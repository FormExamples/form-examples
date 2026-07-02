import type {
	AgeBand,
	AssessmentReason,
	CareSetting,
	NurseRole,
	Priority,
	RiskBand,
	Sex
} from './types';

/** A selectable option: value + display label. Scored options carry their point weight. */
export interface FieldOption {
	value: string;
	label: string;
}

/**
 * Per-field option lists (value + display label). Scored options carry their
 * point weight in the label so the weighting is visible in the wizard. Shared
 * by the wizard selects/radios and by `optionLabel()` for report rendering.
 */
export const options: Record<string, FieldOption[]> = {
	nurseRole: [
		{ value: 'registered-nurse', label: 'Registered nurse' },
		{ value: 'healthcare-assistant', label: 'Healthcare assistant' },
		{ value: 'tissue-viability', label: 'Tissue-viability specialist' },
		{ value: 'other', label: 'Other' }
	],
	careSetting: [
		{ value: 'acute-ward', label: 'Acute ward' },
		{ value: 'community', label: 'Community' },
		{ value: 'care-home', label: 'Care home' },
		{ value: 'hospice', label: 'Hospice' },
		{ value: 'other', label: 'Other' }
	],
	assessmentReason: [
		{ value: 'admission', label: 'Admission' },
		{ value: 'routine', label: 'Routine reassessment' },
		{ value: 'change-in-condition', label: 'Change in condition' }
	],
	ageBand: [
		{ value: '14-49', label: '14-49 (1 point)' },
		{ value: '50-64', label: '50-64 (2 points)' },
		{ value: '65-74', label: '65-74 (3 points)' },
		{ value: '75-80', label: '75-80 (4 points)' },
		{ value: '81-plus', label: '81 and over (5 points)' }
	],
	sex: [
		{ value: 'male', label: 'Male (1 point)' },
		{ value: 'female', label: 'Female (2 points)' }
	],
	buildWeightForHeight: [
		{ value: 'average', label: 'Average — BMI 20-24.9 (0 points)' },
		{ value: 'above-average', label: 'Above average — BMI 25-29.9 (1 point)' },
		{ value: 'obese', label: 'Obese — BMI 30 or over (2 points)' },
		{ value: 'below-average', label: 'Below average — BMI under 20 (3 points)' }
	],
	skinType: [
		{ value: 'healthy', label: 'Healthy (0 points)' },
		{ value: 'tissue-paper', label: 'Tissue paper — thin / fragile (1 point)' },
		{ value: 'dry', label: 'Dry (1 point)' },
		{ value: 'oedematous', label: 'Oedematous (1 point)' },
		{ value: 'clammy-pyrexial', label: 'Clammy / pyrexial (1 point)' },
		{ value: 'discoloured', label: 'Discoloured — category 1 (2 points)' },
		{ value: 'broken', label: 'Broken / spot — category 2-4 (3 points)' }
	],
	continence: [
		{ value: 'complete-catheterised', label: 'Complete / catheterised (0 points)' },
		{ value: 'incontinent-urine', label: 'Incontinent of urine (1 point)' },
		{ value: 'incontinent-faeces', label: 'Incontinent of faeces (2 points)' },
		{ value: 'doubly-incontinent', label: 'Doubly incontinent (3 points)' }
	],
	mobility: [
		{ value: 'fully-mobile', label: 'Fully mobile (0 points)' },
		{ value: 'restless', label: 'Restless / fidgety (1 point)' },
		{ value: 'apathetic', label: 'Apathetic (2 points)' },
		{ value: 'restricted', label: 'Restricted (3 points)' },
		{ value: 'bedbound', label: 'Bedbound — e.g. traction (4 points)' },
		{ value: 'chairbound', label: 'Chairbound — e.g. wheelchair (5 points)' }
	],
	tissueMalnutrition: [
		{ value: 'none', label: 'None (0 points)' },
		{ value: 'smoking', label: 'Smoking (1 point)' },
		{ value: 'anaemia', label: 'Anaemia — Hb under 8 g/dL (2 points)' },
		{ value: 'peripheral-vascular-disease', label: 'Peripheral vascular disease (5 points)' },
		{
			value: 'single-organ-failure',
			label: 'Single organ failure — cardiac, renal, respiratory (5 points)'
		},
		{ value: 'multiple-organ-failure', label: 'Multiple organ failure (8 points)' },
		{ value: 'terminal-cachexia', label: 'Terminal cachexia (8 points)' }
	],
	neurologicalDeficit: [
		{ value: 'none', label: 'None (0 points)' },
		{ value: 'mild', label: 'Mild deficit (4 points)' },
		{ value: 'moderate', label: 'Moderate deficit (5 points)' },
		{ value: 'severe', label: 'Severe deficit (6 points)' }
	],
	majorSurgeryTrauma: [
		{ value: 'none', label: 'None (0 points)' },
		{ value: 'orthopaedic-spinal', label: 'Orthopaedic / spinal, below waist (5 points)' },
		{ value: 'on-table-over-2h', label: 'On table over 2 hours (5 points)' },
		{ value: 'on-table-over-6h', label: 'On table over 6 hours (8 points)' }
	],
	medication: [
		{ value: 'none', label: 'None (0 points)' },
		{
			value: 'high-dose-steroids-cytotoxics-anti-inflammatory',
			label: 'High-dose steroids / cytotoxics / anti-inflammatory (4 points)'
		}
	],
	existingPressureDamage: [
		{ value: 'no', label: 'No' },
		{ value: 'yes', label: 'Yes' }
	]
};

/**
 * Look up an option's display label for a field/value pair. Falls back to the
 * raw value when no option matches (e.g. a legacy stored value).
 */
export function optionLabel(field: string, value: string): string {
	const list = options[field];
	if (!list || value === '' || value == null) return '';
	const found = list.find((o) => o.value === value);
	return found ? found.label : String(value);
}

/** Risk-band label for display. */
export function riskBandLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Low risk (Waterlow under 10)';
		case 'at-risk':
			return 'At risk (Waterlow 10-14)';
		case 'high':
			return 'High risk (Waterlow 15-19)';
		case 'very-high':
			return 'Very high risk (Waterlow 20 or more)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-band badge/banner.
 * Low → success; at-risk → info; high → warning; very-high → error.
 */
export function riskBandColor(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'at-risk':
			return 'bg-info text-info-content border-info';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'very-high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a contributing-category points pill. */
export function pointsColor(points: number): string {
	return points > 0
		? 'bg-warning text-warning-content border-warning'
		: 'bg-base-300 text-base-content border-base-300';
}

/** Recommended prevention action for a risk band (spec §4). */
export function preventionActionLabel(band: RiskBand): string {
	switch (band) {
		case 'low':
			return 'Routine skin inspection; reassess if the patient’s condition changes.';
		case 'at-risk':
			return 'Introduce a pressure-redistributing foam mattress and cushion; document a repositioning schedule; review nutrition and continence.';
		case 'high':
			return 'Escalate to an alternating-pressure / dynamic support surface; increase repositioning frequency; refer to tissue viability; formal skin-care plan.';
		case 'very-high':
			return 'High-specification dynamic mattress; frequent repositioning; urgent tissue-viability review; treat reversible factors (nutrition, moisture, perfusion).';
		default:
			return '';
	}
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
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

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'HIGH';
		case 'medium':
			return 'MEDIUM';
		case 'low':
			return 'LOW';
		default:
			return '';
	}
}

/** Assessing-nurse role label. */
export function nurseRoleLabel(role: NurseRole): string {
	return optionLabel('nurseRole', role);
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	return optionLabel('careSetting', setting);
}

/** Assessment-reason label. */
export function assessmentReasonLabel(reason: AssessmentReason): string {
	return optionLabel('assessmentReason', reason);
}

/** Age-band label. */
export function ageBandLabel(band: AgeBand): string {
	return optionLabel('ageBand', band);
}

/** Patient-sex label. */
export function sexLabel(sex: Sex): string {
	return optionLabel('sex', sex);
}
