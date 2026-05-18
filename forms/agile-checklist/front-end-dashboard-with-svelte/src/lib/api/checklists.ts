import type { ChecklistRow } from '$lib/data/sample.js';
import { SAMPLE_CHECKLISTS } from '$lib/data/sample.js';

const API_BASE = '/api/checklists';
const CACHE_KEY = 'agile-checklist-dashboard:cache:v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export type FetchSource = 'api' | 'cache' | 'sample';

export interface FetchResult {
  source: FetchSource;
  rows: ChecklistRow[];
  fetchedAt?: number;
}

interface CachePayload {
  fetchedAt: number;
  rows: ChecklistRow[];
}

function safeLs(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readCache(): CachePayload | null {
  const ls = safeLs();
  if (!ls) return null;
  const raw = ls.getItem(CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CachePayload;
    if (!parsed || !Array.isArray(parsed.rows)) return null;
    const fetchedAt = Number(parsed.fetchedAt) || 0;
    if (fetchedAt && Date.now() - fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(rows: ChecklistRow[]): void {
  const ls = safeLs();
  if (!ls) return;
  try {
    const payload: CachePayload = { fetchedAt: Date.now(), rows };
    ls.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function clearChecklistsCache(): void {
  const ls = safeLs();
  if (!ls) return;
  try {
    ls.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

export async function fetchChecklists(): Promise<ChecklistRow[]> {
  const result = await fetchChecklistsWithSource();
  return result.rows;
}

export async function fetchChecklistsWithSource(): Promise<FetchResult> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const rows = (await res.json()) as ChecklistRow[];
    if (Array.isArray(rows)) writeCache(rows);
    return { source: 'api', rows };
  } catch {
    const cached = readCache();
    if (cached) {
      return { source: 'cache', rows: cached.rows, fetchedAt: cached.fetchedAt };
    }
    return { source: 'sample', rows: SAMPLE_CHECKLISTS };
  }
}
