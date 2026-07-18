import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/wells-score-for-deep-vein-thrombosis/');
}
