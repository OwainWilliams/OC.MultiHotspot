import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { type HiddenDashboardConfig, DEFAULT_CONFIG } from "./config.interface.js";

export class HiddenDashboardConfigService extends UmbControllerBase {
  #config = new UmbObjectState<HiddenDashboardConfig>(DEFAULT_CONFIG);
  public readonly config = this.#config.asObservable();

  constructor(host: UmbControllerHost) {
    super(host);
    this.#loadConfig();
  }

  async #loadConfig() {
    try {
      const response = await fetch("/umbraco/ochiddendashboard/api/v1/config", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      if (response.ok) {
        const config = await response.json();
        this.#config.setValue(config);
      }
    } catch (error) {
      // Silently fall back to default config
    }
  }

  getConfig(): HiddenDashboardConfig {
    return this.#config.value;
  }

  isExtensionEnabled(alias: string): boolean {
    const config = this.#config.value;
    
    // Check if it's an example extension
    const isExampleExtension = 
      alias.startsWith("OC.HiddenDashboard.") && 
      (alias.includes("Example") || alias.includes("Pacman"));

    if (isExampleExtension) {
      if (!config.showExampleExtensions) {
        return false;
      }
      
      if (config.disabledExampleExtensions.includes(alias)) {
        return false;
      }
    }

    return true;
  }
}

// Singleton instance
let instance: HiddenDashboardConfigService | null = null;

export function getHiddenDashboardConfig(host: UmbControllerHost): HiddenDashboardConfigService {
  if (!instance) {
    instance = new HiddenDashboardConfigService(host);
  }
  return instance;
}
