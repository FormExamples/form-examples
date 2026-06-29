import type {
	AppropriatenessBand,
	Recommendation,
	SafetyBand,
	TriageTier
} from './types';

// ──────────────────────────────────────────────
// Domain label maps
// ──────────────────────────────────────────────

/** Pretty labels for an angiography type. */
export const ANGIOGRAPHY_TYPE_LABELS: Record<string, string> = {
	'ct-angiography': 'CT angiography (CTA)',
	'mr-angiography': 'MR angiography (MRA)',
	'catheter-dsa': 'Catheter / DSA',
	'coronary-angiography': 'Coronary angiography',
	'peripheral-angiography': 'Peripheral angiography',
	'cerebral-angiography': 'Cerebral angiography',
	other: 'Other'
};

/** Human-readable label for an angiography type, falling back to the raw value. */
export function angiographyTypeLabel(value: string): string {
	return ANGIOGRAPHY_TYPE_LABELS[value] || value || '';
}

/** Pretty labels for a body region. */
export const BODY_REGION_LABELS: Record<string, string> = {
	coronary: 'Coronary',
	cerebral: 'Cerebral',
	carotid: 'Carotid',
	aorta: 'Aorta',
	renal: 'Renal',
	'peripheral-lower-limb': 'Peripheral (lower limb)',
	pulmonary: 'Pulmonary',
	mesenteric: 'Mesenteric',
	other: 'Other'
};

/** Human-readable label for a body region, falling back to the raw value. */
export function bodyRegionLabel(value: string): string {
	return BODY_REGION_LABELS[value] || value || '';
}

/** Pretty labels for a primary indication. */
export const INDICATION_LABELS: Record<string, string> = {
	'suspected-coronary-disease': 'Suspected coronary disease',
	'peripheral-arterial-disease': 'Peripheral arterial disease',
	aneurysm: 'Aneurysm',
	stenosis: 'Stenosis',
	'suspected-pulmonary-embolism': 'Suspected pulmonary embolism',
	'gi-bleeding': 'GI bleeding',
	'pre-intervention-planning': 'Pre-intervention planning',
	'suspected-stroke': 'Suspected stroke',
	other: 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
export function indicationLabel(value: string): string {
	return INDICATION_LABELS[value] || value || '';
}

/**
 * Whether the requested examination uses ionising radiation. CT, catheter /
 * DSA, coronary, peripheral, and cerebral angiography all use X-rays; MR
 * angiography does not.
 */
export function usesIonisingRadiation(angiographyType: string): boolean {
	return angiographyType !== '' && angiographyType !== 'mr-angiography';
}

/** Title-case a kebab/snake-case token for display. */
export function titleCase(s: string): string {
	return String(s || '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Calculate age in years from a date-of-birth string. */
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
// Axis band / tier labels and Lily-token colour classes
// ──────────────────────────────────────────────

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

export function safetyBandLabel(band: SafetyBand): string {
	switch (band) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
	}
}

export function safetyBandColor(band: SafetyBand): string {
	switch (band) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
	}
}

export function triageTierLabel(tier: TriageTier): string {
	switch (tier) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
	}
}

export function triageTierColor(tier: TriageTier): string {
	switch (tier) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'emergency':
			return 'bg-error text-error-content border-error';
	}
}

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

/** Flag-priority colour class (high → error, medium → warning, low → base-300). */
export function priorityColor(priority: 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}
