import { LitElement as p, html as o, css as x, state as d, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as f } from "@umbraco-cms/backoffice/element-api";
import { UmbControllerBase as E } from "@umbraco-cms/backoffice/class-api";
import { umbExtensionsRegistry as v } from "@umbraco-cms/backoffice/extension-registry";
import { UmbArrayState as g } from "@umbraco-cms/backoffice/observable-api";
import { g as _ } from "./config.service-U1CJjH1k.js";
class y extends E {
  constructor(t) {
    super(t), this.#e = new g([], (i) => i.alias), this.extensions = this.#e.asObservable(), this.observe(
      v.byType("hiddenContent"),
      (i) => {
        this.#t(i);
      },
      "observeHiddenContentExtensions"
    );
  }
  #e;
  #t(t) {
    const i = t.map((s) => ({
      alias: s.alias,
      name: s.name,
      label: s.meta.label,
      description: s.meta.description,
      icon: s.meta.icon || "icon-box",
      pathname: s.meta.pathname,
      elementLoader: s.element
    }));
    this.#e.setValue(i);
  }
  getExtensions() {
    return this.#e.value;
  }
}
let h = null;
function $(e) {
  return h || (h = new y(e)), h;
}
var w = Object.defineProperty, C = Object.getOwnPropertyDescriptor, c = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? C(t, i) : t, a = e.length - 1, l; a >= 0; a--)
    (l = e[a]) && (n = (s ? l(t, i, n) : l(n)) || n);
  return s && n && w(t, i, n), n;
};
let r = class extends f(p) {
  constructor() {
    super(), this._extensions = [], this._filteredExtensions = [];
    const e = $(this), t = _(this);
    this.observe(
      e.extensions,
      (i) => {
        this._extensions = i, this._filterExtensions();
      },
      "_observeExtensions"
    ), this.observe(
      t.config,
      (i) => {
        this._config = i, this._filterExtensions();
      },
      "_observeConfig"
    );
  }
  _filterExtensions() {
    if (!this._config) {
      this._filteredExtensions = this._extensions;
      return;
    }
    this._filteredExtensions = this._extensions.filter((e) => !(e.alias.startsWith("OC.HiddenDashboard.") && (e.alias.includes("Example") || e.alias.includes("Pacman")) && (!this._config.showExampleExtensions || this._config.disabledExampleExtensions.includes(e.alias)))), this._filteredExtensions.length > 0 ? (!this._selectedExtension || !this._filteredExtensions.includes(this._selectedExtension)) && this._selectExtension(this._filteredExtensions[0]) : (this._selectedExtension = void 0, this._loadedElement = void 0);
  }
  async _selectExtension(e) {
    this._selectedExtension = e, this._loadedElement = void 0;
    try {
      const t = await e.elementLoader(), i = t.default || t[Object.keys(t)[0]];
      i && (this._loadedElement = new i());
    } catch (t) {
      console.error(`Failed to load extension element for ${e.alias}:`, t);
    }
  }
  render() {
    return this._filteredExtensions.length === 0 ? o`
        <uui-box>
          <div slot="header">🎮 Hidden Content</div>
          <p>${this._config?.noExtensionsMessage || "No hidden content extensions registered yet."}</p>
          ${this._config?.showExtensibilityHint !== !1 ? o`<p><i>Third-party packages can register their hidden content here!</i></p>` : ""}
        </uui-box>
      ` : o`
      <div class="hidden-content-container">
        <div class="sidebar">
          <h3>🎮 Hidden Extensions</h3>
          <ul class="extension-list">
            ${this._filteredExtensions.map(
      (e) => o`
                <li>
                  <uui-button
                    look="${this._selectedExtension?.alias === e.alias ? "primary" : "secondary"}"
                    label="${e.label}"
                    @click="${() => this._selectExtension(e)}"
                    compact
                  >
                    <uui-icon name="${e.icon || "icon-box"}"></uui-icon>
                    ${e.label}
                  </uui-button>
                </li>
              `
    )}
          </ul>
        </div>
        
        <div class="content-area">
          ${this._selectedExtension ? o`
                <uui-box>
                  <div slot="header">
                    <uui-icon name="${this._selectedExtension.icon || "icon-box"}"></uui-icon>
                    ${this._selectedExtension.label}
                  </div>
                  ${this._selectedExtension.description ? o`<p class="description">${this._selectedExtension.description}</p>` : ""}
                  ${this._loadedElement ? o`<div class="extension-content">${this._loadedElement}</div>` : o`<p>Loading...</p>`}
                </uui-box>
              ` : o`<p>Select an extension to view its content.</p>`}
        </div>
      </div>
    `;
  }
};
r.styles = [
  x`
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
    `
];
c([
  d()
], r.prototype, "_extensions", 2);
c([
  d()
], r.prototype, "_filteredExtensions", 2);
c([
  d()
], r.prototype, "_config", 2);
c([
  d()
], r.prototype, "_selectedExtension", 2);
c([
  d()
], r.prototype, "_loadedElement", 2);
r = c([
  m("oc-hidden-content-section")
], r);
var z = Object.defineProperty, O = Object.getOwnPropertyDescriptor, b = (e, t, i, s) => {
  for (var n = s > 1 ? void 0 : s ? O(t, i) : t, a = e.length - 1, l; a >= 0; a--)
    (l = e[a]) && (n = (s ? l(t, i, n) : l(n)) || n);
  return s && n && z(t, i, n), n;
};
let u = class extends f(p) {
  constructor() {
    super();
    const e = _(this);
    this.observe(
      e.config,
      (t) => {
        this._config = t;
      },
      "_observeConfig"
    );
  }
  render() {
    const e = this._config?.dashboardTitle || "Hidden Dashboard";
    return o`
      <div class="dashboard-header">
        <h1>🎮 ${e}</h1>
      </div>
      <oc-hidden-content-section class="wide"></oc-hidden-content-section>
    `;
  }
};
u.styles = [
  x`
      :host {
        display: grid;
        gap: var(--uui-size-layout-1);
        padding: var(--uui-size-layout-1);
        grid-template-columns: 1fr 1fr 1fr;
      }

      .dashboard-header {
        grid-column: span 3;
        text-align: center;
        padding: var(--uui-size-space-4) 0;
      }

      .dashboard-header h1 {
        margin: 0;
        color: var(--uui-color-primary);
        font-size: 2.5em;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
      }

      uui-box {
        margin-bottom: var(--uui-size-layout-1);
      }

      h2 {
        margin-top: 0;
      }

      .wide {
        grid-column: span 3;
      }
    `
];
b([
  d()
], u.prototype, "_config", 2);
u = b([
  m("example-dashboard")
], u);
const R = u;
export {
  u as ExampleDashboardElement,
  R as default
};
//# sourceMappingURL=dashboard.element-BHki1R0v.js.map
