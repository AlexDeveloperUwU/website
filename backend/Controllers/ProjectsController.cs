using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("projects")]
    [ApiExplorerSettings(IgnoreApi = false)]
    [EnableCors("AllowAnyCorsPolicy")]
    public class ProjectsController : ControllerBase { }
}
