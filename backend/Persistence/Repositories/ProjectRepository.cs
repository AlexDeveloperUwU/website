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
            var gitProjectNames = new HashSet<string>(gitProjects.Select(p => p.Name));

            foreach (var project in existingProjects)
            {
                if (!gitProjectNames.Contains(project.Name))
                {
                    project.Show = false;
                }
            }

            var existingProjectsDict = existingProjects.ToDictionary(p => p.Name);

            foreach (var gitProject in gitProjects)
            {
                if (gitProject.Owner == "Backups")
                {
                    continue;
                }

                if (existingProjectsDict.TryGetValue(gitProject.Name, out var existingProject))
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
