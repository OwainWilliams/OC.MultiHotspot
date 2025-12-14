import {
  LitElement,
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { getHiddenContentRegistry } from "../extensions/hidden-content-registry.service.js";
import type { HiddenContentExtension } from "../extensions/hidden-content.manifest.js";
import { getHiddenDashboardConfig } from "../config/config.service.js";
import type { HiddenDashboardConfig } from "../config/config.interface.js";

@customElement("oc-hidden-content-section")
export class HiddenContentSectionElement extends UmbElementMixin(LitElement) {
  @state()
  private _extensions: Array<HiddenContentExtension> = [];

  @state()
  private _filteredExtensions: Array<HiddenContentExtension> = [];

  @state()
  private _config?: HiddenDashboardConfig;

  @state()
  private _selectedExtension?: HiddenContentExtension;

  @state()
  private _loadedElement?: HTMLElement;

  constructor() {
    super();

    const registry = getHiddenContentRegistry(this);
    const configService = getHiddenDashboardConfig(this);
    
    this.observe(
      registry.extensions,
      (extensions) => {
        this._extensions = extensions;
        this._filterExtensions();
      },
      "_observeExtensions"
    );

    this.observe(
      configService.config,
      (config) => {
        this._config = config;
        this._filterExtensions();
      },
      "_observeConfig"
    );
  }

  private _filterExtensions() {
    if (!this._config) {
      this._filteredExtensions = this._extensions;
      return;
    }

    this._filteredExtensions = this._extensions.filter((ext) => {
      // Check if it's an example extension
      const isExampleExtension = 
        ext.alias.startsWith("OC.HiddenDashboard.") && 
        (ext.alias.includes("Example") || ext.alias.includes("Pacman"));

      if (isExampleExtension) {
        // Check if example extensions are disabled globally
        if (!this._config!.showExampleExtensions) {
          return false;
        }
        
        // Check if this specific extension is in the disabled list
        if (this._config!.disabledExampleExtensions.includes(ext.alias)) {
          return false;
        }
      }

      return true;
    });

    // Auto-select first extension if available and current selection is filtered out
    if (this._filteredExtensions.length > 0) {
      if (!this._selectedExtension || !this._filteredExtensions.includes(this._selectedExtension)) {
        this._selectExtension(this._filteredExtensions[0]);
      }
    } else {
      this._selectedExtension = undefined;
      this._loadedElement = undefined;
    }
  }

  async _selectExtension(extension: HiddenContentExtension) {
    this._selectedExtension = extension;
    this._loadedElement = undefined;

    try {
      const module = await extension.elementLoader();
      const ElementClass = module.default || module[Object.keys(module)[0]];
      
      if (ElementClass) {
        this._loadedElement = new ElementClass();
      }
    } catch (error) {
      console.error(`Failed to load extension element for ${extension.alias}:`, error);
    }
  }

  render() {
    if (this._filteredExtensions.length === 0) {
      return html`
        <uui-box>
          <div slot="header">🎮 Hidden Content</div>
          <p>${this._config?.noExtensionsMessage || "No hidden content extensions registered yet."}</p>
          ${this._config?.showExtensibilityHint !== false
            ? html`<p><i>Third-party packages can register their hidden content here!</i></p>`
            : ""}
        </uui-box>
      `;
    }

    return html`
      <div class="hidden-content-container">
        <div class="sidebar">
          <h3>🎮 Hidden Extensions</h3>
          <ul class="extension-list">
            ${this._filteredExtensions.map(
              (ext) => html`
                <li>
                  <uui-button
                    look="${this._selectedExtension?.alias === ext.alias
                      ? 'primary'
                      : 'secondary'}"
                    label="${ext.label}"
                    @click="${() => this._selectExtension(ext)}"
                    compact
                  >
                    <uui-icon name="${ext.icon || 'icon-box'}"></uui-icon>
                    ${ext.label}
                  </uui-button>
                </li>
              `
            )}
          </ul>
        </div>
        
        <div class="content-area">
          ${this._selectedExtension
            ? html`
                <uui-box>
                  <div slot="header">
                    <uui-icon name="${this._selectedExtension.icon || 'icon-box'}"></uui-icon>
                    ${this._selectedExtension.label}
                  </div>
                  ${this._selectedExtension.description
                    ? html`<p class="description">${this._selectedExtension.description}</p>`
                    : ""}
                  ${this._loadedElement
                    ? html`<div class="extension-content">${this._loadedElement}</div>`
                    : html`<p>Loading...</p>`}
                </uui-box>
              `
            : html`<p>Select an extension to view its content.</p>`}
        </div>
      </div>
    `;
  }

  static styles = [
    css`
      :host {
        display: block;
      }

      .hidden-content-container {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: var(--uui-size-layout-1);
      }

      .sidebar {
        background: var(--uui-color-surface);
        border-radius: var(--uui-border-radius);
        padding: var(--uui-size-space-4);
      }

      .sidebar h3 {
        margin: 0 0 var(--uui-size-space-4) 0;
        font-size: var(--uui-type-h5-size);
      }

      .extension-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .extension-list li {
        margin-bottom: var(--uui-size-space-2);
      }

      .extension-list uui-button {
        width: 100%;
        justify-content: flex-start;
      }

      .content-area {
        min-height: 200px;
      }

      .description {
        color: var(--uui-color-text-alt);
        font-style: italic;
      }

      .extension-content {
        margin-top: var(--uui-size-space-4);
      }

      @media (max-width: 768px) {
        .hidden-content-container {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];
}

export default HiddenContentSectionElement;

declare global {
  interface HTMLElementTagNameMap {
    "oc-hidden-content-section": HiddenContentSectionElement;
  }
}
