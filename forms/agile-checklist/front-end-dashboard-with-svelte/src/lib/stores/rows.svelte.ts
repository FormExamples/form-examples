import { SAMPLE_CHECKLISTS, type ChecklistRow } from '$lib/data/sample.js';

class RowsStore {
  rows = $state<ChecklistRow[]>(SAMPLE_CHECKLISTS.slice());
  loaded = $state(false);

  set(next: ChecklistRow[]) {
    this.rows = next;
    this.loaded = true;
  }

  reset() {
    this.rows = SAMPLE_CHECKLISTS.slice();
    this.loaded = true;
  }

  byId(id: string): ChecklistRow | undefined {
    return this.rows.find((r) => r.id === id);
  }
}

export const rowsStore = new RowsStore();
