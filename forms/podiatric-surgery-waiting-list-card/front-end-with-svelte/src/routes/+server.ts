import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/podiatric-surgery-waiting-list-card/');
}
