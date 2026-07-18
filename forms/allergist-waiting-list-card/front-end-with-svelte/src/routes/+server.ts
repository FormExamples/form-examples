import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/allergist-waiting-list-card/');
}
