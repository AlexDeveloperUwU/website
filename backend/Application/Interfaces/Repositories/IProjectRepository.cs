using Portfolio.Backend.Application.Models.Projects;

namespace Portfolio.Backend.Application.Interfaces.Repositories
{
    public interface IProjectRepository
    {
        Task SyncProjects(IEnumerable<GitProject> gitProjects);
    }
}
