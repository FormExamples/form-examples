import type { PulmonaryFunctionTestRequest, FiredRule } from './types';

/** A tracked mandatory field, used to compute Axis C completeness. */
interface FieldCheck {
	ruleId: string;
	label: string;
	weight: number;
	present: (r: PulmonaryFunctionTestRequest) => boolean;
}

function heightPresent(r: PulmonaryFunctionTestRequest): boolean {
	return r.patient.heightCm !== null && r.patient.heightCm !== undefined;
}

function weightPresent(r: PulmonaryFunctionTestRequest): boolean {
	return r.patient.weightKg !== null && r.patient.weightKg !== undefined;
}

/**
 * The tracked request fields, with the indication and clinical question
 * weighted highest because they drive every other axis. Completeness is the
 * weighted percentage of points present.
 */
const fields: FieldCheck[] = [
	{ ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication', weight: 3, present: (r) => !!r.request.primaryIndication },
	{ ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question', weight: 3, present: (r) => r.request.clinicalQuestion.trim() !== '' },
	{ ruleId: 'R-COMPLETE-TEST-TYPE', label: 'requested test type', weight: 2, present: (r) => !!r.request.testType },
	{ ruleId: 'R-COMPLETE-SMOKING-STATUS', label: 'smoking status', weight: 2, present: (r) => !!r.background.smokingStatus },
	{ ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name', weight: 1, present: (r) => !!r.patient.firstName && !!r.patient.lastName },
	{ ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number', weight: 1, present: (r) => !!r.patient.nhsNumber },
	{ ruleId: 'R-COMPLETE-DOB', label: 'date of birth', weight: 1, present: (r) => !!r.patient.dateOfBirth },
	{ ruleId: 'R-COMPLETE-ANTHROPOMETRY', label: 'height and weight', weight: 1, present: (r) => heightPresent(r) && weightPresent(r) },
	{ ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician', weight: 1, present: (r) => !!r.clinician.clinicianName },
	{ ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date', weight: 1, present: (r) => !!r.clinician.referralDate },
	{ ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency', weight: 1, present: (r) => !!r.triage.urgency }
];

/**
 * Axis C — request completeness. Returns the weighted percentage (0–100,
 * rounded) of tracked fields present, plus an audit-trail rule for each
 * missing field.
 */
export function gradeCompleteness(r: PulmonaryFunctionTestRequest): {
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
				category: 'missing-field',
				description: `Missing ${field.label}.`
			});
		}
	}

	const completenessPercent = totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
	return { completenessPercent, firedRules };
}
