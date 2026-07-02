import type { AssessmentData, Fluids, MandatoryRule } from './types';

/**
 * Declarative mandatory-item rules for the Anaesthetic Record completeness
 * engine.
 *
 * This is a DOCUMENTATION / COMPLETENESS form — not a numeric score. The engine
 * evaluates a fixed set of mandatory-item rules (spec §4), each tagged
 * `critical` or `noncritical`, then the grader classifies the record:
 *
 *   anyCriticalMissing         -> 'incomplete'
 *   else anyNoncriticalMissing -> 'partial'
 *   else                       -> 'complete'
 *
 * Each rule carries a stable id, a human-readable label, its criticality, and a
 * pure `satisfied(data)` predicate, so the UI can show exactly which items are
 * still missing (mirroring the `anaesthetic_record_grade_rule` SQL table).
 */

/** A text / enum value counts as present when it is a non-empty trimmed string. */
export function textPresent(v: string): boolean {
	return typeof v === 'string' && v.trim() !== '';
}

/** A numeric value counts as present when it is a finite number (not null). */
export function numberPresent(v: number | null): boolean {
	return typeof v === 'number' && !Number.isNaN(v);
}

/** True when the fluids section carries any summary volume (spec §4). */
export function fluidsSummaryPresent(fluids: Fluids): boolean {
	return (
		numberPresent(fluids.estimatedBloodLossMl) ||
		numberPresent(fluids.crystalloidMl) ||
		numberPresent(fluids.colloidMl) ||
		numberPresent(fluids.bloodProductsMl) ||
		numberPresent(fluids.urineOutputMl) ||
		numberPresent(fluids.cellSalvageMl)
	);
}

/**
 * The fixed mandatory-item ruleset. Order is stable so the audit trail and the
 * "missing items" list render deterministically.
 */
export const mandatoryRules: MandatoryRule[] = [
	// ── Safety-critical (missing → Incomplete) ──────────────────────────────
	{
		id: 'M-PATIENT-IDENTIFIER',
		category: 'critical',
		label: 'Patient identification recorded',
		satisfied: (d) => textPresent(d.identification.patientIdentifier)
	},
	{
		id: 'M-ANAESTHETIST',
		category: 'critical',
		label: 'Responsible anaesthetist recorded',
		satisfied: (d) => textPresent(d.identification.anaesthetistName)
	},
	{
		id: 'M-ASA-STATUS',
		category: 'critical',
		label: 'ASA physical status recorded',
		satisfied: (d) => textPresent(d.asaAirway.asaStatus)
	},
	{
		id: 'M-ANAESTHETIC-TECHNIQUE',
		category: 'critical',
		label: 'Anaesthetic technique recorded',
		satisfied: (d) => textPresent(d.identification.anaestheticTechnique)
	},
	{
		id: 'M-AIRWAY-TECHNIQUE',
		category: 'critical',
		label: 'Airway-management technique recorded',
		satisfied: (d) => textPresent(d.airway.airwayTechnique)
	},
	{
		id: 'M-WHO-CHECKLIST',
		category: 'critical',
		label: 'WHO checklist status recorded (Sign In and Time Out)',
		satisfied: (d) => textPresent(d.preInduction.whoSignIn) && textPresent(d.preInduction.whoTimeOut)
	},
	{
		id: 'M-TIMED-OBSERVATION',
		category: 'critical',
		label: 'At least one set of timed observations recorded',
		satisfied: (d) => Array.isArray(d.observations) && d.observations.length >= 1
	},
	{
		id: 'M-SIGNATURE',
		category: 'critical',
		label: 'Anaesthetist signature recorded',
		satisfied: (d) => textPresent(d.signoff.anaesthetistSignature)
	},

	// ── Non-critical (missing → Partial) ────────────────────────────────────
	{
		id: 'M-WEIGHT',
		category: 'noncritical',
		label: 'Patient weight recorded',
		satisfied: (d) => numberPresent(d.identification.weightKg)
	},
	{
		id: 'M-MONITORING',
		category: 'noncritical',
		label: 'Monitoring modalities recorded',
		satisfied: (d) =>
			Array.isArray(d.monitoring.monitoringModalities) &&
			d.monitoring.monitoringModalities.length >= 1
	},
	{
		id: 'M-FLUIDS',
		category: 'noncritical',
		label: 'Fluids / blood-loss summary recorded',
		satisfied: (d) => fluidsSummaryPresent(d.fluids)
	},
	{
		id: 'M-RECOVERY-DESTINATION',
		category: 'noncritical',
		label: 'Recovery-handover destination recorded',
		satisfied: (d) => textPresent(d.handover.recoveryDestination)
	}
];

/** Convenience: evaluate a data object against every mandatory rule. */
export type { AssessmentData };
