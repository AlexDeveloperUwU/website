using Portfolio.Backend.Application.Models.Projects;
using Portfolio.Backend.Application.Models.Response;

namespace Portfolio.Backend.Application.Interfaces.GitProviders
{
    public interface IGitLab
    {
        Task<ApiResponseDto<List<GitProject>>> GetProjects(string Token);
    }
}
