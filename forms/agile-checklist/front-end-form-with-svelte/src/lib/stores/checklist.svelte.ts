import type { AgileChecklist, GradingResult } from '$lib/engine/types.js';
import { createEmptyChecklist } from '$lib/engine/factory.js';
import { calculateMaturity } from '$lib/engine/composite-grader.js';
import { safeParseChecklist } from '$lib/engine/schema.js';
import { TOTAL_STEPS } from '$lib/config/steps.js';

const STORAGE_KEY = 'agile-checklist:v1';

interface PersistedDraft {
  savedAt: string;
  data: AgileChecklist;
}

function safeLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function loadDraft(): { data: AgileChecklist; savedAt: string } | null {
  const ls = safeLocalStorage();
  if (!ls) return null;
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedDraft>;
    const validated = safeParseChecklist(parsed?.data);
    if (!validated) return null;
    const savedAt = typeof parsed?.savedAt === 'string' ? parsed.savedAt : '';
    return { data: validated, savedAt };
  } catch {
    return null;
  }
}

function persistDraft(data: AgileChecklist): string {
  const ls = safeLocalStorage();
  if (!ls) return '';
  const savedAt = new Date().toISOString();
  const payload: PersistedDraft = { savedAt, data };
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota or disabled — ignore */
  }
  return savedAt;
}

function clearDraft() {
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    ls.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

class ChecklistStore {
  data: AgileChecklist = $state(createEmptyChecklist());
  currentStep = $state(1);
  lastSavedAt = $state<string>('');
  draftRestored = $state(false);

  result = $derived<GradingResult>(calculateMaturity(this.data));

  constructor() {
    const restored = loadDraft();
    if (restored) {
      this.data = restored.data;
      this.lastSavedAt = restored.savedAt;
      this.draftRestored = true;
    }
    if (typeof window !== 'undefined') {
      $effect.root(() => {
        $effect(() => {
          // Track the entire data tree so any field change persists.
          const snapshot = $state.snapshot(this.data);
          this.lastSavedAt = persistDraft(snapshot as AgileChecklist);
        });
      });
    }
  }

  reset() {
    this.data = createEmptyChecklist();
    this.currentStep = 1;
    this.draftRestored = false;
    clearDraft();
    this.lastSavedAt = '';
  }

  discardDraft() {
    this.reset();
  }

  acknowledgeDraft() {
    this.draftRestored = false;
  }

  goto(n: number) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }
}

export const store = new ChecklistStore();
