import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/clinical-neurophysiology-waiting-list-card/');
}
