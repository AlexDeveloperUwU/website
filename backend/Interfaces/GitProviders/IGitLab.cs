using backend.Models.Projects;
using backend.Models.Response;

namespace backend.Interfaces.GitProviders
{
    public interface IGitLab
    {
        Task<ApiResponseDto<List<GitProject>>> GetProjects(string Token);
    }
}
