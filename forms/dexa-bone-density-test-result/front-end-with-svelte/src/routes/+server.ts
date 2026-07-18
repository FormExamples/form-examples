import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/dexa-bone-density-test-result/');
}
