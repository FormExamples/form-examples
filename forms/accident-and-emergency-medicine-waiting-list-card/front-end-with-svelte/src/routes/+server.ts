import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/accident-and-emergency-medicine-waiting-list-card/');
}
