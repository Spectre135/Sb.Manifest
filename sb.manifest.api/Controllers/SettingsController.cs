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
    public class SettingsController : ControllerBase
    {
        private readonly IConfiguration config;
        public SettingsController(IConfiguration configuration)
        {
            config = configuration;
        }

        /// <summary>
        /// Get sales products 
        /// </summary>
        [HttpGet("settings/sales/product")]
        public IActionResult GetSalesProductList()
        {
            try
            {
                SettingsService service = new SettingsService();
                return Ok(service.GetSalesProductList(config));

            }catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,ex);
            }
            
        }

        /// <summary>
        /// Save sales product
        /// Function add/edit product
        /// </summary>
        /// <param name="mSalesProduct">Model of MSalesProduct</param>
        [HttpPost("settings/sales/product/save")]
        public IActionResult SaveSalesProduct([FromBody] MSalesProduct mSalesProduct)
        {
            try
            {
                SettingsService service = new SettingsService();
                service.SaveSalesProduct(config, mSalesProduct);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Get product slot 
        /// How much slot needed for selected product
        /// </summary>
        [HttpGet("settings/sales/product/slot")]
        public IActionResult GetSlotProductList()
        {
            try
            {
                SettingsService service = new SettingsService();
                return Ok(service.GetSlotProductList(config));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Save product slot
        /// Function add/edit product slot
        /// </summary>
        /// <param name="mProductSlot">Model of MProductSlot</param>
        [HttpPost("settings/sales/product/slot/save")]
        public IActionResult SaveProductSlot([FromBody] MProductSlot mProductSlot)
        {
            try
            {
                SettingsService service = new SettingsService();
                service.SaveProductSlot(config, mProductSlot);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Get Aircrafts
        /// </summary>
        [HttpGet("settings/aircraft")]
        public IActionResult GetAircrafts()
        {
            try
            {
                SettingsService service = new SettingsService();
                return Ok(service.GetAircrafts(config));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Save aircraft
        /// Function add/edit aircraft
        /// </summary>
        /// <param name="mAircraft">Model of MAircraft</param>
        [HttpPost("settings/aircraft/save")]
        public IActionResult SaveAircrafts([FromBody] MAircraft mAircraft)
        {
            try
            {
                SettingsService service = new SettingsService();
                service.SaveAircraft(config, mAircraft);
                return Ok();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Get Accounts
        /// </summary>
        [HttpGet("settings/account")]
        public IActionResult GetAccounts()
        {
            try
            {
                SettingsService service = new SettingsService();
                return Ok(service.GetAccounts(config));

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        /// <summary>
        /// Get List of all countries
        /// </summary>
        [HttpGet("settings/countries")]
        public IActionResult GetCountries()
        {
            try
            {
                SettingsService service = new SettingsService();
                return Ok(service.GetCountries(config));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }
    }
}
