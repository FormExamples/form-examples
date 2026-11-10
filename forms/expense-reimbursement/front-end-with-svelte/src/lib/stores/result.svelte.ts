import { browser } from '$app/env';
import type { ExpenseReimbursement, GradingResult } from '#lib/engine/types.js';
import { createDefaultClaim, createDefaultItem } from '#lib/engine/defaults.js';

/** localStorage draft key for a given claim id (defaults to `new`). */
function storageKey(id: string): string {
  return `expense-reimbursement.front-end-with-svelte.${id || 'new'}.v1`;
}

/**
 * Merge a possibly-partial saved draft onto a base claim, section by section,
 * so fields added after the draft was saved still get their defaults.
 */
function mergeDraft(
  base: ExpenseReimbursement,
  draft: Partial<ExpenseReimbursement>
): ExpenseReimbursement {
  const items =
    Array.isArray(draft.items) && draft.items.length > 0
      ? draft.items.map((it, i) => ({ ...createDefaultItem(i + 1), ...it, lineNumber: i + 1 }))
      : base.items;
  return {
    worker: { ...base.worker, ...draft.worker },
    manager: { ...base.manager, ...draft.manager },
    claim: { ...base.claim, ...draft.claim },
    items,
    repayment: { ...base.repayment, ...draft.repayment },
    declarations: { ...base.declarations, ...draft.declarations }
  };
}

/**
 * Svelte 5 reactive store for the expense reimbursement claim, with
 * localStorage persistence so an in-progress claim survives a page reload.
 */
class ClaimStore {
  data = $state<ExpenseReimbursement>(createDefaultClaim());
  result = $state<GradingResult | null>(null);
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
      // Persist on every change, keyed by the current claim id.
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
   * Load the claim for `id` into the store. A saved draft for that id (in
   * localStorage) takes precedence; otherwise the `seed` claim is used (e.g. a
   * sample claim for an existing id), falling back to a blank draft for `new`.
   */
  loadForId(id: string, seed?: ExpenseReimbursement) {
    const key = id || 'new';
    this.id = key;
    this.result = null;
    this.currentStep = 1;

    let draft: Partial<ExpenseReimbursement> | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      this.hadDraftAtLoad = raw !== null;
      this.#loaded = true;
      if (raw) {
        try {
          draft = JSON.parse(raw) as Partial<ExpenseReimbursement>;
        } catch {
          // Ignore corrupt storage.
        }
      }
    }

    const base = seed ?? createDefaultClaim();
    this.data = draft ? mergeDraft(base, draft) : { ...base };
  }

  reset() {
    this.hadDraftAtLoad = false;
    this.data = createDefaultClaim();
    this.result = null;
    this.currentStep = 1;
    if (browser) {
      localStorage.removeItem(storageKey(this.id));
    }
  }
}

export const claimStore = new ClaimStore();
