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
            var existingProjectsDict = await _context.Projects.ToDictionaryAsync(
                p => p.Name,
                p => p
            );

            foreach (var gitProject in gitProjects)
            {
                if (existingProjectsDict.TryGetValue(gitProject.Name, out var existingProject))
                {
                    existingProject.DescriptionEn = gitProject.Description;
                    existingProject.DescriptionEs = gitProject.Description;
                    existingProject.RepositoryUrl = gitProject.Url;
                    existingProject.Org = gitProject.Owner;
                }
                else
                {
                    var newProject = new Project
                    {
                        Name = gitProject.Name,
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
