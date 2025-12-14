using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using OC.HiddenDashboard.Configuration;

namespace OC.HiddenDashboard.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "OC.HiddenDashboard")]
    public class OCHiddenDashboardApiController : OCHiddenDashboardApiControllerBase
    {
        private readonly HiddenDashboardOptions _options;

        public OCHiddenDashboardApiController(IOptions<HiddenDashboardOptions> options)
        {
            _options = options.Value;
        }

        /// <summary>
        /// Get the configuration for the hidden dashboard
        /// </summary>
        [HttpGet("config")]
        [AllowAnonymous] // Configuration is public, no sensitive data
        [ProducesResponseType(typeof(HiddenDashboardOptions), StatusCodes.Status200OK)]
        public IActionResult GetConfig()
        {
            return Ok(_options);
        }
    }
}
