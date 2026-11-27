import { redirect } from '@sveltejs/kit';

export function GET() {
  redirect(307, '/medical-renal-living-donor-request/');
}
