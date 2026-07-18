import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/hematology-waiting-list-card/');
}
