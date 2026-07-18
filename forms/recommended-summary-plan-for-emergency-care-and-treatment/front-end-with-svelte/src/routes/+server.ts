import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/recommended-summary-plan-for-emergency-care-and-treatment/');
}
