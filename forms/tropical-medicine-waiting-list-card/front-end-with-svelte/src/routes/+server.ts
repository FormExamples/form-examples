import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/tropical-medicine-waiting-list-card/');
}
