import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/birth-control-assessment/');
}
