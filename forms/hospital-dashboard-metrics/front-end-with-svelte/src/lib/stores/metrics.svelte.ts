import { browser } from '$app/environment';
import type { HospitalDashboardMetrics, MetricsSummaryResult } from '$lib/engine/types.js';
import { createEmptyMetrics } from '$lib/engine/factory.js';
import { summariseMetrics } from '$lib/engine/summary.js';
import { TOTAL_STEPS } from '$lib/config/steps.js';
import { TOTAL_METRICS } from '$lib/config/metrics.js';

/** localStorage draft key for a given report id (defaults to `new`). */
function storageKey(id: string): string {
  return `hospital-dashboard-metrics.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank report with all 67 metrics at their unanswered defaults. */
export function createDefaultMetrics(): HospitalDashboardMetrics {
  return createEmptyMetrics();
}

/**
 * Svelte 5 reactive store for the hospital dashboard metrics form, with
 * localStorage persistence so an in-progress report survives a page reload.
 * Drafts are keyed by report id so each record edits independently.
 */
class MetricsStore {
  data = $state<HospitalDashboardMetrics>(createDefaultMetrics());
  currentStep = $state(1);

  /** The id of the report currently loaded into the store (`new` for a fresh draft). */
  id = $state('new');

  /** The live tally, recomputed from `data` on every change. Pure — no grading engine. */
  result = $derived<MetricsSummaryResult>(summariseMetrics(this.data));

  /** Crude completeness measure for the Lily Progress bar (0-100). */
  percentComplete = $derived(
    TOTAL_METRICS === 0 ? 0 : Math.round((this.result.reportedCount / TOTAL_METRICS) * 100),
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
   * Load the report for `id` into the store. A saved draft for that id (in
   * localStorage) takes precedence; otherwise the `seed` report is used
   * (e.g. a sample for an existing id), falling back to a blank draft.
   *
   * The data is merged in place (nested object identities preserved) rather
   * than reassigned, so step components that captured a reference stay bound
   * to live state.
   */
  loadForId(id: string, seed?: HospitalDashboardMetrics) {
    const key = id || 'new';
    this.id = key;
    this.currentStep = 1;

    let draft: HospitalDashboardMetrics | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      if (raw) {
        try {
          draft = JSON.parse(raw) as HospitalDashboardMetrics;
        } catch {
          // Ignore corrupt storage.
        }
      }
    }
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      (draft ?? seed ?? createDefaultMetrics()) as unknown as Record<string, unknown>,
    );
  }

  reset() {
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      createDefaultMetrics() as unknown as Record<string, unknown>,
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
export const metrics = new MetricsStore();

/** Back-compat alias — step components import `store`. */
export const store = metrics;
