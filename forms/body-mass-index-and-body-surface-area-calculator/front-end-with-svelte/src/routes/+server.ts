import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/body-mass-index-and-body-surface-area-calculator/');
}
