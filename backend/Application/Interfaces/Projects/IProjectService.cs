using Portfolio.Backend.Application.Models.Projects;
using Portfolio.Backend.Application.Models.Response;

namespace Portfolio.Backend.Application.Interfaces.Projects
{
    public interface IProjectService
    {
        Task SyncProjects();
        Task<ApiResponseDto<ProjectDto>> GetProject(int projectId);
        Task<ApiResponseDto<List<ProjectDto>>> GetProjects();
        Task<ApiResponseDto<int>> AddProject(ProjectDto project);
        Task<ApiResponseDto<int>> UpdateProject(int projectId, ProjectDto project);
        Task<ApiResponseDto<int>> DeleteProject(int projectId);
    }
}
