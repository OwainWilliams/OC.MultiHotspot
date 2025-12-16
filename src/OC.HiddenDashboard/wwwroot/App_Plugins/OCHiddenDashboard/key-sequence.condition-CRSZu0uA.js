import { UmbConditionBase as c } from "@umbraco-cms/backoffice/extension-registry";
import { UmbControllerBase as o } from "@umbraco-cms/backoffice/class-api";
import { g as r } from "./config.service-U1CJjH1k.js";
class u extends o {
  constructor(e) {
    super(e), this._keySequence = [], this._targetSequence = [], this._isActivated = !1, this._isEnabled = !1, this.#t = (t) => {
      this._isEnabled && (this._timeoutId && window.clearTimeout(this._timeoutId), this._keySequence.push(t.key), console.log(
        "Key pressed:",
        t.key,
        "Current sequence:",
        [...this._keySequence],
        "Target:",
        this._targetSequence
      ), this._keySequence.length > this._targetSequence.length && this._keySequence.shift(), this.#s() && (this._isActivated = !0, this.#n(), console.log("🎮 Secret dashboard unlocked!")), this._timeoutId = window.setTimeout(() => {
        this._keySequence = [], console.log("Key sequence reset due to inactivity");
      }, 2e3));
    }, this.#e(e);
  }
  async #e(e) {
    const t = r(e);
    console.log("KeySequenceService: Waiting for config..."), t.config.subscribe((i) => {
      console.log("KeySequenceService: Config received", i), i.keySequence && i.keySequence.length > 0 ? (this._targetSequence = i.keySequence, this._isEnabled = !0, console.log(
        "KeySequenceService: Key sequence configured",
        this._targetSequence
      ), document.querySelector("[data-key-sequence-listener]") || this.#i()) : (this._isEnabled = !1, console.log(
        "KeySequenceService: No key sequence configured, dashboard disabled"
      ));
    });
  }
  #i() {
    document.body.setAttribute("data-key-sequence-listener", "true"), document.addEventListener("keydown", this.#t), console.log("KeySequenceService: Key listener setup complete");
  }
  #t;
  #s() {
    return this._keySequence.length !== this._targetSequence.length ? !1 : this._targetSequence.every(
      (e, t) => e === this._keySequence[t]
    );
  }
  #n() {
    window.dispatchEvent(new CustomEvent("key-sequence-activated"));
  }
  isActivated() {
    return this._isActivated;
  }
  destroy() {
    super.destroy(), document.removeEventListener("keydown", this.#t), document.body.removeAttribute("data-key-sequence-listener"), this._timeoutId && window.clearTimeout(this._timeoutId);
  }
}
let n = null;
function d(s) {
  return n || (n = new u(s)), n;
}
class y extends c {
  #e;
  constructor(e, t) {
    super(e, t);
    const i = d(e);
    this.permitted = i.isActivated(), this.#e = () => {
      this.permitted = i.isActivated();
    }, window.addEventListener("key-sequence-activated", this.#e);
  }
  destroy() {
    window.removeEventListener("key-sequence-activated", this.#e), super.destroy();
  }
}
export {
  y as KeySequenceCondition,
  y as default
};
//# sourceMappingURL=key-sequence.condition-CRSZu0uA.js.map
