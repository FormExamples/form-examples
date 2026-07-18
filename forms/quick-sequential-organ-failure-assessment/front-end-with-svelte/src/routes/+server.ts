import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/quick-sequential-organ-failure-assessment/');
}
