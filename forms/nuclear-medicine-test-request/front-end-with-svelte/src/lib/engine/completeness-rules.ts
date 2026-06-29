import type { CardiologyRequest, FiredRule } from './types';

/** A mandatory request field, used to compute Axis C completeness. */
interface FieldCheck {
	ruleId: string;
	category: string;
	label: string;
	weight: number;
	present: (r: CardiologyRequest) => boolean;
}

/**
 * The mandatory request fields, with the referral reason and clinical question
 * weighted highest (they are essential to vet a referral). Completeness is the
 * weighted percentage of fields supplied.
 */
const fields: FieldCheck[] = [
	{
		ruleId: 'R-COMP-REASON-01',
		category: 'reason',
		label: 'referral reason',
		weight: 3,
		present: (r) => r.referralReason !== ''
	},
	{
		ruleId: 'R-COMP-QUESTION-01',
		category: 'clinical-question',
		label: 'clinical question',
		weight: 3,
		present: (r) => r.clinicalQuestion.trim() !== ''
	},
	{
		ruleId: 'R-COMP-SERVICE-01',
		category: 'requested-service',
		label: 'requested service',
		weight: 2,
		present: (r) => r.requestedService !== ''
	},
	{
		ruleId: 'R-COMP-PATIENT-01',
		category: 'patient-identification',
		label: 'patient identification (NHS number)',
		weight: 2,
		present: (r) => r.nhsNumber.trim() !== ''
	},
	{
		ruleId: 'R-COMP-CLINICIAN-01',
		category: 'referring-clinician',
		label: 'referring clinician',
		weight: 1,
		present: (r) => r.referringClinician.trim() !== ''
	},
	{
		ruleId: 'R-COMP-HISTORY-01',
		category: 'relevant-history',
		label: 'relevant history',
		weight: 1,
		present: (r) => r.relevantHistory.trim() !== ''
	},
	{
		ruleId: 'R-COMP-ECG-01',
		category: 'investigations',
		label: 'resting ECG',
		weight: 1,
		present: (r) => r.ecgDone
	},
	{
		ruleId: 'R-COMP-CONTACT-01',
		category: 'referrer-contact',
		label: 'referrer contact details',
		weight: 1,
		present: (r) => r.requesterContact.trim() !== ''
	}
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory request fields
 * that are present, plus an audit-trail rule for each missing field.
 */
export function gradeCompleteness(r: CardiologyRequest): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
	let presentWeight = 0;

	for (const field of fields) {
		if (field.present(r)) {
			presentWeight += field.weight;
		} else {
			firedRules.push({
				ruleId: field.ruleId,
				axis: 'completeness',
				category: field.category,
				description: `Mandatory field missing: ${field.label}.`
			});
		}
	}

	const completenessPercent = Math.round((presentWeight / totalWeight) * 100);
	return { completenessPercent, firedRules };
}
