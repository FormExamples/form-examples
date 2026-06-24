import type {
	BloodTestResult,
	ResultClassification,
	AbnormalitySeverity,
	FollowUpUrgency,
	OverallResultStatus,
	ReportStatus,
	SpecimenType,
	SpecimenCondition
} from './types';

// ──────────────────────────────────────────────
// Interpretation-summary predicates
// ──────────────────────────────────────────────

/**
 * A critical (panic) value auto-escalates Axis A to critical and Axis D to
 * critical-alert. Driven by the reporter-supplied summary flag (and an overall
 * status of critical). Mirrors the back-end invariant.
 */
export function hasCriticalValue(r: BloodTestResult): boolean {
	return r.criticalValuePresent || r.overallResultStatus === 'critical';
}

/** Whether any analyte result is flagged abnormal (but not critical). */
export function hasAbnormalResult(r: BloodTestResult): boolean {
	return r.abnormalResultsPresent || r.overallResultStatus === 'abnormal';
}

/** The full set of analyte result values, in panel order, with display metadata. */
export interface AnalyteValue {
	key: keyof BloodTestResult;
	label: string;
	panel: string;
	units: string;
	value: number | null;
}

/** Returns the analyte result values for a result, in panel order. */
export function analyteValues(r: BloodTestResult): AnalyteValue[] {
	return [
		{ key: 'haemoglobinGL', label: 'Haemoglobin', panel: 'Full blood count', units: 'g/L', value: r.haemoglobinGL },
		{ key: 'whiteCellCount', label: 'White cell count', panel: 'Full blood count', units: '×10⁹/L', value: r.whiteCellCount },
		{ key: 'platelets', label: 'Platelets', panel: 'Full blood count', units: '×10⁹/L', value: r.platelets },
		{ key: 'neutrophils', label: 'Neutrophils', panel: 'Full blood count', units: '×10⁹/L', value: r.neutrophils },
		{ key: 'sodiumMmolL', label: 'Sodium', panel: 'Urea & electrolytes / renal', units: 'mmol/L', value: r.sodiumMmolL },
		{ key: 'potassiumMmolL', label: 'Potassium', panel: 'Urea & electrolytes / renal', units: 'mmol/L', value: r.potassiumMmolL },
		{ key: 'ureaMmolL', label: 'Urea', panel: 'Urea & electrolytes / renal', units: 'mmol/L', value: r.ureaMmolL },
		{ key: 'creatinineUmolL', label: 'Creatinine', panel: 'Urea & electrolytes / renal', units: 'µmol/L', value: r.creatinineUmolL },
		{ key: 'egfr', label: 'eGFR', panel: 'Urea & electrolytes / renal', units: 'mL/min/1.73m²', value: r.egfr },
		{ key: 'altUL', label: 'ALT', panel: 'Liver function', units: 'U/L', value: r.altUL },
		{ key: 'alkalinePhosphatase', label: 'Alkaline phosphatase', panel: 'Liver function', units: 'U/L', value: r.alkalinePhosphatase },
		{ key: 'bilirubinUmolL', label: 'Bilirubin', panel: 'Liver function', units: 'µmol/L', value: r.bilirubinUmolL },
		{ key: 'albuminGL', label: 'Albumin', panel: 'Liver function', units: 'g/L', value: r.albuminGL },
		{ key: 'cReactiveProtein', label: 'C-reactive protein', panel: 'Inflammation', units: 'mg/L', value: r.cReactiveProtein },
		{ key: 'hba1cMmolMol', label: 'HbA1c', panel: 'Glycaemic', units: 'mmol/mol', value: r.hba1cMmolMol },
		{ key: 'glucoseMmolL', label: 'Glucose', panel: 'Glycaemic', units: 'mmol/L', value: r.glucoseMmolL },
		{ key: 'tsh', label: 'TSH', panel: 'Endocrine', units: 'mU/L', value: r.tsh },
		{ key: 'ferritin', label: 'Ferritin', panel: 'Haematinics', units: 'µg/L', value: r.ferritin },
		{ key: 'inr', label: 'INR', panel: 'Coagulation', units: 'ratio', value: r.inr }
	];
}

/** Whether at least one analyte result value was measured (non-null). */
export function hasAnyResultValue(r: BloodTestResult): boolean {
	return analyteValues(r).some((a) => a.value !== null);
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

/** Human-readable specimen-type label. */
export function specimenTypeLabel(value: SpecimenType | string): string {
	switch (value) {
		case 'serum':
			return 'Serum';
		case 'plasma':
			return 'Plasma';
		case 'whole-blood':
			return 'Whole blood';
		default:
			return 'Unspecified';
	}
}

/** Human-readable specimen-condition label. */
export function specimenConditionLabel(value: SpecimenCondition | string): string {
	switch (value) {
		case 'satisfactory':
			return 'Satisfactory';
		case 'haemolysed':
			return 'Haemolysed';
		case 'lipaemic':
			return 'Lipaemic';
		case 'clotted':
			return 'Clotted';
		case 'insufficient':
			return 'Insufficient';
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

/** Overall-result-status badge colour. */
export function overallResultStatusColor(value: OverallResultStatus | string): string {
	switch (value) {
		case 'normal':
			return 'bg-green-100 text-green-800 border-green-300';
		case 'abnormal':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		case 'critical':
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
