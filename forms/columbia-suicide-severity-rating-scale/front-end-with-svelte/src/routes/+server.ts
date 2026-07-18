import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/columbia-suicide-severity-rating-scale/');
}
