import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/grace-score-for-acute-coronary-syndrome/');
}
