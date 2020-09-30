#region using
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Filter;
using sb.manifest.api.Model;
using sb.manifest.api.Services;
using System;
using System.Collections.Generic;
#endregion

namespace sb.manifest.api.Controllers
{
    [Authorization]
    [ApiController]
    public class LoadController : ControllerBase
    {
        private readonly IConfiguration config;
        public LoadController(IConfiguration configuration)
        {
            config = configuration;
        }

        /// <summary>
        /// Get all loads list
        /// </summary>
        [HttpGet("load/list")]
        public IActionResult GetLoadList()
        {
            try
            {
                LoadService service = new LoadService();
                return Ok(service.GetLoadList(config));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Add passenger to load
        /// </summary>
        /// <param name="list">List of passengers with MPassenger model</param>
        [HttpPost("load/slot/add")]
        public IActionResult AddSlot([FromBody] List<MPassenger> list)
        {
            try
            {
                LoadService service = new LoadService();
                service.AddSlot(config, list);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Confirm load
        /// </summary>
        /// <param name="mLoad">MLoad model</param>
        [HttpPost("load/confirm")]
        public IActionResult Confirm([FromBody] MLoad mLoad)
        {
            try
            {
                LoadService service = new LoadService();
                service.ConfirmLoad(config, mLoad);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }
    }
}
