import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/preventive-medicine-waiting-list-card/');
}
