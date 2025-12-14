import type { ManifestBase } from "@umbraco-cms/backoffice/extension-api";

export const manifests: Array<ManifestBase> = [
  {
    type: "hiddenContent",
    alias: "OC.HiddenDashboard.ExampleContent",
    name: "Example Hidden Content",
    meta: {
      label: "Example Extension",
      description: "This demonstrates how third-party packages can register hidden content",
      icon: "icon-science",
      pathname: "example-hidden-content",
    },
    element: () => import("./example-hidden-content.element.js"),
  } as any,
  {
    type: "hiddenContent",
    alias: "OC.HiddenDashboard.PacmanGame",
    name: "Pac-Man Game",
    meta: {
      label: "Pac-Man",
      description: "Classic arcade game - Eat all the dots and avoid the ghosts!",
      icon: "icon-gamepad",
      pathname: "pacman-game",
    },
    element: () => import("./pacman-game.element.js"),
  } as any,
];
