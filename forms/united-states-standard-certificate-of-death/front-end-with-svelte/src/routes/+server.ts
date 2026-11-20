import { redirect } from '@sveltejs/kit';

export function GET() {
  redirect(307, '/united-states-standard-certificate-of-death/');
}
