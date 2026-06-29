import type { EcgRequest, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis C — Request completeness (mandatory-field checklist)
//
// Each tracked field carries a weight. The primary indication and clinical
// question are weighted highest because they drive every other axis.
// Completeness is the weighted percentage of points present. Rule IDs are
// stable and identical across every front-end and the back-end.
// ──────────────────────────────────────────────

interface FieldCheck {
	weight: number;
	ruleId: string;
	label: string;
	present: (d: EcgRequest) => boolean;
}

const COMPLETENESS_FIELDS: FieldCheck[] = [
	{ weight: 3, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication', present: (d) => !!d.request.primaryIndication },
	{ weight: 3, ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question', present: (d) => d.request.clinicalQuestion.trim() !== '' },
	{ weight: 2, ruleId: 'R-COMPLETE-ECG-TYPE', label: 'requested ECG type', present: (d) => !!d.request.ecgType },
	{ weight: 1, ruleId: 'R-COMPLETE-HISTORY', label: 'relevant history', present: (d) => d.request.relevantHistory.trim() !== '' },
	{ weight: 1, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name', present: (d) => !!d.patient.firstName && !!d.patient.lastName },
	{ weight: 1, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number', present: (d) => !!d.patient.nhsNumber },
	{ weight: 1, ruleId: 'R-COMPLETE-DOB', label: 'date of birth', present: (d) => !!d.patient.dateOfBirth },
	{ weight: 1, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician', present: (d) => !!d.clinician.clinicianName },
	{ weight: 1, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date', present: (d) => !!d.clinician.referralDate },
	{ weight: 1, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency', present: (d) => !!d.triage.urgency }
];

/**
 * Axis C — compute weighted completeness 0–100 (rounded) and an audit-trail rule
 * for each missing field.
 */
export function scoreCompleteness(data: EcgRequest): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
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
