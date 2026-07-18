import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/gastroenterology-waiting-list-card/');
}
