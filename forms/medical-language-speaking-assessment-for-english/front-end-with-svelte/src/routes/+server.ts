import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/medical-language-speaking-assessment-for-english/');
}
