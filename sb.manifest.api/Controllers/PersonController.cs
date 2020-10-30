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
    public class PersonController : ControllerBase
    {
        private readonly IConfiguration config;
        public PersonController(IConfiguration configuration)
        {
            config = configuration;
        }

        /// <summary>
        /// Persons list with paging
        /// </summary>
        /// <param name="search">Search string First name and Last name of person</param>
        /// <param name="pageIndex"> Page of</param>
        /// <param name="pageSizeSelected">Records on page </param>
        /// <param name="sortKey"></param>
        /// <param name="asc"> sorting asc/desc </param>
        [HttpGet("person/list")]
        public IActionResult GetPersonList(string search = "", int pageIndex = 1, int pageSizeSelected = 1, string sortKey = "", bool asc = false)
        {
            try
            {
                PersonService service = new PersonService();
                return Ok(service.GetPersons(config, search, pageIndex, pageSizeSelected, sortKey, asc));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        /// <summary>
        /// Save person
        /// Function add/edit Persons
        /// </summary>
        /// <param name="mPerson">Model of MPerson</param>
        [HttpPost("person/save")]
        public IActionResult SaveSalesProduct([FromBody] MPerson mPerson)
        {
            try
            {
                PersonService service = new PersonService();
                service.Save(config, mPerson);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Persons ticket post with paging
        /// </summary>
        /// <param name="search">Search string First name and Last name of person</param>
        /// <param name="idPerson">Person id</param>
        /// <param name="pageIndex"> Page of</param>
        /// <param name="pageSizeSelected">Records on page </param>
        /// <param name="sortKey"></param>
        /// <param name="asc"> sorting asc/desc </param>
        [HttpGet("person/ticketpost/list")]
        public IActionResult GetTicketPostList(string search = "", int idPerson=0, int pageIndex = 1, int pageSizeSelected = 1, string sortKey = "", bool asc = false)
        {
            try
            {
                PersonService service = new PersonService();
                return Ok(service.GetTicketPosts(config, search, idPerson, pageIndex, pageSizeSelected, sortKey, asc));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        /// <summary>
        /// Persons load list history with paging
        /// </summary>
        /// <param name="search">Search string First name and Last name of person</param>
        /// <param name="idPerson">Person id</param>
        /// <param name="pageIndex"> Page of</param>
        /// <param name="pageSizeSelected">Records on page </param>
        /// <param name="sortKey"></param>
        /// <param name="asc"> sorting asc/desc </param>
        [HttpGet("person/load/list")]
        public IActionResult GetLoadsHistory(string search = "", int idPerson = 0, int pageIndex = 1, int pageSizeSelected = 1, string sortKey = "", bool asc = false)
        {
            try
            {
                PersonService service = new PersonService();
                return Ok(service.GetLoadsHistory(config, search, idPerson, pageIndex, pageSizeSelected, sortKey, asc));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

    }
}
