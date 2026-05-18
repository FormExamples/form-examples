import { SAMPLE_ADRS, type AdrRow } from '$lib/data/sample.js';

/**
 * Base URL for the Loco backend. Set `VITE_API_BASE_URL=http://localhost:5150`
 * (the Loco default port) in `.env.local` during development to point the
 * dashboard at a running backend. When unset, the dashboard tries the
 * same-origin path `/api/adrs` and falls back to compiled-in sample data
 * if no backend is reachable.
 */
const API_BASE_URL: string =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? '';

/**
 * Fetch the ADR register. Tries `${API_BASE_URL}/api/adrs` first; falls back
 * to the compiled-in sample data when no backend is reachable.
 */
export async function fetchAdrs(): Promise<AdrRow[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/adrs`);
    if (res.ok) {
      const json = (await res.json()) as AdrRow[];
      if (Array.isArray(json) && json.length > 0) return json;
    }
  } catch {
    // fall through
  }
  return SAMPLE_ADRS;
}

export interface AdrView {
  id: string;
  number: number | null;
  slug: string;
  title: string;
  status: string;
  decisionGroup: string;
  decisionDate: string;
  authorName: string;
  markdown: string;
}

/**
 * Fetch a single ADR by slug, including its rendered Markdown body, from
 * `${API_BASE_URL}/api/adrs/{slug}`. Returns `null` when the backend is
 * unreachable or the slug is unknown.
 */
export async function fetchAdr(slug: string): Promise<AdrView | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/adrs/${encodeURIComponent(slug)}`);
    if (res.ok) return (await res.json()) as AdrView;
  } catch {
    // fall through
  }
  return null;
}

/**
 * Resolve a row's `markdownUrl` to a fully-qualified URL when the API base is
 * configured. Backend rows return server-rooted paths like
 * `/architecture_decision_records/1/markdown`, which the dashboard needs to
 * prefix with the backend origin to render correctly cross-origin.
 */
export function resolveMarkdownUrl(row: AdrRow): string {
  if (!row.markdownUrl) return '';
  if (row.markdownUrl.startsWith('http')) return row.markdownUrl;
  if (API_BASE_URL && row.markdownUrl.startsWith('/')) {
    return API_BASE_URL + row.markdownUrl;
  }
  return row.markdownUrl;
}
