import { browser } from '$app/env';
import type { FitNoteAssessment } from '#lib/engine/types.js';
import { createDefaultAssessment } from '#lib/engine/defaults.js';
import { gradeFitNote } from '#lib/engine/fit-note-grader.js';
import { saveFitNote } from '#lib/api/index.js';
import { STEPS, TOTAL_STEPS, type StepDef } from '#lib/config/steps.js';

export interface ValidationErrors {
  [fieldId: string]: string;
}

const STORAGE_BASE = 'medical-fit-note.front-end-with-svelte';

/**
 * localStorage draft key for a given fit-note id. The blank `new` draft uses
 * the form-wide key `medical-fit-note.front-end-with-svelte.v1`; any other id
 * gets its own `….<id>.v1` draft.
 */
function storageKey(id: string): string {
  return !id || id === 'new' ? `${STORAGE_BASE}.v1` : `${STORAGE_BASE}.${id}.v1`;
}

function isAnswered(v: unknown): boolean {
  return v !== null && v !== undefined && v !== '';
}

function stepCounts(d: FitNoteAssessment, def: StepDef) {
  const total = def.any ? 1 : def.fields.length;
  const answered = def.any
    ? def.fields.some((f) => isAnswered(d[f]))
      ? 1
      : 0
    : def.fields.filter((f) => isAnswered(d[f])).length;
  return { answered, total };
}

/**
 * Svelte 5 reactive store for the fit-note wizard, with localStorage
 * persistence so a partial fill survives a page reload. Drafts are keyed by
 * fit-note id so each record edits independently.
 */
class AssessmentStore {
  data: FitNoteAssessment = $state(createDefaultAssessment());
  currentStep = $state(1);

  /**
   * The id of the record currently loaded (`new` for a fresh draft). Starts
   * as `''`, not `'new'`, so the wizard's first `loadForId('new')` always runs
   * and picks up a saved draft.
   */
  id = $state('');

  /** Map of field id (HTML id) -> error message. Empty when valid. */
  errors: ValidationErrors = $state({});
  errorSummaryHidden = $state(true);

  /** Whether the user has submitted at least once (drives the report). */
  submitted = $state(false);

  /** True once a saved draft was found on load (read by the restore banner). */
  hadDraftAtLoad = $state(false);

  result = $derived(gradeFitNote(this.data));

  /** Back-end save state after a submit (the report is computed locally regardless). */
  saveState: 'idle' | 'saving' | 'saved' | 'error' = $state('idle');
  /** Human-readable outcome of the last save attempt. */
  saveMessage = $state('');

  /**
   * Save the current fit note to the back-end API. Never throws: a failure is
   * recorded in `saveState` / `saveMessage` and the local report and draft are
   * kept as they are.
   */
  async save() {
    this.saveState = 'saving';
    this.saveMessage = 'Saving to the back-end…';
    try {
      const saved = await saveFitNote($state.snapshot(this.data), $state.snapshot(this.result));
      this.saveState = 'saved';
      this.saveMessage = `Saved fit note ${saved.noteId} (status: ${saved.status}).`;
    } catch (err) {
      this.saveState = 'error';
      this.saveMessage = `Not saved to the back-end (the report is computed locally and your draft is kept): ${
        err instanceof Error ? err.message : 'request failed'
      }`;
    }
  }

  /** Answered / total tracked fields, as a percentage, for the Progress bar. */
  percentComplete = $derived.by(() => {
    let answered = 0;
    let total = 0;
    for (const def of STEPS) {
      const c = stepCounts(this.data, def);
      answered += c.answered;
      total += c.total;
    }
    return total === 0 ? 0 : Math.round((answered / total) * 100);
  });

  /** Per-step status for the Lily StepList. */
  steps = $derived(
    STEPS.map((s) => {
      const { answered, total } = stepCounts(this.data, s);
      let status: 'waiting' | 'in-progress' | 'finished' | 'error' = 'waiting';
      if (total > 0 && answered >= total) status = 'finished';
      else if (answered > 0) status = 'in-progress';
      if (Object.keys(this.errors).some((k) => k.startsWith(`step-${s.number}-`))) {
        status = 'error';
      }
      return { ...s, status, filled: answered, total };
    })
  );

  // True once loadForId() has run. Guards the persistence effect so its first
  // run cannot overwrite a saved draft with blank data.
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
   * Load the fit note for `id`. A saved draft wins; otherwise `seed` (a
   * sample for an existing id), then a blank draft. Merges in place so step
   * components bound to store.data stay reactive.
   */
  loadForId(id: string, seed?: FitNoteAssessment) {
    const key = id || 'new';
    this.id = key;
    this.currentStep = 1;
    this.errors = {};
    this.errorSummaryHidden = true;
    this.submitted = false;
    this.saveState = 'idle';
    this.saveMessage = '';

    let draft: FitNoteAssessment | null = null;
    if (browser) {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(storageKey(key));
      } catch {
        // Storage unavailable; start from the seed.
      }
      this.hadDraftAtLoad = raw !== null;
      this.#loaded = true;
      if (raw) {
        try {
          draft = JSON.parse(raw) as FitNoteAssessment;
        } catch {
          // Ignore corrupt storage.
        }
      }
    }
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      { ...createDefaultAssessment(), ...(draft ?? seed ?? {}) } as unknown as Record<
        string,
        unknown
      >
    );
  }

  reset() {
    this.hadDraftAtLoad = false;
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      createDefaultAssessment() as unknown as Record<string, unknown>
    );
    this.currentStep = 1;
    this.errors = {};
    this.errorSummaryHidden = true;
    this.submitted = false;
    this.saveState = 'idle';
    this.saveMessage = '';
    if (browser) {
      try {
        localStorage.removeItem(storageKey(this.id));
      } catch {
        // Ignore.
      }
    }
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }

  /**
   * Only what the form cannot be sensibly graded without is required; every
   * other gap is the engine's job to report as a fired rule. Keys are the
   * HTML ids of the offending controls so the ErrorSummary can link to them.
   */
  validate(): ValidationErrors {
    const e: ValidationErrors = {};
    if (!this.data.employeeName.trim()) e['step-1-employee-name'] = 'Employee name is required';
    return e;
  }
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced).
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

export const store = new AssessmentStore();
