using backend.Models.Entities;
using backend.Models.Projects;
using backend.Persistence.Context;
using backend.Persistence.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace backend.Persistence.Repositories
{
    public class ProjectRepository(ApplicationDbContext context) : IProjectRepository
    {
        private readonly ApplicationDbContext _context = context;

        public async Task SyncProjects(IEnumerable<GitProject> gitProjects)
        {
            var existingProjects = await _context.Projects.ToListAsync();

            var gitProjectMap = gitProjects
                .GroupBy(p => p.Name.ToLowerInvariant().Trim())
                .ToDictionary(g => g.Key, g => g.First());

            foreach (var project in existingProjects)
            {
                var normalizedName = project.Name.ToLowerInvariant().Trim();
                if (!gitProjectMap.ContainsKey(normalizedName))
                {
                    project.Show = false;
                }
            }

            var existingProjectsDict = existingProjects
                .GroupBy(p => p.Name.ToLowerInvariant().Trim())
                .ToDictionary(g => g.Key, g => g.First());

            foreach (var gitProject in gitProjects)
            {
                if (gitProject.Owner.Equals("Backups", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var normalizedName = gitProject.Name.ToLowerInvariant().Trim();

                if (existingProjectsDict.TryGetValue(normalizedName, out var existingProject))
                {
                    existingProject.RepositoryUrl = gitProject.Url;
                    existingProject.Org = gitProject.Owner;
                }
                else
                {
                    var newProject = new Project
                    {
                        Name = gitProject.Name,
                        Show = false,
                        DescriptionEn = gitProject.Description,
                        DescriptionEs = gitProject.Description,
                        RepositoryUrl = gitProject.Url,
                        Org = gitProject.Owner,
                    };
                    await _context.Projects.AddAsync(newProject);
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
