import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/history-and-physical-examination/');
}
