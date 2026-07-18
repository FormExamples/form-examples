import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/respiratory-medicine-waiting-list-card/');
}
