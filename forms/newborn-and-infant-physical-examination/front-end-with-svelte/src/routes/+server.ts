import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/newborn-and-infant-physical-examination/');
}
