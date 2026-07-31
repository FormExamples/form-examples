// Declarative completeness rules for the inpatient clinical note.
//
// A component is "documented" when its field(s) hold a meaningful entry OR an
// explicit negative flag is set ("no interval events", "no medication changes",
// "no investigations reviewed") — a deliberate negative is a valid clinical
// record. See `doc/record-standards.md`.
//
// What makes this form different from a single-required-set completeness form is
// that the required set VARIES BY NOTE TYPE (spec §4.2): an admission clerking
// must carry an examination and investigations; a progress note need not. This
// module resolves the effective required set for the note in hand.

import { hasFullObservationSet } from './news2';
import {
	COMPONENTS,
	NOTE_TYPE_EXTRA_REQUIRED,
	type AssessmentData,
	type ComponentKey
} from './types';

export interface RuleComponent {
	/** Stable rule id, e.g. R-PLAN-DOCUMENTED-01. */
	id: string;
	component: ComponentKey;
	category: 'required-component' | 'recommended-component';
	label: string;
	description: string;
	/** Required for THIS note's type. */
	required: boolean;
	present: boolean;
}

/** A text/enum field is present when it is a non-blank string. */
export function has(v: unknown): boolean {
	return v !== null && v !== undefined && String(v).trim() !== '';
}

/** True when at least one of the given strings is non-blank. */
export function hasAny(...values: unknown[]): boolean {
	return values.some((v) => has(v));
}

/** Per-component `documented` predicates (spec §4.1). */
export function componentPresence(data: AssessmentData): Record<ComponentKey, boolean> {
	const h = data.header;
	const iv = data.interval;
	const obs = data.observations;
	const ex = data.examination;
	const inv = data.investigations;
	const med = data.medications;
	const pl = data.planning;
	const so = data.signOff;

	return {
		header: has(h.noteType) && has(h.noteAt) && has(h.authorName) && has(h.authorGrade),
		'interval-history': has(iv.intervalHistory) || iv.noIntervalEvents === 'yes',
		observations: obs.news2Total !== null || hasFullObservationSet(obs),
		examination: hasAny(
			ex.general,
			ex.cardiovascular,
			ex.respiratory,
			ex.abdominal,
			ex.neurological,
			ex.musculoskeletal,
			ex.skinAndWounds,
			ex.linesAndDrains,
			ex.other
		),
		investigations: inv.rows.length > 0 || inv.noInvestigationsReviewed === 'yes',
		problems: data.problems.rows.length > 0,
		medications: med.rows.length > 0 || med.noMedicationChanges === 'yes',
		'risk-assessments': has(data.risks.vteStatus),
		impression: has(data.assessment.clinicalImpression),
		plan: has(pl.plan) || pl.jobs.length > 0,
		escalation: has(pl.escalationStatus) && has(pl.ceilingOfCare),
		communication: hasAny(so.familyCommunication, so.patientCommunication, so.teamHandover)
	};
}

/**
 * The effective required-component set for a note type (spec §4.2): the base
 * required components plus that type's additions. An unrecognised or blank note
 * type falls back to the base set alone.
 */
export function requiredComponentKeys(noteType: string): ComponentKey[] {
	const base = COMPONENTS.filter((c) => c.baseRequired).map((c) => c.component);
	const extra = NOTE_TYPE_EXTRA_REQUIRED[noteType] ?? [];
	const keys = base.slice();
	for (const k of extra) {
		if (!keys.includes(k)) keys.push(k);
	}
	return keys;
}

/** Human-readable description of what documents each component. */
const COMPONENT_DESCRIPTIONS: Record<ComponentKey, string> = {
	header: 'Header: note type, date and time, author name and grade recorded',
	'interval-history':
		'Interval history: events since the last entry recorded, or an explicit "no events"',
	observations:
		'Observations: a NEWS2 total recorded, or a full set of the seven NEWS2 parameters',
	examination: 'Examination: at least one system examined',
	investigations:
		'Investigations: at least one result reviewed, or an explicit "none reviewed"',
	problems: 'Problems: at least one problem on the list',
	medications: 'Medications: at least one prescribing change, or an explicit "no changes"',
	'risk-assessments': 'Risk assessments: VTE status recorded (NICE NG89)',
	impression: 'Impression: a clinical impression recorded',
	plan: 'Plan: a narrative plan, or at least one job',
	escalation: 'Escalation: an escalation status and a ceiling of care recorded',
	communication:
		'Communication: what was discussed with the family, the patient, or the team'
};

/** Stable rule id per component. */
const COMPONENT_RULE_IDS: Record<ComponentKey, string> = {
	header: 'R-HEADER-DOCUMENTED-01',
	'interval-history': 'R-INTERVAL-DOCUMENTED-01',
	observations: 'R-OBSERVATIONS-DOCUMENTED-01',
	examination: 'R-EXAMINATION-DOCUMENTED-01',
	investigations: 'R-INVESTIGATIONS-DOCUMENTED-01',
	problems: 'R-PROBLEMS-DOCUMENTED-01',
	medications: 'R-MEDICATIONS-DOCUMENTED-01',
	'risk-assessments': 'R-RISKS-DOCUMENTED-01',
	impression: 'R-IMPRESSION-DOCUMENTED-01',
	plan: 'R-PLAN-DOCUMENTED-01',
	escalation: 'R-ESCALATION-DOCUMENTED-01',
	communication: 'R-COMMUNICATION-DOCUMENTED-01'
};

/** Every component as a rule row, with `required` resolved for this note's type. */
export function componentRules(data: AssessmentData): RuleComponent[] {
	const presence = componentPresence(data);
	const requiredKeys = requiredComponentKeys(data.header.noteType);

	return COMPONENTS.map((c) => {
		const required = requiredKeys.includes(c.component);
		return {
			id: COMPONENT_RULE_IDS[c.component],
			component: c.component,
			category: required ? ('required-component' as const) : ('recommended-component' as const),
			label: c.label,
			description: COMPONENT_DESCRIPTIONS[c.component],
			required,
			present: !!presence[c.component]
		};
	});
}

/** The required components for this note's type, for the completeness tally. */
export function requiredComponents(data: AssessmentData): RuleComponent[] {
	return componentRules(data).filter((c) => c.required);
}

/** The recommended components. They do not affect the status. */
export function recommendedComponents(data: AssessmentData): RuleComponent[] {
	return componentRules(data).filter((c) => !c.required);
}
