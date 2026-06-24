import type {
	CoagulationResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	OverallResultStatus,
	ReportStatus
} from './types';

// ──────────────────────────────────────────────
// Critical-value and abnormality predicates
// ──────────────────────────────────────────────

/**
 * Whether the reported result values breach a recognised critical threshold:
 * - INR > 8 (BSH oral-anticoagulation reversal threshold), or
 * - fibrinogen < 1.0 g/L (major-haemorrhage / DIC marker), or
 * - a DIC picture (low fibrinogen + raised D-dimer + prolonged PT or APTT).
 *
 * Mirrors the back-end invariant. A breach auto-escalates Axis D to
 * critical-alert regardless of the other axes.
 */
export function hasCriticalValue(r: CoagulationResult): boolean {
	return (
		r.criticalValuePresent ||
		r.overallResultStatus === 'critical' ||
		(r.inr !== null && r.inr > 8) ||
		(r.fibrinogenGL !== null && r.fibrinogenGL < 1.0) ||
		hasDicPicture(r)
	);
}

/**
 * A disseminated-intravascular-coagulation (DIC) picture: low fibrinogen plus a
 * raised D-dimer plus a prolonged PT or APTT, indicating a consumptive
 * coagulopathy.
 */
export function hasDicPicture(r: CoagulationResult): boolean {
	const lowFibrinogen = r.fibrinogenGL !== null && r.fibrinogenGL < 1.5;
	const highDDimer = r.dDimer !== null && r.dDimer >= 500;
	const prolongedPt = r.prothrombinTimeSeconds !== null && r.prothrombinTimeSeconds > 14;
	const prolongedAptt =
		r.activatedPartialThromboplastinTimeSeconds !== null &&
		r.activatedPartialThromboplastinTimeSeconds > 40;
	return lowFibrinogen && highDDimer && (prolongedPt || prolongedAptt);
}

/** Whether any reported result value is outside its adult reference range. */
export function hasAnyAbnormalValue(r: CoagulationResult): boolean {
	return (
		(r.prothrombinTimeSeconds !== null && r.prothrombinTimeSeconds > 14) ||
		(r.inr !== null && r.inr > 1.2) ||
		(r.activatedPartialThromboplastinTimeSeconds !== null &&
			r.activatedPartialThromboplastinTimeSeconds > 40) ||
		(r.apttRatio !== null && r.apttRatio > 1.2) ||
		(r.fibrinogenGL !== null && (r.fibrinogenGL < 2.0 || r.fibrinogenGL > 4.0)) ||
		(r.dDimer !== null && r.dDimer >= 500) ||
		(r.thrombinTimeSeconds !== null && r.thrombinTimeSeconds > 20)
	);
}

/** Whether an isolated APTT prolongation is present (APTT high but PT/INR normal). */
export function hasIsolatedApttProlongation(r: CoagulationResult): boolean {
	const apttProlonged =
		(r.activatedPartialThromboplastinTimeSeconds !== null &&
			r.activatedPartialThromboplastinTimeSeconds > 40) ||
		(r.apttRatio !== null && r.apttRatio > 1.2);
	const ptNormal =
		(r.prothrombinTimeSeconds === null || r.prothrombinTimeSeconds <= 14) &&
		(r.inr === null || r.inr <= 1.2);
	return apttProlonged && ptNormal;
}

/** Whether at least one numeric result value has been recorded. */
export function hasAnyResultValue(r: CoagulationResult): boolean {
	return (
		r.prothrombinTimeSeconds !== null ||
		r.inr !== null ||
		r.activatedPartialThromboplastinTimeSeconds !== null ||
		r.apttRatio !== null ||
		r.fibrinogenGL !== null ||
		r.dDimer !== null ||
		r.thrombinTimeSeconds !== null ||
		r.factorAssays.trim() !== ''
	);
}

/** Whether the specimen condition compromises interpretation. */
export function hasSpecimenQualityIssue(r: CoagulationResult): boolean {
	return (
		r.specimenCondition === 'clotted' ||
		r.specimenCondition === 'underfilled' ||
		r.specimenCondition === 'haemolysed' ||
		r.specimenCondition === 'insufficient'
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

/** Human-readable overall-result-status label. */
export function overallResultStatusLabel(value: OverallResultStatus | string): string {
	switch (value) {
		case 'normal':
			return 'Normal';
		case 'abnormal':
			return 'Abnormal';
		case 'critical':
			return 'Critical';
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
