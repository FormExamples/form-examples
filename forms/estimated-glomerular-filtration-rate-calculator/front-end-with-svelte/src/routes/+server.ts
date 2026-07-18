import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/estimated-glomerular-filtration-rate-calculator/');
}
