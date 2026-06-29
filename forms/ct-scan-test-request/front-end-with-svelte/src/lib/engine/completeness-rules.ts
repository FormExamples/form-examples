// ──────────────────────────────────────────────
// Axis C — Request completeness (mandatory-field checklist)
//
// Each tracked field carries a weight. Indication, clinical question, and the
// IR(ME)R justification are weighted highest because they drive every other
// axis and the radiation justification. Completeness is the percentage of
// weighted points present. Rule IDs are stable and identical across every
// front-end and the back-end (R-COMPLETE-*). Ported from the HTML engine.
// ──────────────────────────────────────────────

import type { CtScanRequest, FiredRule } from './types';

interface CompletenessField {
	weight: number;
	present: (d: CtScanRequest) => boolean;
	ruleId: string;
	label: string;
}

const COMPLETENESS_FIELDS: CompletenessField[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.request.clinicalQuestion && d.request.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
	{ weight: 2, present: (d) => !!d.radiation.irMeRJustification && d.radiation.irMeRJustification.trim() !== '', ruleId: 'R-COMPLETE-JUSTIFICATION', label: 'IR(ME)R justification' },
	{ weight: 1, present: (d) => !!d.contrast.contrastRequired, ruleId: 'R-COMPLETE-CONTRAST', label: 'contrast requirement' },
	{ weight: 1, present: (d) => !!d.radiation.pregnancyStatus, ruleId: 'R-COMPLETE-PREGNANCY', label: 'pregnancy status' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/** The result of grading Axis C. */
export interface CompletenessResult {
	completenessPercent: number;
	firedRules: FiredRule[];
}

/** Compute weighted completeness 0–100 and the missing-field rules. */
export function gradeCompleteness(data: CtScanRequest): CompletenessResult {
	let totalWeight = 0;
	let presentWeight = 0;
	const firedRules: FiredRule[] = [];
	for (const f of COMPLETENESS_FIELDS) {
		totalWeight += f.weight;
		if (f.present(data)) {
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
