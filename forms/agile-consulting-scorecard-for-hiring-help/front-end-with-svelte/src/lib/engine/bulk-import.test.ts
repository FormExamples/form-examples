import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseJsonl } from './bulk-import';

const SAMPLES_DIR = resolve(__dirname, '../../../../samples');

const GOLDEN_LINE = readFileSync(
	resolve(SAMPLES_DIR, 'sample-assessment.json'),
	'utf8',
)
	.replace(/\n/g, ' ')
	.replace(/\s+/g, ' ')
	.trim();

describe('parseJsonl — empty input', () => {
	it('returns empty result for empty string', () => {
		const r = parseJsonl('');
		expect(r.accepted).toEqual([]);
		expect(r.rejected).toEqual([]);
		expect(r.totalLines).toBe(1); // split returns [''] for ''
		expect(r.skippedBlank).toBe(1);
	});

	it('returns empty result for whitespace-only input', () => {
		const r = parseJsonl('   \n\n   \n');
		expect(r.accepted).toEqual([]);
		expect(r.rejected).toEqual([]);
		expect(r.skippedBlank).toBeGreaterThan(0);
	});
});

describe('parseJsonl — happy path', () => {
	it('accepts a single valid line', () => {
		const r = parseJsonl(GOLDEN_LINE);
		expect(r.accepted).toHaveLength(1);
		expect(r.rejected).toHaveLength(0);
		expect(r.accepted[0].lineNumber).toBe(1);
		expect(r.accepted[0].grade.scoreTotal).toBe(9);
		expect(r.accepted[0].grade.computedBand).toBe('medium');
	});

	it('accepts three identical golden lines', () => {
		const r = parseJsonl([GOLDEN_LINE, GOLDEN_LINE, GOLDEN_LINE].join('\n'));
		expect(r.accepted).toHaveLength(3);
		expect(r.accepted.map((a) => a.lineNumber)).toEqual([1, 2, 3]);
		expect(r.accepted.every((a) => a.grade.scoreTotal === 9)).toBe(true);
	});

	it('skips blank lines without rejecting them', () => {
		const r = parseJsonl(`\n${GOLDEN_LINE}\n\n${GOLDEN_LINE}\n`);
		expect(r.accepted).toHaveLength(2);
		expect(r.accepted[0].lineNumber).toBe(2);
		expect(r.accepted[1].lineNumber).toBe(4);
		expect(r.skippedBlank).toBeGreaterThanOrEqual(2);
	});

	it('skips comment lines that start with #', () => {
		const r = parseJsonl(
			[
				'# this is a comment',
				GOLDEN_LINE,
				'   # indented comment',
				GOLDEN_LINE,
			].join('\n'),
		);
		expect(r.accepted).toHaveLength(2);
		expect(r.skippedComment).toBe(2);
		expect(r.accepted[0].lineNumber).toBe(2);
		expect(r.accepted[1].lineNumber).toBe(4);
	});
});

describe('parseJsonl — error paths', () => {
	it('rejects a malformed-JSON line with a parse-error diagnostic', () => {
		const r = parseJsonl('{not valid json');
		expect(r.accepted).toHaveLength(0);
		expect(r.rejected).toHaveLength(1);
		expect(r.rejected[0].lineNumber).toBe(1);
		expect(r.rejected[0].error).toMatch(/JSON parse error/);
	});

	it('rejects a schema-violating line with a zod diagnostic', () => {
		const bad = JSON.stringify({
			organization: { organizationName: '', sector: 'BOGUS', sizeBand: '' },
			respondent: { respondentName: '', respondentEmail: '', role: '' },
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
		const r = parseJsonl(bad);
		expect(r.accepted).toHaveLength(0);
		expect(r.rejected).toHaveLength(1);
		expect(r.rejected[0].error).toMatch(/schema validation failed/);
		expect(r.rejected[0].error).toContain('organization.sector');
	});

	it('mixed input: keeps line numbers stable across accepted + rejected', () => {
		const r = parseJsonl(
			[
				GOLDEN_LINE, // 1 accepted
				'not json',  // 2 rejected
				'',          // 3 blank
				'# comment', // 4 skipped
				GOLDEN_LINE, // 5 accepted
			].join('\n'),
		);
		expect(r.accepted.map((a) => a.lineNumber)).toEqual([1, 5]);
		expect(r.rejected.map((a) => a.lineNumber)).toEqual([2]);
		expect(r.totalLines).toBe(5);
		expect(r.skippedBlank).toBe(1);
		expect(r.skippedComment).toBe(1);
	});
});
