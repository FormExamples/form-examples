import type { BloodTestRequest, FiredRule } from './types';
import { countSelectedPanels } from './panels';

/** A tracked completeness field, with its weight and presence predicate. */
interface FieldCheck {
	weight: number;
	ruleId: string;
	label: string;
	present: (d: BloodTestRequest) => boolean;
}

/**
 * The mandatory request fields. Clinical details, indication, and at least one
 * panel are weighted highest because they drive every other axis.
 */
const COMPLETENESS_FIELDS: FieldCheck[] = [
	{
		weight: 3,
		ruleId: 'R-COMPLETE-INDICATION',
		label: 'primary indication',
		present: (d) => !!d.clinical.primaryIndication
	},
	{
		weight: 3,
		ruleId: 'R-COMPLETE-CLINICAL-DETAILS',
		label: 'clinical details',
		present: (d) => d.clinical.clinicalDetails.trim() !== ''
	},
	{
		weight: 3,
		ruleId: 'R-COMPLETE-PANELS',
		label: 'at least one test panel',
		present: (d) => countSelectedPanels(d.panels) > 0
	},
	{
		weight: 1,
		ruleId: 'R-COMPLETE-PATIENT-NAME',
		label: 'patient name',
		present: (d) => !!d.patient.firstName && !!d.patient.lastName
	},
	{
		weight: 1,
		ruleId: 'R-COMPLETE-NHS-NUMBER',
		label: 'NHS number',
		present: (d) => !!d.patient.nhsNumber
	},
	{
		weight: 1,
		ruleId: 'R-COMPLETE-DOB',
		label: 'date of birth',
		present: (d) => !!d.patient.dateOfBirth
	},
	{
		weight: 1,
		ruleId: 'R-COMPLETE-CLINICIAN',
		label: 'requesting clinician',
		present: (d) => !!d.clinician.clinicianName
	},
	{
		weight: 1,
		ruleId: 'R-COMPLETE-REFERRAL-DATE',
		label: 'referral date',
		present: (d) => !!d.clinician.referralDate
	},
	{
		weight: 1,
		ruleId: 'R-COMPLETE-URGENCY',
		label: 'requested urgency',
		present: (d) => !!d.triage.urgency
	}
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of mandatory request fields
 * that are present, plus an audit-trail rule for each missing field.
 */
export function scoreCompleteness(data: BloodTestRequest): {
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
