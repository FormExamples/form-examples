import { describe, it, expect } from 'vitest';
import { calculateEpdsGrade } from './epds-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { epdsItems, scoreForOption } from './epds-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			careSetting: '',
			assessedAt: '',
			perinatalStage: '',
			perinatalWeek: null
		},
		identification: {
			respondentIdentifier: '',
			ageBand: '',
			preferredLanguage: '',
			assistanceNeeded: ''
		},
		items: {
			item1: null,
			item2: null,
			item3: null,
			item4: null,
			item5: null,
			item6: null,
			item7: null,
			item8: null,
			item9: null,
			item10: null
		},
		note: { clinicalNote: '' }
	};
}

/** All items answered with their least-symptomatic printed option (total 0). */
function createNegativeAssessment(): AssessmentData {
	const d = createDefaultAssessment();
	// Normal items (1, 2, 4): option index 0 → score 0.
	d.items.item1 = 0;
	d.items.item2 = 0;
	d.items.item4 = 0;
	// Reverse items (3, 5, 6, 7, 8, 9, 10): option index 3 → score 0.
	d.items.item3 = 3;
	d.items.item5 = 3;
	d.items.item6 = 3;
	d.items.item7 = 3;
	d.items.item8 = 3;
	d.items.item9 = 3;
	d.items.item10 = 3;
	return d;
}

describe('EPDS reverse-scoring rule', () => {
	it('normal items score equal to the option index', () => {
		expect(scoreForOption('normal', 0)).toBe(0);
		expect(scoreForOption('normal', 3)).toBe(3);
	});

	it('reverse items invert the option index (3 - index)', () => {
		expect(scoreForOption('reverse', 0)).toBe(3);
		expect(scoreForOption('reverse', 3)).toBe(0);
		expect(scoreForOption('reverse', 1)).toBe(2);
	});

	it('returns null for an unanswered item', () => {
		expect(scoreForOption('reverse', null)).toBeNull();
		expect(scoreForOption('normal', undefined)).toBeNull();
	});

	it('items 3, 5, 6, 7, 8, 9 and 10 are the reverse-scored items', () => {
		const reverse = epdsItems.filter((it) => it.direction === 'reverse').map((it) => it.number);
		expect(reverse).toEqual([3, 5, 6, 7, 8, 9, 10]);
	});
});

describe('EPDS grading engine', () => {
	it('scores 0 for a fully-negative assessment (lower band)', () => {
		const r = calculateEpdsGrade(createNegativeAssessment());
		expect(r.totalScore).toBe(0);
		expect(r.band).toBe('lower');
		expect(r.selfHarmFlag).toBe(false);
		expect(r.itemScores).toHaveLength(10);
		expect(r.itemScores.every((s) => s === 0)).toBe(true);
	});

	it('scores 30 when every item is at its most-symptomatic option', () => {
		const d = createDefaultAssessment();
		// Normal items: option 3 → 3. Reverse items: option 0 → 3.
		d.items = {
			item1: 3,
			item2: 3,
			item3: 0,
			item4: 3,
			item5: 0,
			item6: 0,
			item7: 0,
			item8: 0,
			item9: 0,
			item10: 0
		};
		const r = calculateEpdsGrade(d);
		expect(r.totalScore).toBe(30);
		expect(r.band).toBe('likely');
	});

	it('band thresholds fire at 10 (possible) and 13 (likely)', () => {
		// Build a total of 9 via item1 (normal): max 3 each. 3+3+3 = 9.
		const d9 = createDefaultAssessment();
		d9.items.item1 = 3;
		d9.items.item2 = 3;
		d9.items.item4 = 3;
		expect(calculateEpdsGrade(d9).band).toBe('lower');

		// Total 10 → possible. Add item3 (reverse) option 2 → score 1.
		const d10 = createDefaultAssessment();
		d10.items.item1 = 3;
		d10.items.item2 = 3;
		d10.items.item4 = 3;
		d10.items.item3 = 2; // reverse: 3-2 = 1
		expect(calculateEpdsGrade(d10).totalScore).toBe(10);
		expect(calculateEpdsGrade(d10).band).toBe('possible');

		// Total 13 → likely.
		const d13 = createDefaultAssessment();
		d13.items.item1 = 3;
		d13.items.item2 = 3;
		d13.items.item4 = 3;
		d13.items.item3 = 0; // reverse: 3-0 = 3, → total 12
		d13.items.item5 = 2; // reverse: 3-2 = 1, → total 13
		expect(calculateEpdsGrade(d13).totalScore).toBe(13);
		expect(calculateEpdsGrade(d13).band).toBe('likely');
	});

	it('reverse-scores item 3 correctly (option 0 → score 3)', () => {
		const d = createNegativeAssessment();
		d.items.item3 = 0; // reverse: 3-0 = 3
		const r = calculateEpdsGrade(d);
		expect(r.itemScores[2]).toBe(3);
		expect(r.totalScore).toBe(3);
	});

	it('raises the item-10 self-harm flag for any option other than "Never"', () => {
		const d = createNegativeAssessment();
		d.items.item10 = 2; // "Hardly ever" → reverse 3-2 = 1 (positive)
		const r = calculateEpdsGrade(d);
		expect(r.item10Score).toBe(1);
		expect(r.selfHarmFlag).toBe(true);
		expect(r.flaggedIssues.some((f) => f.id === 'F-SELF-HARM-URGENT-001')).toBe(true);
	});

	it('does not raise the self-harm flag when item 10 is "Never"', () => {
		const d = createNegativeAssessment();
		d.items.item10 = 3; // "Never" → reverse 3-3 = 0
		const r = calculateEpdsGrade(d);
		expect(r.item10Score).toBe(0);
		expect(r.selfHarmFlag).toBe(false);
	});

	it('self-harm flag fires even with a low total (independent of band)', () => {
		const d = createNegativeAssessment();
		d.items.item10 = 0; // "Yes, quite often" → reverse 3-0 = 3
		const r = calculateEpdsGrade(d);
		expect(r.totalScore).toBe(3);
		expect(r.band).toBe('lower');
		expect(r.selfHarmFlag).toBe(true);
		expect(r.flaggedIssues[0].priority).toBe('urgent');
	});

	it('a missing item response contributes 0 to the total', () => {
		const r = calculateEpdsGrade(createDefaultAssessment());
		expect(r.totalScore).toBe(0);
		expect(r.band).toBe('lower');
	});

	it('all fired-item audit ids are unique', () => {
		const d = createNegativeAssessment();
		d.items.item1 = 3;
		const ids = calculateEpdsGrade(d).firedItems.map((f) => f.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('EPDS flagged-issue detection', () => {
	const grade = (data: AssessmentData) => {
		const r = calculateEpdsGrade(data);
		return { data, r };
	};

	it('raises no red flags for a complete negative assessment', () => {
		const { r } = grade(createNegativeAssessment());
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises the likely-depression flag (high) at total >= 13', () => {
		const d = createDefaultAssessment();
		d.items.item1 = 3;
		d.items.item2 = 3;
		d.items.item4 = 3;
		d.items.item3 = 0; // 3
		d.items.item5 = 2; // 1 → total 13
		const { r } = grade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-LIKELY-DEPRESSION-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when an item is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), {
			itemScores: new Array(10).fill(0),
			totalScore: 0,
			item10Score: 0,
			selfHarmFlag: false,
			anxietySubscale: 0
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = createNegativeAssessment();
		d.items.item10 = 0; // urgent
		d.items.item1 = 3;
		d.items.item2 = 3;
		d.items.item4 = 3;
		d.items.item3 = 0; // total high → high flag
		d.items.item5 = 2;
		const { r } = grade(d);
		const order: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
		expect(priorities[0]).toBe('urgent');
	});
});
