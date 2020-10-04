#region using
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
    public class PostController : ControllerBase
    {
        private readonly IConfiguration config;
        public PostController(IConfiguration configuration)
        {
            config = configuration;
        }

        /// <summary>
        /// Get all transactions
        /// </summary>
        [HttpGet("post/list")]
        public IActionResult GetTransactionsList(string search = "", int pageIndex = 1, int pageSizeSelected = 1, string sortKey = "", bool asc = false)
        {
            try
            {
                PostService service = new PostService();
                return Ok(service.GetPostList(config, search, pageIndex, pageSizeSelected, sortKey, asc));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Get Invoice for customer
        /// </summary>
        [HttpGet("post/invoice")]
        public IActionResult GetInvoice(long idCustomer)
        {
            try
            {
                PostService service = new PostService();
                return Ok(service.GetInvoice(config, idCustomer));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Customer Pay Invoice
        /// </summary>
        /// <param name="invoices">List of mInvoice</param>
        [HttpPost("post/invoice/pay")]
        public IActionResult Confirm([FromBody] List<MInvoice> invoices)
        {
            try
            {
                PostService service = new PostService();
                service.PayInvoice(config, invoices);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }
    }
}
