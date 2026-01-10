using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using backend.Interfaces.GitProviders;
using backend.Interfaces.Projects;
using backend.Models.Projects;
using backend.Models.Response;
using backend.Persistence.IRepositories;

namespace backend.Services.Projects
{
    public partial class ProjectService(
        IGitHub gitHubProvider,
        IGitLab gitLabProvider,
        IProjectRepository projectRepository,
        IConfiguration configuration,
        ILogger<ProjectService> logger,
        IHttpClientFactory httpClientFactory
    ) : IProjectService
    {
        private const string MirroredConfigPath =
            "/api/v4/projects/personal%2Fothers%2Fpipelinerunner/repository/files/tasks%2Fbackups-gh-gl.yml/raw?ref=main";

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
                    logger.LogInformation(
                        "Syncing {Count} unique projects to database...",
                        combinedProjects.Count
                    );
                    await projectRepository.SyncProjects(combinedProjects);
                    logger.LogInformation("Synchronization completed.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error saving projects to database.");
                }
            }
            else
            {
                logger.LogWarning("No projects found to sync.");
            }
        }

        private static bool IsDeletionPending(string input)
        {
            if (string.IsNullOrEmpty(input))
                return false;
            return input.Contains("deletion_scheduled", StringComparison.OrdinalIgnoreCase)
                || input.Contains("deletion_pending", StringComparison.OrdinalIgnoreCase);
        }

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

                logger.LogInformation(
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
                    logger.LogError(
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

                logger.LogInformation("Identified {Count} mirrored targets.", urls.Count);
                return urls;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to fetch mirrored projects configuration.");
                return [];
            }
        }

        private async Task<List<GitProject>> FetchProjectsFromProviderAsync(
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

                logger.LogError(
                    "Error fetching from {Provider}: {Msg}",
                    providerName,
                    response.Error?.Message
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error fetching from {Provider}", providerName);
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
