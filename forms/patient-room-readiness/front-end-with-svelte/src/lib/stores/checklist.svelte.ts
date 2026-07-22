import { browser } from '$app/environment';
import type { PatientRoomReadinessChecklist, ReadinessSummary } from '$lib/engine/types.js';
import { createEmptyChecklist } from '$lib/engine/factory.js';
import { summariseReadiness } from '$lib/engine/summary.js';
import { STEPS, TOTAL_STEPS } from '$lib/config/steps.js';

export interface ValidationErrors {
  [fieldId: string]: string;
}

/** localStorage draft key for a given checklist id (defaults to `new`). */
function storageKey(id: string): string {
  return `patient-room-readiness.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank room-readiness checklist with all fields at their unanswered defaults. */
export function createDefaultAssessment(): PatientRoomReadinessChecklist {
  return createEmptyChecklist();
}

/**
 * Svelte 5 reactive store for the room-readiness checklist, with
 * localStorage persistence so an in-progress inspection survives a page
 * reload. Drafts are keyed by checklist id so each record edits
 * independently.
 */
class ChecklistStore {
  data: PatientRoomReadinessChecklist = $state(createEmptyChecklist());
  currentStep = $state(1);

  /** The id of the checklist currently loaded into the store (`new` for a fresh draft). */
  id = $state('new');

  /** Map of field id (HTML id) -> error message. Empty when valid. */
  errors: ValidationErrors = $state({});

  /** Whether the page-level error summary should be hidden. */
  errorSummaryHidden = $state(true);

  /** Whether the user has submitted at least once (drives the report). */
  submitted = $state(false);

  /** The live tally (checked / unchecked), recomputed from `data` on every change. */
  result = $derived<ReadinessSummary>(summariseReadiness(this.data));

  /** Completeness of the location + inspector + inspection metadata fields (6 total). */
  percentComplete = $derived(estimatePercentComplete(this.data));

  /** Per-step status for the Lily StepList. */
  steps = $derived(
    STEPS.map((s) => {
      let status: 'waiting' | 'in-progress' | 'finished' | 'error' = 'waiting';
      if (s.slug === 'location') {
        const { buildingNameOrNumber, roomNameOrNumber } = this.data.location;
        if (buildingNameOrNumber && roomNameOrNumber) status = 'finished';
        else if (buildingNameOrNumber || roomNameOrNumber) status = 'in-progress';
      } else if (s.slug === 'checklist') {
        const { checkedCount, totalCount } = this.result;
        if (checkedCount === 0) status = 'waiting';
        else if (checkedCount === totalCount) status = 'finished';
        else status = 'in-progress';
      } else if (s.slug === 'inspector') {
        const { name, email } = this.data.inspector;
        const { date, time } = this.data.inspection;
        const filled = [name, email, date, time].filter(Boolean).length;
        if (filled === 4) status = 'finished';
        else if (filled > 0) status = 'in-progress';
      }
      if (this.errors && Object.keys(this.errors).some((k) => k.startsWith(`step-${s.number}-`))) {
        status = 'error';
      }
      return { ...s, status };
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
   * Load the checklist for `id` into the store. A saved draft for that id
   * (in localStorage) takes precedence; otherwise the `seed` checklist is
   * used (e.g. a sample for an existing id), falling back to a blank draft.
   *
   * The data is merged in place (nested object identities preserved) rather
   * than reassigned, so step components that bound to a section reference
   * (e.g. `bind:value={store.data.location.buildingNameOrNumber}`) stay
   * bound to live state.
   */
  loadForId(id: string, seed?: PatientRoomReadinessChecklist) {
    const key = id || 'new';
    this.id = key;
    this.currentStep = 1;
    this.errors = {};
    this.errorSummaryHidden = true;
    this.submitted = false;

    let draft: PatientRoomReadinessChecklist | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      if (raw) {
        try {
          draft = JSON.parse(raw) as PatientRoomReadinessChecklist;
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
   * Minimal required-field validation: location and inspector identification.
   * The checklist itself has no required minimum — an inspector may
   * legitimately submit with some checkpoints unchecked (that is the whole
   * point of the report, flagging what still needs attention).
   */
  validate(): ValidationErrors {
    const e: ValidationErrors = {};
    if (!this.data.location.buildingNameOrNumber)
      e['step-1-building-name-or-number'] = 'Enter the building name or number';
    if (!this.data.location.roomNameOrNumber)
      e['step-1-room-name-or-number'] = 'Enter the room name or number';
    if (!this.data.inspector.name) e['step-3-inspector-name'] = 'Enter the inspector name';
    return e;
  }
}

function estimatePercentComplete(d: PatientRoomReadinessChecklist): number {
  const tracked = [
    d.location.buildingNameOrNumber,
    d.location.roomNameOrNumber,
    d.inspector.name,
    d.inspector.email,
    d.inspection.date,
    d.inspection.time,
  ];
  const filled = tracked.filter((v) => v !== null && v !== undefined && v !== '').length;
  return Math.round((filled / tracked.length) * 100);
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
export const checklist = new ChecklistStore();

/** Back-compat alias — step components import `store`. */
export const store = checklist;
