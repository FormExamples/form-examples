import type {
  ChecklistRow,
  DashboardChecklistsResponse,
} from '$lib/checklist/types.js';
import { SAMPLE_CHECKLIST_ROWS } from './sample.js';

const API_BASE = 'http://localhost:5150';
const ENDPOINT = '/api/dashboard/checklists';

/**
 * Fetch checklist rows from the backend with a graceful fallback to the
 * bundled sample dataset. The dashboard therefore runs standalone without a
 * backend, while still pointing at the real endpoint when one is available.
 */
export async function fetchChecklists(): Promise<ChecklistRow[]> {
  try {
    const res = await fetch(`${API_BASE}${ENDPOINT}`);
    if (!res.ok) {
      throw new Error(`API ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as DashboardChecklistsResponse;
    if (Array.isArray(data.items) && data.items.length > 0) {
      return data.items;
    }
    return SAMPLE_CHECKLIST_ROWS;
  } catch {
    return SAMPLE_CHECKLIST_ROWS;
  }
}
