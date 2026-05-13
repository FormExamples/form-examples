import { error, json } from '@sveltejs/kit';
import { scorecards } from '$lib/data';
import type { RequestHandler } from './$types';

/**
 * Same-origin per-scorecard lookup. Looks up the row by id in the
 * bundled `scorecards` sample, returning 404 if not found. The Loco
 * backend mounts the same shape at the same path.
 */
export const GET: RequestHandler = ({ params }) => {
	const row = scorecards.find((r) => r.id === params.id);
	if (!row) throw error(404, `No scorecard found with id ${params.id}`);
	return json(row);
};
