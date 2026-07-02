import { describe, it, expect } from 'vitest';
import { calculateZaritGrade, burdenBandFor } from './zarit-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { SHORT_FORM_ITEMS, zaritItems } from './zarit-rules';
import type { AssessmentData, Items } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	const items = {} as Items;
	for (let i = 1; i <= 22; i++) items[`item${i}` as keyof Items] = null;
	return {
		context: {
			practitionerName: '',
			practitionerRole: '',
			assessedAt: '',
			careSetting: '',
			instrumentForm: 'zbi22'
		},
		carer: {
			carerIdentifier: '',
			carerRelationship: '',
			carerCoResident: '',
			careHoursPerWeek: null
		},
		recipient: { recipientIdentifier: '', recipientCondition: '' },
		items,
		note: { clinicalNote: '' }
	};
}

/** Set every one of the twenty-two items to `value`. */
function fillItems(value: number | null): Items {
	const items = {} as Items;
	for (let i = 1; i <= 22; i++) items[`item${i}` as keyof Items] = value;
	return items;
}

describe('ZBI item set', () => {
	it('has 22 items and the correct 12-item short-form subset', () => {
		expect(zaritItems).toHaveLength(22);
		expect(SHORT_FORM_ITEMS).toEqual([1, 2, 3, 6, 9, 10, 11, 12, 17, 20, 21, 22]);
		const shortFormNumbers = zaritItems.filter((it) => it.shortForm).map((it) => it.number);
		expect(shortFormNumbers).toEqual(SHORT_FORM_ITEMS);
	});

	it('marks item 22 as the global burden item', () => {
		expect(zaritItems.find((it) => it.number === 22)?.global).toBe(true);
	});
});

describe('ZBI-22 grading engine', () => {
	it('scores 0 (little-or-none) for an all-zero assessment', () => {
		const d = createDefaultAssessment();
		d.items = fillItems(0);
		const r = calculateZaritGrade(d);
		expect(r.totalScore).toBe(0);
		expect(r.maxScore).toBe(88);
		expect(r.burdenBand).toBe('little-or-none');
	});

	it('scores 88 (severe) when every item is at its maximum', () => {
		const d = createDefaultAssessment();
		d.items = fillItems(4);
		const r = calculateZaritGrade(d);
		expect(r.totalScore).toBe(88);
		expect(r.burdenBand).toBe('severe');
	});

	it('a missing item rating contributes 0 to the total', () => {
		const r = calculateZaritGrade(createDefaultAssessment());
		expect(r.totalScore).toBe(0);
		expect(r.burdenBand).toBe('little-or-none');
	});

	it('applies the ZBI-22 band boundaries at 21/22, 40/41 and 60/61', () => {
		expect(burdenBandFor(21, 'zbi22')).toBe('little-or-none');
		expect(burdenBandFor(22, 'zbi22')).toBe('mild-to-moderate');
		expect(burdenBandFor(40, 'zbi22')).toBe('mild-to-moderate');
		expect(burdenBandFor(41, 'zbi22')).toBe('moderate-to-severe');
		expect(burdenBandFor(60, 'zbi22')).toBe('moderate-to-severe');
		expect(burdenBandFor(61, 'zbi22')).toBe('severe');
	});

	it('derives the band boundary from summed item ratings', () => {
		// 22 items: 20 items at 2 (=40) → mild-to-moderate.
		const d40 = createDefaultAssessment();
		d40.items = { ...fillItems(2), item21: 0, item22: 0 };
		expect(calculateZaritGrade(d40).totalScore).toBe(40);
		expect(calculateZaritGrade(d40).burdenBand).toBe('mild-to-moderate');

		// Bump one item to cross into moderate-to-severe (41).
		const d41 = createDefaultAssessment();
		d41.items = { ...fillItems(2), item21: 0, item22: 1 };
		expect(calculateZaritGrade(d41).totalScore).toBe(41);
		expect(calculateZaritGrade(d41).burdenBand).toBe('moderate-to-severe');
	});
});

describe('ZBI-12 short-form grading engine', () => {
	it('scores only the 12-item subset and caps at 48', () => {
		const d = createDefaultAssessment();
		d.context.instrumentForm = 'zbi12';
		// All 22 items at 4; only the 12 short-form items count → 48.
		d.items = fillItems(4);
		const r = calculateZaritGrade(d);
		expect(r.maxScore).toBe(48);
		expect(r.totalScore).toBe(48);
		expect(r.burdenBand).toBe('high');
	});

	it('ignores non-subset items in the total', () => {
		const d = createDefaultAssessment();
		d.context.instrumentForm = 'zbi12';
		// Non-subset items set high; subset items all 0 → total 0.
		d.items = { ...fillItems(0), item4: 4, item5: 4, item7: 4, item8: 4 };
		expect(calculateZaritGrade(d).totalScore).toBe(0);
	});

	it('applies the ZBI-12 high-burden cut-off at 16/17', () => {
		expect(burdenBandFor(16, 'zbi12')).toBe('lower');
		expect(burdenBandFor(17, 'zbi12')).toBe('high');
	});

	it('crosses lower → high on the subset total at 16/17', () => {
		// Eight subset items at 2 (=16) → lower.
		const lower = createDefaultAssessment();
		lower.context.instrumentForm = 'zbi12';
		lower.items = { ...fillItems(0), item1: 2, item2: 2, item3: 2, item6: 2, item9: 2, item10: 2, item11: 2, item12: 2 };
		expect(calculateZaritGrade(lower).totalScore).toBe(16);
		expect(calculateZaritGrade(lower).burdenBand).toBe('lower');

		// Add one point on a subset item (item17) → 17, high.
		const high = createDefaultAssessment();
		high.context.instrumentForm = 'zbi12';
		high.items = { ...fillItems(0), item1: 2, item2: 2, item3: 2, item6: 2, item9: 2, item10: 2, item11: 2, item12: 2, item17: 1 };
		expect(calculateZaritGrade(high).totalScore).toBe(17);
		expect(calculateZaritGrade(high).burdenBand).toBe('high');
	});
});

describe('ZBI flagged-issue detection', () => {
	it('raises no red flags for a complete all-zero ZBI-22 assessment', () => {
		const d = createDefaultAssessment();
		d.items = fillItems(0);
		expect(calculateZaritGrade(d).flaggedIssues).toHaveLength(0);
	});

	it('raises the severe-burden flag (high) at ZBI-22 total >= 61', () => {
		const d = createDefaultAssessment();
		d.items = fillItems(3); // 66 → severe
		const r = calculateZaritGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-SEVERE-BURDEN-001')).toBe(true);
	});

	it('raises the moderate-to-severe flag (ZBI-22, 41-60)', () => {
		const d = createDefaultAssessment();
		d.items = { ...fillItems(2), item9: 3, item17: 3, item22: 3 }; // 47
		const r = calculateZaritGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-MODERATE-TO-SEVERE-BURDEN-001')).toBe(true);
	});

	it('raises the carer mental-health screen when item 22 is maximal', () => {
		const d = createDefaultAssessment();
		d.items = { ...fillItems(0), item22: 4 };
		const r = calculateZaritGrade(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-CARER-MENTAL-HEALTH-SCREEN-001')).toBe(true);
		expect(r.flaggedIssues.some((f) => f.id === 'F-HIGH-GLOBAL-BURDEN-001')).toBe(true);
	});

	it('raises the ZBI-12 severe-burden flag at the high cut-off', () => {
		const d = createDefaultAssessment();
		d.context.instrumentForm = 'zbi12';
		d.items = { ...fillItems(0), item1: 2, item2: 2, item3: 2, item6: 2, item9: 2, item10: 2, item11: 2, item12: 2, item17: 1 };
		const r = calculateZaritGrade(d);
		expect(r.totalScore).toBe(17);
		expect(r.flaggedIssues.some((f) => f.id === 'F-SEVERE-BURDEN-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when an active item is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), {
			totalScore: 0,
			instrumentForm: 'zbi22'
		});
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high before medium before low)', () => {
		const d = createDefaultAssessment();
		d.items = { ...fillItems(3), item22: 4 }; // severe + global maximal, all answered
		const r = calculateZaritGrade(d);
		const order: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('all fired-item audit ids are unique', () => {
		const d = createDefaultAssessment();
		d.items = fillItems(2);
		const ids = calculateZaritGrade(d).firedItems.map((f) => f.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
