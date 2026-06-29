import type { OETGrade } from './types';

/** Friendly full label for a grade (CEFR-mapped). */
export function gradeLabel(grade: OETGrade): string {
	switch (grade) {
		case 'A':
			return 'A — Expert user (CEFR C2)';
		case 'B':
			return 'B — Highly proficient, clinically safe (CEFR C1)';
		case 'C+':
			return 'C+ — Proficient, borderline above clinical threshold (CEFR B2+)';
		case 'C':
			return 'C — Competent, below typical clinical threshold (CEFR B2)';
		case 'D':
			return 'D — Modest, significant communication concerns (CEFR B1)';
		case 'E':
			return 'E — Limited, unsuitable for Welsh-medium clinical practice (CEFR A2 or below)';
		default:
			return 'Not graded';
	}
}

/** Short label for a grade (badge / dashboard). */
export function gradeShortLabel(grade: OETGrade): string {
	switch (grade) {
		case 'A':
			return 'A · CEFR C2';
		case 'B':
			return 'B · CEFR C1';
		case 'C+':
			return 'C+ · CEFR B2+';
		case 'C':
			return 'C · CEFR B2';
		case 'D':
			return 'D · CEFR B1';
		case 'E':
			return 'E · CEFR A2-';
		default:
			return '—';
	}
}

/** Lily-token colour triple for a grade badge. */
export function gradeColor(grade: OETGrade): string {
	switch (grade) {
		case 'A':
		case 'B':
			return 'bg-success text-success-content border-success';
		case 'C+':
		case 'C':
			return 'bg-warning text-warning-content border-warning';
		case 'D':
		case 'E':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/**
 * Whether a grade is at or above the typical clinical threshold for
 * Welsh-medium clinical communication (NHS Wales Welsh-essential roles target
 * Grade B / CEFR C1).
 */
export function isAtOrAboveClinicalThreshold(grade: OETGrade): boolean {
	return grade === 'A' || grade === 'B';
}
