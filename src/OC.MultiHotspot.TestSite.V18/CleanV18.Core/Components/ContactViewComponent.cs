using CleanV18.Core.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace CleanV18.Core.Components
{
    [ViewComponent(Name = "Contact")]
    public class ContactViewComponent : ViewComponent
    {
        public IViewComponentResult Invoke(ContactViewModel model)
        {
            return View(model);
        }
    }
}
