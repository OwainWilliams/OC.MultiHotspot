using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

namespace CleanV18.Headless.Startup;

public class HeadlessApiComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.AddCleanV18StarterOpenApi();
    }
}
