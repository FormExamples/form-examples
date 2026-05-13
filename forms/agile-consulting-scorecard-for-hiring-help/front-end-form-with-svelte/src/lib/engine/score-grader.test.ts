import { describe, expect, it } from 'vitest';
import { gradeScorecard } from './score-grader';
import type {
	AgileConsultingScorecardAssessment,
	Answer,
	ChecklistItem,
	ManifestoItems,
	PrinciplesItems,
} from './types';

function blankItem(done: Answer = null): ChecklistItem {
	return { done, evidence: '' };
}

function blankAssessment(
	manifestoOverrides: Partial<{ m1: Answer; m2: Answer; m3: Answer; m4: Answer }> = {},
	principlesOverrides: Partial<{
		p1: Answer; p2: Answer; p3: Answer; p4: Answer; p5: Answer; p6: Answer;
		p7: Answer; p8: Answer; p9: Answer; p10: Answer; p11: Answer; p12: Answer;
	}> = {},
): AgileConsultingScorecardAssessment {
	const manifesto: ManifestoItems = {
		m1: blankItem(manifestoOverrides.m1 ?? null),
		m2: blankItem(manifestoOverrides.m2 ?? null),
		m3: blankItem(manifestoOverrides.m3 ?? null),
		m4: blankItem(manifestoOverrides.m4 ?? null),
	};
	const principles: PrinciplesItems = {
		p1: blankItem(principlesOverrides.p1 ?? null),
		p2: blankItem(principlesOverrides.p2 ?? null),
		p3: blankItem(principlesOverrides.p3 ?? null),
		p4: blankItem(principlesOverrides.p4 ?? null),
		p5: blankItem(principlesOverrides.p5 ?? null),
		p6: blankItem(principlesOverrides.p6 ?? null),
		p7: blankItem(principlesOverrides.p7 ?? null),
		p8: blankItem(principlesOverrides.p8 ?? null),
		p9: blankItem(principlesOverrides.p9 ?? null),
		p10: blankItem(principlesOverrides.p10 ?? null),
		p11: blankItem(principlesOverrides.p11 ?? null),
		p12: blankItem(principlesOverrides.p12 ?? null),
	};
	return {
		organization: {
			organizationName: '',
			legalName: '',
			sector: '',
			sizeBand: '',
			headcount: null,
			country: '',
			region: '',
			website: '',
		},
		respondent: {
			respondentName: '',
			respondentEmail: '',
			respondentPhone: '',
			role: '',
			department: '',
			seniority: '',
			timezone: '',
			preferredContact: '',
		},
		assessment: {
			assessmentDate: '',
			status: 'draft',
		},
		manifesto,
		principles,
	};
}

function allTrue(): AgileConsultingScorecardAssessment {
	const a = blankAssessment(
		{ m1: true, m2: true, m3: true, m4: true },
		{
			p1: true, p2: true, p3: true, p4: true, p5: true, p6: true,
			p7: true, p8: true, p9: true, p10: true, p11: true, p12: true,
		},
	);
	return a;
}

function allFalse(): AgileConsultingScorecardAssessment {
	return blankAssessment(
		{ m1: false, m2: false, m3: false, m4: false },
		{
			p1: false, p2: false, p3: false, p4: false, p5: false, p6: false,
			p7: false, p8: false, p9: false, p10: false, p11: false, p12: false,
		},
	);
}

describe('gradeScorecard — totals and bands', () => {
	it('all unanswered → score 0, band low', () => {
		const r = gradeScorecard(blankAssessment());
		expect(r.scoreTotal).toBe(0);
		expect(r.manifestoSubtotal).toBe(0);
		expect(r.principlesSubtotal).toBe(0);
		expect(r.computedBand).toBe('low');
		expect(r.recommendation).toBe('do-not-hire-yet');
	});

	it('all true → score 16, band high', () => {
		const r = gradeScorecard(allTrue());
		expect(r.scoreTotal).toBe(16);
		expect(r.manifestoSubtotal).toBe(4);
		expect(r.principlesSubtotal).toBe(12);
		expect(r.computedBand).toBe('high');
		expect(r.recommendation).toBe('trial-engagement');
	});

	it('all false → score 0, band low', () => {
		const r = gradeScorecard(allFalse());
		expect(r.scoreTotal).toBe(0);
		expect(r.computedBand).toBe('low');
	});

	it('boundary: total 4 → low', () => {
		const r = gradeScorecard(
			blankAssessment({ m1: true, m2: true, m3: true, m4: true }, {}),
		);
		expect(r.scoreTotal).toBe(4);
		expect(r.computedBand).toBe('low');
	});

	it('boundary: total 5 → borderline', () => {
		const r = gradeScorecard(
			blankAssessment(
				{ m1: true, m2: true, m3: true, m4: true },
				{ p1: true },
			),
		);
		expect(r.scoreTotal).toBe(5);
		expect(r.computedBand).toBe('borderline');
		expect(r.recommendation).toBe('do-homework-first');
	});

	it('boundary: total 6 → medium', () => {
		const r = gradeScorecard(
			blankAssessment(
				{ m1: true, m2: true, m3: true, m4: true },
				{ p1: true, p2: true },
			),
		);
		expect(r.scoreTotal).toBe(6);
		expect(r.computedBand).toBe('medium');
	});

	it('boundary: total 10 → medium', () => {
		const r = gradeScorecard(
			blankAssessment(
				{ m1: true, m2: true, m3: true, m4: true },
				{ p1: true, p2: true, p3: true, p4: true, p5: true, p6: true },
			),
		);
		expect(r.scoreTotal).toBe(10);
		expect(r.computedBand).toBe('medium');
	});

	it('boundary: total 11 → high', () => {
		const r = gradeScorecard(
			blankAssessment(
				{ m1: true, m2: true, m3: true, m4: true },
				{ p1: true, p2: true, p3: true, p4: true, p5: true, p6: true, p7: true },
			),
		);
		expect(r.scoreTotal).toBe(11);
		expect(r.computedBand).toBe('high');
	});

	it('null answers do not count as points', () => {
		const r = gradeScorecard(blankAssessment({ m1: null, m2: true }, {}));
		expect(r.scoreTotal).toBe(1);
	});
});

describe('gradeScorecard — fired rules', () => {
	it('fires 16 item rules + 1 composite rule', () => {
		const r = gradeScorecard(allTrue());
		expect(r.firedRules).toHaveLength(17);
		expect(r.firedRules.filter((x) => x.instrument === 'manifesto')).toHaveLength(4);
		expect(r.firedRules.filter((x) => x.instrument === 'principles')).toHaveLength(12);
		expect(r.firedRules.filter((x) => x.instrument === 'composite')).toHaveLength(1);
	});

	it('item rule grade reflects answer (yes/no/unanswered)', () => {
		const r = gradeScorecard(blankAssessment({ m1: true, m2: false, m3: null, m4: null }, {}));
		const m1 = r.firedRules.find((x) => x.ruleId === 'R-MANIFESTO-1');
		const m2 = r.firedRules.find((x) => x.ruleId === 'R-MANIFESTO-2');
		const m3 = r.firedRules.find((x) => x.ruleId === 'R-MANIFESTO-3');
		expect(m1?.grade).toBe('yes');
		expect(m1?.pointsAwarded).toBe(1);
		expect(m2?.grade).toBe('no');
		expect(m2?.pointsAwarded).toBe(0);
		expect(m3?.grade).toBe('unanswered');
		expect(m3?.pointsAwarded).toBe(0);
	});
});

describe('gradeScorecard — readiness flags', () => {
	it('m4=false fires no-senior-leadership-buyin', () => {
		const r = gradeScorecard(blankAssessment({ m4: false }, {}));
		expect(r.additionalFlags.map((f) => f.category)).toContain('no-senior-leadership-buyin');
	});

	it('m1=false fires no-customer-contact', () => {
		const r = gradeScorecard(blankAssessment({ m1: false }, {}));
		expect(r.additionalFlags.map((f) => f.category)).toContain('no-customer-contact');
	});

	it('p1=false fires no-customer-contact', () => {
		const r = gradeScorecard(blankAssessment({}, { p1: false }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('no-customer-contact');
	});

	it('m2=false AND p7=false fires no-working-software', () => {
		const r = gradeScorecard(blankAssessment({ m2: false }, { p7: false }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('no-working-software');
	});

	it('m2=false alone does NOT fire no-working-software (needs p7=false too)', () => {
		const r = gradeScorecard(blankAssessment({ m2: false }, {}));
		expect(r.additionalFlags.map((f) => f.category)).not.toContain('no-working-software');
	});

	it('p8=false fires no-sustainable-budget', () => {
		const r = gradeScorecard(blankAssessment({}, { p8: false }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('no-sustainable-budget');
	});

	it('p11=false fires no-self-organization', () => {
		const r = gradeScorecard(blankAssessment({}, { p11: false }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('no-self-organization');
	});

	it('p12=false fires no-reflection-culture', () => {
		const r = gradeScorecard(blankAssessment({}, { p12: false }));
		expect(r.additionalFlags.map((f) => f.category)).toContain('no-reflection-culture');
	});

	it('all false fires every readiness flag', () => {
		const r = gradeScorecard(allFalse());
		const cats = r.additionalFlags.map((f) => f.category);
		expect(cats).toContain('no-senior-leadership-buyin');
		expect(cats).toContain('no-customer-contact');
		expect(cats).toContain('no-working-software');
		expect(cats).toContain('no-sustainable-budget');
		expect(cats).toContain('no-self-organization');
		expect(cats).toContain('no-reflection-culture');
	});

	it('null (unanswered) does NOT fire any flag', () => {
		const r = gradeScorecard(blankAssessment());
		expect(r.additionalFlags).toHaveLength(0);
	});
});
