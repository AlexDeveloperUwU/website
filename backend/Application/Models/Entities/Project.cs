using System.ComponentModel.DataAnnotations;

namespace Portfolio.Backend.Application.Models.Entities
{
    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public bool Show { get; set; } = true;

        [Required]
        public string Name { get; set; } = string.Empty;
        public string? Url { get; set; }
        public string? RepositoryUrl { get; set; }

        [Required]
        public string DescriptionEs { get; set; } = string.Empty;

        [Required]
        public string DescriptionEn { get; set; } = string.Empty;
        public bool ShowOnHomepage { get; set; } = false;
        public string Org { get; set; } = string.Empty;
        public string Icon { get; set; } = "fas fa-code";
        public string[] Tech { get; set; } = [];
    }
}
