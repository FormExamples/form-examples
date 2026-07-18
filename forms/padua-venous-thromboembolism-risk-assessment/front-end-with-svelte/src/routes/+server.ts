import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/padua-venous-thromboembolism-risk-assessment/');
}
