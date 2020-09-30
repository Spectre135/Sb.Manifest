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
        public IActionResult GetTransactionsList()
        {
            try
            {
                PostService service = new PostService();
                return Ok(service.GetPostList(config));

            }catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex);
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
                return Ok(service.GetInvoice(config,idCustomer));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }
    }
}
