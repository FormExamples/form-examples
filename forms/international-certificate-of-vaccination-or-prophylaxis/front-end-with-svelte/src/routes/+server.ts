import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/international-certificate-of-vaccination-or-prophylaxis/');
}
