import { browser } from '$app/environment';
import type { ChecklistSummaryResult, HospitalDailyMonitoringChecklist } from '$lib/engine/types.js';
import { createEmptyAssessment } from '$lib/engine/factory.js';
import { summariseChecklist } from '$lib/engine/summary.js';
import { TOTAL_STEPS } from '$lib/config/steps.js';
import { TOTAL_ITEMS } from '$lib/config/items.js';

/** localStorage draft key for a given checklist id (defaults to `new`). */
function storageKey(id: string): string {
  return `hospital-daily-monitoring-checklist.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank checklist with all 97 checkpoints at their unanswered defaults. */
export function createDefaultAssessment(): HospitalDailyMonitoringChecklist {
  return createEmptyAssessment();
}

/**
 * Svelte 5 reactive store for the hospital daily monitoring checklist, with
 * localStorage persistence so an in-progress round survives a page reload.
 * Drafts are keyed by checklist id so each record edits independently.
 */
class AssessmentStore {
  data = $state<HospitalDailyMonitoringChecklist>(createDefaultAssessment());
  currentStep = $state(1);

  /** The id of the checklist currently loaded into the store (`new` for a fresh draft). */
  id = $state('new');

  /** The live tally, recomputed from `data` on every change. Pure — no grading engine. */
  result = $derived<ChecklistSummaryResult>(summariseChecklist(this.data));

  /** Crude completeness measure for the Lily Progress bar (0-100). */
  percentComplete = $derived(
    TOTAL_ITEMS === 0 ? 0 : Math.round((this.result.answeredCount / TOTAL_ITEMS) * 100),
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
   * Load the checklist for `id` into the store. A saved draft for that id (in
   * localStorage) takes precedence; otherwise the `seed` checklist is used
   * (e.g. a sample for an existing id), falling back to a blank draft.
   *
   * The data is merged in place (nested object identities preserved) rather
   * than reassigned, so step components that captured a reference stay bound
   * to live state.
   */
  loadForId(id: string, seed?: HospitalDailyMonitoringChecklist) {
    const key = id || 'new';
    this.id = key;
    this.currentStep = 1;

    let draft: HospitalDailyMonitoringChecklist | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      if (raw) {
        try {
          draft = JSON.parse(raw) as HospitalDailyMonitoringChecklist;
        } catch {
          // Ignore corrupt storage.
        }
      }
    }
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      (draft ?? seed ?? createDefaultAssessment()) as unknown as Record<string, unknown>,
    );
  }

  reset() {
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      createDefaultAssessment() as unknown as Record<string, unknown>,
    );
    this.currentStep = 1;
    if (browser) {
      localStorage.removeItem(storageKey(this.id));
    }
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new checklist is loaded.
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

/** The id-keyed reactive checklist store. */
export const assessment = new AssessmentStore();

/** Back-compat alias — step components import `store`. */
export const store = assessment;
