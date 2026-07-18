import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/tumor-marker-test-request/');
}
