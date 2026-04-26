using AspNet.Security.OAuth.Discord;
using EasyLogging.Loggers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace Portfolio.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpGet("login")]
        public IActionResult Login([FromQuery] string returnUrl = "/")
        {
            EasyLogger.Info("Initiating Discord login sequence.");
            var properties = new AuthenticationProperties { RedirectUri = returnUrl };
            return Challenge(properties, DiscordAuthenticationDefaults.AuthenticationScheme);
        }

        [HttpGet("logout")]
        public IActionResult Logout([FromQuery] string returnUrl = "/")
        {
            EasyLogger.Info("Initiating logout sequence.");
            var properties = new AuthenticationProperties { RedirectUri = returnUrl };
            return SignOut(properties, CookieAuthenticationDefaults.AuthenticationScheme);
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return Ok(new { IsAuthenticated = true, Username = User.Identity.Name });
            }

            return Ok(new { IsAuthenticated = false });
        }
    }
}
