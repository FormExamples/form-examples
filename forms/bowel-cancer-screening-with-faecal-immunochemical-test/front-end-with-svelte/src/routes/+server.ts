import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/bowel-cancer-screening-with-faecal-immunochemical-test/');
}
