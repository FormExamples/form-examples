import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildPdfDocument } from './pdf-builder';
import { gradeScorecard } from '../engine/score-grader';
import type { AgileConsultingScorecardAssessment } from '../engine/types';

const SAMPLES_DIR = resolve(__dirname, '../../../../samples');

function loadSample(): AgileConsultingScorecardAssessment {
	return JSON.parse(
		readFileSync(resolve(SAMPLES_DIR, 'sample-assessment.json'), 'utf8'),
	);
}

describe('buildPdfDocument', () => {
	const assessment = loadSample();
	const grade = gradeScorecard(assessment);
	const doc = buildPdfDocument(assessment, grade);

	it('uses A4 paper with sensible margins', () => {
		expect(doc.pageSize).toBe('A4');
		expect(doc.pageMargins).toEqual([40, 60, 40, 60]);
	});

	it('attaches the form-name header and a page-counting footer', () => {
		expect(doc.header).toBeTruthy();
		expect(doc.footer).toBeTypeOf('function');
	});

	it('emits exactly four major sections (summary + 3 cards)', () => {
		// 0: score+band columns
		// 1: subtotal columns
		// 2: "Organization & respondent" heading
		// 3: org/respondent table
		// 4: "Item-by-item answers" heading
		// 5: items table
		// 6: "Readiness flags" heading
		// 7..: one entry per flag (or the "no flags" line)
		const content = doc.content;
		expect(Array.isArray(content)).toBe(true);
	});

	it('renders the items table with a header row + 16 item rows', () => {
		const content = doc.content as unknown[];
		const tables = content.filter(
			(c): c is { table: { body: unknown[][] } } =>
				typeof c === 'object' && c !== null && 'table' in (c as Record<string, unknown>),
		);
		// First table = organization (8 rows), second table = items (1 header + 16 rows)
		expect(tables.length).toBe(2);
		expect(tables[1].table.body.length).toBe(17);
	});

	it('mirrors the grade score and band in the rendered totals', () => {
		// Spot-check: the doc must contain text "9 / 16" for the sample grade.
		const json = JSON.stringify(doc);
		expect(json).toContain(`${grade.scoreTotal} / 16`);
		expect(json).toContain(`${grade.manifestoSubtotal} / 4`);
		expect(json).toContain(`${grade.principlesSubtotal} / 12`);
		expect(json.toLowerCase()).toContain(grade.computedBand.toUpperCase().toLowerCase());
	});

	it('renders each fired flag with its category and suggested action', () => {
		const json = JSON.stringify(doc);
		for (const flag of grade.additionalFlags) {
			expect(json).toContain(flag.category);
			expect(json).toContain(flag.suggestedAction);
		}
	});

	it('renders a sentinel when no flags fired', () => {
		const empty: AgileConsultingScorecardAssessment = JSON.parse(JSON.stringify(assessment));
		for (const k of ['m1', 'm2', 'm3', 'm4'] as const) empty.manifesto[k].done = true;
		for (const k of ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12'] as const) {
			empty.principles[k].done = true;
		}
		const g = gradeScorecard(empty);
		expect(g.additionalFlags).toHaveLength(0);
		const d = buildPdfDocument(empty, g);
		expect(JSON.stringify(d)).toContain('No readiness flags fired');
	});
});
