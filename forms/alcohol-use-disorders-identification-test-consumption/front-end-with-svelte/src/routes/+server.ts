import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/alcohol-use-disorders-identification-test-consumption/');
}
