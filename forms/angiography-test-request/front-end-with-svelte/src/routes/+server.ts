import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/angiography-test-request/');
}
