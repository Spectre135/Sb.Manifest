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

        /// <summary>
        /// Customers list with paging
        /// </summary>
        /// <param name="search">Search string First name and Last name of customer</param>
        /// <param name="pageIndex"> Page of</param>
        /// <param name="pageSizeSelected">Records on page </param>
        /// <param name="sortKey"></param>
        /// <param name="asc"> sorting asc/desc </param>
        [HttpGet("customer/list")]
        public IActionResult GetCustomerList(string search = "", int pageIndex = 1, int pageSizeSelected = 1, string sortKey = "", bool asc = false)
        {
            try
            {
                CustomerService service = new CustomerService();
                return Ok(service.GetCustomers(config, search, pageIndex, pageSizeSelected, sortKey, asc));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        /// <summary>
        /// Save customer
        /// Function add/edit Customer
        /// </summary>
        /// <param name="mCustomer">Model of MCustomer</param>
        [HttpPost("customer/save")]
        public IActionResult SaveSalesProduct([FromBody] MCustomer mCustomer)
        {
            try
            {
                CustomerService service = new CustomerService();
                service.Save(config, mCustomer);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Customers ticket post with paging
        /// </summary>
        /// <param name="search">Search string First name and Last name of customer</param>
        /// <param name="idCustomer">Customer id</param>
        /// <param name="pageIndex"> Page of</param>
        /// <param name="pageSizeSelected">Records on page </param>
        /// <param name="sortKey"></param>
        /// <param name="asc"> sorting asc/desc </param>
        [HttpGet("customer/ticketpost/list")]
        public IActionResult GetTicketPostList(string search = "", int idCustomer=0, int pageIndex = 1, int pageSizeSelected = 1, string sortKey = "", bool asc = false)
        {
            try
            {
                CustomerService service = new CustomerService();
                return Ok(service.GetTicketPosts(config, search, idCustomer, pageIndex, pageSizeSelected, sortKey, asc));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        /// <summary>
        /// Customers load list history with paging
        /// </summary>
        /// <param name="search">Search string First name and Last name of customer</param>
        /// <param name="idCustomer">Customer id</param>
        /// <param name="pageIndex"> Page of</param>
        /// <param name="pageSizeSelected">Records on page </param>
        /// <param name="sortKey"></param>
        /// <param name="asc"> sorting asc/desc </param>
        [HttpGet("customer/load/list")]
        public IActionResult GetLoadsHistory(string search = "", int idCustomer = 0, int pageIndex = 1, int pageSizeSelected = 1, string sortKey = "", bool asc = false)
        {
            try
            {
                CustomerService service = new CustomerService();
                return Ok(service.GetLoadsHistory(config, search, idCustomer, pageIndex, pageSizeSelected, sortKey, asc));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

    }
}
