using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace ByodLauncher.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : Controller
    {
        private readonly IConfiguration _configuration;

        public AuthenticationController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> Login([FromQuery] string username, [FromQuery] string authToken)
        {
            var expectedAuthToken = _configuration["Authentication:DummyAuthenticationToken"];
            if (!string.IsNullOrEmpty(username) && expectedAuthToken.Equals(authToken))
            {
                var userClaims = new List<Claim> {new Claim(ClaimTypes.Name, username)};
                var identity = new ClaimsIdentity(userClaims, "SimulatedAuthentication");
                var userPrincipal = new ClaimsPrincipal(new[] {identity});
                await HttpContext.SignInAsync(userPrincipal);
            }
            else
            {
                return BadRequest();
            }

            return Ok();
        }
    }
}