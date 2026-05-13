import type { AgileConsultingScorecardAssessment, GradeResult } from './types';
import { gradeScorecard } from './score-grader';
import { safeParseAssessment } from './schema';

/** One successfully imported row. */
export interface AcceptedImport {
	lineNumber: number; // 1-based, matches editor line numbers
	assessment: AgileConsultingScorecardAssessment;
	grade: GradeResult;
}

/** One rejected row, with a human-readable diagnostic. */
export interface RejectedImport {
	lineNumber: number;
	rawLine: string;
	error: string;
}

export interface BulkImportResult {
	accepted: AcceptedImport[];
	rejected: RejectedImport[];
	totalLines: number;
	skippedBlank: number;
	skippedComment: number;
}

/**
 * Parse a JSON-Lines document into validated assessments.
 *
 * Convention:
 *   - One JSON object per line (no trailing comma).
 *   - Blank lines are skipped silently.
 *   - Lines whose first non-whitespace character is `#` are treated as
 *     comments and skipped silently.
 *   - Every other line is parsed as JSON, validated with the zod
 *     `AgileConsultingScorecardAssessmentSchema`, and (on success)
 *     scored with `gradeScorecard`.
 *
 * Errors do *not* abort the import — every line is processed and the
 * caller receives an accepted/rejected split so they can decide what
 * to do about partial failures.
 */
export function parseJsonl(text: string): BulkImportResult {
	const lines = text.split(/\r?\n/);
	const accepted: AcceptedImport[] = [];
	const rejected: RejectedImport[] = [];
	let skippedBlank = 0;
	let skippedComment = 0;

	for (let i = 0; i < lines.length; i++) {
		const lineNumber = i + 1;
		const raw = lines[i];
		const trimmed = raw.trim();
		if (trimmed.length === 0) {
			skippedBlank++;
			continue;
		}
		if (trimmed.startsWith('#')) {
			skippedComment++;
			continue;
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(trimmed);
		} catch (e) {
			rejected.push({
				lineNumber,
				rawLine: raw,
				error: `JSON parse error: ${e instanceof Error ? e.message : String(e)}`,
			});
			continue;
		}

		const result = safeParseAssessment(parsed);
		if (!result.success) {
			const summary = result.error.issues
				.slice(0, 5)
				.map((iss) => `${iss.path.join('.')}: ${iss.message}`)
				.join('; ');
			const extra = result.error.issues.length > 5
				? ` (+${result.error.issues.length - 5} more)`
				: '';
			rejected.push({
				lineNumber,
				rawLine: raw,
				error: `schema validation failed: ${summary}${extra}`,
			});
			continue;
		}

		const assessment = result.data;
		accepted.push({
			lineNumber,
			assessment,
			grade: gradeScorecard(assessment),
		});
	}

	return {
		accepted,
		rejected,
		totalLines: lines.length,
		skippedBlank,
		skippedComment,
	};
}
