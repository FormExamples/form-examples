import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/physical-medicine-and-rehabilitation-waiting-list-card/');
}
