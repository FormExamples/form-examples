import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/objectives-and-key-results-tracker/');
}
