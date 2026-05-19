import { browser } from '$app/environment';
import { computeSafetyFlags } from '$lib/checklist/flags.js';
import { computeStatus } from '$lib/checklist/completion.js';
import { createEmptyChecklist } from '$lib/checklist/factory.js';
import type {
  SafetyFlag,
  WhoSurgicalSafetyChecklist,
} from '$lib/checklist/types.js';
import { MAX_STEP, MIN_STEP } from '$lib/config/steps.js';

const STORAGE_KEY = 'who-surgical-safety-checklist-draft';

class ChecklistStore {
  data: WhoSurgicalSafetyChecklist = $state(createEmptyChecklist());
  currentStep = $state(0);

  flags = $derived<SafetyFlag[]>(computeSafetyFlags(this.data));
  status = $derived(computeStatus(this.data));

  /**
   * Restore from localStorage. Called from the root `+layout.svelte` on mount.
   * Safe to call multiple times; second call is a no-op if already loaded.
   */
  loadFromLocalStorage(): void {
    if (!browser) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        this.data = {
          ...createEmptyChecklist(),
          ...parsed,
          teamMembers: Array.isArray(parsed.teamMembers)
            ? parsed.teamMembers
            : [],
        };
      }
    } catch {
      // Ignore malformed drafts; the user will just see an empty form.
    }
  }

  saveToLocalStorage(): void {
    if (!browser) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // Quota or privacy mode — silently skip.
    }
  }

  reset(): void {
    this.data = createEmptyChecklist();
    this.currentStep = 0;
    if (browser) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }

  goto(n: number): void {
    if (n >= MIN_STEP && n <= MAX_STEP) this.currentStep = n;
  }

  next(): void {
    if (this.currentStep < MAX_STEP) this.currentStep += 1;
  }

  previous(): void {
    if (this.currentStep > MIN_STEP) this.currentStep -= 1;
  }
}

export const store = new ChecklistStore();
