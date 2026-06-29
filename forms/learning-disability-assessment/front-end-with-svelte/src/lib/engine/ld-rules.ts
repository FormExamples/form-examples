import type { AssessmentData, LDRule, SupportLevel } from './types';
import { levelScore } from './utils';

/**
 * Adaptive Functioning scoring rules.
 *
 * Each of the 10 adaptive-functioning items maps a single 4-option
 * SupportLevel response to a numeric score (0-3). The total adaptive score is
 * the mean of all answered items (range 0-3). Unanswered items return 0 and
 * are excluded from the answered-count tracker.
 *
 * Score → support requirement: 0 independent, 1 some, 2 significant, 3 full.
 * Severity is derived from the mean over the *answered* items (proportional),
 * so partial completion is still meaningful.
 */

/** Build a rule that delegates to a single adaptiveFunctioning field. */
function adaptiveRule(
	id: string,
	category: string,
	description: string,
	field: keyof AssessmentData['adaptiveFunctioning']
): LDRule {
	return {
		id,
		category,
		description,
		evaluate: (d) => {
			const v = d.adaptiveFunctioning[field] as SupportLevel;
			// Add 1 so an answered "independent" (score 0) still counts as
			// answered; the grader subtracts 1 to recover the true 0-3 weight.
			return v ? levelScore(v) + 1 : 0;
		}
	};
}

export const ldRules: LDRule[] = [
	adaptiveRule('LD-CON-001', 'Conceptual', 'Language and vocabulary', 'conceptualLanguage'),
	adaptiveRule('LD-CON-002', 'Conceptual', 'Reading and writing', 'conceptualReadingWriting'),
	adaptiveRule('LD-CON-003', 'Conceptual', 'Money, time and number concepts', 'conceptualMoneyTime'),
	adaptiveRule('LD-SOC-001', 'Social', 'Friendships and relationships', 'socialFriendships'),
	adaptiveRule('LD-SOC-002', 'Social', 'Empathy and social judgement', 'socialEmpathy'),
	adaptiveRule('LD-SOC-003', 'Social', 'Social communication', 'socialCommunication'),
	adaptiveRule('LD-PRA-001', 'Practical', 'Personal self-care (washing, dressing, eating)', 'practicalSelfCare'),
	adaptiveRule('LD-PRA-002', 'Practical', 'Home living (cooking, cleaning, household tasks)', 'practicalHomeLiving'),
	adaptiveRule('LD-PRA-003', 'Practical', 'Community use (shopping, transport, money)', 'practicalCommunity'),
	adaptiveRule('LD-PRA-004', 'Practical', 'Work or school skills', 'practicalWorkSchool')
];
