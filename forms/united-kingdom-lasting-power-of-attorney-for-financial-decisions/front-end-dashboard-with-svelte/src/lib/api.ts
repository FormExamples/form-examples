// Thin fetch wrapper for the LPA dashboard. Tries the backend `/api/lpa`
// endpoint first and falls back to the in-memory sample fixtures if the
// backend is unreachable or returns an error. This keeps the dashboard
// runnable as a static SvelteKit app with no backend in development.

import type { Lpa } from './types.js';
import { sampleLpas, findSampleLpa } from './sample-data.js';

const API_BASE = '/api/lpa';

export async function fetchLpas(): Promise<Lpa[]> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = (await res.json()) as Lpa[];
    if (!Array.isArray(data) || data.length === 0) return sampleLpas;
    return data;
  } catch {
    return sampleLpas;
  }
}

export async function fetchLpa(id: string): Promise<Lpa | undefined> {
  try {
    const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`API ${res.status}`);
    return (await res.json()) as Lpa;
  } catch {
    return findSampleLpa(id);
  }
}
