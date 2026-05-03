export type NavLink = { href: string; label: string };

export const SITE_NAME = 'FormExamples';
export const SITE_TAGLINE = '116 medical-form reference implementations';
export const REPO_URL = 'https://github.com/joelparkerhenderson/medical-forms';

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/forms/', label: 'Forms' },
  { href: '/architecture/', label: 'Architecture' },
  { href: '/tech-stacks/', label: 'Tech stacks' },
  { href: '/compliance/', label: 'Compliance' },
  { href: '/get-started/', label: 'Get started' }
];
