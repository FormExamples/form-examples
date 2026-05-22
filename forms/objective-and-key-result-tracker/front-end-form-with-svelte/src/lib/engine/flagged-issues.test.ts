import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { gradeObjective } from './composite-grader';

const FIXTURES_DIR = path.resolve(__dirname, '../../../../test-fixtures/scoring');

interface Fixture {
	name: string;
	input: any;
	expected: { computedCompositeRag: 'green' | 'amber' | 'red'; expectedFlags: { flagCode: string; priority: string }[] };
}

describe('gradeObjective — every fixture', () => {
	const files = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json'));
	for (const file of files) {
		const fx: Fixture = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf8'));
		it(`${file}: ${fx.name}`, () => {
			const r = gradeObjective(fx.input);
			expect(r.computedCompositeRag).toBe(fx.expected.computedCompositeRag);
			const got = r.flags.map((f) => f.flagCode).sort();
			const want = fx.expected.expectedFlags.map((f) => f.flagCode).sort();
			expect(got).toEqual(want);
		});
	}
});
