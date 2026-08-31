export type NavLink = { href: string; label: string };

export const SITE_NAME = 'FormExamples';
export const SITE_TAGLINE = '355 medical-form reference implementations';
export const REPO_URL = 'https://github.com/formexamples/form-examples';

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/forms/', label: 'Forms' },
  { href: '/architecture/', label: 'Architecture' },
  { href: '/tech-stacks/', label: 'Tech stacks' },
  { href: '/compliance/', label: 'Compliance' },
  { href: '/get-started/', label: 'Get started' }
];

/**
 * The document <title> AND the SharePicker share title both derive from
 * this one function, fed by `page.data.title` (set per-route by each
 * +page.ts load — see src/app.d.ts's App.PageData). Single source of
 * truth: a route can never have its tab title and its shared title drift
 * apart.
 */
export function pageTitle(title?: string): string {
  return title ? `${title} — ${SITE_NAME}` : SITE_NAME;
}
