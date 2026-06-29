import type { BronchoscopyRequest, FiredRule } from './types';

/** A mandatory request field, used to compute Axis C completeness. */
interface FieldCheck {
	ruleId: string;
	label: string;
	weight: number;
	present: (d: BronchoscopyRequest) => boolean;
}

/**
 * The tracked mandatory fields. Indication and clinical question are weighted
 * highest because they drive every other axis. Completeness is the weighted
 * percentage of fields supplied.
 */
const COMPLETENESS_FIELDS: FieldCheck[] = [
	{
		weight: 3,
		present: (d) => !!d.request.primaryIndication,
		ruleId: 'R-COMPLETE-INDICATION',
		label: 'primary indication'
	},
	{
		weight: 3,
		present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '',
		ruleId: 'R-COMPLETE-CLINICAL-QUESTION',
		label: 'clinical question'
	},
	{
		weight: 2,
		present: (d) => !!d.request.procedure,
		ruleId: 'R-COMPLETE-PROCEDURE',
		label: 'requested procedure'
	},
	{
		weight: 2,
		present: (d) => !!d.symptoms.imagingFindings && d.symptoms.imagingFindings.trim() !== '',
		ruleId: 'R-COMPLETE-IMAGING',
		label: 'imaging findings'
	},
	{
		weight: 1,
		present: (d) => !!d.patient.firstName && !!d.patient.lastName,
		ruleId: 'R-COMPLETE-PATIENT-NAME',
		label: 'patient name'
	},
	{
		weight: 1,
		present: (d) => !!d.patient.nhsNumber,
		ruleId: 'R-COMPLETE-NHS-NUMBER',
		label: 'NHS number'
	},
	{
		weight: 1,
		present: (d) => !!d.patient.dateOfBirth,
		ruleId: 'R-COMPLETE-DOB',
		label: 'date of birth'
	},
	{
		weight: 1,
		present: (d) => !!d.clinician.clinicianName,
		ruleId: 'R-COMPLETE-CLINICIAN',
		label: 'requesting clinician'
	},
	{
		weight: 1,
		present: (d) => !!d.clinician.referralDate,
		ruleId: 'R-COMPLETE-REFERRAL-DATE',
		label: 'referral date'
	},
	{
		weight: 1,
		present: (d) => !!d.procedural.asaGrade,
		ruleId: 'R-COMPLETE-ASA',
		label: 'ASA grade'
	},
	{
		weight: 1,
		present: (d) => !!d.triage.urgency,
		ruleId: 'R-COMPLETE-URGENCY',
		label: 'requested urgency'
	}
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory request fields
 * that are present, plus an audit-trail rule for each missing field.
 */
export function gradeCompleteness(d: BronchoscopyRequest): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
	let totalWeight = 0;
	let presentWeight = 0;
	const firedRules: FiredRule[] = [];

	for (const f of COMPLETENESS_FIELDS) {
		totalWeight += f.weight;
		if (f.present(d)) {
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

	const completenessPercent =
		totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
	return { completenessPercent, firedRules };
}
