import type { ManifestBase } from "@umbraco-cms/backoffice/extension-api";

export interface ManifestHiddenContent extends ManifestBase {
  type: "hiddenContent";
  meta: {
    label: string;
    description?: string;
    icon?: string;
    pathname?: string;
  };
  element: () => Promise<any>;
}

export interface HiddenContentExtension {
  alias: string;
  name: string;
  label: string;
  description?: string;
  icon?: string;
  pathname?: string;
  elementLoader: () => Promise<any>;
}
