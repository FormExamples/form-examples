import type { OetRule } from './types';

/**
 * Declarative OET speaking criterion rules. Each rule fires when a rated
 * criterion falls at or below a threshold, recording a weakness for the
 * report's justification table. Severity grade: 1 = minor, 2 = borderline,
 * 3 = below the functional threshold, 4 = severe weakness.
 *
 * Linguistic criteria are rated 0-6 (functional threshold = 4); clinical
 * communication criteria are rated 0-3 (functional threshold = 2).
 */
export const oetRules: OetRule[] = [
	// ─── INTELLIGIBILITY (0-6) ──────────────────────────────────
	{
		id: 'LING-INT-1',
		criterion: 'Intelligibility',
		description: 'Intelligibility below the functional threshold (band < 4)',
		grade: 3,
		evaluate: (d) =>
			d.linguisticCriteria.intelligibility !== null &&
			d.linguisticCriteria.intelligibility < 4
	},
	{
		id: 'LING-INT-2',
		criterion: 'Intelligibility',
		description: 'Intelligibility minimal — pronunciation impedes understanding (band ≤ 2)',
		grade: 4,
		evaluate: (d) =>
			d.linguisticCriteria.intelligibility !== null &&
			d.linguisticCriteria.intelligibility <= 2
	},
	// ─── FLUENCY (0-6) ──────────────────────────────────────────
	{
		id: 'LING-FLU-1',
		criterion: 'Fluency',
		description: 'Fluency below the functional threshold (band < 4)',
		grade: 3,
		evaluate: (d) =>
			d.linguisticCriteria.fluency !== null && d.linguisticCriteria.fluency < 4
	},
	{
		id: 'LING-FLU-2',
		criterion: 'Fluency',
		description: 'Fluency minimal — speech rate and continuity disrupted (band ≤ 2)',
		grade: 4,
		evaluate: (d) =>
			d.linguisticCriteria.fluency !== null && d.linguisticCriteria.fluency <= 2
	},
	// ─── APPROPRIATENESS OF LANGUAGE (0-6) ──────────────────────
	{
		id: 'LING-APP-1',
		criterion: 'Appropriateness of Language',
		description: 'Appropriateness of language below the functional threshold (band < 4)',
		grade: 3,
		evaluate: (d) =>
			d.linguisticCriteria.appropriatenessOfLanguage !== null &&
			d.linguisticCriteria.appropriatenessOfLanguage < 4
	},
	{
		id: 'LING-APP-2',
		criterion: 'Appropriateness of Language',
		description: 'Register and tone frequently inappropriate to the clinical context (band ≤ 2)',
		grade: 4,
		evaluate: (d) =>
			d.linguisticCriteria.appropriatenessOfLanguage !== null &&
			d.linguisticCriteria.appropriatenessOfLanguage <= 2
	},
	// ─── RESOURCES OF GRAMMAR & EXPRESSION (0-6) ────────────────
	{
		id: 'LING-GRA-1',
		criterion: 'Resources of Grammar & Expression',
		description: 'Resources of grammar & expression below the functional threshold (band < 4)',
		grade: 3,
		evaluate: (d) =>
			d.linguisticCriteria.resourcesOfGrammarAndExpression !== null &&
			d.linguisticCriteria.resourcesOfGrammarAndExpression < 4
	},
	{
		id: 'LING-GRA-2',
		criterion: 'Resources of Grammar & Expression',
		description: 'Grammar errors are frequent and impede meaning (band ≤ 2)',
		grade: 4,
		evaluate: (d) =>
			d.linguisticCriteria.resourcesOfGrammarAndExpression !== null &&
			d.linguisticCriteria.resourcesOfGrammarAndExpression <= 2
	},
	// ─── CLINICAL COMMUNICATION (0-3) ───────────────────────────
	{
		id: 'COMM-REL-1',
		criterion: 'Relationship-building',
		description: 'Relationship-building below the competent threshold (band < 2)',
		grade: 3,
		evaluate: (d) =>
			d.clinicalCommunication.relationshipBuilding !== null &&
			d.clinicalCommunication.relationshipBuilding < 2
	},
	{
		id: 'COMM-REL-2',
		criterion: 'Relationship-building',
		description: 'Relationship-building deficient — no rapport established (band 0)',
		grade: 4,
		evaluate: (d) => d.clinicalCommunication.relationshipBuilding === 0
	},
	{
		id: 'COMM-PER-1',
		criterion: "Understanding patient's perspective",
		description: "Understanding the patient's perspective below the competent threshold (band < 2)",
		grade: 3,
		evaluate: (d) =>
			d.clinicalCommunication.understandingPatientPerspective !== null &&
			d.clinicalCommunication.understandingPatientPerspective < 2
	},
	{
		id: 'COMM-PER-2',
		criterion: "Understanding patient's perspective",
		description: "Patient's concerns and expectations not explored (band 0)",
		grade: 4,
		evaluate: (d) => d.clinicalCommunication.understandingPatientPerspective === 0
	},
	{
		id: 'COMM-STR-1',
		criterion: 'Providing structure',
		description: 'Providing structure below the competent threshold (band < 2)',
		grade: 3,
		evaluate: (d) =>
			d.clinicalCommunication.providingStructure !== null &&
			d.clinicalCommunication.providingStructure < 2
	},
	{
		id: 'COMM-STR-2',
		criterion: 'Providing structure',
		description: 'Consultation lacks logical sequence and signposting (band 0)',
		grade: 4,
		evaluate: (d) => d.clinicalCommunication.providingStructure === 0
	},
	{
		id: 'COMM-GAT-1',
		criterion: 'Information-gathering',
		description: 'Information-gathering below the competent threshold (band < 2)',
		grade: 3,
		evaluate: (d) =>
			d.clinicalCommunication.informationGathering !== null &&
			d.clinicalCommunication.informationGathering < 2
	},
	{
		id: 'COMM-GAT-2',
		criterion: 'Information-gathering',
		description: 'Key clinical history not elicited (band 0)',
		grade: 4,
		evaluate: (d) => d.clinicalCommunication.informationGathering === 0
	},
	{
		id: 'COMM-GIV-1',
		criterion: 'Information-giving',
		description: 'Information-giving below the competent threshold (band < 2)',
		grade: 3,
		evaluate: (d) =>
			d.clinicalCommunication.informationGiving !== null &&
			d.clinicalCommunication.informationGiving < 2
	},
	{
		id: 'COMM-GIV-2',
		criterion: 'Information-giving',
		description: 'Explanations unclear or not checked for understanding (band 0)',
		grade: 4,
		evaluate: (d) => d.clinicalCommunication.informationGiving === 0
	}
];
