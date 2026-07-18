import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/pulmonary-embolism-rule-out-criteria/');
}
