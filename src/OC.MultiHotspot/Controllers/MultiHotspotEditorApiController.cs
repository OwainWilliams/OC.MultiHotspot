using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Security;

namespace OC.MultiHotspot.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "oc-multihotspot")] // Should match Constants.ApiName
    public class MultiHotspotEditorApiController : MultiHotspotEditorApiControllerBase
    {
        private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor;

        public MultiHotspotEditorApiController(IBackOfficeSecurityAccessor backOfficeSecurityAccessor)
        {
            _backOfficeSecurityAccessor = backOfficeSecurityAccessor;
        }
    }
}
