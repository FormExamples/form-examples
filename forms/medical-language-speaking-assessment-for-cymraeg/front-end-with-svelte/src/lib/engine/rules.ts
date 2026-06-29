// Declarative criterion registry for the clinical Welsh-language (Cymraeg)
// speaking assessment.
//
// Linguistic criteria — 0..6 (7 anchor points), mapped to CEFR A1..C2.
// Clinical indicators  — 0..3 (4 anchor points).
//
// The grader iterates the registry to produce the per-criterion audit trail;
// the wizard consumes the same data to render the radio scales.

import type { Anchor, Criterion, CriterionWithAnchors } from './types';

/** 0..6 anchors used by all four linguistic criteria. Mapped to CEFR. */
export const LINGUISTIC_ANCHORS: Anchor[] = [
	{ value: 0, label: '0', description: 'Performance falls short of the lowest descriptor; communication in Welsh not achieved.' },
	{ value: 1, label: '1', description: 'Limited control (CEFR A1/A2); communication in Welsh frequently breaks down.' },
	{ value: 2, label: '2', description: 'Modest control (CEFR B1); communication in Welsh is achieved with effort.' },
	{ value: 3, label: '3', description: 'Acceptable control (CEFR B2); communication in Welsh is generally maintained.' },
	{ value: 4, label: '4', description: 'Good control (CEFR B2+/C1); the candidate communicates effectively in Welsh.' },
	{ value: 5, label: '5', description: 'Very good control (CEFR C1); minor lapses do not impede Welsh-language communication.' },
	{ value: 6, label: '6', description: 'Excellent control (CEFR C2); performance approaches that of a fluent Welsh speaker.' }
];

/** 0..3 anchors used by all five clinical communication indicators. */
export const CLINICAL_ANCHORS: Anchor[] = [
	{ value: 0, label: '0', description: 'Indicator not demonstrated; behaviour absent or counter-productive.' },
	{ value: 1, label: '1', description: 'Partially demonstrated; key elements are missing or under-developed.' },
	{ value: 2, label: '2', description: 'Demonstrated to a satisfactory standard; minor gaps remain.' },
	{ value: 3, label: '3', description: 'Demonstrated to a high standard; behaviour is consistent and effective.' }
];

/**
 * The criterion registry — single source of truth for the form, the grader,
 * and the report. Linguistic criteria are rated 0-6 once per role-play.
 * Clinical communication indicators are rated 0-3 once for the assessment.
 */
export const CRITERIA: Criterion[] = [
	{
		id: 'LING-FLU',
		domain: 'linguistic',
		label: 'Fluency (Rhuglder)',
		description:
			'Speech rate, smoothness, hesitations, and use of filler — the candidate’s ability to sustain natural Welsh-language speech in a clinical encounter.',
		maxScore: 6,
		dataField: 'fluency'
	},
	{
		id: 'LING-GRM',
		domain: 'linguistic',
		label: 'Grammar (Gramadeg)',
		description:
			'Range and accuracy of Welsh grammar, including mutations (treigladau), tense, agreement, and clause structure.',
		maxScore: 6,
		dataField: 'grammar'
	},
	{
		id: 'LING-PRO',
		domain: 'linguistic',
		label: 'Pronunciation (Ynganu)',
		description:
			'Pronunciation, intonation, accent, rhythm, and stress in Welsh — including characteristic sounds (ll, ch, rh) and clarity for Welsh-speaking patients.',
		maxScore: 6,
		dataField: 'pronunciation'
	},
	{
		id: 'LING-APP',
		domain: 'linguistic',
		label: 'Clinical Appropriateness (Priodoldeb Clinigol)',
		description:
			'Register, tone, professional Welsh medical vocabulary, dialect sensitivity (north/south Wales), and avoidance of unexplained jargon.',
		maxScore: 6,
		dataField: 'clinicalAppropriateness'
	},
	{
		id: 'CLIN-REL',
		domain: 'clinical',
		label: 'Relationship-building',
		description:
			'Initiating the encounter in Welsh, demonstrating respect and empathy, and establishing rapport with Welsh-speaking patients.',
		maxScore: 3,
		dataField: 'relationshipBuilding'
	},
	{
		id: 'CLIN-UPP',
		domain: 'clinical',
		label: 'Understanding Patient’s Perspective',
		description:
			'Eliciting and responding to the patient’s ideas, concerns, and expectations expressed in Welsh.',
		maxScore: 3,
		dataField: 'understandingPatientPerspective'
	},
	{
		id: 'CLIN-STR',
		domain: 'clinical',
		label: 'Providing Structure',
		description: 'Sequencing, signposting, summarising, and managing the time available, in Welsh.',
		maxScore: 3,
		dataField: 'providingStructure'
	},
	{
		id: 'CLIN-IGT',
		domain: 'clinical',
		label: 'Information-gathering',
		description:
			'Open and closed questioning, active listening, and clarification of patient responses in Welsh.',
		maxScore: 3,
		dataField: 'informationGathering'
	},
	{
		id: 'CLIN-IGV',
		domain: 'clinical',
		label: 'Information-giving',
		description:
			'Clear, structured, and patient-appropriate Welsh-language explanation, including checking understanding.',
		maxScore: 3,
		dataField: 'informationGiving'
	}
];

/** The registry consumed by the wizard, the grader, and the report. */
export const criterionRegistry: CriterionWithAnchors[] = CRITERIA.map((c) => ({
	...c,
	anchors: c.domain === 'linguistic' ? LINGUISTIC_ANCHORS : CLINICAL_ANCHORS
}));

/** Look up a single criterion by id. */
export function findCriterion(id: string): CriterionWithAnchors | null {
	return criterionRegistry.find((c) => c.id === id) ?? null;
}

/** Linguistic criteria only (4 entries, each 0..6). */
export function linguisticCriteria(): CriterionWithAnchors[] {
	return criterionRegistry.filter((c) => c.domain === 'linguistic');
}

/** Clinical communication indicators only (5 entries, each 0..3). */
export function clinicalCriteria(): CriterionWithAnchors[] {
	return criterionRegistry.filter((c) => c.domain === 'clinical');
}
