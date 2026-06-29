import type { AssessmentData, AxisGrade, AxisStatus, FiredRule, GradingResult } from './types';
import { axisRules } from './endocrine-rules';
import { maxStatus } from './utils';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure function: run every axis rule against the patient data and return the
 * per-axis grades plus the overall status, fired rules, and flagged issues.
 *
 * Overall status is the most-severe axis status across all assessed axes.
 * Severity order: severe > moderate > mild > subclinical > normal > '' (not assessed).
 */
export function calculateGrades(data: AssessmentData): GradingResult {
	const axisGrades: AxisGrade[] = [];
	const firedRules: FiredRule[] = [];
	let overall: AxisStatus = '';

	for (const rule of axisRules) {
		try {
			const { status, findings } = rule.evaluate(data);
			const rationale =
				findings.length === 0
					? status === 'normal'
						? 'Indices within reference range.'
						: status === ''
							? 'No data provided.'
							: 'Status derived from clinical features.'
					: findings.join(' ');

			axisGrades.push({
				axis: rule.axis,
				status,
				rationale,
				contributingFindings: findings
			});

			if (status !== '') {
				overall = maxStatus(overall, status);
				firedRules.push({
					id: rule.id,
					category: rule.axis,
					description: rule.description,
					status
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`Axis rule ${rule.id} evaluation failed:`, e);
		}
	}

	// Count graded (assessed) axes (informational).
	const answeredCount = axisGrades.filter((g) => g.status !== '').length;

	return {
		axisGrades,
		overallStatus: overall || 'normal',
		answeredCount,
		firedRules,
		additionalFlags: detectAdditionalFlags(data),
		timestamp: new Date().toISOString()
	};
}
