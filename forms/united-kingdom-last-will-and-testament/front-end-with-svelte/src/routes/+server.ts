import { redirect } from '@sveltejs/kit';

export function GET() {
  redirect(307, '/united-kingdom-last-will-and-testament/');
}
