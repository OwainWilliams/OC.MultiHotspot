# OC.HiddenDashboard - Extension Usage Guide

## Overview

The OC.HiddenDashboard package allows third-party developers to register their own hidden content that will only be revealed when users enter the Konami code (↑ ↑ ↓ ↓ ← →).

This is perfect for:
- Easter eggs
- Developer tools
- Debug panels
- Hidden administrative features
- Secret content that shouldn't be easily discoverable

## How It Works

1. Your package registers a "hiddenContent" extension
2. The extension remains hidden until the Konami code is entered
3. Once revealed, your content appears in the Hidden Dashboard alongside other registered extensions

## Quick Start

### 1. Install the Package

```bash
# Install OC.HiddenDashboard in your Umbraco project
dotnet add package OC.HiddenDashboard
```

### 2. Create Your Hidden Content Component

Create a Web Component for your hidden content:

```typescript
// my-secret-panel.element.ts
import {
  LitElement,
  css,
  html,
  customElement,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";

@customElement("my-secret-panel")
export class MySecretPanelElement extends UmbElementMixin(LitElement) {
  render() {
    return html`
      <div class="secret-content">
        <h2>🎉 You found the secret panel!</h2>
        <p>This is my hidden content that only appears with the Konami code.</p>
        
        <uui-button
          look="primary"
          label="Do Something Secret"
          @click=${this.#handleSecretAction}
        >
          Do Something Secret
        </uui-button>
      </div>
    `;
  }

  #handleSecretAction = () => {
    console.log("Secret action executed!");
    // Your logic here
  };

  static styles = [
    css`
      .secret-content {
        padding: var(--uui-size-space-4);
      }

      h2 {
        margin-top: 0;
      }
    `,
  ];
}

export default MySecretPanelElement;

declare global {
  interface HTMLElementTagNameMap {
    "my-secret-panel": MySecretPanelElement;
  }
}
```

### 3. Register Your Extension

Create a manifest file to register your hidden content:

```typescript
// manifest.ts
import type { ManifestTypes } from "@umbraco-cms/backoffice/extension-registry";

const manifests: Array<ManifestTypes> = [
  {
    type: "hiddenContent",
    alias: "MyPackage.SecretPanel",
    name: "My Secret Panel",
    meta: {
      label: "Secret Developer Tools",
      description: "Hidden developer tools for advanced users",
      icon: "icon-wrench",
      pathname: "secret-panel",
    },
    element: () => import("./my-secret-panel.element.js"),
  },
];

export const manifests = manifests;
```

### 4. Load Your Manifest

Make sure your manifest is loaded in your package's bundle:

```typescript
// umbraco-package.ts or bundle.ts
import { manifests as mySecretManifests } from "./manifest.js";

export const manifests: Array<ManifestTypes> = [
  ...mySecretManifests,
  // ...other manifests
];
```

## Extension Properties

### Required Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | `"hiddenContent"` | Must be "hiddenContent" to register with the hidden dashboard |
| `alias` | `string` | Unique identifier for your extension |
| `name` | `string` | Display name for your extension |
| `meta.label` | `string` | Label shown in the sidebar |
| `element` | `() => Promise<any>` | Lazy-loaded element/component |

### Optional Properties

| Property | Type | Description |
|----------|------|-------------|
| `meta.description` | `string` | Description shown when selected |
| `meta.icon` | `string` | Umbraco icon name (e.g., "icon-wrench") |
| `meta.pathname` | `string` | Optional pathname identifier |

## Advanced Examples

### Example 1: Debug Information Panel

```typescript
{
  type: "hiddenContent",
  alias: "MyPackage.DebugPanel",
  name: "Debug Information",
  meta: {
    label: "Debug Info",
    description: "View system debug information",
    icon: "icon-bug",
  },
  element: () => import("./debug-panel.element.js"),
}
```

### Example 2: Feature Flags Manager

```typescript
{
  type: "hiddenContent",
  alias: "MyPackage.FeatureFlags",
  name: "Feature Flags",
  meta: {
    label: "Feature Flags",
    description: "Manage experimental features",
    icon: "icon-switch",
  },
  element: () => import("./feature-flags.element.js"),
}
```

### Example 3: Performance Monitor

```typescript
{
  type: "hiddenContent",
  alias: "MyPackage.PerfMonitor",
  name: "Performance Monitor",
  meta: {
    label: "Performance",
    description: "Monitor application performance metrics",
    icon: "icon-speedometer",
  },
  element: () => import("./perf-monitor.element.js"),
}
```

## Component Best Practices

### 1. Use Umbraco UI Components

Leverage the Umbraco UI library for consistency:

```typescript
import { UUIButtonElement } from "@umbraco-cms/backoffice/external/uui";

render() {
  return html`
    <uui-box headline="My Hidden Feature">
      <uui-button look="primary" label="Action">
        Perform Action
      </uui-button>
    </uui-box>
  `;
}
```

### 2. Handle State Properly

Use the `@state()` decorator for reactive properties:

```typescript
@state()
private _data?: MyData;

async connectedCallback() {
  super.connectedCallback();
  this._data = await this.#fetchData();
}
```

### 3. Clean Up Resources

Always clean up in the destroy or disconnectedCallback:

```typescript
override destroy(): void {
  // Clean up subscriptions, timers, etc.
  super.destroy();
}
```

## Testing Your Extension

1. Build your package
2. Start your Umbraco site
3. Navigate to the Content section
4. Press the Konami code: ↑ ↑ ↓ ↓ ← →
5. The Hidden Dashboard should appear
6. Your extension should be listed in the sidebar

## Troubleshooting

### Extension Not Appearing

- Verify the manifest type is exactly `"hiddenContent"`
- Check browser console for loading errors
- Ensure the element export is correct (use `export default`)

### Component Not Loading

- Check that the element import path is correct
- Verify the custom element is registered with `@customElement()`
- Check for TypeScript/build errors

### Konami Code Not Working

- The dashboard itself must be visible (check section conditions)
- Ensure you're pressing arrow keys (not WASD)
- Check browser console for the "🎮 Secret dashboard unlocked!" message

## API Reference

### Type Definitions

```typescript
interface ManifestHiddenContent extends ManifestBase {
  type: "hiddenContent";
  meta: {
    label: string;
    description?: string;
    icon?: string;
    pathname?: string;
  };
  element: () => Promise<any>;
}
```

## Support & Resources

- GitHub: [OC.HiddenDashboard](https://github.com/OwainWilliams/OC.HiddenDashboard)
- Issues: Report bugs or request features on GitHub
- Umbraco Docs: [Extension Development](https://docs.umbraco.com/umbraco-cms/customizing/overview)

## License

This extension system is part of OC.HiddenDashboard and follows its license terms.
