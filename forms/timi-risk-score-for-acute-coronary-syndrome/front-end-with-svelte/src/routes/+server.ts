import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/timi-risk-score-for-acute-coronary-syndrome/');
}
