import type { FluoroscopyRequest, FiredRule } from './types';

/** A mandatory request field, used to compute Axis C completeness. */
interface FieldCheck {
	weight: number;
	present: (d: FluoroscopyRequest) => boolean;
	ruleId: string;
	label: string;
}

/**
 * The tracked request fields, with the indication and clinical question weighted
 * highest because they drive every other axis. Completeness is the weighted
 * percentage of points present.
 */
const COMPLETENESS_FIELDS: FieldCheck[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{
		weight: 3,
		present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '',
		ruleId: 'R-COMPLETE-CLINICAL-QUESTION',
		label: 'clinical question'
	},
	{ weight: 2, present: (d) => !!d.request.studyType, ruleId: 'R-COMPLETE-STUDY-TYPE', label: 'requested study type' },
	{ weight: 2, present: (d) => !!d.safety.pregnancyStatus, ruleId: 'R-COMPLETE-PREGNANCY-STATUS', label: 'pregnancy status' },
	{
		weight: 1,
		present: (d) => !!d.safety.irMeRJustification && d.safety.irMeRJustification.trim() !== '',
		ruleId: 'R-COMPLETE-IRMER-JUSTIFICATION',
		label: 'IR(ME)R justification'
	},
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
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
export function scoreCompleteness(data: FluoroscopyRequest): {
	percent: number;
	missing: FiredRule[];
} {
	let totalWeight = 0;
	let presentWeight = 0;
	const missing: FiredRule[] = [];
	for (const f of COMPLETENESS_FIELDS) {
		totalWeight += f.weight;
		if (f.present(data)) {
			presentWeight += f.weight;
		} else {
			missing.push({
				ruleId: f.ruleId,
				axis: 'completeness',
				category: 'missing-field',
				description: `Missing ${f.label}.`
			});
		}
	}
	const percent = totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
	return { percent, missing };
}
