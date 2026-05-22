import type { Lpa, ValidationResult } from '$lib/types.js';
import { createEmptyLpa, createEmptyPerson } from '$lib/factory.js';
import { validateLpa } from '$lib/validator/validator.js';
import { TOTAL_STEPS } from '$lib/config/steps.js';

class LpaStore {
  data: Lpa = $state(createEmptyLpa());
  currentStep = $state(1);

  result = $derived<ValidationResult>(validateLpa(this.data));

  reset() {
    this.data = createEmptyLpa();
    this.currentStep = 1;
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }

  addAttorney() {
    this.data.attorneys.push({
      person: createEmptyPerson(),
      ordinal: this.data.attorneys.length + 1,
    });
  }

  removeAttorney(idx: number) {
    this.data.attorneys.splice(idx, 1);
    this.data.attorneys.forEach((a, i) => {
      a.ordinal = i + 1;
    });
  }

  addReplacementAttorney() {
    this.data.replacementAttorneys.push({
      person: createEmptyPerson(),
      ordinal: this.data.replacementAttorneys.length + 1,
      replacementStepInCondition: '',
    });
  }

  removeReplacementAttorney(idx: number) {
    this.data.replacementAttorneys.splice(idx, 1);
    this.data.replacementAttorneys.forEach((a, i) => {
      a.ordinal = i + 1;
    });
  }

  addPersonToNotify() {
    if (this.data.peopleToNotify.length >= 5) return;
    this.data.peopleToNotify.push({
      person: createEmptyPerson(),
      ordinal: this.data.peopleToNotify.length + 1,
    });
  }

  removePersonToNotify(idx: number) {
    this.data.peopleToNotify.splice(idx, 1);
    this.data.peopleToNotify.forEach((p, i) => {
      p.ordinal = i + 1;
    });
  }

  ensureCertificateProvider() {
    if (!this.data.certificateProvider) {
      this.data.certificateProvider = {
        person: createEmptyPerson(),
        knowsDonorAs: '',
        isOverEighteen: false,
        readLpa: false,
        noRestrictionsOnActing: false,
        isRelatedToDonorOrAttorney: false,
        isCareHomeOwnerOrEmployee: false,
        eligibilityConfirmationAt: '',
      };
    }
  }
}

export const store = new LpaStore();
