import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/edinburgh-postnatal-depression-scale/');
}
