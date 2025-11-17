using backend.Interfaces.Jobs;
using backend.Interfaces.Projects;

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
