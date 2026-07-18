import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/national-early-warning-score-2/');
}
