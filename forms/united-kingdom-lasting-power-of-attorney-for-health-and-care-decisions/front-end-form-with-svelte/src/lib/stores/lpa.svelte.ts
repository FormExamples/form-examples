import { emptyLpaApplication } from '$lib/engine/factory.js';
import { calculateLpaValidity } from '$lib/engine/composite-validator.js';
import type { LpaApplication, LpaValidityResult } from '$lib/engine/types.js';

interface LpaStore {
  application: LpaApplication;
  step: number;
  validity: LpaValidityResult;
  recompute(): void;
  reset(): void;
  goToStep(n: number): void;
}

function makeStore(): LpaStore {
  const application = $state(emptyLpaApplication());
  let step = $state(1);
  let validity = $state(calculateLpaValidity(application));

  function recompute() {
    validity = calculateLpaValidity(application);
  }

  function reset() {
    Object.assign(application, emptyLpaApplication());
    step = 1;
    recompute();
  }

  function goToStep(n: number) {
    if (n >= 1 && n <= 14) {
      step = n;
    }
  }

  return {
    get application() {
      return application;
    },
    get step() {
      return step;
    },
    get validity() {
      return validity;
    },
    recompute,
    reset,
    goToStep,
  };
}

export const lpaStore = makeStore();
