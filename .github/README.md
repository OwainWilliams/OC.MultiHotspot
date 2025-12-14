# OC.HiddenDashboard 

[![Downloads](https://img.shields.io/nuget/dt/Umbraco.Community.OC.HiddenDashboard?color=cc9900)](https://www.nuget.org/packages/Umbraco.Community.OC.HiddenDashboard/)
[![NuGet](https://img.shields.io/nuget/vpre/Umbraco.Community.OC.HiddenDashboard?color=0273B3)](https://www.nuget.org/packages/Umbraco.Community.OC.HiddenDashboard)
[![GitHub license](https://img.shields.io/github/license/OwainWilliams/OC.HiddenDashboard?color=8AB803)](../LICENSE)

# OC.HiddenDashboard

A fun Umbraco package that adds a hidden dashboard accessible via the Konami code (↑ ↑ ↓ ↓ ← →), with full extensibility for third-party packages to register their own hidden content.

## Features

- 🎮 **Konami Code Activation** - Hidden dashboard revealed with classic cheat code
- 🔧 **Fully Configurable** - Customize title, control example extensions via appsettings.json
- 🎯 **Extensible** - Third-party packages can register their own hidden content
- 🎨 **Example Extensions** - Includes working Pac-Man game and documentation examples
- 📦 **Type Safe** - Full TypeScript support for extension development

## Installation

```bash
dotnet add package OC.HiddenDashboard
```

## Quick Start

### 1. Access the Dashboard

1. Navigate to Umbraco Content section
2. Press the Konami code: **↑ ↑ ↓ ↓ ← →**
3. The hidden dashboard appears!

### 2. Configure (Optional)

Add to your `appsettings.json`:

```json
{
  "OC.HiddenDashboard": {
    "DashboardTitle": "Secret Developer Tools",
    "ShowExampleExtensions": false,
    "DisabledExampleExtensions": ["OC.HiddenDashboard.PacmanGame"]
  }
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `DashboardTitle` | string | "Hidden Dashboard" | Title shown in the dashboard |
| `ShowExampleExtensions` | boolean | true | Show/hide all built-in examples |
| `DisabledExampleExtensions` | string[] | [] | Array of specific extensions to disable |
| `NoExtensionsMessage` | string | "No hidden content..." | Custom empty state message |
| `ShowExtensibilityHint` | boolean | true | Show hint about third-party extensions |

### Configuration Examples

**Hide All Examples (Production):**
```json
{
  "OC.HiddenDashboard": {
    "ShowExampleExtensions": false
  }
}
```

**Hide Only Pac-Man:**
```json
{
  "OC.HiddenDashboard": {
    "DisabledExampleExtensions": ["OC.HiddenDashboard.PacmanGame"]
  }
}
```

**Custom Branding:**
```json
{
  "OC.HiddenDashboard": {
    "DashboardTitle": "🔧 Internal Tools"
  }
}
```

## Creating Extensions

Third-party packages can register their own hidden content that appears in the dashboard.

### 1. Create Your Component

```typescript
import { LitElement, html, customElement } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

@customElement("my-secret-tools")
export class MySecretToolsElement extends UmbElementMixin(LitElement) {
  render() {
    return html`
      <div>
        <h2>🔧 My Secret Tools</h2>
        <p>Hidden developer tools for advanced users</p>
      </div>
    `;
  }
}

export default MySecretToolsElement;
```

### 2. Register Extension

```typescript
import type { ManifestBase } from "@umbraco-cms/backoffice/extension-api";

export const manifests: Array<ManifestBase> = [
  {
    type: "hiddenContent",
    alias: "MyPackage.SecretTools",
    name: "My Secret Tools",
    meta: {
      label: "Developer Tools",
      description: "Hidden tools for advanced users",
      icon: "icon-wrench",
    },
    element: () => import("./my-secret-tools.element.js"),
  } as any,
];
```

### 3. That's It!

Your extension will automatically appear in the hidden dashboard sidebar when users enter the Konami code!

## Built-in Examples

The package includes two example extensions:

### 📚 Example Extension
Demonstrates how to create custom hidden content with documentation and interactive demos.

### 🎮 Pac-Man Game
A fully playable classic Pac-Man game with:
- Classic gameplay and ghost AI
- Power pellets and scoring
- High score tracking (localStorage)
- Keyboard controls

**Controls:**
- Arrow Keys: Move
- P or Space: Pause

## Documentation

- **[CONFIGURATION.md](./CONFIGURATION.md)** - Complete configuration guide with examples
- **[EXTENSIBILITY.md](./EXTENSIBILITY.md)** - Quick start for package developers
- **[EXTENSION-USAGE.md](./EXTENSION-USAGE.md)** - Detailed API reference and examples
- **[PACMAN.md](./PACMAN.md)** - About the Pac-Man easter egg

## Requirements

- Umbraco CMS 17.0+
- .NET 10
- Node.js LTS (for development)

## Development

### Building the Package

```bash
# Build TypeScript/Client
cd Client
npm install
npm run build

# Build .NET
dotnet build
```

### File Watching

```bash
cd Client
npm run watch
```

## Use Cases

Perfect for:
- 🔍 Debug panels and diagnostics
- 🎛️ Feature flag management
- 📊 Performance monitoring tools
- 🎨 Easter eggs and fun content
- 🔐 Administrative utilities
- 🎮 Games and interactive content

## Security Note

⚠️ This feature hides content from casual users but is **not a security feature**. Always implement proper permission checks and authorization within your extensions for sensitive functionality.

## Contributing

Contributions welcome! Please see [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## License

[Your License Here]

## Credits

Created by [Your Name/Organization]

---

**Made with ❤️ for the Umbraco community**


## Installation

Add the package to an existing Umbraco website (v15+) from nuget:

`dotnet add package Umbraco.Community.OC.HiddenDashboard`

TODO *provide any other instructions for someone using your package*

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md).

## Acknowledgments

TODO