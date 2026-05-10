import type { AgileAssessment, GradingResult } from '$lib/engine/types.js';
import { createEmptyAssessment } from '$lib/engine/factory.js';
import { calculateMaturity } from '$lib/engine/composite-grader.js';
import { TOTAL_STEPS } from '$lib/config/steps.js';

class AssessmentStore {
  data: AgileAssessment = $state(createEmptyAssessment());
  currentStep = $state(1);

  result = $derived<GradingResult>(calculateMaturity(this.data));

  reset() {
    this.data = createEmptyAssessment();
    this.currentStep = 1;
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }
}

export const store = new AssessmentStore();
