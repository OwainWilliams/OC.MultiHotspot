import {
  LitElement,
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import "./hidden-content-section.element.js";
import { getHiddenDashboardConfig } from "../config/config.service.js";
import type { HiddenDashboardConfig } from "../config/config.interface.js";

@customElement("example-dashboard")
export class ExampleDashboardElement extends UmbElementMixin(LitElement) {
  @state()
  private _config?: HiddenDashboardConfig;

  constructor() {
    super();

    const configService = getHiddenDashboardConfig(this);
    this.observe(
      configService.config,
      (config) => {
        this._config = config;
      },
      "_observeConfig"
    );
  }

  render() {
    const title = this._config?.dashboardTitle || "Hidden Dashboard";

    return html`
      <div class="dashboard-header">
        <h1>🎮 ${title}</h1>
      </div>
      <oc-hidden-content-section class="wide"></oc-hidden-content-section>
    `;
  }

  static styles = [
    css`
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
    `,
  ];
}

export default ExampleDashboardElement;

declare global {
  interface HTMLElementTagNameMap {
    "example-dashboard": ExampleDashboardElement;
  }
}
