import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/has-bled-score-for-major-bleeding-risk/');
}
