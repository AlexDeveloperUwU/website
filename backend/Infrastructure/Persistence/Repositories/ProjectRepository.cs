using EasyLogging.Loggers;
using Microsoft.EntityFrameworkCore;
using Portfolio.Backend.Application.Enums.Error;
using Portfolio.Backend.Application.Interfaces.Repositories;
using Portfolio.Backend.Application.Interfaces.Response;
using Portfolio.Backend.Application.Models.Entities;
using Portfolio.Backend.Application.Models.Projects;
using Portfolio.Backend.Application.Models.Response;
using Portfolio.Backend.Infrastructure.Persistence.Context;

namespace Portfolio.Backend.Infrastructure.Persistence.Repositories
{
    public class ProjectRepository(ApplicationDbContext context, IResponseService responseService)
        : IProjectRepository
    {
        private readonly ApplicationDbContext _context = context;
        private readonly IResponseService _responseService = responseService;

        /// <summary>
        /// Adds the given project to the database.
        /// </summary>
        public async Task<ApiResponseDto<int>> AddProject(Project project)
        {
            try
            {
                await _context.Projects.AddAsync(project);
                await _context.SaveChangesAsync();
                return _responseService.CreateSuccessResponse(project.Id);
            }
            catch (Exception ex)
            {
                EasyLogger.Error(ex, "Error adding project to database.");
                return _responseService.CreateErrorResponse<int>(
                    (int)Errors.CANNOT_WRITE_DATA,
                    ex.Message
                );
            }
        }

        /// <summary>
        /// Updates the given project in the database.
        /// </summary>
        public async Task<ApiResponseDto<int>> UpdateProject(Project project)
        {
            try
            {
                _context.Projects.Update(project);
                await _context.SaveChangesAsync();
                return _responseService.CreateSuccessResponse(project.Id);
            }
            catch (Exception ex)
            {
                EasyLogger.Error(ex, "Error updating project in database.");
                return _responseService.CreateErrorResponse<int>(
                    (int)Errors.CANNOT_WRITE_DATA,
                    ex.Message
                );
            }
        }

        /// <summary>
        /// Deletes the given project in the database.
        /// </summary>
        public async Task<ApiResponseDto<int>> DeleteProject(int projectId)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    return _responseService.CreateErrorResponse<int>(
                        (int)Errors.DATA_NOT_FOUND,
                        "Project not found."
                    );
                }

                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();
                return _responseService.CreateSuccessResponse(projectId);
            }
            catch (Exception ex)
            {
                EasyLogger.Error(ex, "Error deleting project from database.");
                return _responseService.CreateErrorResponse<int>(
                    (int)Errors.CANNOT_WRITE_DATA,
                    ex.Message
                );
            }
        }

        /// <summary>
        /// Gets an specified project from the database.
        /// </summary>
        public async Task<ApiResponseDto<Project>> GetProject(int projectId)
        {
            try
            {
                var project = await _context
                    .Projects.AsNoTracking()
                    .FirstOrDefaultAsync(p => p.Id == projectId);

                if (project == null)
                {
                    return _responseService.CreateErrorResponse<Project>(
                        (int)Errors.DATA_NOT_FOUND,
                        "Project not found."
                    );
                }

                return _responseService.CreateSuccessResponse(project);
            }
            catch (Exception ex)
            {
                EasyLogger.Error(ex, "Error fetching project from database.");
                return _responseService.CreateErrorResponse<Project>(
                    (int)Errors.CANNOT_READ_DATA,
                    ex.Message
                );
            }
        }

        /// <summary>
        /// Gets the list of all the projects inserted in the database.
        /// </summary>
        public async Task<ApiResponseDto<List<Project>>> GetProjects()
        {
            try
            {
                var projects = await _context.Projects.AsNoTracking().ToListAsync();
                return _responseService.CreateSuccessResponse(projects);
            }
            catch (Exception ex)
            {
                EasyLogger.Error(ex, "Error fetching projects from database.");
                return _responseService.CreateErrorResponse<List<Project>>(
                    (int)Errors.CANNOT_READ_DATA,
                    ex.Message
                );
            }
        }

        /// <summary>
        /// Maps projects, processes them by type, filters backups, and updates or adds them to the database.
        /// </summary>
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
