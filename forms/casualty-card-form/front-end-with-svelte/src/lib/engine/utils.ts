import type { NEWS2ClinicalResponse } from './types';

export function calculateAge(dob: string): number | null {
	if (!dob) return null;
	const birth = new Date(dob);
	if (isNaN(birth.getTime())) return null;
	const today = new Date();
	let age = today.getFullYear() - birth.getFullYear();
	const m = today.getMonth() - birth.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
		age--;
	}
	return age;
}

export function news2ResponseLabel(response: NEWS2ClinicalResponse): string {
	switch (response) {
		case 'low': return 'Low (routine monitoring)';
		case 'low-medium': return 'Low-Medium (urgent ward review)';
		case 'medium': return 'Medium (urgent review)';
		case 'high': return 'High (emergency assessment)';
		default: return '';
	}
}

export function news2ResponseColor(response: NEWS2ClinicalResponse): string {
	switch (response) {
		case 'low': return 'bg-success text-success-content border-success';
		case 'low-medium': return 'bg-warning text-warning-content border-warning';
		case 'medium': return 'bg-warning text-warning-content border-warning';
		case 'high': return 'bg-error text-error-content border-error';
		default: return 'bg-base-300 text-base-content border-base-300';
	}
}

export function news2ScoreColor(score: number): string {
	if (score >= 7) return 'bg-error text-error-content border-error';
	if (score >= 5) return 'bg-warning text-warning-content border-warning';
	if (score >= 3) return 'bg-warning text-warning-content border-warning';
	return 'bg-success text-success-content border-success';
}

export function mtsCategoryLabel(category: string): string {
	switch (category) {
		case '1-immediate': return '1 - Immediate (Red)';
		case '2-very-urgent': return '2 - Very Urgent (Orange)';
		case '3-urgent': return '3 - Urgent (Yellow)';
		case '4-standard': return '4 - Standard (Green)';
		case '5-non-urgent': return '5 - Non-Urgent (Blue)';
		default: return '';
	}
}
