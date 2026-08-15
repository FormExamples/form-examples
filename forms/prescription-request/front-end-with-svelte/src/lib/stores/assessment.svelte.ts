import { browser } from '$app/env';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';

/** localStorage draft key for a given request id (defaults to `new`). */
function storageKey(id: string): string {
  return `prescription-request.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank prescription request with all fields at their unanswered defaults. */
export function createDefaultAssessment(): AssessmentData {
  return {
    patientInformation: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      nhsNumber: ''
    },
    clinicianInformation: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      nhsEmployeeNumber: ''
    },
    prescriptionDetails: {
      requestDate: '',
      medicationName: '',
      dosage: '',
      frequency: '',
      routeOfAdministration: '',
      treatmentInstructions: ''
    },
    substitutionOptions: {
      allowBrandSubstitution: '',
      allowGenericSubstitution: '',
      allowDosageAdjustment: '',
      substitutionNotes: ''
    },
    requestType: {
      isNewPrescription: '',
      isEmergency: '',
      additionalNotes: ''
    }
  };
}

/**
 * Svelte 5 reactive store for the prescription request, with localStorage
 * persistence so an in-progress request survives a page reload. Drafts are
 * keyed by request id so each record edits independently.
 */
class AssessmentStore {
  data = $state<AssessmentData>(createDefaultAssessment());
  result = $state<GradingResult | null>(null);
  currentStep = $state(1);
  /** The id of the request currently loaded into the store (`new` for a fresh draft). */
  id = $state('new');

  constructor() {
    if (browser) {
      $effect.root(() => {
        $effect(() => {
          localStorage.setItem(storageKey(this.id), JSON.stringify(this.data));
        });
      });
    }
  }

  /**
   * Load the request for `id` into the store. A saved draft for that id (in
   * localStorage) takes precedence; otherwise the `seed` request is used
   * (e.g. a sample for an existing id), falling back to a blank draft.
   *
   * The data is merged in place (nested object identities preserved) rather
   * than reassigned, so step components that captured a section reference
   * (e.g. `const d = assessment.data.prescriptionDetails`) stay bound to live state.
   */
  loadForId(id: string, seed?: AssessmentData) {
    const key = id || 'new';
    this.id = key;
    this.result = null;
    this.currentStep = 1;

    let draft: AssessmentData | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      if (raw) {
        try {
          draft = JSON.parse(raw) as AssessmentData;
        } catch {
          // Ignore corrupt storage.
        }
      }
    }
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      (draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>
    );
  }

  reset() {
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      createDefaultAssessment() as unknown as Record<string, unknown>
    );
    this.result = null;
    this.currentStep = 1;
    if (browser) {
      localStorage.removeItem(storageKey(this.id));
    }
  }
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new request is loaded.
 */
function deepAssign(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object') {
      deepAssign(tv as Record<string, unknown>, sv as Record<string, unknown>);
    } else {
      target[key] = sv;
    }
  }
}

export const assessment = new AssessmentStore();
