import { browser } from '$app/environment';
import type { OperationNote, GradingResult } from '$lib/engine/types.js';
import { createEmptyOperationNote } from '$lib/engine/factory.js';
import { calculateOperationGrade } from '$lib/engine/composite-grader.js';
import { STEPS, TOTAL_STEPS } from '$lib/config/steps.js';

export interface ValidationErrors {
  [fieldId: string]: string;
}

/** localStorage draft key for a given operation-note id (defaults to `new`). */
function storageKey(id: string): string {
  return `medical-operation-note.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank operation note with all fields at their unanswered defaults. */
export function createDefaultOperationNote(): OperationNote {
  return createEmptyOperationNote();
}

class OperationNoteStore {
  data: OperationNote = $state(createDefaultOperationNote());
  currentStep = $state(1);

  /** The id of the operation note currently loaded into the store (`new` for a fresh draft). */
  id = $state('new');

  /** Map of field id (HTML id) -> error message. Empty when valid. */
  errors: ValidationErrors = $state({});

  /** Whether the page-level error summary should be hidden. */
  errorSummaryHidden = $state(true);

  /** Whether the user has submitted at least once (drives the report). */
  submitted = $state(false);

  result = $derived<GradingResult>(calculateOperationGrade(this.data));

  /** Crude completeness measure for the Lily Progress bar. */
  percentComplete = $derived(estimatePercentComplete(this.data));

  /**
   * Per-step status for the Lily StepList. The "current" step is whatever
   * the user last interacted with. A step counts as "finished" once any
   * field for that step is populated; "in-progress" otherwise.
   */
  steps = $derived(
    STEPS.map((s) => {
      const filled = countStepFilled(this.data, s.number);
      let status: 'waiting' | 'in-progress' | 'finished' | 'error' = 'waiting';
      if (filled >= 3) status = 'finished';
      else if (filled > 0) status = 'in-progress';
      if (this.errors && Object.keys(this.errors).some((k) => k.startsWith(`step-${s.number}-`))) {
        status = 'error';
      }
      return { ...s, status, filled };
    }),
  );

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
   * Load the operation note for `id` into the store. A saved draft for that id
   * (in localStorage) takes precedence; otherwise the `seed` note is used
   * (e.g. a sample for an existing id), falling back to a blank draft.
   *
   * The data is merged in place (nested object identities preserved) rather
   * than reassigned, so step components that bind to `store.data.<section>`
   * stay bound to live state.
   */
  loadForId(id: string, seed?: OperationNote) {
    const key = id || 'new';
    this.id = key;
    this.currentStep = 1;
    this.errors = {};
    this.errorSummaryHidden = true;
    this.submitted = false;

    let draft: OperationNote | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      if (raw) {
        try {
          draft = JSON.parse(raw) as OperationNote;
        } catch {
          // Ignore corrupt storage.
        }
      }
    }
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      (draft ?? seed ?? createDefaultOperationNote()) as unknown as Record<string, unknown>,
    );
  }

  reset() {
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      createDefaultOperationNote() as unknown as Record<string, unknown>,
    );
    this.currentStep = 1;
    this.errors = {};
    this.errorSummaryHidden = true;
    this.submitted = false;
    if (browser) {
      localStorage.removeItem(storageKey(this.id));
    }
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }

  /**
   * Required-field checks across the 12-step op-note. Each entry
   * carries the HTML `id` of the offending control so the ErrorSummary
   * can anchor-link to it.
   */
  validate(): ValidationErrors {
    const e: ValidationErrors = {};
    if (!this.data.operation.hospital)
      e['step-1-hospital'] = 'Enter the hospital name';
    if (!this.data.operation.theatreNumber)
      e['step-1-theatre-number'] = 'Enter the theatre or OR number';
    if (!this.data.patient.firstName)
      e['step-2-first-name'] = 'Enter the patient first name';
    if (!this.data.patient.lastName)
      e['step-2-last-name'] = 'Enter the patient last name';
    if (!this.data.diagnosesAndProcedures.performedProcedures)
      e['step-4-performed-procedures'] = 'Document the procedure(s) actually performed';
    if (
      this.data.signOff.surgeonOverrideRisk &&
      this.data.signOff.surgeonOverrideRisk !== this.result.compositeRisk &&
      !this.data.signOff.surgeonOverrideReason.trim()
    ) {
      e['step-12-override-reason'] = 'Document the reason for overriding the computed composite risk';
    }
    if (!this.data.signOff.electronicSignatureName)
      e['step-12-signature'] = 'Sign the operation note electronically';
    return e;
  }
}

function estimatePercentComplete(d: OperationNote): number {
  let filled = 0;
  let total = 0;
  for (const key of Object.keys(d) as Array<keyof OperationNote>) {
    const v = d[key];
    if (Array.isArray(v)) {
      total += 1;
      if (v.length > 0) filled += 1;
      continue;
    }
    if (v && typeof v === 'object') {
      for (const inner of Object.values(v)) {
        total += 1;
        if (inner !== null && inner !== '' && inner !== undefined) filled += 1;
      }
    }
  }
  if (total === 0) return 0;
  return Math.round((filled / total) * 100);
}

/**
 * Approximate count of "answered" fields for a given step.
 */
function countStepFilled(d: OperationNote, stepNumber: number): number {
  const section = sectionForStep(d, stepNumber);
  if (!section) return 0;
  if (Array.isArray(section)) return section.length;
  let n = 0;
  for (const v of Object.values(section)) {
    if (v !== null && v !== '' && v !== undefined) n += 1;
  }
  return n;
}

function sectionForStep(d: OperationNote, n: number): unknown {
  switch (n) {
    case 1: return d.operation;
    case 2: return d.patient;
    case 3: return d.team;
    case 4: return d.diagnosesAndProcedures;
    case 5: return d.anaesthesia;
    case 6: return d.positionPrepApproach;
    case 7: return d.operativeFindings;
    case 8: return d.materialsImplants;
    case 9: return d.drainsPacksSpecimens;
    case 10: return d.safetyCountsEbl;
    case 11: return d.postOperativePlan;
    case 12: return d.signOff;
    default: return null;
  }
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new operation note is loaded.
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

export const store = new OperationNoteStore();
