using System.Text.Json.Serialization;

namespace Portfolio.Backend.Application.Models.GitProviders
{
    public class GitLabRepoDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Visibility { get; set; } = string.Empty;

        [JsonPropertyName("web_url")]
        public string WebUrl { get; set; } = string.Empty;
        public GitLabNamespaceDto Namespace { get; set; } = new();
    }

    public class GitLabNamespaceDto
    {
        public string Name { get; set; } = string.Empty;
    }
}
