import type { NerveConductionStudyRequest, FiredRule } from './types';

/** A tracked mandatory field, used to compute Axis C completeness. */
interface FieldCheck {
	ruleId: string;
	label: string;
	weight: number;
	present: (r: NerveConductionStudyRequest) => boolean;
}

/**
 * Axis C — Request completeness (mandatory-field checklist).
 *
 * Each tracked field carries a weight. Indication and clinical question are
 * weighted highest because they drive every other axis. Completeness is the
 * weighted percentage of points present. Rule IDs are stable across every
 * front-end and the back-end.
 */
const COMPLETENESS_FIELDS: FieldCheck[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.study.studyType, ruleId: 'R-COMPLETE-STUDY-TYPE', label: 'requested study type' },
	{ weight: 2, present: (d) => !!d.study.region, ruleId: 'R-COMPLETE-REGION', label: 'anatomical region' },
	{ weight: 1, present: (d) => !!d.study.laterality, ruleId: 'R-COMPLETE-LATERALITY', label: 'laterality' },
	{ weight: 1, present: (d) => !!d.symptoms.symptomDuration, ruleId: 'R-COMPLETE-SYMPTOM-DURATION', label: 'symptom duration' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/**
 * Compute weighted completeness 0–100 and an audit-trail rule for each missing
 * field.
 */
export function gradeCompleteness(r: NerveConductionStudyRequest): {
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

	const completenessPercent =
		totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
	return { completenessPercent, firedRules };
}
