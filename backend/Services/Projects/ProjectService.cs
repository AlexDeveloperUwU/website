using backend.Interfaces.GitProviders;
using backend.Interfaces.Projects;
using backend.Models.Projects;
using backend.Models.Response;
using backend.Persistence.IRepositories;

namespace backend.Services.Projects
{
    public class ProjectService(
        IGitHub gitHubProvider,
        IGitLab gitLabProvider,
        IProjectRepository projectRepository,
        IConfiguration configuration,
        ILogger<ProjectService> logger
    ) : IProjectService
    {
        public async Task SyncProjects()
        {
            var allProjects = new List<GitProject>();

            allProjects.AddRange(
                await FetchProjectsFromProviderAsync(
                    gitHubProvider.GetProjects,
                    configuration["GITHUB_TOKEN"],
                    "GitHub"
                )
            );

            allProjects.AddRange(
                await FetchProjectsFromProviderAsync(
                    gitLabProvider.GetProjects,
                    configuration["GITLAB_TOKEN"],
                    "GitLab"
                )
            );

            if (allProjects.Any())
            {
                try
                {
                    logger.LogInformation(
                        "Syncing a total of {Count} projects with the database...",
                        allProjects.Count
                    );
                    await projectRepository.SyncProjects(allProjects);
                    logger.LogInformation("Database synchronization completed successfully.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while saving projects to the database.");
                }
            }
            else
            {
                logger.LogWarning("No projects found from any Git provider to sync.");
            }
        }

        private async Task<List<GitProject>> FetchProjectsFromProviderAsync(
            Func<string, Task<ApiResponseDto<List<GitProject>>>> getProjectsDelegate,
            string? token,
            string providerName
        )
        {
            if (string.IsNullOrEmpty(token))
            {
                logger.LogWarning(
                    "{ProviderName}_TOKEN is not configured. Skipping {ProviderName} synchronization.",
                    providerName,
                    providerName
                );
                return [];
            }

            try
            {
                logger.LogInformation(
                    "Starting {ProviderName} projects synchronization...",
                    providerName
                );
                var response = await getProjectsDelegate(token);

                if (response.Success && response.Data != null)
                {
                    logger.LogInformation(
                        "Fetched {Count} projects from {ProviderName}.",
                        response.Data.Count,
                        providerName
                    );
                    return response.Data;
                }
                else
                {
                    logger.LogError(
                        "Error fetching projects from {ProviderName}: {Message}",
                        providerName,
                        response.Error?.Message
                    );
                }
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "An error occurred during {ProviderName} projects synchronization.",
                    providerName
                );
            }

            return [];
        }
    }
}
