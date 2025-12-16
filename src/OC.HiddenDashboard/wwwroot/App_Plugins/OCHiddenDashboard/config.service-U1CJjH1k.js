import { UmbControllerBase as i } from "@umbraco-cms/backoffice/class-api";
import { UmbObjectState as o } from "@umbraco-cms/backoffice/observable-api";
const a = {
  dashboardTitle: "Hidden Dashboard",
  keySequence: [],
  showExampleExtensions: !0,
  disabledExampleExtensions: [],
  noExtensionsMessage: "No hidden content extensions registered yet.",
  showExtensibilityHint: !0
};
class r extends i {
  constructor(e) {
    super(e), this.#e = new o(a), this.config = this.#e.asObservable(), this.#n();
  }
  #e;
  async #n() {
    try {
      const e = await fetch("/umbraco/ochiddendashboard/api/v1/config", {
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (e.ok) {
        const n = await e.json();
        this.#e.setValue(n);
      }
    } catch {
    }
  }
  getConfig() {
    return this.#e.value;
  }
  isExtensionEnabled(e) {
    const n = this.#e.value;
    return !(e.startsWith("OC.HiddenDashboard.") && (e.includes("Example") || e.includes("Pacman")) && (!n.showExampleExtensions || n.disabledExampleExtensions.includes(e)));
  }
}
let s = null;
function h(t) {
  return s || (s = new r(t)), s;
}
export {
  h as g
};
//# sourceMappingURL=config.service-U1CJjH1k.js.map
