using System.Text.Json.Serialization;

namespace backend.Models.GitProviders
{
    public class GitHubRepoDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public GitHubOwnerDto Owner { get; set; } = new();
        public bool Private { get; set; }

        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; } = string.Empty;
    }

    public class GitHubOwnerDto
    {
        public string Login { get; set; } = string.Empty;
    }
}
