import { browser } from '$app/env';
import type { Lpa, ValidationResult } from '#lib/types.js';
import { createEmptyLpa, createEmptyPerson } from '#lib/factory.js';
import { validateLpa } from '#lib/validator/validator.js';
import { TOTAL_STEPS } from '#lib/config/steps.js';

/** localStorage draft key for a given LPA id (defaults to `new`). */
function storageKey(id: string): string {
  return `united-kingdom-lasting-power-of-attorney-for-financial-decisions.front-end-with-svelte.${id || 'new'}.v1`;
}

/** A blank LP1F LPA with all fields at their unanswered defaults. */
export function createDefaultLpa(): Lpa {
  return createEmptyLpa();
}

/**
 * Svelte 5 reactive store for the LP1F lasting power of attorney, with
 * localStorage persistence so an in-progress LPA survives a page reload.
 * Drafts are keyed by LPA id so each record edits independently. The
 * validation result is derived live from the data.
 */
class LpaStore {
  data: Lpa = $state(createDefaultLpa());
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

  result = $derived<ValidationResult>(validateLpa(this.data));

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
   * Load the LPA for `id` into the store. A saved draft for that id (in
   * localStorage) takes precedence; otherwise the `seed` LPA is used (e.g. a
   * sample for an existing id), falling back to a blank draft.
   *
   * The data is merged in place (nested object identities preserved) rather
   * than reassigned, so step components that captured a section reference stay
   * bound to live state.
   */
  loadForId(id: string, seed?: Lpa) {
    const key = id || 'new';
    this.id = key;
    this.currentStep = 1;

    let draft: Lpa | null = null;
    if (browser) {
      const raw = localStorage.getItem(storageKey(key));
      this.hadDraftAtLoad = raw !== null;
      this.#loaded = true;
      if (raw) {
        try {
          draft = JSON.parse(raw) as Lpa;
        } catch {
          // Ignore corrupt storage.
        }
      }
    }
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      (draft ?? seed ?? createDefaultLpa()) as unknown as Record<string, unknown>,
    );
  }

  reset() {
  	this.hadDraftAtLoad = false;
    deepAssign(
      this.data as unknown as Record<string, unknown>,
      createDefaultLpa() as unknown as Record<string, unknown>,
    );
    this.currentStep = 1;
    if (browser) {
      localStorage.removeItem(storageKey(this.id));
    }
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }

  addAttorney() {
    this.data.attorneys.push({
      person: createEmptyPerson(),
      ordinal: this.data.attorneys.length + 1,
    });
  }

  removeAttorney(idx: number) {
    this.data.attorneys.splice(idx, 1);
    this.data.attorneys.forEach((a, i) => {
      a.ordinal = i + 1;
    });
  }

  addReplacementAttorney() {
    this.data.replacementAttorneys.push({
      person: createEmptyPerson(),
      ordinal: this.data.replacementAttorneys.length + 1,
      replacementStepInCondition: '',
    });
  }

  removeReplacementAttorney(idx: number) {
    this.data.replacementAttorneys.splice(idx, 1);
    this.data.replacementAttorneys.forEach((a, i) => {
      a.ordinal = i + 1;
    });
  }

  addPersonToNotify() {
    if (this.data.peopleToNotify.length >= 5) return;
    this.data.peopleToNotify.push({
      person: createEmptyPerson(),
      ordinal: this.data.peopleToNotify.length + 1,
    });
  }

  removePersonToNotify(idx: number) {
    this.data.peopleToNotify.splice(idx, 1);
    this.data.peopleToNotify.forEach((p, i) => {
      p.ordinal = i + 1;
    });
  }

  ensureCertificateProvider() {
    if (!this.data.certificateProvider) {
      this.data.certificateProvider = {
        person: createEmptyPerson(),
        knowsDonorAs: '',
        isOverEighteen: false,
        readLpa: false,
        noRestrictionsOnActing: false,
        isRelatedToDonorOrAttorney: false,
        isCareHomeOwnerOrEmployee: false,
        eligibilityConfirmationAt: '',
      };
    }
  }
}

/**
 * Deep-merge `source` into `target`, recursing into plain objects so nested
 * object identities are preserved (primitives and arrays are replaced). This
 * keeps Svelte's deep `$state` proxies — and any references captured from
 * them — reactive when a new LPA is loaded.
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

export const store = new LpaStore();
