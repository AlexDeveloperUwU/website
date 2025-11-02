using backend.Models.Projects;

namespace backend.Persistence.IRepositories
{
    public interface IProjectRepository
    {
        Task SyncProjects(IEnumerable<GitProject> gitProjects);
    }
}
