// The full Lily Design System theme catalogue, vendored as standalone
// stylesheets under `static/themes/<value>.css`. Each file is loaded one at a
// time via a swappable <link> in the root layout (standalone Lily theme files
// are designed to be the sole theme stylesheet, so they cannot be combined).
// `system` loads no theme file and falls back to the app's default tokens.

/** A selectable theme: the stylesheet basename and a human-readable label. */
export interface ThemeOption {
	value: string;
	label: string;
}

/** Friendly labels for the long, fully-qualified design-system theme names. */
const LABEL_OVERRIDES: Record<string, string> = {
	'adobe-spectrum': 'Adobe Spectrum',
	'mozilla-protocol': 'Mozilla Protocol',
	'united-kingdom-government-digital-service': 'UK · Government Digital Service',
	'united-kingdom-national-health-service-england-for-patients': 'UK · NHS England — Patients',
	'united-kingdom-national-health-service-england-for-practitioners':
		'UK · NHS England — Practitioners',
	'united-kingdom-national-health-service-scotland-for-patients': 'UK · NHS Scotland — Patients',
	'united-kingdom-national-health-service-scotland-for-practitioners':
		'UK · NHS Scotland — Practitioners',
	'united-kingdom-national-health-service-wales-for-patients': 'UK · NHS Wales — Patients',
	'united-kingdom-national-health-service-wales-for-practitioners': 'UK · NHS Wales — Practitioners',
	'united-states-web-design-system': 'US · Web Design System'
};

/** Title-case a hyphenated single-word theme name (e.g. `cyberpunk` → `Cyberpunk`). */
function titleCase(value: string): string {
	return value
		.split('-')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
}

const THEME_VALUES = [
	'abyss', 'acid', 'adobe-spectrum', 'aqua', 'autumn', 'black', 'bumblebee', 'business',
	'caramellatte', 'cmyk', 'coffee', 'corporate', 'cupcake', 'cyberpunk', 'dark', 'dim',
	'dracula', 'emerald', 'fantasy', 'forest', 'garden', 'halloween', 'lemonade', 'light',
	'lofi', 'luxury', 'mozilla-protocol', 'night', 'nord', 'pastel', 'retro', 'silk', 'sunset',
	'synthwave', 'united-kingdom-government-digital-service',
	'united-kingdom-national-health-service-england-for-patients',
	'united-kingdom-national-health-service-england-for-practitioners',
	'united-kingdom-national-health-service-scotland-for-patients',
	'united-kingdom-national-health-service-scotland-for-practitioners',
	'united-kingdom-national-health-service-wales-for-patients',
	'united-kingdom-national-health-service-wales-for-practitioners',
	'united-states-web-design-system', 'valentine', 'winter', 'wireframe'
];

/** Every vendored Lily theme, in catalogue order. */
export const THEME_OPTIONS: ThemeOption[] = THEME_VALUES.map((value) => ({
	value,
	label: LABEL_OVERRIDES[value] ?? titleCase(value)
}));

/** The gold-standard default theme: the Lily Design System light theme. */
export const DEFAULT_THEME = 'light';

/** localStorage key for the persisted theme selection. */
export const THEME_STORAGE_KEY = 'hearing-aid-assessment.theme.v1';
