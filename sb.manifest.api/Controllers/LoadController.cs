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
    public class LoadController : ControllerBase
    {
        private readonly IConfiguration config;
        public LoadController(IConfiguration configuration)
        {
            config = configuration;
        }

        [HttpGet("load/list")]
        public IActionResult GetLoadList()
        {
            try
            {
                LoadService service = new LoadService();
                return Ok(service.GetLoadList(config));

            }catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex);
            }
            
        }
    }
}
