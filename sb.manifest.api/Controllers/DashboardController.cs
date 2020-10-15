#region using
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Filter;
using sb.manifest.api.Services;
using System;
#endregion

namespace sb.manifest.api.Controllers
{
    [Authorization]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IConfiguration config;
        public DashboardController(IConfiguration configuration)
        {
            config = configuration;
        }

        /// <summary>
        /// Get dashboard data for products/profit/numbers
        /// </summary>
        [HttpGet("dashboard/product")]
        public IActionResult GetDashboardProductList()
        {
            try
            {
                DashboardService service = new DashboardService();
                return Ok(service.GetDashboardProductList(config));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

    }
}
