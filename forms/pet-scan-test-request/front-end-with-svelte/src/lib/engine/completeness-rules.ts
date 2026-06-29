import type { PetScanRequest, FiredRule } from './types';
import { isFdgStudy } from './safety-rules';

/** A mandatory request field, used to compute Axis C completeness. */
interface FieldCheck {
	ruleId: string;
	label: string;
	weight: number;
	present: (d: PetScanRequest) => boolean;
}

/** Glucose only counts toward completeness for FDG studies. */
function glucosePresentIfRequired(d: PetScanRequest): boolean {
	if (!isFdgStudy(d.request.scanType)) return true;
	const g = d.preparation.bloodGlucoseMmolL;
	return g !== null && g !== undefined;
}

/**
 * The mandatory request fields, with the indication and clinical question
 * weighted highest because they drive every other axis. Completeness is the
 * weighted percentage of fields supplied.
 */
const fields: FieldCheck[] = [
	{ ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication', weight: 3, present: (d) => !!d.request.primaryIndication },
	{ ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question', weight: 3, present: (d) => d.request.clinicalQuestion.trim() !== '' },
	{ ruleId: 'R-COMPLETE-SCAN-TYPE', label: 'requested scan type', weight: 2, present: (d) => !!d.request.scanType },
	{ ruleId: 'R-COMPLETE-GLUCOSE', label: 'blood glucose (FDG study)', weight: 2, present: (d) => glucosePresentIfRequired(d) },
	{ ruleId: 'R-COMPLETE-JUSTIFICATION', label: 'IR(ME)R justification', weight: 1, present: (d) => d.justification.irMeRJustification.trim() !== '' },
	{ ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name', weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName },
	{ ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number', weight: 1, present: (d) => !!d.patient.nhsNumber },
	{ ruleId: 'R-COMPLETE-DOB', label: 'date of birth', weight: 1, present: (d) => !!d.patient.dateOfBirth },
	{ ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician', weight: 1, present: (d) => !!d.clinician.clinicianName },
	{ ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date', weight: 1, present: (d) => !!d.clinician.referralDate },
	{ ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency', weight: 1, present: (d) => !!d.justification.urgency }
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory request fields
 * that are present, plus an audit-trail rule for each missing field.
 */
export function scoreCompleteness(data: PetScanRequest): {
	percent: number;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let totalWeight = 0;
	let presentWeight = 0;

	for (const f of fields) {
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

	const percent = totalWeight === 0 ? 0 : Math.round((presentWeight / totalWeight) * 100);
	return { percent, firedRules };
}
