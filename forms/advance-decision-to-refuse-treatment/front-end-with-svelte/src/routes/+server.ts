import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/advance-decision-to-refuse-treatment/');
}
