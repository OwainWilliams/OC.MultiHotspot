using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;

namespace CleanV18.Core.Extensions;

public static class PublishedContentExtensions
{
    public static string GetAltText(this IPublishedContent content, string altTextPropertyAlias = "altText")
    {
        if (content == null) return "";
        if (content.HasProperty(altTextPropertyAlias)) return content.Value<string>(altTextPropertyAlias);

        return "";
    }
}
