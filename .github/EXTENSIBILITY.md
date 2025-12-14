# OC.HiddenDashboard - Extensibility Guide

## 🎮 Overview

OC.HiddenDashboard now supports third-party extensions! Other packages can register their own hidden content that will be revealed alongside the main dashboard when users enter the Konami code (↑ ↑ ↓ ↓ ← →).

## ✨ Features

- **Easy Integration**: Simple manifest-based registration
- **Type Safe**: Full TypeScript support
- **Lazy Loading**: Components load on demand
- **Isolated**: Each extension runs independently
- **Beautiful UI**: Integrated sidebar navigation

## 🚀 Quick Start for Package Developers

### Step 1: Create Your Component

```typescript
// src/hidden-tools.element.ts
import {
  LitElement,
  css,
  html,
  customElement,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

@customElement("my-package-hidden-tools")
export class MyPackageHiddenToolsElement extends UmbElementMixin(LitElement) {
  render() {
    return html`
      <div class="tools">
        <h2>🔧 My Secret Tools</h2>
        <p>Hidden developer tools for advanced users</p>
        <uui-button look="primary" label="Run Tool">
          Run Tool
        </uui-button>
      </div>
    `;
  }

  static styles = [
    css`
      .tools {
        padding: var(--uui-size-space-4);
      }
    `,
  ];
}

export default MyPackageHiddenToolsElement;
```

### Step 2: Register Your Extension

```typescript
// src/manifest.ts
import type { ManifestBase } from "@umbraco-cms/backoffice/extension-api";

export const manifests: Array<ManifestBase> = [
  {
    type: "hiddenContent",
    alias: "MyPackage.HiddenTools",
    name: "My Hidden Tools",
    meta: {
      label: "Developer Tools",
      description: "Secret tools for advanced users",
      icon: "icon-wrench",
      pathname: "hidden-tools",
    },
    element: () => import("./hidden-tools.element.js"),
  } as any, // Cast needed for custom extension type
];
```

### Step 3: Include in Your Bundle

```typescript
// src/bundle.ts
import { manifests as hiddenTools } from "./manifest.js";

export const manifests = [
  ...hiddenTools,
  // ...other manifests
];
```

## 📋 Complete Example

See the full example in [`EXTENSION-USAGE.md`](./EXTENSION-USAGE.md) for detailed documentation including:
- Multiple example components
- Best practices
- Troubleshooting guide
- API reference

## 🎯 Use Cases

Perfect for:
- **Debug Panels**: System diagnostics and debugging tools
- **Feature Flags**: Toggle experimental features
- **Performance Monitors**: View performance metrics
- **Developer Tools**: Code generators, validators, etc.
- **Easter Eggs**: Fun hidden content for users
- **Admin Utilities**: Sensitive tools that shouldn't be easily accessible

## 📦 Extension Properties

### Required

```typescript
{
  type: "hiddenContent",           // Must be "hiddenContent"
  alias: "Unique.Alias",           // Your unique identifier
  name: "Display Name",            // Full name
  meta: {
    label: "Sidebar Label",        // Shows in sidebar
  },
  element: () => import("..."),    // Lazy-loaded component
}
```

### Optional

```typescript
meta: {
  description: "Longer description",  // Shown when selected
  icon: "icon-name",                  // Umbraco icon
  pathname: "url-slug",               // Optional path identifier
}
```

## 🔍 How It Works

1. **Registration**: Your package registers a `hiddenContent` type extension
2. **Discovery**: OC.HiddenDashboard monitors for these extensions
3. **Activation**: When Konami code is entered, dashboard appears
4. **Display**: Your content appears in the extensions sidebar
5. **Lazy Loading**: Component loads when user selects it

## 🎨 UI Integration

Your extension automatically gets:
- ✅ Sidebar navigation with your icon and label
- ✅ Content area for your component
- ✅ Consistent Umbraco styling
- ✅ Responsive layout
- ✅ Loading states

## 🔐 Security Note

While this feature hides content from casual users, it's **not a security feature**. Anyone who knows the Konami code can access it. For truly secure features:
- Implement proper permission checks in your component
- Validate user roles and permissions
- Don't expose sensitive data without authorization

## 📚 Full Documentation

- [Complete Usage Guide](./EXTENSION-USAGE.md) - Detailed examples and API reference
- [Umbraco Extension Docs](https://docs.umbraco.com/umbraco-cms/customizing/overview)

## 🤝 Support

- **GitHub**: [OC.HiddenDashboard](https://github.com/OwainWilliams/OC.HiddenDashboard)
- **Issues**: Report bugs or request features
- **Discussions**: Share your hidden extensions!

## 📝 Example Extensions

The package includes an example extension showing how to:
- Create interactive components
- Use Umbraco UI components
- Structure your code
- Handle state management

Look for "Example Extension" in the hidden dashboard sidebar!

---

**Made with ❤️ for the Umbraco community**
