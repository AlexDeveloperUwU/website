using backend.Models.Projects;
using backend.Models.Response;

namespace backend.Interfaces.GitProviders
{
    public interface IGitHub
    {
        Task<ApiResponseDto<List<GitProject>>> GetProjects(string Token);
    }
}
