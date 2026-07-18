import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/sequential-organ-failure-assessment/');
}
