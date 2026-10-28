import { browser } from '$app/env';
import { createDefaultAssessment } from '#lib/engine/defaults.js';
import { gradeDevice } from '#lib/engine/device-grader.js';
import { fieldId, getPath, isAnswered } from '#lib/engine/paths.js';
import type { AssessmentData, GradingResult } from '#lib/engine/types.js';
import { STEPS, TOTAL_STEPS } from '#lib/config/steps.js';
import { submitAssessment } from '#lib/api/medical-device-assessments.js';

export { createDefaultAssessment };

export interface ValidationError {
  id: string;
  message: string;
}

const KEY_PREFIX = 'medical-device-assessment.front-end-with-svelte';

/**
 * localStorage draft key for a given assessment id. The blank `new` draft uses
 * the form-wide key `medical-device-assessment.front-end-with-svelte.v1`; every
 * other id gets its own `.<id>.v1` key so records edit independently.
 */
function storageKey(id: string): string {
  const key = id || 'new';
  return key === 'new' ? `${KEY_PREFIX}.v1` : `${KEY_PREFIX}.${key}.v1`;
}

type StepStatus = 'waiting' | 'in-progress' | 'finished' | 'error';

/**
 * Svelte 5 reactive store for the medical device assessment, with localStorage
 * persistence so an in-progress assessment survives a page reload. Drafts are
 * keyed by assessment id so each record edits independently.
 */
class AssessmentStore {
  data: AssessmentData = $state(createDefaultAssessment());
  currentStep = $state(1);

  /**
   * The id of the record currently loaded into the store (`new` for a fresh
   * draft). Starts as `''`, not `'new'`: the wizard page only calls
   * loadForId() when `assessment.id !== id`, so defaulting to `'new'` would
   * mean a saved `/new` draft is never reloaded. `''` never collides with a
   * real route id.
   */
  id = $state('');

  /** Validation errors with the real input id to anchor-link to. */
  errors: ValidationError[] = $state([]);
  errorSummaryHidden = $state(true);

  /** Whether the user has submitted at least once (drives the report). */
  submitted = $state(false);

  /**
   * Outcome of saving to the back end after submit. A failure never hides the
   * report or clears the localStorage draft.
   */
  saveStatus: { kind: 'idle' | 'saving' | 'saved' | 'error'; message: string } = $state({
    kind: 'idle',
    message: ''
  });

  /** The live engine result for the current answers. */
  result = $derived<GradingResult>(gradeDevice(this.data));

  /** Per-step answered/total counts over the currently visible questions. */
  stepProgress = $derived(
    STEPS.map((s) => {
      let answered = 0;
      let total = 0;
      for (const f of s.fields) {
        if (f.show && !f.show(this.data, this.result)) continue;
        // The status select always has a value and the final-class blank is a
        // valid choice, so neither counts toward progress.
        if (f.path === 'status' || f.path === 'finalDeviceClass') continue;
        total += 1;
        if (isAnswered(getPath(this.data, f.path))) answered += 1;
      }
      return { number: s.step, answered, total };
    })
  );

  percentComplete = $derived.by(() => {
    let answered = 0;
    let total = 0;
    for (const p of this.stepProgress) {
      answered += p.answered;
      total += p.total;
    }
    return total === 0 ? 0 : Math.round((answered / total) * 100);
  });

  /** Per-step status for the Lily StepList. */
  steps = $derived(
    STEPS.map((s) => {
      const p = this.stepProgress[s.step - 1];
      let status: StepStatus = 'waiting';
      if (p.total > 0 && p.answered === p.total) status = 'finished';
      else if (p.answered > 0) status = 'in-progress';
      if (this.errors.some((e) => s.fields.some((f) => fieldId(f.path) === e.id))) {
        status = 'error';
      }
      return { number: s.step, short: s.short, title: s.title, status };
    })
  );

  /**
   * True once a saved draft was found for the current id on load -- read by
   * RestoreBanner.svelte to tell the user their progress was restored.
   * Mirrors the HTML front-end's window.__FORM_STATE__.hadDraftAtLoad.
   */
  hadDraftAtLoad = $state(false);
  // True once loadForId() has run. Guards the persistence effect: without it
  // the effect's first run would persist the blank initial data before
  // loadForId() could read a previously saved draft.
  #loaded = false;

  constructor() {
    if (browser) {
      $effect.root(() => {
        $effect(() => {
          const key = storageKey(this.id);
          const snapshot = JSON.stringify(this.data);
          if (!this.#loaded) return;
          localStorage.setItem(key, snapshot);
        });
      });
    }
  }

  /**
   * Load the assessment for `id` into the store. A saved draft for that id
   * takes precedence; otherwise the `seed` (e.g. a sample for an existing id)
   * is used, falling back to a blank draft.
   *
   * The data is merged in place (nested object identities preserved) rather
   * than reassigned, so step components that captured a section reference stay
   * bound to live state.
   */
  loadForId(id: string, seed?: AssessmentData) {
    const key = id || 'new';
    this.id = key;
    this.currentStep = 1;
    this.errors = [];
    this.errorSummaryHidden = true;
    this.submitted = false;
    this.saveStatus = { kind: 'idle', message: '' };

    let draft: AssessmentData | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      this.hadDraftAtLoad = raw !== null;
      this.#loaded = true;
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

  /**
   * POST the submitted assessment, its grade, fired rules and flags to the
   * Loco API (see lib/api/medical-device-assessments.ts for the sequence).
   */
  async save() {
    this.saveStatus = { kind: 'saving', message: 'Saving to the server...' };
    try {
      const saved = await submitAssessment(
        $state.snapshot(this.data) as AssessmentData,
        this.result
      );
      this.saveStatus = {
        kind: 'saved',
        message: saved.blocked
          ? `Saved as a draft (assessment id ${saved.assessmentId}). No class could be determined, so no grade was stored.`
          : `Saved assessment ${saved.assessmentId} with ${saved.rules} rule(s) and ${saved.flags} flag(s).`
      };
    } catch (err) {
      const why = err instanceof Error ? err.message : 'request failed';
      this.saveStatus = {
        kind: 'error',
        message: `Could not save to the server (${why}). Your report is shown below and your draft is kept on this device; submit again when the server is back.`
      };
    }
  }

  reset() {
    this.saveStatus = { kind: 'idle', message: '' };
    this.hadDraftAtLoad = false;
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      createDefaultAssessment() as unknown as Record<string, unknown>
    );
    this.currentStep = 1;
    this.errors = [];
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
   * The only validation rule (as in the HTML front-end): an override reason is
   * mandatory when the final class differs from the computed class.
   */
  validate(): ValidationError[] {
    const found: ValidationError[] = [];
    const d = this.data;
    if (
      d.finalDeviceClass !== '' &&
      d.finalDeviceClass !== this.result.computedDeviceClass &&
      d.overrideReason.trim() === ''
    ) {
      found.push({
        id: 'f-overrideReason',
        message: 'Override reason is required when the final class differs from the computed class'
      });
    }
    return found;
  }
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies -- and any references captured from
 * them -- reactive when a new assessment is loaded.
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
