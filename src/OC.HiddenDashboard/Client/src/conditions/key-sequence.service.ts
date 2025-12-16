import { UmbControllerBase } from "@umbraco-cms/backoffice/class-api";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { getHiddenDashboardConfig } from "../config/config.service.js";

export class KeySequenceService extends UmbControllerBase {
  private _keySequence: string[] = [];
  private _targetSequence: string[] = [];
  private _isActivated = false;
  private _timeoutId?: number;
  private _isEnabled = false;

  constructor(host: UmbControllerHost) {
    super(host);
    this.#loadConfigAndSetup(host);
  }

  async #loadConfigAndSetup(host: UmbControllerHost) {
    // Get the configuration service
    const configService = getHiddenDashboardConfig(host);

    

    // Wait for config to load - but don't block the constructor
    configService.config.subscribe((config) => {
    

      if (config.keySequence && config.keySequence.length > 0) {
        this._targetSequence = config.keySequence;
        this._isEnabled = true;
       

        // Only setup listener once
        if (!document.querySelector('[data-key-sequence-listener]')) {
          this.#setupKeyListener();
        }
      } else {
        // No key sequence configured, dashboard remains disabled
        this._isEnabled = false;
      }
    });
  }

  #setupKeyListener() {
    // Mark that we've set up the listener
    document.body.setAttribute("data-key-sequence-listener", "true");
    document.addEventListener("keydown", this.#handleKeyPress);
  }

  #handleKeyPress = (event: KeyboardEvent) => {
    if (!this._isEnabled) {
      return;
    }

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
    document.body.removeAttribute("data-key-sequence-listener");
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
