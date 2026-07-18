import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/mast-cell-activation-syndrome-assessment/');
}
