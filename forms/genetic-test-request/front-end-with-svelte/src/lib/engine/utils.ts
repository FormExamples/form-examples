import type {
	GeneticTestRequest,
	TestType,
	PrimaryIndication,
	AppropriatenessBand,
	ConsentCounsellingBand,
	TriageTier,
	Recommendation
} from './types';

// ──────────────────────────────────────────────
// Clinical predicates
// ──────────────────────────────────────────────

/** True when the requested test is predictive / presymptomatic. */
export function isPredictiveTest(testType: string, indication: string): boolean {
	return testType === 'predictive-presymptomatic' || indication === 'predictive-family-history';
}

/** True when the request is prenatal. */
export function isPrenatalRequest(
	testType: string,
	indication: string,
	specimenType: string
): boolean {
	return (
		testType === 'prenatal' ||
		indication === 'prenatal-diagnosis' ||
		specimenType === 'prenatal'
	);
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Pretty label for a test type, falling back to the raw value. */
export function testTypeLabel(value: TestType | string): string {
	switch (value) {
		case 'diagnostic-single-gene':
			return 'Diagnostic single gene';
		case 'gene-panel':
			return 'Gene panel';
		case 'whole-exome':
			return 'Whole exome';
		case 'whole-genome':
			return 'Whole genome';
		case 'chromosomal-microarray':
			return 'Chromosomal microarray';
		case 'karyotype':
			return 'Karyotype';
		case 'predictive-presymptomatic':
			return 'Predictive / presymptomatic';
		case 'carrier-testing':
			return 'Carrier testing';
		case 'pharmacogenomic':
			return 'Pharmacogenomic';
		case 'prenatal':
			return 'Prenatal';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Pretty label for a primary indication, falling back to the raw value. */
export function indicationLabel(value: PrimaryIndication | string): string {
	switch (value) {
		case 'suspected-genetic-disorder':
			return 'Suspected genetic disorder';
		case 'familial-cancer':
			return 'Familial cancer';
		case 'developmental-delay':
			return 'Developmental delay';
		case 'congenital-anomaly':
			return 'Congenital anomaly';
		case 'cardiomyopathy-arrhythmia':
			return 'Cardiomyopathy / arrhythmia';
		case 'neuromuscular':
			return 'Neuromuscular';
		case 'predictive-family-history':
			return 'Predictive (family history)';
		case 'carrier-screening':
			return 'Carrier screening';
		case 'prenatal-diagnosis':
			return 'Prenatal diagnosis';
		case 'pharmacogenomics':
			return 'Pharmacogenomics';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness band display label. */
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

/** Axis B consent & counselling display label. */
export function consentLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'not-met':
			return 'Not met';
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
			return 'Query referrer';
		case 'redirect':
			return 'Redirect';
		case 'reject':
			return 'Reject — blocking issue';
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

/** Axis B consent & counselling badge colour. */
export function consentColor(value: ConsentCounsellingBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'not-met':
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

/** Patient full name from the nested patient section. */
export function patientName(r: GeneticTestRequest): string {
	return `${r.patient.firstName} ${r.patient.lastName}`.trim();
}
