import { emptyAdrFormData, type AdrFormData } from '$lib/types.js';

const STORAGE_KEY = 'adr.form.v1';

function loadFromStorage(): AdrFormData {
  if (typeof window === 'undefined') return emptyAdrFormData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAdrFormData();
    const parsed = JSON.parse(raw) as Partial<AdrFormData>;
    return { ...emptyAdrFormData(), ...parsed };
  } catch {
    return emptyAdrFormData();
  }
}

function saveToStorage(data: AdrFormData) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or storage disabled — autosave is best-effort
  }
}

class AdrStore {
  data: AdrFormData = $state(loadFromStorage());
  private autosaveBound = false;

  /**
   * Wire up autosave once the store is consumed from a component that
   * runs in the browser. Safe to call from any component's top level —
   * the store survives re-renders, so it only attaches the effect on the
   * first call.
   */
  enableAutosave() {
    if (this.autosaveBound) return;
    this.autosaveBound = true;
    $effect.root(() => {
      $effect(() => {
        saveToStorage(this.data);
      });
    });
  }

  reset() {
    this.data = emptyAdrFormData();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  /** Replace the entire draft with the given data (used by Markdown import). */
  replace(data: AdrFormData) {
    this.data = data;
    // autosave $effect picks this up automatically when enabled
  }

  addPosition() {
    this.data.positions.push({
      name: '', description: '', modelOrDiagramUrl: '',
      isChosen: false, pros: '', cons: ''
    });
  }

  removePosition(index: number) {
    this.data.positions.splice(index, 1);
    if (this.data.positions.length === 0) this.addPosition();
  }

  chooseExclusive(index: number) {
    for (let i = 0; i < this.data.positions.length; i++) {
      this.data.positions[i].isChosen = i === index;
    }
  }

  addNote(notedBy: string, body: string) {
    if (!body.trim()) return;
    this.data.notes.push({
      notedAt: new Date().toISOString(),
      notedBy,
      body
    });
  }

  removeNote(index: number) {
    this.data.notes.splice(index, 1);
  }
}

export const store = new AdrStore();
