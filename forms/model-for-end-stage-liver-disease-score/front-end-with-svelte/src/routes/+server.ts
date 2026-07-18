import { redirect } from '@sveltejs/kit';

export function GET() {
	redirect(307, '/model-for-end-stage-liver-disease-score/');
}
