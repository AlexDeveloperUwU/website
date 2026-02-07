using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using EasyLogging.Loggers;
using Portfolio.Backend.Application.Enums.Error;
using Portfolio.Backend.Application.Interfaces.GitProviders;
using Portfolio.Backend.Application.Interfaces.Projects;
using Portfolio.Backend.Application.Interfaces.Repositories;
using Portfolio.Backend.Application.Interfaces.Response;
using Portfolio.Backend.Application.Models.Entities;
using Portfolio.Backend.Application.Models.Projects;
using Portfolio.Backend.Application.Models.Response;

namespace backend.Services.Projects
{
    public partial class ProjectService(
        IGitHub gitHubProvider,
        IGitLab gitLabProvider,
        IProjectRepository projectRepository,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        IResponseService responseService
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

        /// <summary>
        /// Gets an specified project from the database.
        /// </summary>
        public async Task<ApiResponseDto<ProjectDto>> GetProject(int projectId)
        {
            var response = await projectRepository.GetProject(projectId);
            if (!response.Success || response.Data == null)
            {
                return responseService.CreateErrorResponse<ProjectDto>(
                    ParseErrorCode(response.Error?.Code),
                    response.Error?.Message ?? "Project not found"
                );
            }

            var dto = MapToDto(response.Data);
            return responseService.CreateSuccessResponse(dto);
        }

        /// <summary>
        /// Gets the list of all the projects inserted in the database.
        /// </summary>
        public async Task<ApiResponseDto<List<ProjectDto>>> GetProjects()
        {
            var response = await projectRepository.GetProjects();
            if (!response.Success || response.Data == null)
            {
                return responseService.CreateErrorResponse<List<ProjectDto>>(
                    ParseErrorCode(response.Error?.Code),
                    response.Error?.Message ?? "Error fetching projects"
                );
            }

            var dtos = response.Data.Select(MapToDto).ToList();
            return responseService.CreateSuccessResponse(dtos);
        }

        /// <summary>
        /// Adds the given project to the database.
        /// </summary>
        public async Task<ApiResponseDto<int>> AddProject(ProjectDto projectDto)
        {
            var entity = MapToEntity(projectDto);
            return await projectRepository.AddProject(entity);
        }

        /// <summary>
        /// Updates the given project in the database.
        /// </summary>
        public async Task<ApiResponseDto<int>> UpdateProject(int projectId, ProjectDto projectDto)
        {
            var existingResponse = await projectRepository.GetProject(projectId);
            if (!existingResponse.Success || existingResponse.Data == null)
            {
                return responseService.CreateErrorResponse<int>(
                    (int)Errors.DATA_NOT_FOUND,
                    "Project not found"
                );
            }

            var entity = MapToEntity(projectDto);
            entity.Id = projectId;

            return await projectRepository.UpdateProject(entity);
        }

        /// <summary>
        /// Deletes the given project in the database.
        /// </summary>
        public async Task<ApiResponseDto<int>> DeleteProject(int projectId)
        {
            return await projectRepository.DeleteProject(projectId);
        }

        private static int ParseErrorCode(string? code)
        {
            if (string.IsNullOrEmpty(code))
                return (int)Errors.UNKNOWN_ERROR;

            if (int.TryParse(code, out var numericCode))
                return numericCode;

            if (Enum.TryParse<Errors>(code, out var errorEnum))
                return (int)errorEnum;

            return (int)Errors.UNKNOWN_ERROR;
        }

        private static ProjectDto MapToDto(Project entity)
        {
            return new ProjectDto
            {
                Id = entity.Id,
                Show = entity.Show,
                Name = entity.Name,
                Url = entity.Url,
                RepositoryUrl = entity.RepositoryUrl,
                DescriptionEs = entity.DescriptionEs,
                DescriptionEn = entity.DescriptionEn,
                ShowOnHomepage = entity.ShowOnHomepage,
                Org = entity.Org,
                Icon = entity.Icon,
                Tech = entity.Tech,
            };
        }

        private static Project MapToEntity(ProjectDto dto)
        {
            return new Project
            {
                Id = dto.Id ?? 0,
                Show = dto.Show,
                Name = dto.Name,
                Url = dto.Url,
                RepositoryUrl = dto.RepositoryUrl,
                DescriptionEs = dto.DescriptionEs,
                DescriptionEn = dto.DescriptionEn,
                ShowOnHomepage = dto.ShowOnHomepage,
                Org = dto.Org,
                Icon = dto.Icon,
                Tech = dto.Tech,
            };
        }
    }
}
