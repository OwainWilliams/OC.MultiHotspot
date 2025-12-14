import {
  type UmbConditionConfigBase,
  type UmbConditionControllerArguments,
  type UmbExtensionCondition,
} from "@umbraco-cms/backoffice/extension-api";
import { UmbConditionBase } from "@umbraco-cms/backoffice/extension-registry";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { getKeySequenceService } from "./key-sequence.service.js";

export type KeySequenceConditionConfig = UmbConditionConfigBase<"OC.Condition.KeySequence">;

export class KeySequenceCondition
  extends UmbConditionBase<KeySequenceConditionConfig>
  implements UmbExtensionCondition
{
  #handleActivation: () => void;

  constructor(
    host: UmbControllerHost,
    args: UmbConditionControllerArguments<KeySequenceConditionConfig>
  ) {
    super(host, args);

    // Initialize the service
    const service = getKeySequenceService(host);
    
    // Set initial state
    this.permitted = service.isActivated();

    // Listen for activation events
    this.#handleActivation = () => {
      this.permitted = service.isActivated();
    };

    window.addEventListener("key-sequence-activated", this.#handleActivation);
  }

  override destroy(): void {
    window.removeEventListener("key-sequence-activated", this.#handleActivation);
    super.destroy();
  }
}

export default KeySequenceCondition;
