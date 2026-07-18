import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/internal-medicine-waiting-list-card/');
}
