import type {
	AppropriatenessBand,
	BleedingRiskBand,
	Recommendation,
	TriageTier
} from './types';

// ──────────────────────────────────────────────
// Vocabulary label maps (mirrors the HTML engine's types.js)
// ──────────────────────────────────────────────

const BIOPSY_SITE_LABELS: Record<string, string> = {
	skin: 'Skin',
	breast: 'Breast',
	'lymph-node': 'Lymph node',
	liver: 'Liver',
	kidney: 'Kidney',
	prostate: 'Prostate',
	lung: 'Lung',
	'bone-marrow': 'Bone marrow',
	'gi-tract': 'GI tract',
	thyroid: 'Thyroid',
	'soft-tissue': 'Soft tissue',
	other: 'Other'
};

const BIOPSY_METHOD_LABELS: Record<string, string> = {
	punch: 'Punch',
	excision: 'Excision',
	incision: 'Incision',
	'core-needle': 'Core needle',
	'fine-needle-aspiration': 'Fine-needle aspiration',
	aspiration: 'Aspiration',
	'image-guided': 'Image-guided',
	endoscopic: 'Endoscopic',
	other: 'Other'
};

const INDICATION_LABELS: Record<string, string> = {
	'suspected-malignancy': 'Suspected malignancy',
	'cancer-staging': 'Cancer staging',
	'suspected-infection': 'Suspected infection',
	'inflammatory-disease': 'Inflammatory disease',
	'transplant-monitoring': 'Transplant monitoring',
	lymphadenopathy: 'Lymphadenopathy',
	'characterise-lesion': 'Characterise lesion',
	other: 'Other'
};

/** Human-readable label for a biopsy site, falling back to the raw value. */
export function biopsySiteLabel(value: string): string {
	return BIOPSY_SITE_LABELS[value] || value || '';
}

/** Human-readable label for a biopsy method, falling back to the raw value. */
export function biopsyMethodLabel(value: string): string {
	return BIOPSY_METHOD_LABELS[value] || value || '';
}

/** Human-readable label for a primary indication, falling back to the raw value. */
export function indicationLabel(value: string): string {
	return INDICATION_LABELS[value] || value || '';
}

/** Title-case a kebab/snake value (e.g. `two-week-wait` → `Two Week Wait`). */
export function titleCase(value: string): string {
	return String(value || '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ──────────────────────────────────────────────
// Axis label helpers
// ──────────────────────────────────────────────

/** Appropriateness band label. */
export function appropriatenessBandLabel(band: AppropriatenessBand): string {
	switch (band) {
		case 'usually-appropriate':
			return 'Usually appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'usually-not-appropriate':
			return 'Usually not appropriate';
	}
}

/** Bleeding-risk band label. */
export function bleedingRiskLabel(band: BleedingRiskBand): string {
	switch (band) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
	}
}

/** Triage tier label. */
export function triageTierLabel(tier: TriageTier): string {
	switch (tier) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'two-week-wait':
			return 'Two-week wait';
		case 'emergency':
			return 'Emergency';
	}
}

/** Calculate age from a date-of-birth string. */
export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
	return age;
}

// ──────────────────────────────────────────────
// Lily-token colour helpers (success/warning/error/info/base only)
// ──────────────────────────────────────────────

/** Appropriateness band → Lily token triple. */
export function appropriatenessBandColor(band: AppropriatenessBand): string {
	switch (band) {
		case 'usually-appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'usually-not-appropriate':
			return 'bg-error text-error-content border-error';
	}
}

/** Bleeding-risk band → Lily token triple. */
export function bleedingRiskColor(band: BleedingRiskBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
	}
}

/** Triage tier → Lily token triple. */
export function triageTierColor(tier: TriageTier): string {
	switch (tier) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'two-week-wait':
			return 'bg-info text-info-content border-info';
		case 'emergency':
			return 'bg-error text-error-content border-error';
	}
}

/** Overall recommendation → Lily token triple. */
export function recommendationColor(rec: Recommendation): string {
	switch (rec) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-warning text-warning-content border-warning';
		case 'redirect':
			return 'bg-info text-info-content border-info';
		case 'reject':
			return 'bg-error text-error-content border-error';
	}
}

/** Safety-flag priority → Lily token triple. */
export function priorityColor(priority: string): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
