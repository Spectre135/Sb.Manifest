#region using
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using sb.manifest.api.Filter;
using sb.manifest.api.Model;
using sb.manifest.api.Services;
using System;
#endregion

namespace sb.manifest.api.Controllers
{
    [Authorization]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IConfiguration config;
        public CustomerController(IConfiguration configuration)
        {
            config = configuration;
        }

        [HttpGet("customer/list")]
        public IActionResult GetCustomerList()
        {
            try
            {
                CustomerService service = new CustomerService();
                return Ok(service.GetCustomers(config));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}
