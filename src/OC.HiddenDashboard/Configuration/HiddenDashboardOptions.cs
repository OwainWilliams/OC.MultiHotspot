namespace OC.HiddenDashboard.Configuration
{
    /// <summary>
    /// Configuration options for the OC.HiddenDashboard package
    /// </summary>
    public class HiddenDashboardOptions
    {
        /// <summary>
        /// The display name for the hidden dashboard
        /// Default: "Hidden Dashboard"
        /// </summary>
        public string DashboardTitle { get; set; } = "Hidden Dashboard";

        /// <summary>
        /// Whether to show the built-in example extensions (Example Content and Pac-Man game)
        /// Default: true
        /// </summary>
        public bool ShowExampleExtensions { get; set; } = true;

        /// <summary>
        /// Array of specific example extension aliases to disable
        /// Example: ["OC.HiddenDashboard.PacmanGame", "OC.HiddenDashboard.ExampleContent"]
        /// </summary>
        public string[] DisabledExampleExtensions { get; set; } = Array.Empty<string>();

        /// <summary>
        /// Custom message to display in the hidden content section when no extensions are registered
        /// Default: "No hidden content extensions registered yet."
        /// </summary>
        public string NoExtensionsMessage { get; set; } = "No hidden content extensions registered yet.";

        /// <summary>
        /// Whether to show the hint about third-party packages being able to register content
        /// Default: true
        /// </summary>
        public bool ShowExtensibilityHint { get; set; } = true;
    }
}
