import type { DashboardScorecardsResponse, ScorecardRow } from './types';

/**
 * Fetch the submitted-scorecard list. The default origin is the
 * SvelteKit dev server itself — `/api/dashboard/scorecards` is served
 * by `src/routes/api/dashboard/scorecards/+server.ts` against the
 * bundled sample data, so the dashboard works standalone.
 *
 * In a production deployment the Loco backend serves the same shape at
 * the same path; point the dashboard at the backend by setting
 * `PUBLIC_API_BASE` (e.g. `http://localhost:5150`) at build time, or
 * by passing a `base` argument here.
 *
 * Callers are still expected to fall back to the bundled `scorecards`
 * sample (in `data.ts`) on network failure.
 */
export async function fetchScorecards(base = ''): Promise<ScorecardRow[]> {
	const res = await fetch(`${base}/api/dashboard/scorecards`);
	if (!res.ok) {
		throw new Error(`Failed to fetch scorecards: ${res.status} ${res.statusText}`);
	}
	const data: DashboardScorecardsResponse = await res.json();
	return data.items;
}

/**
 * Fetch a single scorecard by id. Used by the per-scorecard report
 * route at `/report/[id]`.
 */
export async function fetchScorecard(id: string, base = ''): Promise<ScorecardRow | null> {
	const res = await fetch(`${base}/api/scorecards/${encodeURIComponent(id)}`);
	if (res.status === 404) return null;
	if (!res.ok) {
		throw new Error(`Failed to fetch scorecard ${id}: ${res.status} ${res.statusText}`);
	}
	return (await res.json()) as ScorecardRow;
}

export interface DashboardStats {
	total: number;
	byBand: { low: number; borderline: number; medium: number; high: number };
	bySector: Record<string, number>;
	bySize: Record<string, number>;
	flagCount: number;
	flagCountByCategory: Record<string, number>;
	averageScore: number;
}

/**
 * Fetch aggregate counts. Returns `null` on any network or HTTP
 * failure so the dashboard can hide the stats panel gracefully when
 * the backend isn't reachable.
 */
export async function fetchStats(base = ''): Promise<DashboardStats | null> {
	try {
		const res = await fetch(`${base}/api/stats`);
		if (!res.ok) return null;
		return (await res.json()) as DashboardStats;
	} catch {
		return null;
	}
}
