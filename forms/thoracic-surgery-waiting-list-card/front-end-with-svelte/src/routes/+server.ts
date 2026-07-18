import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/thoracic-surgery-waiting-list-card/');
}
