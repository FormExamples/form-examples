import type { EndoscopyRequest, FiredRule } from './types';

// ----------------------------------------------------------------------
// Axis C — Request completeness (mandatory-field checklist)
// ----------------------------------------------------------------------
//
// Each tracked field carries a weight. Indication and clinical question are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present. Rule IDs are stable (R-COMPLETE-*).

// FIT is only "missing" for lower-GI indications where DG56 applies.
const LOWER_GI_INDICATIONS = [
	'rectal-bleeding',
	'change-in-bowel-habit',
	'positive-fit',
	'ibd-surveillance',
	'polyp-surveillance'
];

function fitPresentForLowerGi(d: EndoscopyRequest): boolean {
	if (!LOWER_GI_INDICATIONS.includes(d.request.primaryIndication)) return true;
	return d.redFlags.fitResultUgG !== null && d.redFlags.fitResultUgG !== undefined;
}

interface FieldCheck {
	weight: number;
	present: (d: EndoscopyRequest) => boolean;
	ruleId: string;
	label: string;
}

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
		present: (d) => !!d.request.requestedProcedure,
		ruleId: 'R-COMPLETE-PROCEDURE',
		label: 'requested procedure'
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
		present: (d) => !!d.triage.urgency,
		ruleId: 'R-COMPLETE-URGENCY',
		label: 'requested urgency'
	},
	{
		weight: 1,
		present: (d) => fitPresentForLowerGi(d),
		ruleId: 'R-COMPLETE-FIT',
		label: 'FIT result (for lower-GI indications)'
	}
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory request fields
 * that are present, plus an audit-trail rule for each missing field.
 */
export function gradeCompleteness(r: EndoscopyRequest): {
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

export { LOWER_GI_INDICATIONS };
