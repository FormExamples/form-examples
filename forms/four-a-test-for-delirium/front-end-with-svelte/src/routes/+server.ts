import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/four-a-test-for-delirium/');
}
