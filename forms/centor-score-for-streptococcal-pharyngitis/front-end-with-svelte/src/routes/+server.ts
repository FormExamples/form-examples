import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/centor-score-for-streptococcal-pharyngitis/');
}
