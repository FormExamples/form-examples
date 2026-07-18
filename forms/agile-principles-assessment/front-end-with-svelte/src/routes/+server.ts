import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/agile-principles-assessment/');
}
