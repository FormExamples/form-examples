import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/framingham-risk-score-for-hard-coronary-heart-disease/');
}
