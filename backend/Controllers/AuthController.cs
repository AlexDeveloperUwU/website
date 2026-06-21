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
            EasyLogger.Info(
                $"Initiating Discord login sequence. Target return context: {returnUrl}"
            );

            var callbackUrl = Url.Action("Callback", "Auth", new { returnUrl });
            var properties = new AuthenticationProperties { RedirectUri = callbackUrl };

            return Challenge(properties, DiscordAuthenticationDefaults.AuthenticationScheme);
        }

        [HttpGet("callback")]
        public IActionResult Callback([FromQuery] string returnUrl = "/")
        {
            EasyLogger.Info(
                $"External authentication completed. Redirecting execution matrix to: {returnUrl}"
            );
            return Redirect(returnUrl);
        }

        [HttpPost("logout")]
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
