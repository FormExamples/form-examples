import type { OperationNoteRow } from '$lib/sample-data.js';
import { SAMPLE_OPERATION_NOTES } from '$lib/sample-data.js';

const API_BASE = '/api/operation-notes';

/** Fetch operation-note rows from the backend. Falls back to sample data so
 *  the dashboard runs standalone without a Loco backend on localhost. */
export async function fetchOperationNotes(): Promise<OperationNoteRow[]> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as OperationNoteRow[];
  } catch {
    return SAMPLE_OPERATION_NOTES;
  }
}
