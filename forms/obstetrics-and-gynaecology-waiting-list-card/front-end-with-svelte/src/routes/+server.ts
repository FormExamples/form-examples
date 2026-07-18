import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/obstetrics-and-gynaecology-waiting-list-card/');
}
