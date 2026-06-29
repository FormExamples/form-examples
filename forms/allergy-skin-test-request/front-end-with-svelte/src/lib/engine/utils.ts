// Label and colour helpers for the Allergy Skin Test Request front-end.
//
// Colours are Lily Design System token utilities only (success / warning /
// error / info / base-300) — never hardcoded palette names.

import type {
	AppropriatenessBand,
	ValidityBand,
	TriageTier,
	Recommendation,
	FlagPriority,
	TestType,
	Indication
} from './types';

/** Pretty labels for the test types. */
export const TEST_TYPE_LABELS: Record<string, string> = {
	'skin-prick-test': 'Skin-prick test',
	'intradermal-test': 'Intradermal test',
	'patch-test': 'Patch test',
	'specific-ige-blood': 'Specific-IgE blood',
	'drug-provocation-challenge': 'Drug-provocation challenge',
	other: 'Other'
};

/** Human-readable label for a test type, falling back to the raw value. */
export function testTypeLabel(value: TestType | string): string {
	return TEST_TYPE_LABELS[value] || value || '';
}

/** Pretty labels for the primary indications. */
export const INDICATION_LABELS: Record<string, string> = {
	'suspected-food-allergy': 'Suspected food allergy',
	'suspected-drug-allergy': 'Suspected drug allergy',
	'rhinitis-asthma': 'Rhinitis / asthma',
	'anaphylaxis-investigation': 'Anaphylaxis investigation',
	'venom-allergy': 'Venom allergy',
	'contact-dermatitis': 'Contact dermatitis',
	urticaria: 'Urticaria',
	other: 'Other'
};

/** Human-readable label for an indication, falling back to the raw value. */
export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] || value || '';
}

/** Title-case a hyphen/underscore-delimited token (e.g. `red-flag` → `Red Flag`). */
export function titleCase(value: string): string {
	return String(value || '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ──────────────────────────────────────────────
// Axis A — appropriateness
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

// ──────────────────────────────────────────────
// Axis B — validity and safety
// ──────────────────────────────────────────────

export function validityBandLabel(band: ValidityBand): string {
	switch (band) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
	}
}

export function validityBandColor(band: ValidityBand): string {
	switch (band) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
	}
}

// ──────────────────────────────────────────────
// Axis D — triage priority
// ──────────────────────────────────────────────

export function triageTierLabel(tier: TriageTier): string {
	return tier === 'urgent' ? 'Urgent' : 'Routine';
}

export function triageTierColor(tier: TriageTier): string {
	return tier === 'urgent'
		? 'bg-warning text-warning-content border-warning'
		: 'bg-info text-info-content border-info';
}

// ──────────────────────────────────────────────
// Recommendation
// ──────────────────────────────────────────────

export function recommendationColor(rec: Recommendation): string {
	switch (rec) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-warning text-warning-content border-warning';
		case 'redirect':
		case 'reject':
			return 'bg-error text-error-content border-error';
	}
}

// ──────────────────────────────────────────────
// Flag priority
// ──────────────────────────────────────────────

export function flagPriorityColor(priority: FlagPriority): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Completeness bar colour band by percent. */
export function completenessColor(percent: number): string {
	if (percent >= 80) return 'bg-success text-success-content border-success';
	if (percent >= 50) return 'bg-warning text-warning-content border-warning';
	return 'bg-error text-error-content border-error';
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
