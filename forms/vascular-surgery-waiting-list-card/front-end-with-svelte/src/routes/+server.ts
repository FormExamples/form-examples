import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/vascular-surgery-waiting-list-card/');
}
