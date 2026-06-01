import type { GradingResult, WaitingListCard } from '$lib/engine/types.js';
import { createEmptyCard } from '$lib/engine/factory.js';
import { calculateWaitingTimeStatus } from '$lib/engine/composite-grader.js';
import { TOTAL_STEPS } from '$lib/config/steps.js';

class CardStore {
  data: WaitingListCard = $state(createEmptyCard());
  currentStep = $state(1);
  todayIso = $state(new Date().toISOString().slice(0, 10));

  result = $derived<GradingResult>(
    calculateWaitingTimeStatus(this.data, { todayIso: this.todayIso })
  );

  reset() {
    this.data = createEmptyCard();
    this.currentStep = 1;
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }

  next() {
    if (this.currentStep < TOTAL_STEPS) this.currentStep += 1;
  }

  prev() {
    if (this.currentStep > 1) this.currentStep -= 1;
  }
}

export const store = new CardStore();
