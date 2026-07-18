import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/gastroenterologic-surgery-waiting-list-card/');
}
