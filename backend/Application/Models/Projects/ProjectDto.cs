namespace Portfolio.Backend.Application.Models.Projects
{
    public class ProjectDto
    {
        public int? Id { get; set; }
        public bool Show { get; set; } = true;
        public string Name { get; set; } = string.Empty;
        public string? Url { get; set; } = string.Empty;
        public string? RepositoryUrl { get; set; } = string.Empty;
        public string DescriptionEs { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;
        public bool ShowOnHomepage { get; set; } = false;
        public string Org { get; set; } = string.Empty;
        public string Icon { get; set; } = "fas fa-code";
        public string[] Tech { get; set; } = [];
    }
}
