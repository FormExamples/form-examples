import type {
	LinguisticCriteria,
	ClinicalCommunication,
	OetGrade,
	Outcome
} from './types';

/** Maximum combined raw band total: 4×6 (linguistic) + 5×3 (communication). */
export const LINGUISTIC_MAX = 24;
export const COMMUNICATION_MAX = 15;
export const RAW_MAX = LINGUISTIC_MAX + COMMUNICATION_MAX;

/** Sum the four linguistic bands, treating unrated (null) criteria as 0. */
export function linguisticTotal(c: LinguisticCriteria): number {
	return (
		(c.intelligibility ?? 0) +
		(c.fluency ?? 0) +
		(c.appropriatenessOfLanguage ?? 0) +
		(c.resourcesOfGrammarAndExpression ?? 0)
	);
}

/** Sum the five clinical-communication bands, treating unrated (null) as 0. */
export function communicationTotal(c: ClinicalCommunication): number {
	return (
		(c.relationshipBuilding ?? 0) +
		(c.understandingPatientPerspective ?? 0) +
		(c.providingStructure ?? 0) +
		(c.informationGathering ?? 0) +
		(c.informationGiving ?? 0)
	);
}

/** Scale a raw band total (0-39) to the OET 0-500 score. */
export function rawToScore(rawTotal: number): number {
	return Math.round((rawTotal / RAW_MAX) * 500);
}

/** Map an OET 0-500 score to its letter grade (per the published bands). */
export function scoreToGrade(score: number): OetGrade {
	if (score >= 450) return 'A';
	if (score >= 350) return 'B';
	if (score >= 300) return 'C+';
	if (score >= 200) return 'C';
	if (score >= 100) return 'D';
	return 'E';
}

/** Registration outcome: grade A or B is a pass for most UK healthcare boards. */
export function gradeOutcome(grade: OetGrade): Outcome {
	return grade === 'A' || grade === 'B' ? 'pass' : 'refer';
}

/** Human-readable description of an OET grade. */
export function gradeLabel(grade: OetGrade): string {
	switch (grade) {
		case 'A':
			return 'Grade A — High-level professional proficiency';
		case 'B':
			return 'Grade B — Good professional proficiency';
		case 'C+':
			return 'Grade C+ — Functional proficiency';
		case 'C':
			return 'Grade C — Functional proficiency';
		case 'D':
			return 'Grade D — Below functional threshold';
		case 'E':
			return 'Grade E — Below functional threshold';
	}
}

/** Short grade label for compact contexts (e.g. dashboard cells). */
export function gradeShort(grade: OetGrade): string {
	return `Grade ${grade}`;
}

/** Lily status colour triple for an OET grade. */
export function gradeColor(grade: OetGrade): string {
	switch (grade) {
		case 'A':
		case 'B':
			return 'bg-success text-success-content border-success';
		case 'C+':
		case 'C':
			return 'bg-warning text-warning-content border-warning';
		case 'D':
		case 'E':
			return 'bg-error text-error-content border-error';
	}
}

/** Outcome label. */
export function outcomeLabel(outcome: Outcome): string {
	return outcome === 'pass' ? 'Pass' : 'Below threshold';
}

/** Outcome colour triple. */
export function outcomeColor(outcome: Outcome): string {
	return outcome === 'pass'
		? 'bg-success text-success-content border-success'
		: 'bg-error text-error-content border-error';
}

// ──────────────────────────────────────────────
// Report Badge severity helpers (fired-rule grade 1-4)
// ──────────────────────────────────────────────

/** Severity label for a fired-rule grade (used by the Badge component). */
export function severityLabel(grade: number): string {
	switch (grade) {
		case 1:
			return 'Minor';
		case 2:
			return 'Borderline';
		case 3:
			return 'Below threshold';
		case 4:
			return 'Severe weakness';
		default:
			return `Grade ${grade}`;
	}
}

/** Severity colour triple for a fired-rule grade (used by the Badge component). */
export function severityColor(grade: number): string {
	switch (grade) {
		case 1:
			return 'bg-base-300 text-base-content border-base-300';
		case 2:
		case 3:
			return 'bg-warning text-warning-content border-warning';
		case 4:
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Linguistic criterion band descriptor (0-6 scale). */
export function linguisticBandLabel(band: number | null): string {
	if (band === null) return 'Not rated';
	if (band >= 5) return `${band} — Strong`;
	if (band >= 4) return `${band} — Functional`;
	if (band >= 3) return `${band} — Limited`;
	return `${band} — Minimal`;
}

/** Communication criterion band descriptor (0-3 scale). */
export function communicationBandLabel(band: number | null): string {
	if (band === null) return 'Not rated';
	switch (band) {
		case 3:
			return '3 — Adept';
		case 2:
			return '2 — Competent';
		case 1:
			return '1 — Partial';
		default:
			return '0 — Deficient';
	}
}
