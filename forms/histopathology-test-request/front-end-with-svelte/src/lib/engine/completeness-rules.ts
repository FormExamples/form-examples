import type { HistopathologyRequest, FiredRule } from './types';

/** A mandatory request field, used to compute Axis C completeness. */
interface FieldCheck {
	weight: number;
	present: (d: HistopathologyRequest) => boolean;
	ruleId: string;
	label: string;
}

/**
 * The tracked mandatory fields, with the indication and clinical question
 * weighted highest because they drive every other axis. Completeness is the
 * weighted percentage of points present.
 */
const COMPLETENESS_FIELDS: FieldCheck[] = [
	{ weight: 3, present: (d) => !!d.indication.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.indication.clinicalQuestion && d.indication.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.specimen.specimenType, ruleId: 'R-COMPLETE-SPECIMEN-TYPE', label: 'specimen type' },
	{ weight: 2, present: (d) => !!d.specimen.specimenSite, ruleId: 'R-COMPLETE-SPECIMEN-SITE', label: 'anatomical site' },
	{ weight: 1, present: (d) => !!d.specimen.fixative, ruleId: 'R-COMPLETE-FIXATIVE', label: 'fixative' },
	{ weight: 1, present: (d) => !!d.indication.clinicalDetails && d.indication.clinicalDetails.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-DETAILS', label: 'clinical details' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.urgency.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory fields present,
 * plus an audit-trail rule for each missing field.
 */
export function scoreCompleteness(data: HistopathologyRequest): {
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
