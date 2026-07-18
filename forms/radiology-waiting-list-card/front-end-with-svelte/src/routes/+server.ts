import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/radiology-waiting-list-card/');
}
