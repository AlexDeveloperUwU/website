using backend.Application.Models.Projects;
using backend.Application.Models.Response;

namespace backend.Application.Interfaces.GitProviders
{
    public interface IGitHub
    {
        Task<ApiResponseDto<List<GitProject>>> GetProjects(string Token);
    }
}
