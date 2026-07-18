import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/pet-scan-test-request/');
}
