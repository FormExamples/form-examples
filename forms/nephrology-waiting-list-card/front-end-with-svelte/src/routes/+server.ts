import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/nephrology-waiting-list-card/');
}
