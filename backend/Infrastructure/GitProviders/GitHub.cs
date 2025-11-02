using System.Net.Http.Headers;
using System.Text.Json;
using backend.Enums.Projects;
using backend.Interfaces.GitProviders;
using backend.Interfaces.Response;
using backend.Models.GitProviders;
using backend.Models.Projects;
using backend.Models.Response;

namespace backend.Infrastructure.GitProviders
{
    public class GitHub(IHttpClientFactory httpClientFactory, IResponseService responseService)
        : IGitHub
    {
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly IResponseService _responseService = responseService;

        public async Task<ApiResponseDto<List<GitProject>>> GetProjects(string token)
        {
            try
            {
                var httpClient = _httpClientFactory.CreateClient("GitHub");
                var request = new HttpRequestMessage(
                    HttpMethod.Get,
                    "user/repos?affiliation=owner,organization_member&per_page=100"
                );
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var message =
                        $"Failed to fetch data from GitHub API. Status: {response.ReasonPhrase}";
                    return _responseService.CreateErrorResponse<List<GitProject>>(
                        (int)response.StatusCode,
                        message
                    );
                }

                var content = await response.Content.ReadAsStringAsync();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var apiRepos = JsonSerializer.Deserialize<List<GitHubRepoDto>>(content, options);

                if (apiRepos == null)
                {
                    return _responseService.CreateSuccessResponse(new List<GitProject>());
                }

                var projects = apiRepos
                    .Select(repo => new GitProject
                    {
                        Name = repo.Name,
                        Description = repo.Description ?? string.Empty,
                        Owner = repo.Owner.Login,
                        Type = repo.Private ? GitProjectTypes.Private : GitProjectTypes.Public,
                        Url = repo.HtmlUrl,
                    })
                    .ToList();

                return _responseService.CreateSuccessResponse(projects);
            }
            catch (Exception ex)
            {
                return _responseService.CreateErrorResponse<List<GitProject>>(
                    500,
                    $"An unexpected error occurred: {ex.Message}"
                );
            }
        }
    }
}
