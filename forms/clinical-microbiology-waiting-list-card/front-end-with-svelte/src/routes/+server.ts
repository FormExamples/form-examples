import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/clinical-microbiology-waiting-list-card/');
}
