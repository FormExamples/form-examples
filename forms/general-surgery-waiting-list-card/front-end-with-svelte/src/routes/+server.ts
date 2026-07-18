import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/general-surgery-waiting-list-card/');
}
