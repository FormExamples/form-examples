import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/occupational-medicine-waiting-list-card/');
}
