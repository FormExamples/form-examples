import type { UrinalysisRequest, FiredRule } from './types';
import { selectedTestFields } from './appropriateness-rules';

/** A tracked request field, used to compute Axis C completeness. */
interface FieldCheck {
	weight: number;
	present: (r: UrinalysisRequest) => boolean;
	ruleId: string;
	label: string;
}

/**
 * The tracked request fields, with the primary indication and clinical details
 * weighted highest (they drive every other axis). Completeness is the weighted
 * percentage of fields supplied.
 */
const COMPLETENESS_FIELDS: FieldCheck[] = [
	{ weight: 3, present: (d) => !!d.context.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{
		weight: 3,
		present: (d) => !!d.context.clinicalDetails && d.context.clinicalDetails.trim() !== '',
		ruleId: 'R-COMPLETE-CLINICAL-DETAILS',
		label: 'clinical details'
	},
	{ weight: 2, present: (d) => selectedTestFields(d).length > 0, ruleId: 'R-COMPLETE-TESTS', label: 'requested tests' },
	{ weight: 2, present: (d) => !!d.specimen.specimenType, ruleId: 'R-COMPLETE-SPECIMEN-TYPE', label: 'specimen type' },
	{
		weight: 1,
		present: (d) => !!d.patient.firstName && !!d.patient.lastName,
		ruleId: 'R-COMPLETE-PATIENT-NAME',
		label: 'patient name'
	},
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of tracked request fields
 * present, plus an audit-trail rule for each missing field.
 */
export function gradeCompleteness(r: UrinalysisRequest): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
	let totalWeight = 0;
	let presentWeight = 0;
	const firedRules: FiredRule[] = [];

	for (const f of COMPLETENESS_FIELDS) {
		totalWeight += f.weight;
		if (f.present(r)) {
			presentWeight += f.weight;
		} else {
			firedRules.push({
				ruleId: f.ruleId,
				axis: 'completeness',
				category: 'missing-field',
				description: `Missing ${f.label}.`
			});
		}
	}

	const completenessPercent = totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
	return { completenessPercent, firedRules };
}
