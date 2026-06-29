import { describe, expect, it } from 'vitest';
import { diffAssessments } from './diff';
import type {
	AgileConsultingScorecardAssessment,
	Answer,
	ChecklistItem,
} from './types';

function blankItem(done: Answer = null): ChecklistItem {
	return { done, evidence: '' };
}

function assessmentWith(
	m: [Answer, Answer, Answer, Answer],
	p: [Answer, Answer, Answer, Answer, Answer, Answer, Answer, Answer, Answer, Answer, Answer, Answer],
): AgileConsultingScorecardAssessment {
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
		manifesto: { m1: blankItem(m[0]), m2: blankItem(m[1]), m3: blankItem(m[2]), m4: blankItem(m[3]) },
		principles: {
			p1: blankItem(p[0]),  p2: blankItem(p[1]),  p3: blankItem(p[2]),  p4: blankItem(p[3]),
			p5: blankItem(p[4]),  p6: blankItem(p[5]),  p7: blankItem(p[6]),  p8: blankItem(p[7]),
			p9: blankItem(p[8]),  p10: blankItem(p[9]), p11: blankItem(p[10]), p12: blankItem(p[11]),
		},
	};
}

describe('diffAssessments — empty vs empty', () => {
	it('reports no deltas when both snapshots are blank', () => {
		const before = assessmentWith([null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null]);
		const after = assessmentWith([null, null, null, null], [null, null, null, null, null, null, null, null, null, null, null, null]);
		const d = diffAssessments(before, after);
		expect(d.scoreDelta).toBe(0);
		expect(d.bandChanged).toBe(false);
		expect(d.improved).toHaveLength(0);
		expect(d.regressed).toHaveLength(0);
		expect(d.newFlags).toHaveLength(0);
		expect(d.clearedFlags).toHaveLength(0);
		expect(d.items).toHaveLength(16);
		expect(d.items.every((i) => i.change === 'unchanged')).toBe(true);
	});
});

describe('diffAssessments — improvement loop', () => {
	it('reports +N score and per-item improvements', () => {
		const before = assessmentWith(
			[false, false, false, false],
			[false, false, false, false, null, null, null, null, null, null, null, null],
		);
		const after = assessmentWith(
			[true, true, false, false],
			[true, null, null, null, null, null, null, null, null, null, null, null],
		);
		const d = diffAssessments(before, after);
		expect(d.scoreDelta).toBe(3);
		expect(d.manifestoDelta).toBe(2);
		expect(d.principlesDelta).toBe(1);
		expect(d.improved.map((i) => i.itemKey)).toEqual(['m1', 'm2', 'p1']);
		expect(d.regressed).toHaveLength(0);
	});

	it('reports a band lift when crossing 4→5→6', () => {
		const before = assessmentWith(
			[true, true, true, true],
			[null, null, null, null, null, null, null, null, null, null, null, null],
		);
		const after = assessmentWith(
			[true, true, true, true],
			[true, true, null, null, null, null, null, null, null, null, null, null],
		);
		const d = diffAssessments(before, after);
		expect(d.scoreDelta).toBe(2);
		expect(d.bandBefore).toBe('low');
		expect(d.bandAfter).toBe('medium');
		expect(d.bandChanged).toBe(true);
	});
});

describe('diffAssessments — regression loop', () => {
	it('reports negative delta and per-item regressions', () => {
		const before = assessmentWith(
			[true, true, true, true],
			[true, true, true, null, null, null, null, null, null, null, null, null],
		);
		const after = assessmentWith(
			[true, true, false, false],
			[true, null, null, null, null, null, null, null, null, null, null, null],
		);
		const d = diffAssessments(before, after);
		expect(d.scoreDelta).toBe(-4);
		expect(d.regressed.map((i) => i.itemKey)).toEqual(['m3', 'm4', 'p2', 'p3']);
		expect(d.improved).toHaveLength(0);
	});
});

describe('diffAssessments — flag tracking', () => {
	it('reports newFlags when a regression triggers a flag', () => {
		// Before: m4 = true (no senior-leadership-buyin flag).
		// After:  m4 = false (flag fires).
		const before = assessmentWith(
			[null, null, null, true],
			[null, null, null, null, null, null, null, null, null, null, null, null],
		);
		const after = assessmentWith(
			[null, null, null, false],
			[null, null, null, null, null, null, null, null, null, null, null, null],
		);
		const d = diffAssessments(before, after);
		expect(d.newFlags.map((f) => f.category)).toContain('no-senior-leadership-buyin');
		expect(d.clearedFlags).toHaveLength(0);
	});

	it('reports clearedFlags when an improvement removes a flag', () => {
		// Before: p12 = false (no-reflection-culture flag).
		// After:  p12 = true (flag cleared).
		const before = assessmentWith(
			[null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null, null, false],
		);
		const after = assessmentWith(
			[null, null, null, null],
			[null, null, null, null, null, null, null, null, null, null, null, true],
		);
		const d = diffAssessments(before, after);
		expect(d.clearedFlags.map((f) => f.category)).toContain('no-reflection-culture');
		expect(d.newFlags).toHaveLength(0);
	});
});

describe('diffAssessments — change classification', () => {
	it('classifies the four transitions correctly', () => {
		const before = assessmentWith(
			[false, true, null, true],
			[null, false, null, null, null, null, null, null, null, null, null, null],
		);
		const after = assessmentWith(
			[true, false, true, null],
			[false, null, null, null, null, null, null, null, null, null, null, null],
		);
		const d = diffAssessments(before, after);
		const find = (key: string) => d.items.find((i) => i.itemKey === key)!;
		expect(find('m1').change).toBe('improved');   // false → true: yes is achieved
		expect(find('m2').change).toBe('regressed');  // true → false: yes is lost
		expect(find('m3').change).toBe('improved');   // null → true: yes is achieved
		expect(find('m4').change).toBe('regressed');  // true → null: yes is lost
		expect(find('p1').change).toBe('answered');   // null → false: now explicitly no
		expect(find('p2').change).toBe('cleared');    // false → null: removed an explicit answer
	});
});
