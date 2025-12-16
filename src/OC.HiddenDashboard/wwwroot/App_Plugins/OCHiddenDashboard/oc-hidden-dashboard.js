const a = [
  {
    name: "OCHidden Dashboard Entrypoint",
    alias: "OC.HiddenDashboard.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-EQsuJrwO.js")
  }
], e = [
  {
    name: "OCHidden Dashboard Dashboard",
    alias: "OC.HiddenDashboard.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-BHki1R0v.js"),
    meta: {
      label: "Hidden Dashboard",
      pathname: "example-dashboard"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      },
      {
        alias: "OC.Condition.KeySequence"
      }
    ]
  }
], n = [
  {
    type: "condition",
    name: "Key Sequence Condition",
    alias: "OC.Condition.KeySequence",
    api: () => import("./key-sequence.condition-CRSZu0uA.js")
  }
], t = [
  {
    type: "hiddenContent",
    alias: "OC.HiddenDashboard.ExampleContent",
    name: "Example Hidden Content",
    meta: {
      label: "Example Extension",
      description: "This demonstrates how third-party packages can register hidden content",
      icon: "icon-science",
      pathname: "example-hidden-content"
    },
    element: () => import("./example-hidden-content.element-DVMUEfti.js")
  },
  {
    type: "hiddenContent",
    alias: "OC.HiddenDashboard.PacmanGame",
    name: "Pac-Man Game",
    meta: {
      label: "Pac-Man",
      description: "Classic arcade game - Eat all the dots and avoid the ghosts!",
      icon: "icon-gamepad",
      pathname: "pacman-game"
    },
    element: () => import("./pacman-game.element-CpGxiBKV.js")
  }
], i = [
  ...a,
  ...e,
  ...n,
  ...t
];
export {
  i as manifests
};
//# sourceMappingURL=oc-hidden-dashboard.js.map
