import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/nerve-conduction-study-test-request/');
}
