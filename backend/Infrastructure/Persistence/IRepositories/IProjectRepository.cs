using backend.Application.Models.Projects;

namespace backend.Infrastructure.Persistence.IRepositories
{
    public interface IProjectRepository
    {
        Task SyncProjects(IEnumerable<GitProject> gitProjects);
    }
}
