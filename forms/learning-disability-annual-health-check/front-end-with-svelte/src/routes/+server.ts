import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/learning-disability-annual-health-check/');
}
