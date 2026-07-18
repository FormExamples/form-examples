import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/agile-consulting-scorecard-for-hiring-help/');
}
