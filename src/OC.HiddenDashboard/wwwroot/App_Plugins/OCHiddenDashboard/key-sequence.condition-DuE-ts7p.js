import { UmbConditionBase as r } from "@umbraco-cms/backoffice/extension-registry";
import { UmbControllerBase as o } from "@umbraco-cms/backoffice/class-api";
class c extends o {
  constructor(e) {
    super(e), this._keySequence = [], this._targetSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight"], this._isActivated = !1, this.#t = (t) => {
      this._timeoutId && window.clearTimeout(this._timeoutId), this._keySequence.push(t.key), this._keySequence.length > this._targetSequence.length && this._keySequence.shift(), this.#i() && (this._isActivated = !0, this.#s(), console.log("🎮 Secret dashboard unlocked!")), this._timeoutId = window.setTimeout(() => {
        this._keySequence = [];
      }, 2e3);
    }, this.#e();
  }
  #e() {
    document.addEventListener("keydown", this.#t);
  }
  #t;
  #i() {
    return this._keySequence.length !== this._targetSequence.length ? !1 : this._targetSequence.every(
      (e, t) => e === this._keySequence[t]
    );
  }
  #s() {
    window.dispatchEvent(new CustomEvent("key-sequence-activated"));
  }
  isActivated() {
    return this._isActivated;
  }
  destroy() {
    super.destroy(), document.removeEventListener("keydown", this.#t), this._timeoutId && window.clearTimeout(this._timeoutId);
  }
}
let s = null;
function u(i) {
  return s || (s = new c(i)), s;
}
class a extends r {
  #e;
  constructor(e, t) {
    super(e, t);
    const n = u(e);
    this.permitted = n.isActivated(), this.#e = () => {
      this.permitted = n.isActivated();
    }, window.addEventListener("key-sequence-activated", this.#e);
  }
  destroy() {
    window.removeEventListener("key-sequence-activated", this.#e), super.destroy();
  }
}
export {
  a as KeySequenceCondition,
  a as default
};
//# sourceMappingURL=key-sequence.condition-DuE-ts7p.js.map
