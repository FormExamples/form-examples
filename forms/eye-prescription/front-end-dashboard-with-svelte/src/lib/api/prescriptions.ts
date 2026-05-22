import type { PrescriptionRow } from '$lib/data/sample.js';
import { SAMPLE_PRESCRIPTIONS } from '$lib/data/sample.js';

const API_BASE = '/api/prescriptions';

/** Fetch prescriptions from the back-end. Falls back to sample data so the
 *  dashboard works standalone, without a running Loco backend. */
export async function fetchPrescriptions(): Promise<PrescriptionRow[]> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as PrescriptionRow[];
  } catch {
    return SAMPLE_PRESCRIPTIONS;
  }
}
