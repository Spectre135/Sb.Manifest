#region using
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Auth;
using sb.manifest.api.Filter;
using sb.manifest.api.Model;
using sb.manifest.api.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
#endregion

namespace sb.manifest.api.Controllers
{
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration config;
        public AuthController(IConfiguration configuration)
        {
            config = configuration;
        }

        /// <summary>
        /// Login 
        /// Generiranje avtorizacijskega žetona za avtentikacijo uporabnika 
        /// </summary>
        [AllowAnonymous]
        [HttpPost("token")]
        public IActionResult Login([FromBody] MUser user)
        {
            try
            {
                if (AuthService.IsUserAuthenticated(user))             
                    return Ok(JwtManager.GenerateToken(user));

                return StatusCode(StatusCodes.Status401Unauthorized, "Bad username or password.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Get server time
        /// </summary>
        [AllowAnonymous]
        [HttpGet("server/time")]
        public IActionResult GetServerTime()
        {
            return Ok(DateTime.Now);
        }

    }
}
