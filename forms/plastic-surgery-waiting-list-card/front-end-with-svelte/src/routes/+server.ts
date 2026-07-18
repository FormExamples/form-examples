import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/plastic-surgery-waiting-list-card/');
}
