import { redirect } from '@sveltejs/kit';

export function GET() {
  redirect(307, '/medical-human-leukocyte-and-disease-association-request/');
}
