import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/recognition-of-stroke-in-the-emergency-room/');
}
