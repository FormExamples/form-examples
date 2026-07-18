import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/oral-and-maxillofacial-surgery-waiting-list-card/');
}
