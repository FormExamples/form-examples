import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/cataract-diagnostic-evaluation/');
}
