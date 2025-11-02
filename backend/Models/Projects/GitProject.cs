using backend.Enums.Projects;

namespace backend.Models.Projects
{
    public class GitProject
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Owner { get; set; } = string.Empty;
        public GitProjectTypes Type { get; set; } = GitProjectTypes.Unknown;
        public string Url { get; set; } = string.Empty;
    }
}
