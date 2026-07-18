import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/chronic-obstructive-pulmonary-disease-review/');
}
