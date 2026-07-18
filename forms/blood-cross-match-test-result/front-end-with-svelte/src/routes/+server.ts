import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/blood-cross-match-test-result/');
}
