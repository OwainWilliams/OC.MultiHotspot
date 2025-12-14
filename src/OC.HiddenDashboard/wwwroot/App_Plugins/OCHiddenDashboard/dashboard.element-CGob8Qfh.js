import { LitElement as x, html as o, css as f, state as d, customElement as m } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as E } from "@umbraco-cms/backoffice/element-api";
import { UmbControllerBase as b } from "@umbraco-cms/backoffice/class-api";
import { umbExtensionsRegistry as v } from "@umbraco-cms/backoffice/extension-registry";
import { UmbArrayState as y, UmbObjectState as w } from "@umbraco-cms/backoffice/observable-api";
class $ extends b {
  constructor(e) {
    super(e), this.#e = new y([], (i) => i.alias), this.extensions = this.#e.asObservable(), this.observe(
      v.byType("hiddenContent"),
      (i) => {
        this.#t(i);
      },
      "observeHiddenContentExtensions"
    );
  }
  #e;
  #t(e) {
    const i = e.map((s) => ({
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
let u = null;
function C(t) {
  return u || (u = new $(t)), u;
}
const O = {
  dashboardTitle: "Hidden Dashboard",
  showExampleExtensions: !0,
  disabledExampleExtensions: [],
  noExtensionsMessage: "No hidden content extensions registered yet.",
  showExtensibilityHint: !0
};
class H extends b {
  constructor(e) {
    super(e), this.#e = new w(O), this.config = this.#e.asObservable(), this.#t();
  }
  #e;
  async #t() {
    try {
      const e = await fetch("/umbraco/ochiddendashboard/api/v1/config", {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (e.ok) {
        const i = await e.json();
        this.#e.setValue(i);
      }
    } catch {
    }
  }
  getConfig() {
    return this.#e.value;
  }
  isExtensionEnabled(e) {
    const i = this.#e.value;
    return !(e.startsWith("OC.HiddenDashboard.") && (e.includes("Example") || e.includes("Pacman")) && (!i.showExampleExtensions || i.disabledExampleExtensions.includes(e)));
  }
}
let p = null;
function g(t) {
  return p || (p = new H(t)), p;
}
var D = Object.defineProperty, z = Object.getOwnPropertyDescriptor, c = (t, e, i, s) => {
  for (var n = s > 1 ? void 0 : s ? z(e, i) : e, a = t.length - 1, l; a >= 0; a--)
    (l = t[a]) && (n = (s ? l(e, i, n) : l(n)) || n);
  return s && n && D(e, i, n), n;
};
let r = class extends E(x) {
  constructor() {
    super(), this._extensions = [], this._filteredExtensions = [];
    const t = C(this), e = g(this);
    this.observe(
      t.extensions,
      (i) => {
        this._extensions = i, this._filterExtensions();
      },
      "_observeExtensions"
    ), this.observe(
      e.config,
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
    this._filteredExtensions = this._extensions.filter((t) => !(t.alias.startsWith("OC.HiddenDashboard.") && (t.alias.includes("Example") || t.alias.includes("Pacman")) && (!this._config.showExampleExtensions || this._config.disabledExampleExtensions.includes(t.alias)))), this._filteredExtensions.length > 0 ? (!this._selectedExtension || !this._filteredExtensions.includes(this._selectedExtension)) && this._selectExtension(this._filteredExtensions[0]) : (this._selectedExtension = void 0, this._loadedElement = void 0);
  }
  async _selectExtension(t) {
    this._selectedExtension = t, this._loadedElement = void 0;
    try {
      const e = await t.elementLoader(), i = e.default || e[Object.keys(e)[0]];
      i && (this._loadedElement = new i());
    } catch (e) {
      console.error(`Failed to load extension element for ${t.alias}:`, e);
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
      (t) => o`
                <li>
                  <uui-button
                    look="${this._selectedExtension?.alias === t.alias ? "primary" : "secondary"}"
                    label="${t.label}"
                    @click="${() => this._selectExtension(t)}"
                    compact
                  >
                    <uui-icon name="${t.icon || "icon-box"}"></uui-icon>
                    ${t.label}
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
  f`
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
var P = Object.defineProperty, j = Object.getOwnPropertyDescriptor, _ = (t, e, i, s) => {
  for (var n = s > 1 ? void 0 : s ? j(e, i) : e, a = t.length - 1, l; a >= 0; a--)
    (l = t[a]) && (n = (s ? l(e, i, n) : l(n)) || n);
  return s && n && P(e, i, n), n;
};
let h = class extends E(x) {
  constructor() {
    super();
    const t = g(this);
    this.observe(
      t.config,
      (e) => {
        this._config = e;
      },
      "_observeConfig"
    );
  }
  render() {
    const t = this._config?.dashboardTitle || "Hidden Dashboard";
    return o`
      <div class="dashboard-header">
        <h1>🎮 ${t}</h1>
      </div>
      <oc-hidden-content-section class="wide"></oc-hidden-content-section>
    `;
  }
};
h.styles = [
  f`
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
_([
  d()
], h.prototype, "_config", 2);
h = _([
  m("example-dashboard")
], h);
const M = h;
export {
  h as ExampleDashboardElement,
  M as default
};
//# sourceMappingURL=dashboard.element-CGob8Qfh.js.map
