using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Backend.Application.Interfaces.Projects;
using Portfolio.Backend.Application.Models.Projects;
using Portfolio.Backend.Application.Models.Response;

namespace Portfolio.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(IgnoreApi = false)]
    [EnableCors("AllowAnyCorsPolicy")]
    public class ProjectsController(IProjectService projectService) : ControllerBase
    {
        private readonly IProjectService _projectService = projectService;

        [HttpGet]
        public async Task<ActionResult<ApiResponseDto<List<ProjectDto>>>> GetAll()
        {
            var response = await _projectService.GetProjects();
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponseDto<ProjectDto>>> Get(int id)
        {
            var response = await _projectService.GetProject(id);
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<int>>> Post([FromBody] ProjectDto projectDto)
        {
            if (projectDto == null)
            {
                return BadRequest("Invalid project data.");
            }

            var response = await _projectService.AddProject(projectDto);
            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponseDto<int>>> Put(
            int id,
            [FromBody] ProjectDto projectDto
        )
        {
            if (projectDto == null)
            {
                return BadRequest("Invalid project data.");
            }

            var response = await _projectService.UpdateProject(id, projectDto);
            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponseDto<int>>> Delete(int id)
        {
            var response = await _projectService.DeleteProject(id);
            return Ok(response);
        }
    }
}
