import { redirect } from '@sveltejs/kit';

export function GET() {
  redirect(307, '/medical-renal-transplant-recipient-request/');
}
