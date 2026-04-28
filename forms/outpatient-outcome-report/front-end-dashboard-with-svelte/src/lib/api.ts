import type { DashboardOutcomesResponse, OutcomeRow } from './types.ts';

const API_BASE = 'http://localhost:5150';

/** Fetch outcome list from the backend dashboard endpoint. */
export async function fetchOutcomes(): Promise<OutcomeRow[]> {
	const res = await fetch(`${API_BASE}/api/dashboard/outcomes`);
	if (!res.ok) {
		throw new Error(`Failed to fetch outcomes: ${res.status} ${res.statusText}`);
	}
	const data: DashboardOutcomesResponse = await res.json();
	return data.items;
}
