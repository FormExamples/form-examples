import type { LpaRow } from '$lib/data/sample.js';
import { SAMPLE_LPAS } from '$lib/data/sample.js';

const API_BASE = '/api/lpa';

export async function fetchLpas(): Promise<LpaRow[]> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as LpaRow[];
  } catch {
    return SAMPLE_LPAS;
  }
}

export async function fetchLpa(id: string): Promise<LpaRow | undefined> {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as LpaRow;
  } catch {
    return SAMPLE_LPAS.find((r) => r.id === id);
  }
}
