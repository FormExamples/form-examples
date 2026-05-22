import type { EyePrescription, ClassificationResult } from '$lib/engine/types.js';
import { createEmptyPrescription } from '$lib/engine/factory.js';
import { classify } from '$lib/engine/composite.js';
import { suggestExpiry } from '$lib/engine/utils.js';

class PrescriptionStore {
  data: EyePrescription = $state(createEmptyPrescription());
  result: ClassificationResult = $derived(classify(this.data));

  reset(): void {
    this.data = createEmptyPrescription();
  }

  /** Auto-suggest expiry when issue date and birth date are both set
   *  and the prescriber has not yet entered an expiry by hand. */
  maybeSuggestExpiry(): void {
    const { issueDate, expiryDate } = this.data.examination;
    const { birthDate } = this.data.patient;
    if (issueDate && birthDate && !expiryDate) {
      this.data.examination.expiryDate = suggestExpiry(birthDate, issueDate);
    }
  }
}

export const store = new PrescriptionStore();
