import type { DexaRequest, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis C — Request completeness (mandatory-field checklist)
//
// Each tracked field carries a weight. Indication and clinical question are
// weighted highest because they drive every other axis. Completeness is the
// weighted percentage of points present.
// ──────────────────────────────────────────────

/** Whether a FRAX major-fracture probability is present. */
function fraxPresent(d: DexaRequest): boolean {
	return d.riskFactors.fraxMajorFracturePercent !== null && d.riskFactors.fraxMajorFracturePercent !== undefined;
}

/** A mandatory request field, used to compute Axis C completeness. */
interface FieldCheck {
	weight: number;
	ruleId: string;
	label: string;
	present: (d: DexaRequest) => boolean;
}

const fields: FieldCheck[] = [
	{ weight: 3, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication', present: (d) => !!d.request.primaryIndication },
	{
		weight: 3,
		ruleId: 'R-COMPLETE-CLINICAL-QUESTION',
		label: 'clinical question',
		present: (d) => d.request.clinicalQuestion.trim() !== ''
	},
	{ weight: 2, ruleId: 'R-COMPLETE-SCAN-REGION', label: 'requested scan region', present: (d) => !!d.request.scanRegion },
	{ weight: 2, ruleId: 'R-COMPLETE-FRAX', label: 'FRAX major-fracture probability', present: (d) => fraxPresent(d) },
	{
		weight: 1,
		ruleId: 'R-COMPLETE-PATIENT-NAME',
		label: 'patient name',
		present: (d) => !!d.patient.firstName && !!d.patient.lastName
	},
	{ weight: 1, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number', present: (d) => !!d.patient.nhsNumber },
	{ weight: 1, ruleId: 'R-COMPLETE-DOB', label: 'date of birth', present: (d) => !!d.patient.dateOfBirth },
	{ weight: 1, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician', present: (d) => !!d.clinician.clinicianName },
	{ weight: 1, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date', present: (d) => !!d.clinician.referralDate },
	{ weight: 1, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency', present: (d) => !!d.triage.urgency }
];

/**
 * Axis C — compute weighted completeness 0–100 and the missing-field rules.
 */
export function gradeCompleteness(d: DexaRequest): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let totalWeight = 0;
	let presentWeight = 0;

	for (const f of fields) {
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

	const completenessPercent = totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
	return { completenessPercent, firedRules };
}
