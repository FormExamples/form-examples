import { redirect } from '@sveltejs/kit';

export function GET() {
  redirect(307, '/united-states-last-will-and-testament/');
}
