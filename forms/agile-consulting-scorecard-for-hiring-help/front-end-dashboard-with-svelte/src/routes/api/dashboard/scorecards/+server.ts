import { json } from '@sveltejs/kit';
import { scorecards } from '$lib/data';
import type { DashboardScorecardsResponse } from '$lib/types';
import type { RequestHandler } from './$types';

/**
 * Same-origin scorecard list. Serves the bundled `scorecards` sample
 * so the dashboard works standalone. The Loco backend mounts the same
 * shape at the same path; pointing the dashboard at the backend is
 * controlled by `fetchScorecards(base)` in `$lib/api.ts`.
 */
export const GET: RequestHandler = () => {
	const body: DashboardScorecardsResponse = {
		items: scorecards,
		total: scorecards.length,
	};
	return json(body);
};
