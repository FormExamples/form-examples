import type { AssessmentData, DomainRule } from './types';

/**
 * The seven ASEPTIC domains, in order. Each entry names the AssessmentData
 * section and the stable domain key used across the grade / grade_rule SQL
 * tables.
 */
export const DOMAINS: { section: keyof AssessmentData; domain: string; label: string }[] = [
	{ section: 'appearance', domain: 'appearance-behaviour', label: 'Appearance and behaviour' },
	{ section: 'speech', domain: 'speech', label: 'Speech' },
	{ section: 'emotion', domain: 'emotion', label: 'Emotion (mood and affect)' },
	{ section: 'perception', domain: 'perception', label: 'Perception' },
	{ section: 'thought', domain: 'thought', label: 'Thought (form and content)' },
	{ section: 'insight', domain: 'insight', label: 'Insight and judgement' },
	{ section: 'cognition', domain: 'cognition', label: 'Cognition' }
];

/**
 * A domain is documented when at least one of its finding fields is non-blank
 * (`''` counts as blank). This is the sole documentation predicate — the MSE is
 * a completeness instrument, not a numeric score.
 */
export function sectionDocumented(data: AssessmentData, section: keyof AssessmentData): boolean {
	const group = data[section] as unknown as Record<string, unknown> | undefined;
	if (!group) return false;
	return Object.keys(group).some((k) => {
		const v = group[k];
		return v !== null && v !== undefined && String(v).trim() !== '';
	});
}

/**
 * Declarative MSE documentation rules — exactly one per ASEPTIC domain. Each
 * rule is satisfied when any finding field in its domain is recorded. The
 * grader (`mse-grader.ts`) evaluates every rule, counts documented domains, and
 * derives the completeness percentage and the complete / partial status. Rows
 * mirror the `mental_state_examination_grade_rule` SQL table.
 */
export const domainRules: DomainRule[] = DOMAINS.map((d, idx) => ({
	id: `R-DOMAIN-${String(idx + 1).padStart(2, '0')}-${d.domain.toUpperCase()}`,
	section: d.section,
	domain: d.domain,
	category: 'domain-documentation',
	label: d.label,
	description: `${d.label} domain documented (at least one finding recorded)`,
	satisfied: (data: AssessmentData) => sectionDocumented(data, d.section)
}));
