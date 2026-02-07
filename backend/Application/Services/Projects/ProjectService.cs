using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using backend.Application.Interfaces.GitProviders;
using backend.Application.Interfaces.Projects;
using backend.Application.Models.Projects;
using backend.Application.Models.Response;
using backend.Infrastructure.Persistence.IRepositories;
using EasyLogging.Loggers;

namespace backend.Services.Projects
{
    public partial class ProjectService(
        IGitHub gitHubProvider,
        IGitLab gitLabProvider,
        IProjectRepository projectRepository,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory
    ) : IProjectService
    {
        private const string MirroredConfigPath =
            "/api/v4/projects/personal%2Fothers%2Fpipelinerunner/repository/files/tasks%2Fbackups-gh-gl.yml/raw?ref=main";

        /// <summary>
        /// Synchronizes projects from GitHub and GitLab, filters mirrored and pending deletions, and saves unique records.
        /// </summary>
        public async Task SyncProjects()
        {
            var gitHubProjects = await FetchProjectsFromProviderAsync(
                gitHubProvider.GetProjects,
                configuration["GITHUB_TOKEN"],
                "GitHub"
            );

            var gitLabProjects = await FetchProjectsFromProviderAsync(
                gitLabProvider.GetProjects,
                configuration["GITLAB_TOKEN"],
                "GitLab"
            );

            var mirroredTargetUrls = await GetMirroredGitLabUrls();

            var filteredGitLab = gitLabProjects
                .Where(p =>
                {
                    var normalizedUrl = p.Url.Trim().TrimEnd('/').ToLowerInvariant();
                    return !mirroredTargetUrls.Contains(normalizedUrl);
                })
                .ToList();

            var combinedProjects = gitHubProjects
                .Concat(filteredGitLab)
                .Where(p => !IsDeletionPending(p.Name) && !IsDeletionPending(p.Url))
                .GroupBy(p => p.Name.ToLowerInvariant().Trim())
                .Select(g => g.First())
                .ToList();

            if (combinedProjects.Count != 0)
            {
                try
                {
                    EasyLogger.Info(
                        "Syncing {Count} unique projects to database...",
                        combinedProjects.Count
                    );
                    await projectRepository.SyncProjects(combinedProjects);
                    EasyLogger.Info("Synchronization completed.");
                }
                catch (Exception ex)
                {
                    EasyLogger.Error(ex, "Error saving projects to database.");
                }
            }
            else
            {
                EasyLogger.Warning("No projects found to sync.");
            }
        }

        /// <summary>
        /// Checks if the provided input contains strings indicating a pending deletion.
        /// </summary>
        private static bool IsDeletionPending(string input)
        {
            if (string.IsNullOrEmpty(input))
                return false;
            return input.Contains("deletion_scheduled", StringComparison.OrdinalIgnoreCase)
                || input.Contains("deletion_pending", StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Retrieves the set of URLs identified as mirrored targets from the GitLab configuration.
        /// </summary>
        private async Task<HashSet<string>> GetMirroredGitLabUrls()
        {
            var gitLabServer = configuration["GITLAB_SERVER"]?.TrimEnd('/');
            if (string.IsNullOrEmpty(gitLabServer))
                return [];

            try
            {
                var mirroredConfigUrl = $"{gitLabServer}{MirroredConfigPath}";
                var token = configuration["GITLAB_TOKEN"];

                var client = httpClientFactory.CreateClient();
                if (!string.IsNullOrEmpty(token))
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                        "Bearer",
                        token
                    );
                }

                EasyLogger.Info(
                    "Fetching mirrored projects configuration from {Url}...",
                    mirroredConfigUrl
                );
                var content = await client.GetStringAsync(mirroredConfigUrl);

                if (
                    !string.IsNullOrWhiteSpace(content)
                    && content
                        .TrimStart()
                        .StartsWith("<!DOCTYPE html", StringComparison.OrdinalIgnoreCase)
                )
                {
                    EasyLogger.Error(
                        "Received HTML from API endpoint. Verify Project ID and Token scopes."
                    );
                    return [];
                }

                var matches = MirroredTargetsRegex().Matches(content);
                var urls = matches
                    .Select(m =>
                        m.Groups["url"]
                            .Value.Trim()
                            .Trim('"')
                            .Trim('\'')
                            .TrimEnd('/')
                            .ToLowerInvariant()
                    )
                    .Where(url => !string.IsNullOrEmpty(url))
                    .ToHashSet();

                EasyLogger.Info("Identified {Count} mirrored targets.", urls.Count);
                return urls;
            }
            catch (Exception ex)
            {
                EasyLogger.Error(ex, "Failed to fetch mirrored projects configuration.");
                return [];
            }
        }

        /// <summary>
        /// Fetches projects from a specific git provider delegate.
        /// </summary>
        private static async Task<List<GitProject>> FetchProjectsFromProviderAsync(
            Func<string, Task<ApiResponseDto<List<GitProject>>>> getProjectsDelegate,
            string? token,
            string providerName
        )
        {
            if (string.IsNullOrEmpty(token))
                return [];

            try
            {
                var response = await getProjectsDelegate(token);
                if (response.Success && response.Data != null)
                    return response.Data;

                EasyLogger.Error(
                    "Error fetching from {Provider}: {Msg}",
                    providerName,
                    response.Error?.Message ?? string.Empty
                );
            }
            catch (Exception ex)
            {
                EasyLogger.Error(ex, "Error fetching from {Provider}", providerName);
            }

            return [];
        }

        [GeneratedRegex(
            @"target\s*:\s*(?:[""']|>\-)?\s*(?:[""'])?(?<url>https?://[^""'\s]+)",
            RegexOptions.IgnoreCase | RegexOptions.Multiline
        )]
        private static partial Regex MirroredTargetsRegex();
    }
}
