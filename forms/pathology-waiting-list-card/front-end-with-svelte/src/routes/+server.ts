import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/pathology-waiting-list-card/');
}
