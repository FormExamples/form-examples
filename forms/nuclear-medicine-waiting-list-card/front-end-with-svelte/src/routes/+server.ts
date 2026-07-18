import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/nuclear-medicine-waiting-list-card/');
}
