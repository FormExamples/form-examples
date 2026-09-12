import { browser } from '$app/env';
import type { HospitalPerformanceIndicators, IndicatorsSummaryResult } from '#lib/engine/types.js';
import { createEmptyIndicators } from '#lib/engine/factory.js';
import { summariseIndicators } from '#lib/engine/summary.js';
import { TOTAL_STEPS } from '#lib/config/steps.js';
import { TOTAL_INDICATORS } from '#lib/config/indicators.js';

/** localStorage draft key for a given report id (defaults to `new`). */
function storageKey(id: string): string {
  return `hospital-performance-indicators.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank report with all 50 indicators at their unanswered defaults. */
export function createDefaultIndicators(): HospitalPerformanceIndicators {
  return createEmptyIndicators();
}

/**
 * Svelte 5 reactive store for the hospital performance indicators form,
 * with localStorage persistence so an in-progress report survives a page
 * reload. Drafts are keyed by report id so each record edits independently.
 */
class IndicatorsStore {
  data = $state<HospitalPerformanceIndicators>(createDefaultIndicators());
  currentStep = $state(1);

  /**
   * The id of the record currently loaded into the store (`new`
   * for a fresh draft). Starts as `''`, not `'new'`: the wizard
   * page only calls loadForId() when `store.id !== id`, so if this
   * defaulted to the literal string `'new'` the very first visit
   * to the (very common) `/new` route would never call
   * loadForId() at all -- any saved draft for `new` would be
   * silently ignored on every fresh page load. `''` never
   * collides with a real route id.
   */
  id = $state('');

  /** The live tally, recomputed from `data` on every change. Pure — no grading engine. */
  result = $derived<IndicatorsSummaryResult>(summariseIndicators(this.data));

  /** Crude completeness measure for the Lily Progress bar (0-100). */
  percentComplete = $derived(TOTAL_INDICATORS === 0
    ? 0
    : Math.round(this.result.reportedCount / TOTAL_INDICATORS * 100));

  /**
   * True once a saved draft was found for the current id/store on
   * load -- read by RestoreBanner.svelte to tell the user their
   * progress was restored rather than silently repopulating fields
   * with no explanation. Mirrors the HTML front-end's
   * window.__FORM_STATE__.hadDraftAtLoad.
   */
  hadDraftAtLoad = $state(false);
  // True once loadForId() has run for the first time. Guards the
  // persistence effect below: without it, the effect's very first
  // (immediate) run persists the *blank* initial data before
  // loadForId() ever gets a chance to read a previously-saved draft
  // from localStorage -- silently clobbering it with blank data on
  // every fresh page load.
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
   * Load the report for `id` into the store. A saved draft for that id (in
   * localStorage) takes precedence; otherwise the `seed` report is used
   * (e.g. a sample for an existing id), falling back to a blank draft.
   *
   * The data is merged in place (nested object identities preserved) rather
   * than reassigned, so step components that captured a reference stay bound
   * to live state.
   */
  loadForId(id: string, seed?: HospitalPerformanceIndicators) {
    const key = id || 'new';
    this.id = key;
    this.currentStep = 1;

    let draft: HospitalPerformanceIndicators | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      this.hadDraftAtLoad = raw !== null;
      this.#loaded = true;
      if (raw) {
        try {
          draft = JSON.parse(raw) as HospitalPerformanceIndicators;
        } catch {
          // Ignore corrupt storage.
        }
      }
    }
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      (draft ?? seed ?? createDefaultIndicators()) as unknown as Record<string, unknown>,
    );
  }

  reset() {
  	this.hadDraftAtLoad = false;
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      createDefaultIndicators() as unknown as Record<string, unknown>,
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
 * them — reactive when a new report is loaded.
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

/** The id-keyed reactive report store. */
export const indicators = new IndicatorsStore();

/** Back-compat alias — step components import `store`. */
export const store = indicators;
