import type {
	TestsSection,
	AppropriatenessBand,
	PreanalyticalBand,
	TriageTier,
	Recommendation,
	SpecimenType,
	PrimaryIndication,
	Urgency
} from './types';

// ──────────────────────────────────────────────
// Requested-test helpers
// ──────────────────────────────────────────────

/** Ordered list of the requestable test booleans (field key + label). */
export const TEST_FIELDS: { field: keyof TestsSection; label: string; primary?: boolean }[] = [
	{ field: 'cultureAndSensitivity', label: 'Culture & sensitivity (MC&S)', primary: true },
	{ field: 'gramStain', label: 'Gram stain / microscopy' },
	{ field: 'acidFastBacilliTb', label: 'Acid-fast bacilli (AFB / TB)' },
	{ field: 'fungalCulture', label: 'Fungal culture' },
	{ field: 'pcrMolecular', label: 'PCR / molecular' },
	{ field: 'cDifficileToxin', label: 'C. difficile toxin' },
	{ field: 'mrsaScreen', label: 'MRSA screen' }
];

/** Count how many test booleans are set in the tests sub-object. */
export function countSelectedTests(tests: TestsSection): number {
	if (!tests) return 0;
	let n = 0;
	for (const t of TEST_FIELDS) {
		if (tests[t.field] === true) n++;
	}
	return n;
}

/** True when at least one requestable test boolean is set. */
export function anyTestSelected(tests: TestsSection): boolean {
	return countSelectedTests(tests) > 0;
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const SPECIMEN_TYPE_LABELS: Record<string, string> = {
	'blood-culture': 'Blood culture',
	urine: 'Urine',
	'wound-swab': 'Wound swab',
	sputum: 'Sputum',
	'throat-swab': 'Throat swab',
	stool: 'Stool',
	csf: 'CSF',
	tissue: 'Tissue',
	'catheter-tip': 'Catheter tip',
	'genital-swab': 'Genital swab',
	other: 'Other'
};

/** Human-readable label for a specimen type, falling back to the raw value. */
export function specimenTypeLabel(value: SpecimenType | string): string {
	return SPECIMEN_TYPE_LABELS[value] || value || 'Unspecified';
}

const INDICATION_LABELS: Record<string, string> = {
	'suspected-sepsis': 'Suspected sepsis',
	'urinary-tract-infection': 'Urinary-tract infection',
	'wound-infection': 'Wound infection',
	'respiratory-infection': 'Respiratory infection',
	gastroenteritis: 'Gastroenteritis',
	meningitis: 'Meningitis',
	'sti-screen': 'STI screen',
	'pyrexia-unknown-origin': 'Pyrexia of unknown origin',
	'infection-screening': 'Infection screening',
	other: 'Other'
};

/** Human-readable label for a primary indication, falling back to raw value. */
export function indicationLabel(value: PrimaryIndication | string): string {
	return INDICATION_LABELS[value] || value || 'Unspecified';
}

/** Requested-urgency display label. */
export function urgencyLabel(value: Urgency | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'stat':
			return 'Stat';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness display label. */
export function appropriatenessLabel(value: string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'Usually appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'usually-not-appropriate':
			return 'Usually not appropriate';
		default:
			return 'Not graded';
	}
}

/** Axis B pre-analytical display label. */
export function preanalyticalLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'reject-risk':
			return 'Reject risk';
		default:
			return 'Not graded';
	}
}

/** Axis D triage-tier display label. */
export function triageTierLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'stat':
			return 'Stat';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'accept':
			return 'Accept and process';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily token utility classes)
// ──────────────────────────────────────────────

/** Axis A appropriateness badge colour. */
export function appropriatenessColor(value: AppropriatenessBand | string): string {
	switch (value) {
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

/** Axis B pre-analytical badge colour. */
export function preanalyticalColor(value: PreanalyticalBand | string): string {
	switch (value) {
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

/** Axis D triage-tier badge colour. */
export function triageTierColor(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		case 'stat':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation badge colour. */
export function recommendationColor(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-info text-info-content border-info';
		case 'redirect':
			return 'bg-warning text-warning-content border-warning';
		case 'reject':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
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
