import { navLinks } from '#lib/site';

export const prerender = true;

const SITE_URL = 'https://formexamples.com';

export function GET() {
  const urls = [...new Set(navLinks.map(({ href }) => href))].sort();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((href) => `  <url><loc>${SITE_URL}${href}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'content-type': 'application/xml' } });
}
