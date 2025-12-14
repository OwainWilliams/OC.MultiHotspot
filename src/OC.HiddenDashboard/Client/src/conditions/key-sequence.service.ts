import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

export class KeySequenceService extends UmbControllerBase {
  private _keySequence: string[] = [];
  private _targetSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight"];
  private _isActivated = false;
  private _timeoutId?: number;

  constructor(host: UmbControllerHost) {
    super(host);
    this.#setupKeyListener();
  }

  #setupKeyListener() {
    document.addEventListener("keydown", this.#handleKeyPress);
  }

  #handleKeyPress = (event: KeyboardEvent) => {
    // Clear timeout if exists
    if (this._timeoutId) {
      window.clearTimeout(this._timeoutId);
    }

    // Add the key to sequence
    this._keySequence.push(event.key);

    // Keep only the last N keys where N is the target sequence length
    if (this._keySequence.length > this._targetSequence.length) {
      this._keySequence.shift();
    }

    // Check if sequence matches
    if (this.#checkSequence()) {
      this._isActivated = true;
      this.#notifyChange();
      console.log("🎮 Secret dashboard unlocked!");
    }

    // Reset sequence after 2 seconds of inactivity
    this._timeoutId = window.setTimeout(() => {
      this._keySequence = [];
    }, 2000);
  };

  #checkSequence(): boolean {
    if (this._keySequence.length !== this._targetSequence.length) {
      return false;
    }

    return this._targetSequence.every(
      (key, index) => key === this._keySequence[index]
    );
  }

  #notifyChange() {
    // Dispatch a custom event to notify condition checkers
    window.dispatchEvent(new CustomEvent("key-sequence-activated"));
  }

  isActivated(): boolean {
    return this._isActivated;
  }

  override destroy(): void {
    super.destroy();
    document.removeEventListener("keydown", this.#handleKeyPress);
    if (this._timeoutId) {
      window.clearTimeout(this._timeoutId);
    }
  }
}

// Singleton instance
let instance: KeySequenceService | null = null;

export function getKeySequenceService(host: UmbControllerHost): KeySequenceService {
  if (!instance) {
    instance = new KeySequenceService(host);
  }
  return instance;
}
