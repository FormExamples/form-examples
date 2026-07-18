import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/ambulatory-blood-pressure-test-result/');
}
