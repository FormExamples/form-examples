import type { ApplicationRow, DashboardApplicationsResponse } from './types.ts';

const API_BASE = 'http://localhost:5150';

/** Fetch FP92A applications from the backend dashboard endpoint. */
export async function fetchApplications(): Promise<ApplicationRow[]> {
	const res = await fetch(`${API_BASE}/api/dashboard/applications`);
	if (!res.ok) {
		throw new Error(`Failed to fetch applications: ${res.status} ${res.statusText}`);
	}
	const data: DashboardApplicationsResponse = await res.json();
	return data.items;
}
