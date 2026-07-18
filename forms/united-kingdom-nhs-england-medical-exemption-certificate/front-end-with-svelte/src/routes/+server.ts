import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/united-kingdom-nhs-england-medical-exemption-certificate/');
}
