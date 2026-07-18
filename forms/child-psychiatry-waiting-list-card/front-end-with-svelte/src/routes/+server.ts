import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/child-psychiatry-waiting-list-card/');
}
