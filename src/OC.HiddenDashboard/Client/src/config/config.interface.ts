export interface HiddenDashboardConfig {
  dashboardTitle: string;
  keySequence: string[];
  showExampleExtensions: boolean;
  disabledExampleExtensions: string[];
  noExtensionsMessage: string;
  showExtensibilityHint: boolean;
}

export const DEFAULT_CONFIG: HiddenDashboardConfig = {
  dashboardTitle: "Hidden Dashboard",
  keySequence: [],
  showExampleExtensions: true,
  disabledExampleExtensions: [],
  noExtensionsMessage: "No hidden content extensions registered yet.",
  showExtensibilityHint: true,
};
