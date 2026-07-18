import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/clinical-biology-waiting-list-card/');
}
