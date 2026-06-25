import type {
	LumbarPunctureResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	CsfAppearance,
	TestResult,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * Whether the CSF culture grew an organism (a positive culture is a critical
 * result). A free-text culture is treated as positive when it is non-empty and
 * does not match a recognised negative phrase ("no growth", "negative",
 * "sterile", "no organisms").
 */
export function culturePositive(r: LumbarPunctureResult): boolean {
	const text = r.cultureResult.trim().toLowerCase();
	if (text === '') return false;
	const negativePhrases = ['no growth', 'negative', 'sterile', 'no organism', 'not grown', 'awaited', 'pending'];
	return !negativePhrases.some((p) => text.includes(p));
}

/**
 * A critical CSF result — a bacterial meningitis pattern, a suggested
 * subarachnoid haemorrhage, or a positive culture — auto-escalates Axis D to
 * critical-alert. Mirrors the back-end invariant.
 */
export function hasCriticalFinding(r: LumbarPunctureResult): boolean {
	return (
		r.bacterialMeningitisPattern ||
		r.subarachnoidHaemorrhageSuggested ||
		culturePositive(r)
	);
}

/** Whether any structured abnormal finding / pattern is present. */
export function hasAnyAbnormalFinding(r: LumbarPunctureResult): boolean {
	return (
		r.raisedProtein ||
		r.pleocytosis ||
		r.lowGlucose ||
		r.bacterialMeningitisPattern ||
		r.viralPattern ||
		r.subarachnoidHaemorrhageSuggested ||
		r.oligoclonalBands === 'positive' ||
		r.xanthochromia === 'positive' ||
		culturePositive(r)
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

/** Human-readable CSF-appearance label. */
export function csfAppearanceLabel(value: CsfAppearance | string): string {
	switch (value) {
		case 'clear':
			return 'Clear';
		case 'cloudy':
			return 'Cloudy';
		case 'turbid':
			return 'Turbid';
		case 'blood-stained':
			return 'Blood-stained';
		case 'xanthochromic':
			return 'Xanthochromic';
		default:
			return 'Unspecified';
	}
}

/** Human-readable specialist-test (tri-state) label. */
export function testResultLabel(value: TestResult | string): string {
	switch (value) {
		case 'positive':
			return 'Positive';
		case 'negative':
			return 'Negative';
		case 'not-tested':
			return 'Not tested';
		default:
			return 'Unspecified';
	}
}

/** Human-readable reporting-category label (structured CSF pattern). */
export function reportingCategoryLabel(value: string): string {
	switch (value) {
		case 'bacterial-pattern':
			return 'Bacterial pattern';
		case 'viral-pattern':
			return 'Viral / aseptic pattern';
		case 'SAH-pattern':
			return 'SAH pattern';
		case 'inflammatory-demyelinating':
			return 'Inflammatory / demyelinating';
		case 'raised-protein':
			return 'Raised protein';
		case 'pleocytosis':
			return 'Pleocytosis';
		case 'normal':
			return 'Normal';
		case 'indeterminate':
			return 'Indeterminate';
		case '':
			return 'Unspecified';
		default:
			return value;
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
