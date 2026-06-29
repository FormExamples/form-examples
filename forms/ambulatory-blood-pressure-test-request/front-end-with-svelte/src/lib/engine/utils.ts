// Label and colour helpers for the Ambulatory Blood Pressure Test Request.
//
// Colour classes use Lily Design System tokens only (success / warning / error
// / info / base-300) — never hardcoded palette utilities.

import type {
	AppropriatenessBand,
	FlagPriority,
	Indication,
	Recommendation,
	SuitabilityBand,
	TestType,
	TriageTier
} from './types';

/** Pretty label for a test type, falling back to the raw value. */
const TEST_TYPE_LABELS: Record<string, string> = {
	'24-hour-abpm': '24-hour ABPM',
	'home-blood-pressure-monitoring': 'Home blood pressure monitoring',
	other: 'Other'
};

export function testTypeLabel(value: TestType | string): string {
	return TEST_TYPE_LABELS[value] || value || '';
}

/** Pretty label for a primary indication, falling back to the raw value. */
const INDICATION_LABELS: Record<string, string> = {
	'diagnose-hypertension': 'Diagnose hypertension',
	'white-coat-hypertension': 'Suspected white-coat hypertension',
	'masked-hypertension': 'Suspected masked hypertension',
	'resistant-hypertension': 'Resistant hypertension',
	'treatment-monitoring': 'Treatment monitoring',
	'hypotension-symptoms': 'Hypotension symptoms',
	'pregnancy-hypertension': 'Pregnancy hypertension',
	other: 'Other'
};

export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] || value || '';
}

/** Format a clinic blood-pressure pair as "S/D mmHg" or '' if incomplete. */
export function formatBloodPressure(
	systolic: number | null | undefined,
	diastolic: number | null | undefined
): string {
	if (systolic === null || systolic === undefined) return '';
	if (diastolic === null || diastolic === undefined) return '';
	return `${Number(systolic)}/${Number(diastolic)} mmHg`;
}

/** Title-case a hyphen/underscore-separated identifier. */
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

// ----------------------------------------------------------------------
// Axis A — appropriateness band
// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------
// Axis B — suitability band
// ----------------------------------------------------------------------

export function suitabilityBandLabel(band: SuitabilityBand): string {
	switch (band) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'limited':
			return 'Limited';
	}
}

export function suitabilityBandColor(band: SuitabilityBand): string {
	switch (band) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'limited':
			return 'bg-error text-error-content border-error';
	}
}

// ----------------------------------------------------------------------
// Axis D — triage tier
// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------
// Recommendation
// ----------------------------------------------------------------------

export function recommendationColor(rec: Recommendation): string {
	switch (rec) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'redirect':
			return 'bg-warning text-warning-content border-warning';
		case 'query-referrer':
			return 'bg-info text-info-content border-info';
		case 'reject':
			return 'bg-error text-error-content border-error';
	}
}

// ----------------------------------------------------------------------
// Safety-flag priority
// ----------------------------------------------------------------------

export function priorityColor(priority: FlagPriority): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}
