export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "OCHidden Dashboard Entrypoint",
    alias: "OC.HiddenDashboard.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];
