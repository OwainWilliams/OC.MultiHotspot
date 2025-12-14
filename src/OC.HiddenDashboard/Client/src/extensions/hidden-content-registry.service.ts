import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import type { ManifestHiddenContent, HiddenContentExtension } from "./hidden-content.manifest.js";
import { UmbArrayState } from "@umbraco-cms/backoffice/observable-api";

export class HiddenContentRegistryService extends UmbControllerBase {
  #extensions = new UmbArrayState<HiddenContentExtension>([], (x) => x.alias);

  public readonly extensions = this.#extensions.asObservable();

  constructor(host: UmbControllerHost) {
    super(host);
    
    // Observe the global extension registry for hiddenContent type extensions
    this.observe(
      umbExtensionsRegistry.byType("hiddenContent"),
      (manifests) => {
        this.#updateExtensions(manifests as Array<ManifestHiddenContent>);
      },
      "observeHiddenContentExtensions"
    );
  }

  #updateExtensions(manifests: Array<ManifestHiddenContent>) {
    const extensions: HiddenContentExtension[] = manifests.map((manifest) => ({
      alias: manifest.alias,
      name: manifest.name,
      label: manifest.meta.label,
      description: manifest.meta.description,
      icon: manifest.meta.icon || "icon-box",
      pathname: manifest.meta.pathname,
      elementLoader: manifest.element,
    }));

    this.#extensions.setValue(extensions);
  }

  getExtensions(): Array<HiddenContentExtension> {
    return this.#extensions.value;
  }
}

// Singleton instance
let instance: HiddenContentRegistryService | null = null;

export function getHiddenContentRegistry(host: UmbControllerHost): HiddenContentRegistryService {
  if (!instance) {
    instance = new HiddenContentRegistryService(host);
  }
  return instance;
}
