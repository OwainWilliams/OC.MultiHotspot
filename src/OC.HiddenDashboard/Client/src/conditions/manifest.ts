import type { ManifestCondition } from "@umbraco-cms/backoffice/extension-api";

export const manifests: Array<ManifestCondition> = [
  {
    type: "condition",
    name: "Key Sequence Condition",
    alias: "OC.Condition.KeySequence",
    api: () => import("./key-sequence.condition.js"),
  },
];
