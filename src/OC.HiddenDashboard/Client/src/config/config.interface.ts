export interface HiddenDashboardConfig {
  dashboardTitle: string;
  showExampleExtensions: boolean;
  disabledExampleExtensions: string[];
  noExtensionsMessage: string;
  showExtensibilityHint: boolean;
}

export const DEFAULT_CONFIG: HiddenDashboardConfig = {
  dashboardTitle: "Hidden Dashboard",
  showExampleExtensions: true,
  disabledExampleExtensions: [],
  noExtensionsMessage: "No hidden content extensions registered yet.",
  showExtensibilityHint: true,
};
