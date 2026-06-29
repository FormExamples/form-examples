import type { SleepStudyRequest, FiredRule } from './types';

/** A tracked mandatory field, used to compute Axis C completeness. */
interface FieldCheck {
	ruleId: string;
	label: string;
	weight: number;
	present: (r: SleepStudyRequest) => boolean;
}

function epworthPresent(r: SleepStudyRequest): boolean {
	const v = r.scores.epworthScore;
	return v !== null && v !== undefined;
}

function stopBangPresent(r: SleepStudyRequest): boolean {
	const v = r.scores.stopBangScore;
	return v !== null && v !== undefined;
}

/**
 * The tracked request fields, with indication, clinical question, and Epworth
 * weighted highest because they drive every other axis. Completeness is the
 * weighted percentage of fields supplied.
 */
const fields: FieldCheck[] = [
	{ ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication', weight: 3, present: (r) => !!r.request.primaryIndication },
	{ ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question', weight: 3, present: (r) => r.request.clinicalQuestion.trim() !== '' },
	{ ruleId: 'R-COMPLETE-EPWORTH', label: 'Epworth score', weight: 3, present: epworthPresent },
	{ ruleId: 'R-COMPLETE-STUDY-TYPE', label: 'requested study type', weight: 2, present: (r) => !!r.request.studyType },
	{ ruleId: 'R-COMPLETE-STOP-BANG', label: 'STOP-BANG score', weight: 1, present: stopBangPresent },
	{ ruleId: 'R-COMPLETE-BMI', label: 'body mass index', weight: 1, present: (r) => r.patient.bodyMassIndex !== null && r.patient.bodyMassIndex !== undefined },
	{ ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name', weight: 1, present: (r) => !!r.patient.firstName && !!r.patient.lastName },
	{ ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number', weight: 1, present: (r) => !!r.patient.nhsNumber },
	{ ruleId: 'R-COMPLETE-DOB', label: 'date of birth', weight: 1, present: (r) => !!r.patient.dateOfBirth },
	{ ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician', weight: 1, present: (r) => !!r.clinician.clinicianName },
	{ ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date', weight: 1, present: (r) => !!r.clinician.referralDate },
	{ ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency', weight: 1, present: (r) => !!r.triage.urgency }
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of tracked fields present,
 * plus an audit-trail rule for each missing field.
 */
export function gradeCompleteness(r: SleepStudyRequest): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let totalWeight = 0;
	let presentWeight = 0;

	for (const field of fields) {
		totalWeight += field.weight;
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
