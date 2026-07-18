import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/predicting-risk-of-cardiovascular-disease-events/');
}
