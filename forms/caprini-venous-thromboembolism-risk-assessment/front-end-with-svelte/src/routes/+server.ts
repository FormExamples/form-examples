import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/caprini-venous-thromboembolism-risk-assessment/');
}
