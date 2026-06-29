import type { XRayRequest, FiredRule } from './types';

/** A tracked completeness field with its weight and presence predicate. */
interface FieldCheck {
	weight: number;
	ruleId: string;
	label: string;
	present: (d: XRayRequest) => boolean;
}

/**
 * Axis C — Request completeness (mandatory-field checklist). Indication and
 * clinical question are weighted highest because they drive every other axis.
 * Completeness is the percentage of weighted points present.
 */
const COMPLETENESS_FIELDS: FieldCheck[] = [
	{ weight: 3, present: (d) => !!d.request.primaryIndication, ruleId: 'R-COMPLETE-INDICATION', label: 'primary indication' },
	{ weight: 3, present: (d) => !!d.detail.clinicalQuestion && d.detail.clinicalQuestion.trim() !== '', ruleId: 'R-COMPLETE-CLINICAL-QUESTION', label: 'clinical question' },
	{ weight: 2, present: (d) => !!d.request.bodyRegion, ruleId: 'R-COMPLETE-BODY-REGION', label: 'body region' },
	{ weight: 2, present: (d) => !!d.request.laterality, ruleId: 'R-COMPLETE-LATERALITY', label: 'laterality' },
	{ weight: 2, present: (d) => !!d.safety.irMeRJustification && d.safety.irMeRJustification.trim() !== '', ruleId: 'R-COMPLETE-JUSTIFICATION', label: 'IR(ME)R justification' },
	{ weight: 1, present: (d) => !!d.safety.pregnancyStatus, ruleId: 'R-COMPLETE-PREGNANCY-STATUS', label: 'pregnancy status' },
	{ weight: 1, present: (d) => !!d.patient.firstName && !!d.patient.lastName, ruleId: 'R-COMPLETE-PATIENT-NAME', label: 'patient name' },
	{ weight: 1, present: (d) => !!d.patient.nhsNumber, ruleId: 'R-COMPLETE-NHS-NUMBER', label: 'NHS number' },
	{ weight: 1, present: (d) => !!d.patient.dateOfBirth, ruleId: 'R-COMPLETE-DOB', label: 'date of birth' },
	{ weight: 1, present: (d) => !!d.clinician.clinicianName, ruleId: 'R-COMPLETE-CLINICIAN', label: 'requesting clinician' },
	{ weight: 1, present: (d) => !!d.clinician.referralDate, ruleId: 'R-COMPLETE-REFERRAL-DATE', label: 'referral date' },
	{ weight: 1, present: (d) => !!d.triage.urgency, ruleId: 'R-COMPLETE-URGENCY', label: 'requested urgency' }
];

/**
 * Compute weighted completeness 0-100 and the missing-field rules.
 */
export function scoreCompleteness(data: XRayRequest): {
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
