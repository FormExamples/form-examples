import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/pre-operative-assessment-by-clinician/');
}
