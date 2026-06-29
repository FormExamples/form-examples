import type { Outcome, SeverityGrade } from './types';

/** Friendly label for an overall audit outcome. */
export function outcomeLabel(outcome: Outcome): string {
	switch (outcome) {
		case 'compliant':
			return 'Compliant';
		case 'minor':
			return 'Minor Findings';
		case 'major':
			return 'Major Findings';
		case 'critical':
			return 'Critical Findings';
		default:
			return '';
	}
}

/** Lily token colour triple for an overall audit outcome (used by banners/badges). */
export function outcomeColor(outcome: Outcome): string {
	switch (outcome) {
		case 'compliant':
			return 'bg-success text-success-content border-success';
		case 'minor':
			return 'bg-info text-info-content border-info';
		case 'major':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Recommended action timeframe per outcome. */
export function actionTimeframe(outcome: Outcome): string {
	switch (outcome) {
		case 'critical':
			return 'Immediate corrective action required';
		case 'major':
			return 'Action within 30 days';
		case 'minor':
			return 'Action within 90 days';
		case 'compliant':
			return 'No action required';
		default:
			return '';
	}
}

/** Map a severity grade (1-4) to the equivalent finding-level slug. */
export function gradeToFindingLevel(grade: number): Outcome {
	if (grade >= 4) return 'critical';
	if (grade === 3) return 'major';
	if (grade === 2) return 'minor';
	return 'compliant';
}

/** Friendly label for a finding severity grade. */
export function gradeLabel(grade: number): string {
	switch (grade) {
		case 1:
			return 'Compliant';
		case 2:
			return 'Minor';
		case 3:
			return 'Major';
		case 4:
			return 'Critical';
		default:
			return `Grade ${grade}`;
	}
}

/** Lily token colour triple for a finding severity grade (used by Badge). */
export function gradeColor(grade: number): string {
	switch (grade) {
		case 1:
			return 'bg-success text-success-content border-success';
		case 2:
			return 'bg-info text-info-content border-info';
		case 3:
			return 'bg-warning text-warning-content border-warning';
		case 4:
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Friendly label for a flag priority. */
export function flagPriorityLabel(priority: string): string {
	switch (priority) {
		case 'urgent':
			return 'Urgent';
		case 'high':
			return 'High';
		case 'medium':
			return 'Medium';
		case 'low':
			return 'Low';
		default:
			return priority;
	}
}

/**
 * Count the non-compliant findings (severity grade ≥ 2) among fired rules.
 * Grade-1 rules are answered, compliant controls and are excluded.
 */
export function countFindings(firedRules: { grade: SeverityGrade }[]): number {
	return firedRules.filter((r) => r.grade >= 2).length;
}
