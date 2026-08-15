import type { AdrFormData } from '#lib/types.js';
import type { AdrEvaluation, AdrFlag } from './types';

/**
 * The core Tyree & Akerman template sections whose presence determines an
 * ADR's completeness. Positions are scored separately (they are a 1:N table).
 */
const CORE_SECTIONS: { key: keyof AdrFormData['adr']; label: string }[] = [
	{ key: 'title', label: 'Title' },
	{ key: 'issue', label: 'Issue' },
	{ key: 'decision', label: 'Decision' },
	{ key: 'assumptions', label: 'Assumptions' },
	{ key: 'constraints', label: 'Constraints' },
	{ key: 'argument', label: 'Argument' },
	{ key: 'implications', label: 'Implications' },
	{ key: 'relatedDecisions', label: 'Related decisions' },
	{ key: 'relatedRequirements', label: 'Related requirements' },
	{ key: 'relatedArtifacts', label: 'Related artifacts' },
	{ key: 'relatedPrinciples', label: 'Related principles' }
];

/** True when a string field carries meaningful (non-whitespace) content. */
function filled(value: string): boolean {
	return value.trim().length > 0;
}

/**
 * Evaluate an ADR draft: measure completeness over the core Tyree & Akerman
 * sections (plus the positions table), surface the chosen position, and flag
 * governance gaps. Pure — no side effects, no network, no storage.
 */
export function evaluateAdr(data: AdrFormData): AdrEvaluation {
	const a = data.adr;

	// Completeness: the core text sections plus a point for "≥1 position".
	const totalSections = CORE_SECTIONS.length + 1;
	let filledSections = CORE_SECTIONS.filter((s) => filled(a[s.key])).length;

	const positions = data.positions ?? [];
	const namedPositions = positions.filter((p) => filled(p.name));
	if (namedPositions.length > 0) filledSections += 1;

	const completeness = Math.round((filledSections / totalSections) * 100);

	const chosen = positions.find((p) => p.isChosen && filled(p.name));
	const chosenPosition = chosen ? chosen.name.trim() : '';

	const flags: AdrFlag[] = [];

	if (!filled(a.issue)) {
		flags.push({
			id: 'no-issue',
			category: 'Completeness',
			message: 'No issue / context recorded. State the problem the ADR addresses.',
			priority: 'high'
		});
	}
	if (!filled(a.decision)) {
		flags.push({
			id: 'no-decision',
			category: 'Completeness',
			message: 'No decision recorded. State the position chosen, clearly.',
			priority: 'high'
		});
	}
	if (namedPositions.length === 0) {
		flags.push({
			id: 'no-positions',
			category: 'Rigour',
			message: 'No alternative positions captured. Record the options considered.',
			priority: 'medium'
		});
	} else if (!chosenPosition) {
		flags.push({
			id: 'no-chosen-position',
			category: 'Rigour',
			message: 'None of the positions is marked as chosen. Mark exactly one.',
			priority: 'medium'
		});
	}
	if (!filled(a.argument)) {
		flags.push({
			id: 'no-argument',
			category: 'Rigour',
			message: 'No argument recorded. Explain why the decision was made.',
			priority: 'low'
		});
	}
	if ((a.status === 'approved' || a.status === 'decided') && !filled(a.signedOffBy)) {
		flags.push({
			id: 'unsigned',
			category: 'Governance',
			message: `Status is "${a.status}" but no sign-off is recorded.`,
			priority: 'medium'
		});
	}
	if (a.status === 'superseded' && !filled(a.relatedDecisions)) {
		flags.push({
			id: 'superseded-no-link',
			category: 'Governance',
			message: 'Superseded ADR does not link to the decision that replaces it.',
			priority: 'low'
		});
	}

	const order = { high: 0, medium: 1, low: 2 } as const;
	flags.sort((x, y) => order[x.priority] - order[y.priority]);

	return {
		status: a.status,
		filledSections,
		totalSections,
		completeness,
		positionCount: namedPositions.length,
		chosenPosition,
		flags,
		timestamp: new Date().toISOString()
	};
}
