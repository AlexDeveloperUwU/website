using Portfolio.Backend.Application.Interfaces.Jobs;
using Portfolio.Backend.Application.Interfaces.Projects;

namespace Portfolio.Backend.Infrastructure.Jobs
{
    public class BackgroundJobs(IProjectService projectService) : IBackgroundJobs
    {
        public async Task SyncProjectsJob()
        {
            await projectService.SyncProjects();
        }
    }
}
