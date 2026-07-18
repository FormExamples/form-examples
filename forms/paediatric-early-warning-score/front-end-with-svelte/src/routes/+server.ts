import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/paediatric-early-warning-score/');
}
