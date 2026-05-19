import type { GradingResult, MedifAssessment } from '$lib/engine/types.js';
import { createEmptyAssessment } from '$lib/engine/factory.js';
import { evaluateFitnessToFly } from '$lib/engine/composite-grader.js';

export const TOTAL_STEPS = 14;

class AssessmentStore {
  data: MedifAssessment = $state(createEmptyAssessment());
  currentStep = $state(1);

  result = $derived<GradingResult>(evaluateFitnessToFly(this.data));

  reset() {
    this.data = createEmptyAssessment();
    this.currentStep = 1;
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }
}

export const store = new AssessmentStore();
