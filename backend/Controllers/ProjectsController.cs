using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Backend.Controllers
{
    [ApiController]
    [Route("projects")]
    [ApiExplorerSettings(IgnoreApi = false)]
    [EnableCors("AllowAnyCorsPolicy")]
    public class ProjectsController : ControllerBase { }
}
