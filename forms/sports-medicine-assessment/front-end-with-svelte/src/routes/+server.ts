import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/sports-medicine-assessment/');
}
