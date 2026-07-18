import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/united-kingdom-maternity-certificate-mat-b1/');
}
