using backend.Application.Interfaces.Jobs;
using backend.Application.Interfaces.Projects;

namespace backend.Infrastructure.Jobs
{
    public class BackgroundJobs(IProjectService projectService) : IBackgroundJobs
    {
        public async Task SyncProjectsJob()
        {
            await projectService.SyncProjects();
        }
    }
}
