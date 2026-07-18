import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/');
}
