#region using
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Filter;
using sb.manifest.api.Hubs;
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
        private readonly IHubContext<DisplayHub> hubContext;

        public LoadController(IConfiguration configuration, IHubContext<DisplayHub> _hubContext)
        {
            config = configuration;
            hubContext = _hubContext;
        }

        /// <summary>
        /// Get all loads list
        /// </summary>
        [HttpGet("load")]
        public IActionResult GetLoads()
        {
            try
            {
                LoadService service = new LoadService();
                return Ok(service.GetLoads(config));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Get skydivers in load
        /// </summary>
        [HttpGet("load/list")]
        public IActionResult GetLoadList()
        {
            try
            {
                LoadService service = new LoadService();
                return Ok(service.GetLoadList(config, hubContext));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Add/Edit load
        /// </summary>
        /// <param name="mLoad">Model MLoad with values</param>
        [HttpPost("load/save")]
        public IActionResult SaveLoad([FromBody] MLoad mLoad)
        {
            try
            {
                LoadService service = new LoadService();
                service.SaveLoad(config, mLoad);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Delete load
        /// </summary>
        /// <param name="mLoad">Model MLoad with values</param>
        [HttpPost("load/delete")]
        public IActionResult DeleteLoad([FromBody] MLoad mLoad)
        {
            try
            {
                LoadService service = new LoadService();
                service.DeleteLoad(config, mLoad);
                return Ok();

            }
            catch (SQLConstraintsException ex)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable, ex);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Save depart time of load
        /// </summary>
        /// <param name="mLoad">Model MLoad with values</param>
        [HttpPost("load/depart/save")]
        public IActionResult SaveDepart([FromBody] MLoad mLoad)
        {
            try
            {
                LoadService service = new LoadService();
                service.SaveDepart(config, mLoad);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Add skykdiver/passenger to load
        /// </summary>
        /// <param name="list">List of passengers with MPassenger model</param>
        [HttpPost("load/slot/add")]
        public IActionResult AddSlot([FromBody] List<MOnBoard> list)
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
        /// Move or Remove skykdiver/passenger from to load
        /// </summary>
        /// <param name="mMove">List of persons to be moved or removed with MMove model</param>
        [HttpPost("load/slot/move")]
        public IActionResult MoveSlot([FromBody] MMove mMove)
        {
            try
            {
                LoadService service = new LoadService();
                service.MoveSlot(config, mMove);
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

        /// <summary>
        /// Get active jumpers today
        /// <param name="idLoad"></param>
        /// </summary>
        [HttpGet("load/active/today")]
        public IActionResult GetActiveToday(int idLoad = 0)
        {
            try
            {
                LoadService service = new LoadService();
                return Ok(service.GetActiveToday(config,idLoad));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Get list of jumpers who can be add to load- excluded who are on board already 
        /// <param name="search">Search string First name and Last name of person</param>
        /// <param name="size"> Max rows returned</param>
        /// <param name="idLoad"></param>
        /// </summary>
        [HttpGet("load/active/")]
        public IActionResult GetActive(string search = "", int size = 20, int idLoad=0)
        {
            try
            {
                LoadService service = new LoadService();
                return Ok(service.GetActive(config, search, size, idLoad));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }
    }
}
