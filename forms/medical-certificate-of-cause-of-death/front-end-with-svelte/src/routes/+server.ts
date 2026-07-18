import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/medical-certificate-of-cause-of-death/');
}
