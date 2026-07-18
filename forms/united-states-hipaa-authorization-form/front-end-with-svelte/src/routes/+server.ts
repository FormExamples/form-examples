import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/united-states-hipaa-authorization-form/');
}
