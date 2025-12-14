# Configuration Guide

## Overview

OC.HiddenDashboard can be customized through configuration in your `appsettings.json` file. This allows you to rename the dashboard, control which example extensions are shown, and customize messaging.

## Quick Start

Add the following section to your `appsettings.json`:

```json
{
  "OC.HiddenDashboard": {
    "DashboardTitle": "Secret Developer Tools",
    "ShowExampleExtensions": false,
    "DisabledExampleExtensions": ["OC.HiddenDashboard.PacmanGame"],
    "NoExtensionsMessage": "No extensions available yet.",
    "ShowExtensibilityHint": true
  }
}
```

**Important:** Restart your application after changing configuration.

## Available Options

### `DashboardTitle`
**Type:** `string`  
**Default:** `"Hidden Dashboard"`

The display name for the hidden dashboard shown at the top of the content area.

**Example:**
```json
"DashboardTitle": "🔧 Secret Developer Tools"
```

---

### `ShowExampleExtensions`
**Type:** `boolean`  
**Default:** `true`

Controls whether ALL built-in example extensions (Example Content and Pac-Man game) are shown.

**Example:**
```json
"ShowExampleExtensions": false
```

---

### `DisabledExampleExtensions`
**Type:** `string[]`  
**Default:** `[]` (empty array)

Array of specific example extension aliases to disable for fine-grained control.

**Available Aliases:**
- `OC.HiddenDashboard.ExampleContent`
- `OC.HiddenDashboard.PacmanGame`

**Example:**
```json
"DisabledExampleExtensions": [
  "OC.HiddenDashboard.PacmanGame"
]
```

---

### `NoExtensionsMessage`
**Type:** `string`  
**Default:** `"No hidden content extensions registered yet."`

Custom message displayed when no extensions are available.

**Example:**
```json
"NoExtensionsMessage": "Register your custom extensions to see them here!"
```

---

### `ShowExtensibilityHint`
**Type:** `boolean`  
**Default:** `true`

Whether to show the hint "Third-party packages can register their hidden content here!" when no extensions are available.

**Example:**
```json
"ShowExtensibilityHint": false
```

## Configuration Examples

### Production Environment

Hide all built-in examples:

```json
{
  "OC.HiddenDashboard": {
    "DashboardTitle": "Internal Tools",
    "ShowExampleExtensions": false,
    "ShowExtensibilityHint": false
  }
}
```

### Development Environment

Keep examples but hide the game:

```json
{
  "OC.HiddenDashboard": {
    "DashboardTitle": "🎮 Hidden Dashboard",
    "ShowExampleExtensions": true,
    "DisabledExampleExtensions": [
      "OC.HiddenDashboard.PacmanGame"
    ]
  }
}
```

### Custom Branding

Rename for your organization:

```json
{
  "OC.HiddenDashboard": {
    "DashboardTitle": "Acme Corp Secret Features"
  }
}
```

## Environment-Specific Configuration

Use different configurations per environment:

**appsettings.Development.json:**
```json
{
  "OC.HiddenDashboard": {
    "ShowExampleExtensions": true
  }
}
```

**appsettings.Production.json:**
```json
{
  "OC.HiddenDashboard": {
    "ShowExampleExtensions": false,
    "ShowExtensibilityHint": false
  }
}
```

## Configuration Priority

Settings follow the standard ASP.NET Core configuration hierarchy:

1. `appsettings.json` (base settings)
2. `appsettings.{Environment}.json` (environment-specific overrides)
3. Environment variables
4. Command-line arguments

## Programmatic Configuration

Configure options programmatically in a composer:

```csharp
using Microsoft.Extensions.DependencyInjection;
using OC.HiddenDashboard.Configuration;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;

public class CustomHiddenDashboardComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        builder.Services.Configure<HiddenDashboardOptions>(options =>
        {
            options.DashboardTitle = "My Custom Dashboard";
            options.ShowExampleExtensions = false;
        });
    }
}
```

## Notes

- Configuration changes require an application restart
- Clear browser cache (Ctrl+F5) after restart for changes to take effect
- The dashboard tab label remains static (cannot be configured dynamically)
- The configuration endpoint is publicly accessible but contains no sensitive data

## See Also

- [README.md](./README.md) - Package overview
- [EXTENSIBILITY.md](./EXTENSIBILITY.md) - Creating custom extensions
- [EXTENSION-USAGE.md](./EXTENSION-USAGE.md) - Detailed API reference
