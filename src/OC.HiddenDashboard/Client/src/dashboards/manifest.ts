export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "OCHidden Dashboard Dashboard",
    alias: "OC.HiddenDashboard.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element.js"),
    meta: {
      label: "Hidden Dashboard",
      pathname: "example-dashboard",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content",
      },
      {
        alias: "OC.Condition.KeySequence",
      },
    ],
  },
];
