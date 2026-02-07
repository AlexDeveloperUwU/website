using Portfolio.Backend.Application.Models.Entities;
using Portfolio.Backend.Application.Models.Projects;
using Portfolio.Backend.Application.Models.Response;

namespace Portfolio.Backend.Application.Interfaces.Repositories
{
    public interface IProjectRepository
    {
        Task SyncProjects(IEnumerable<GitProject> gitProjects);
        Task<ApiResponseDto<Project>> GetProject(int projectId);
        Task<ApiResponseDto<List<Project>>> GetProjects();
        Task<ApiResponseDto<int>> AddProject(Project project);
        Task<ApiResponseDto<int>> UpdateProject(Project project);
        Task<ApiResponseDto<int>> DeleteProject(int projectId);
    }
}
