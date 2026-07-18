import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/eye-vision-test-result/');
}
