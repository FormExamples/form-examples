import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/seasonal-affective-disorder-assessment/');
}
