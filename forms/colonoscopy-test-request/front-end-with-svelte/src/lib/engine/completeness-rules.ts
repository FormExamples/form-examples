// ──────────────────────────────────────────────
// Axis C — Request completeness (mandatory-field checklist)
//
// Each tracked field carries a weight. Indication and clinical question are
// weighted highest because they drive every other axis. Completeness is the
// percentage of weighted points present. Rule IDs (R-COMPLETE-*) are stable
// across every front-end and the back-end.
// ──────────────────────────────────────────────

import type { ColonoscopyRequest, FiredRule } from './types';

/** True when a FIT result has been recorded. */
export function fitPresent(d: ColonoscopyRequest): boolean {
	const fit = d.redFlags.fitResultUgG;
	return fit !== null && fit !== undefined && (fit as unknown as string) !== '';
}

interface CompletenessField {
	weight: number;
	present: (d: ColonoscopyRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.request.procedure, ruleId: 'R-COMPLETE-PROCEDURE', label: 'requested procedure' },
	{ weight: 2, present: (d) => fitPresent(d), ruleId: 'R-COMPLETE-FIT', label: 'FIT result' },
	{ weight: 1, present: (d) => !!d.fitness.asaGrade, ruleId: 'R-COMPLETE-ASA', label: 'ASA grade' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/** Compute weighted completeness 0–100 and the missing-field rules. */
export function scoreCompleteness(data: ColonoscopyRequest): { percent: number; missing: FiredRule[] } {
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
