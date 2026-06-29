// Label and Lily-token colour helpers for the Blood Cross-Match Test Request.
//
// Pretty labels are ported from the HTML front-end's `types.js`. Colour helpers
// return Lily design-token utility classes only (success / warning / error /
// info / base-300) — never hardcoded palette colours.

import type {
	AppropriatenessBand,
	BloodGroup,
	Component,
	FlagPriority,
	IdentitySafetyBand,
	Indication,
	Recommendation,
	RequestType,
	TriageTier
} from './types';

const REQUEST_TYPE_LABELS: Record<string, string> = {
	'group-and-save': 'Group and save',
	'antibody-screen': 'Antibody screen',
	crossmatch: 'Crossmatch',
	'emergency-o-negative': 'Emergency O-negative',
	other: 'Other'
};

const COMPONENT_LABELS: Record<string, string> = {
	'red-cells': 'Red cells',
	platelets: 'Platelets',
	'fresh-frozen-plasma': 'Fresh-frozen plasma',
	cryoprecipitate: 'Cryoprecipitate',
	none: 'None (sample only)'
};

const INDICATION_LABELS: Record<string, string> = {
	surgery: 'Surgery',
	'acute-bleeding': 'Acute bleeding',
	anaemia: 'Anaemia (non-bleeding)',
	'obstetric-haemorrhage': 'Obstetric haemorrhage',
	'chemotherapy-support': 'Chemotherapy support',
	'transfusion-dependent': 'Transfusion-dependent',
	other: 'Other'
};

const BLOOD_GROUP_LABELS: Record<string, string> = {
	'a-pos': 'A RhD positive',
	'a-neg': 'A RhD negative',
	'b-pos': 'B RhD positive',
	'b-neg': 'B RhD negative',
	'o-pos': 'O RhD positive',
	'o-neg': 'O RhD negative',
	'ab-pos': 'AB RhD positive',
	'ab-neg': 'AB RhD negative',
	unknown: 'Unknown'
};

const APPROPRIATENESS_BAND_LABELS: Record<AppropriatenessBand, string> = {
	'usually-appropriate': 'Usually appropriate',
	'may-be-appropriate': 'May be appropriate',
	'usually-not-appropriate': 'Usually not appropriate'
};

const IDENTITY_SAFETY_BAND_LABELS: Record<IdentitySafetyBand, string> = {
	ok: 'OK',
	caution: 'Caution',
	'reject-risk': 'Reject risk'
};

const TRIAGE_TIER_LABELS: Record<TriageTier, string> = {
	routine: 'Routine',
	urgent: 'Urgent',
	emergency: 'Emergency',
	stat: 'Stat'
};

const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
	accept: 'Accept and process',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/** Human-readable label for a request type, falling back to the raw value. */
export function requestTypeLabel(value: RequestType): string {
	return REQUEST_TYPE_LABELS[value] || value || '';
}

/** Human-readable label for a blood component, falling back to the raw value. */
export function componentLabel(value: Component): string {
	return COMPONENT_LABELS[value] || value || '';
}

/** Human-readable label for a clinical indication, falling back to the raw value. */
export function indicationLabel(value: Indication): string {
	return INDICATION_LABELS[value] || value || '';
}

/** Human-readable label for an ABO/Rh blood group, falling back to the raw value. */
export function bloodGroupLabel(value: BloodGroup): string {
	return BLOOD_GROUP_LABELS[value] || value || '';
}

/** Human-readable label for an appropriateness band. */
export function appropriatenessBandLabel(band: AppropriatenessBand): string {
	return APPROPRIATENESS_BAND_LABELS[band] || band;
}

/** Human-readable label for an identity / sample-safety band. */
export function identitySafetyBandLabel(band: IdentitySafetyBand): string {
	return IDENTITY_SAFETY_BAND_LABELS[band] || band;
}

/** Human-readable label for a triage tier. */
export function triageTierLabel(tier: TriageTier): string {
	return TRIAGE_TIER_LABELS[tier] || tier;
}

/** Human-readable label for an overall vetting recommendation. */
export function recommendationLabel(rec: Recommendation): string {
	return RECOMMENDATION_LABELS[rec] || rec;
}

// ──────────────────────────────────────────────
// Lily-token colour helpers (no hardcoded palette)
// ──────────────────────────────────────────────

/** Appropriateness band → Lily token utility triple. */
export function appropriatenessBandColor(band: AppropriatenessBand): string {
	switch (band) {
		case 'usually-appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'usually-not-appropriate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Identity / sample-safety band → Lily token utility triple. */
export function identitySafetyBandColor(band: IdentitySafetyBand): string {
	switch (band) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'reject-risk':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Triage tier → Lily token utility triple. */
export function triageTierColor(tier: TriageTier): string {
	switch (tier) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'emergency':
			return 'bg-error text-error-content border-error';
		case 'stat':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation → Lily token utility triple. */
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
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag priority → Lily token utility triple. */
export function priorityColor(priority: FlagPriority): string {
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

/** Title-case a hyphen / underscore separated token (e.g. `reject-risk` → `Reject Risk`). */
export function titleCase(s: string): string {
	return String(s || '')
		.replace(/[-_]/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Calculate age in whole years from a date-of-birth string. */
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
