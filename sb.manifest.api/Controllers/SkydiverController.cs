#region using
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Model;
using sb.manifest.api.Services;
using System;
#endregion

namespace sb.manifest.api.Controllers
{
    [ApiController]
    public class SkydiverController: ControllerBase
    {
        private readonly IConfiguration config;
        public SkydiverController(IConfiguration configuration)
        {
            config = configuration;
        }

        [HttpGet("skydiver/list")]
        public IActionResult GetSkydiverList()
        {
            try
            {
                SkydiverService service = new SkydiverService();
                return Ok(service.GetSkydivers(config));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}
