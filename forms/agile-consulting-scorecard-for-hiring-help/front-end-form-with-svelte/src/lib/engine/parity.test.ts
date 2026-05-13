import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { gradeScorecard } from './score-grader';
import type { AgileConsultingScorecardAssessment, GradeResult } from './types';

// Engine-parity guard. The TypeScript engine here, the Rust engine in
// `full-stack-with-loco-tera-htmx-alpine/src/scoring/grader.rs`, and the
// vanilla JS engine in `front-end-form-with-html/index.html` must all
// produce the same `GradeResult` for `samples/sample-assessment.json`.
//
// To regenerate the golden file when the engine changes, run:
//   cd full-stack-with-loco-tera-htmx-alpine
//   cargo run --quiet --bin agile-consulting-scorecard-cli \
//       < ../samples/sample-assessment.json \
//       > ../samples/sample-grade.json
const SAMPLES_DIR = resolve(__dirname, '../../../../samples');

describe('engine parity — golden samples', () => {
	it('matches sample-grade.json on sample-assessment.json', () => {
		const assessment: AgileConsultingScorecardAssessment = JSON.parse(
			readFileSync(resolve(SAMPLES_DIR, 'sample-assessment.json'), 'utf8'),
		);
		const expected: GradeResult = JSON.parse(
			readFileSync(resolve(SAMPLES_DIR, 'sample-grade.json'), 'utf8'),
		);
		const actual = gradeScorecard(assessment);
		expect(actual).toEqual(expected);
	});
});
