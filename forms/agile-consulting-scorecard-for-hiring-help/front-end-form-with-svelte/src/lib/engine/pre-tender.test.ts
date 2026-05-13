import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { toPreTenderSummary } from './pre-tender';
import { gradeScorecard } from './score-grader';
import type { AgileConsultingScorecardAssessment } from './types';

const SAMPLES_DIR = resolve(__dirname, '../../../../samples');

function loadGolden(): AgileConsultingScorecardAssessment {
	return JSON.parse(
		readFileSync(resolve(SAMPLES_DIR, 'sample-assessment.json'), 'utf8'),
	);
}

describe('toPreTenderSummary — shape', () => {
	const data = loadGolden();
	const grade = gradeScorecard(data);
	const summary = toPreTenderSummary(data, grade);

	it('stamps a schema version', () => {
		expect(summary.$schemaVersion).toBe(1);
	});

	it('keeps organization name, sector, size band — drops the rest', () => {
		expect(summary.organization.organizationName).toBe(data.organization.organizationName);
		expect(summary.organization.sector).toBe(data.organization.sector);
		expect(summary.organization.sizeBand).toBe(data.organization.sizeBand);
		expect(Object.keys(summary.organization).sort()).toEqual(
			['organizationName', 'sector', 'sizeBand'].sort(),
		);
	});

	it('keeps the assessment date and nothing else', () => {
		expect(summary.assessment.assessmentDate).toBe(data.assessment.assessmentDate);
		expect(Object.keys(summary.assessment)).toEqual(['assessmentDate']);
	});

	it('mirrors the engine score, subtotals, band, and recommendation', () => {
		expect(summary.score.total).toBe(grade.scoreTotal);
		expect(summary.score.manifestoSubtotal).toBe(grade.manifestoSubtotal);
		expect(summary.score.principlesSubtotal).toBe(grade.principlesSubtotal);
		expect(summary.score.band).toBe(grade.computedBand);
		expect(summary.score.recommendation).toBe('do-homework-first');
	});

	it('keeps flag categories + priorities, drops descriptions and actions', () => {
		expect(summary.flags).toHaveLength(grade.additionalFlags.length);
		for (let i = 0; i < summary.flags.length; i++) {
			expect(summary.flags[i].category).toBe(grade.additionalFlags[i].category);
			expect(summary.flags[i].priority).toBe(grade.additionalFlags[i].priority);
			expect(Object.keys(summary.flags[i]).sort()).toEqual(['category', 'priority']);
		}
	});
});

describe('toPreTenderSummary — redaction', () => {
	const data = loadGolden();
	const grade = gradeScorecard(data);
	const summary = toPreTenderSummary(data, grade);
	const json = JSON.stringify(summary);

	it('does not leak respondent name or email', () => {
		expect(json).not.toContain(data.respondent.respondentName);
		expect(json).not.toContain(data.respondent.respondentEmail);
	});

	it('does not leak per-item evidence text', () => {
		const evidenceTexts = [
			data.manifesto.m1.evidence,
			data.manifesto.m2.evidence,
			data.manifesto.m4.evidence,
			data.principles.p2.evidence,
			data.principles.p11.evidence,
		].filter((s) => s.length > 0);
		expect(evidenceTexts.length).toBeGreaterThan(0);
		for (const t of evidenceTexts) {
			expect(json).not.toContain(t);
		}
	});

	it('does not include the legal name, headcount, region, or website', () => {
		expect(json).not.toContain(data.organization.legalName);
		expect(json).not.toContain(String(data.organization.headcount));
		expect(json).not.toContain(data.organization.region);
		expect(json).not.toContain(data.organization.website);
	});

	it('does not include per-item answers (the 16 done flags)', () => {
		// The redacted JSON should never contain raw "done": true|false markers.
		expect(json).not.toMatch(/"done"\s*:\s*(true|false|null)/);
	});
});
