import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/emergency-medical-technician-psychomotor-examination/');
}
