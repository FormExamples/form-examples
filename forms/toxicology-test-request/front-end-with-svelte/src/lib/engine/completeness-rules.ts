import type { ToxicologyRequest, FiredRule } from './types';
import { countSelectedAssays } from './utils';

/** A tracked mandatory field, used to compute Axis C completeness. */
interface FieldCheck {
	ruleId: string;
	label: string;
	weight: number;
	present: (r: ToxicologyRequest) => boolean;
}

/**
 * The tracked request fields, with the primary indication and clinical details
 * weighted highest because they drive every other axis. Completeness is the
 * weighted percentage of points present.
 */
const fields: FieldCheck[] = [
	{
		ruleId: 'R-COMPLETE-INDICATION',
		label: 'primary indication',
		weight: 3,
		present: (r) => !!r.clinical.primaryIndication
	},
	{
		ruleId: 'R-COMPLETE-CLINICAL-DETAILS',
		label: 'clinical details',
		weight: 3,
		present: (r) => !!r.clinical.clinicalDetails && r.clinical.clinicalDetails.trim() !== ''
	},
	{
		ruleId: 'R-COMPLETE-ASSAY',
		label: 'at least one assay',
		weight: 2,
		present: (r) => countSelectedAssays(r.assays) > 0
	},
	{
		ruleId: 'R-COMPLETE-TIMING',
		label: 'time since ingestion',
		weight: 2,
		present: (r) =>
			r.clinical.timeSinceIngestionHours !== null &&
			r.clinical.timeSinceIngestionHours !== undefined
	},
	{
		ruleId: 'R-COMPLETE-PATIENT-NAME',
		label: 'patient name',
		weight: 1,
		present: (r) => !!r.patient.firstName && !!r.patient.lastName
	},
	{
		ruleId: 'R-COMPLETE-NHS-NUMBER',
		label: 'NHS number',
		weight: 1,
		present: (r) => !!r.patient.nhsNumber
	},
	{
		ruleId: 'R-COMPLETE-DOB',
		label: 'date of birth',
		weight: 1,
		present: (r) => !!r.patient.dateOfBirth
	},
	{
		ruleId: 'R-COMPLETE-CLINICIAN',
		label: 'requesting clinician',
		weight: 1,
		present: (r) => !!r.clinician.clinicianName
	},
	{
		ruleId: 'R-COMPLETE-REFERRAL-DATE',
		label: 'referral date',
		weight: 1,
		present: (r) => !!r.clinician.referralDate
	},
	{
		ruleId: 'R-COMPLETE-SPECIMEN',
		label: 'specimen status',
		weight: 1,
		present: (r) => !!r.specimen.specimenCollected
	},
	{
		ruleId: 'R-COMPLETE-URGENCY',
		label: 'requested urgency',
		weight: 1,
		present: (r) => !!r.triage.urgency
	}
];

/**
 * Axis C — request completeness.
 *
 * Returns the weighted percentage (0–100, rounded) of tracked fields that are
 * present, plus an audit-trail rule for each missing field.
 */
export function scoreCompleteness(r: ToxicologyRequest): {
	completenessPercent: number;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let totalWeight = 0;
	let presentWeight = 0;
	for (const f of fields) {
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
