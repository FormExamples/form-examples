import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getRecommendedActions } from './recommendations';
import type { AgileConsultingScorecardAssessment, ChecklistItem } from './types';

const SAMPLES_DIR = resolve(__dirname, '../../../../samples');

function loadSample(): AgileConsultingScorecardAssessment {
	return JSON.parse(
		readFileSync(resolve(SAMPLES_DIR, 'sample-assessment.json'), 'utf8'),
	);
}

function blankItem(done: boolean | null = null): ChecklistItem {
	return { done, evidence: '' };
}

function blankAssessment(): AgileConsultingScorecardAssessment {
	return {
		organization: {
			organizationName: '', legalName: '', sector: '', sizeBand: '',
			headcount: null, country: '', region: '', website: '',
		},
		respondent: {
			respondentName: '', respondentEmail: '', respondentPhone: '',
			role: '', department: '', seniority: '', timezone: '',
			preferredContact: '',
		},
		assessment: { assessmentDate: '', status: 'draft' },
		manifesto: { m1: blankItem(), m2: blankItem(), m3: blankItem(), m4: blankItem() },
		principles: {
			p1: blankItem(), p2: blankItem(), p3: blankItem(), p4: blankItem(),
			p5: blankItem(), p6: blankItem(), p7: blankItem(), p8: blankItem(),
			p9: blankItem(), p10: blankItem(), p11: blankItem(), p12: blankItem(),
		},
	};
}

describe('getRecommendedActions', () => {
	it('returns nothing for an unanswered assessment', () => {
		expect(getRecommendedActions(blankAssessment())).toEqual([]);
	});

	it('returns nothing for an all-true assessment', () => {
		const a = blankAssessment();
		for (const k of ['m1', 'm2', 'm3', 'm4'] as const) a.manifesto[k].done = true;
		for (const k of [
			'p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12',
		] as const) {
			a.principles[k].done = true;
		}
		expect(getRecommendedActions(a)).toEqual([]);
	});

	it('returns one action per item marked false, in scorecard order', () => {
		const a = blankAssessment();
		a.manifesto.m3.done = false;
		a.principles.p1.done = false;
		a.principles.p7.done = false;
		const actions = getRecommendedActions(a);
		expect(actions.map((x) => x.itemKey)).toEqual(['m3', 'p1', 'p7']);
		for (const x of actions) {
			expect(x.heading.length).toBeGreaterThan(0);
			expect(x.intervention.length).toBeGreaterThan(0);
			expect(x.rationale.length).toBeGreaterThan(0);
		}
	});

	it('returns all 16 actions for an all-false assessment', () => {
		const a = blankAssessment();
		for (const k of ['m1', 'm2', 'm3', 'm4'] as const) a.manifesto[k].done = false;
		for (const k of [
			'p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12',
		] as const) {
			a.principles[k].done = false;
		}
		const actions = getRecommendedActions(a);
		expect(actions).toHaveLength(16);
		expect(actions[0].itemKey).toBe('m1');
		expect(actions[15].itemKey).toBe('p12');
	});

	it('matches the golden sample (7 false items → 7 actions)', () => {
		const a = loadSample();
		const actions = getRecommendedActions(a);
		// Sample has m3, p1, p5, p7, p9, p10, p11 = 7 false items.
		expect(actions.map((x) => x.itemKey)).toEqual([
			'm3', 'p1', 'p5', 'p7', 'p9', 'p10', 'p11',
		]);
	});

	it('skips unanswered items even when other items are false', () => {
		const a = blankAssessment();
		a.manifesto.m1.done = null;     // unanswered → skip
		a.manifesto.m2.done = false;    // false → include
		a.manifesto.m3.done = true;     // true → skip
		const actions = getRecommendedActions(a);
		expect(actions.map((x) => x.itemKey)).toEqual(['m2']);
	});
});
