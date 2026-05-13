import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gradeScorecard } from './score-grader';
import { parseAssessment, safeParseAssessment } from './schema';

const SAMPLES_DIR = resolve(__dirname, '../../../../samples');

describe('parseAssessment — golden sample', () => {
	it('accepts the canonical sample-assessment.json', () => {
		const raw = JSON.parse(
			readFileSync(resolve(SAMPLES_DIR, 'sample-assessment.json'), 'utf8'),
		);
		const parsed = parseAssessment(raw);
		// Round-tripping the parsed value through the engine must still
		// match the golden grade — proves zod parsing does not mutate the
		// scoring inputs.
		const grade = gradeScorecard(parsed);
		expect(grade.scoreTotal).toBe(9);
		expect(grade.computedBand).toBe('medium');
	});
});

describe('safeParseAssessment — rejection cases', () => {
	it('rejects an assessment with an unknown sector', () => {
		const r = safeParseAssessment({
			organization: { organizationName: 'X', sector: 'BOGUS', sizeBand: '' },
			respondent: { respondentName: 'Y', respondentEmail: '', role: '' },
			assessment: { assessmentDate: '' },
			manifesto: {
				m1: { done: null, evidence: '' },
				m2: { done: null, evidence: '' },
				m3: { done: null, evidence: '' },
				m4: { done: null, evidence: '' },
			},
			principles: {
				p1:  { done: null, evidence: '' }, p2:  { done: null, evidence: '' },
				p3:  { done: null, evidence: '' }, p4:  { done: null, evidence: '' },
				p5:  { done: null, evidence: '' }, p6:  { done: null, evidence: '' },
				p7:  { done: null, evidence: '' }, p8:  { done: null, evidence: '' },
				p9:  { done: null, evidence: '' }, p10: { done: null, evidence: '' },
				p11: { done: null, evidence: '' }, p12: { done: null, evidence: '' },
			},
		});
		expect(r.success).toBe(false);
		if (!r.success) {
			const sectorIssue = r.error.issues.find((i) => i.path.join('.') === 'organization.sector');
			expect(sectorIssue).toBeDefined();
		}
	});

	it('rejects an assessment missing a manifesto item', () => {
		const r = safeParseAssessment({
			organization: { organizationName: '', sector: '', sizeBand: '' },
			respondent: { respondentName: '', respondentEmail: '', role: '' },
			assessment: { assessmentDate: '' },
			manifesto: {
				m1: { done: null, evidence: '' },
				m2: { done: null, evidence: '' },
				// m3 missing
				m4: { done: null, evidence: '' },
			},
			principles: {
				p1:  { done: null, evidence: '' }, p2:  { done: null, evidence: '' },
				p3:  { done: null, evidence: '' }, p4:  { done: null, evidence: '' },
				p5:  { done: null, evidence: '' }, p6:  { done: null, evidence: '' },
				p7:  { done: null, evidence: '' }, p8:  { done: null, evidence: '' },
				p9:  { done: null, evidence: '' }, p10: { done: null, evidence: '' },
				p11: { done: null, evidence: '' }, p12: { done: null, evidence: '' },
			},
		});
		expect(r.success).toBe(false);
		if (!r.success) {
			const m3Issue = r.error.issues.find((i) => i.path.join('.') === 'manifesto.m3');
			expect(m3Issue).toBeDefined();
		}
	});

	it('rejects a checklist item with a non-boolean done value', () => {
		const r = safeParseAssessment({
			organization: { organizationName: '', sector: '', sizeBand: '' },
			respondent: { respondentName: '', respondentEmail: '', role: '' },
			assessment: { assessmentDate: '' },
			manifesto: {
				m1: { done: 'yes', evidence: '' }, // string, not boolean|null
				m2: { done: null, evidence: '' },
				m3: { done: null, evidence: '' },
				m4: { done: null, evidence: '' },
			},
			principles: {
				p1:  { done: null, evidence: '' }, p2:  { done: null, evidence: '' },
				p3:  { done: null, evidence: '' }, p4:  { done: null, evidence: '' },
				p5:  { done: null, evidence: '' }, p6:  { done: null, evidence: '' },
				p7:  { done: null, evidence: '' }, p8:  { done: null, evidence: '' },
				p9:  { done: null, evidence: '' }, p10: { done: null, evidence: '' },
				p11: { done: null, evidence: '' }, p12: { done: null, evidence: '' },
			},
		});
		expect(r.success).toBe(false);
		if (!r.success) {
			const m1DoneIssue = r.error.issues.find(
				(i) => i.path.join('.') === 'manifesto.m1.done',
			);
			expect(m1DoneIssue).toBeDefined();
		}
	});
});
