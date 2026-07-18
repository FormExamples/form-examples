import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/qrisk3-cardiovascular-disease-risk-score/');
}
