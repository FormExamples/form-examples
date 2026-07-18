import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/infectious-diseases-waiting-list-card/');
}
