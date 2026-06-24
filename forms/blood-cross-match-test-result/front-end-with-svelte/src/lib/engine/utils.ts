import type {
	BloodCrossMatchResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	RequestType,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical result auto-escalates Axis D to critical-alert and raises the
 * critical-result-alert plus discrepancy-with-request flags. Mirrors the
 * back-end invariant: an incompatible crossmatch, clinically-significant
 * antibodies (a positive antibody screen), an ABO discrepancy (historical-group
 * non-concordance), or an unmet two-sample group-check rule.
 */
export function hasCriticalResult(r: BloodCrossMatchResult): boolean {
	return (
		r.crossmatchResult === 'incompatible' ||
		r.antibodyScreenResult === 'positive' ||
		isAboDiscrepancy(r) ||
		isTwoSampleRuleUnmet(r)
	);
}

/** Whether an ABO discrepancy (historical-group non-concordance) is recorded. */
export function isAboDiscrepancy(r: BloodCrossMatchResult): boolean {
	return r.aboGroup !== '' && !r.historicalGroupConcordant;
}

/** Whether the two-sample (group-check) rule was not satisfied before issue. */
export function isTwoSampleRuleUnmet(r: BloodCrossMatchResult): boolean {
	// Only meaningful once grouping / crossmatch testing is under way.
	return !r.twoSampleRuleMet && (r.aboGroup !== '' || r.crossmatchResult !== '');
}

/** Whether any abnormal structured finding is present. */
export function hasAnyAbnormalFinding(r: BloodCrossMatchResult): boolean {
	return (
		r.crossmatchResult === 'incompatible' ||
		r.antibodyScreenResult === 'positive' ||
		isAboDiscrepancy(r) ||
		isTwoSampleRuleUnmet(r) ||
		insufficientUnits(r)
	);
}

/** Whether fewer compatible units are available than were crossmatched. */
export function insufficientUnits(r: BloodCrossMatchResult): boolean {
	return (
		r.unitsCrossmatched !== null &&
		r.unitsAvailable !== null &&
		r.unitsAvailable < r.unitsCrossmatched
	);
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Axis A result-classification display label. */
export function resultClassificationLabel(value: string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'abnormal':
			return 'Abnormal';
		case 'critical':
			return 'Critical';
		case 'inconclusive':
			return 'Inconclusive';
		default:
			return 'Not graded';
	}
}

/** Axis B abnormality-severity display label. */
export function abnormalitySeverityLabel(value: string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'minor':
			return 'Minor';
		case 'moderate':
			return 'Moderate';
		case 'major':
			return 'Major';
		default:
			return 'Not graded';
	}
}

/** Axis D follow-up-urgency display label. */
export function followUpUrgencyLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'recommended':
			return 'Recommended';
		case 'urgent':
			return 'Urgent';
		case 'critical-alert':
			return 'Critical alert';
		default:
			return 'Not graded';
	}
}

/** Human-readable request-type label. */
export function requestTypeLabel(value: RequestType | string): string {
	switch (value) {
		case 'group-and-save':
			return 'Group and save';
		case 'crossmatch':
			return 'Crossmatch';
		case 'antibody-screen':
			return 'Antibody screen';
		case 'emergency-issue':
			return 'Emergency issue';
		default:
			return 'Unspecified';
	}
}

/** Human-readable report-status label. */
export function reportStatusLabel(value: ReportStatus | string): string {
	switch (value) {
		case 'preliminary':
			return 'Preliminary';
		case 'final':
			return 'Final';
		case 'amended':
			return 'Amended';
		case 'cancelled':
			return 'Cancelled';
		default:
			return 'Unspecified';
	}
}

/** Human-readable ABO/RhD group label. */
export function bloodGroupLabel(abo: string, rhd: string): string {
	if (abo === '') return 'Not determined';
	const aboText = abo.toUpperCase();
	const rhdText = rhd === 'positive' ? ' RhD positive' : rhd === 'negative' ? ' RhD negative' : '';
	return `${aboText}${rhdText}`;
}

/** Human-readable component label. */
export function componentLabel(value: string): string {
	switch (value) {
		case 'red-cells':
			return 'Red cells';
		case 'platelets':
			return 'Platelets';
		case 'fresh-frozen-plasma':
			return 'Fresh frozen plasma';
		case 'cryoprecipitate':
			return 'Cryoprecipitate';
		case 'none':
			return 'None';
		default:
			return 'Unspecified';
	}
}

/** Human-readable crossmatch-result label. */
export function crossmatchResultLabel(value: string): string {
	switch (value) {
		case 'compatible':
			return 'Compatible';
		case 'incompatible':
			return 'Incompatible';
		case 'electronic-issue':
			return 'Electronic issue';
		case 'not-performed':
			return 'Not performed';
		default:
			return 'Unspecified';
	}
}

// ──────────────────────────────────────────────
// Display colours (Tailwind utility classes)
// ──────────────────────────────────────────────

/** Axis A result-classification badge colour. */
export function resultClassificationColor(value: ResultClassification | string): string {
	switch (value) {
		case 'normal':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'abnormal':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'critical':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'inconclusive':
			return 'bg-gray-100 text-gray-700 border-gray-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Axis B abnormality-severity badge colour. */
export function abnormalitySeverityColor(value: AbnormalitySeverity | string): string {
	switch (value) {
		case 'none':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'minor':
			return 'bg-blue-100 text-blue-800 border-blue-300';
		case 'moderate':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'major':
			return 'bg-red-100 text-red-800 border-red-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Axis D follow-up-urgency badge colour. */
export function followUpUrgencyColor(value: FollowUpUrgency | string): string {
	switch (value) {
		case 'routine':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'recommended':
			return 'bg-blue-100 text-blue-800 border-blue-300';
		case 'urgent':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'critical-alert':
			return 'bg-red-100 text-red-800 border-red-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
		case 'high':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'medium':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'low':
			return 'bg-gray-100 text-gray-700 border-gray-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}
