import type { ChoiceOption, ClimateCategory, GradedDomainKey } from './types';
import {
	DEPARTMENT_OPTIONS,
	HOURS_OPTIONS,
	RECOMMEND_OPTIONS,
	ROLE_LEVEL_OPTIONS,
	TENURE_OPTIONS,
	WORK_LOCATION_OPTIONS
} from './rules';

/** Friendly label for a ClimateCategory. */
export function categoryLabel(cat: ClimateCategory): string {
	switch (cat) {
		case 'thriving':
			return 'Thriving';
		case 'healthy':
			return 'Healthy';
		case 'developing':
			return 'Developing';
		case 'strained':
			return 'Strained';
		case 'critical':
			return 'Critical';
		default:
			return 'Not scored';
	}
}

/**
 * Lily token colour triple for a category badge.
 * thriving→success, healthy→info, developing/strained→warning, critical→error.
 */
export function categoryColor(cat: ClimateCategory): string {
	switch (cat) {
		case 'thriving':
			return 'bg-success text-success-content border-success';
		case 'healthy':
			return 'bg-info text-info-content border-info';
		case 'developing':
			return 'bg-warning text-warning-content border-warning';
		case 'strained':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Severity rank for picking the "worst" category (higher = worse). */
export function categoryRank(cat: ClimateCategory): number {
	switch (cat) {
		case 'thriving':
			return 0;
		case 'healthy':
			return 1;
		case 'developing':
			return 2;
		case 'strained':
			return 3;
		case 'critical':
			return 4;
		default:
			return -1;
	}
}

/**
 * Classify a 0-100 score into a ClimateCategory.
 *   85-100 thriving · 70-84 healthy · 50-69 developing · 25-49 strained · 0-24 critical
 */
export function classifyScore(score: number | null): ClimateCategory {
	if (score === null || score === undefined || isNaN(score)) return '';
	if (score >= 85) return 'thriving';
	if (score >= 70) return 'healthy';
	if (score >= 50) return 'developing';
	if (score >= 25) return 'strained';
	return 'critical';
}

/** Display titles for the eight graded domains. */
export const DOMAIN_LABELS: Record<GradedDomainKey, string> = {
	leadership: 'Leadership & Management',
	psychSafety: 'Psychological Safety',
	inclusion: 'Inclusion & Belonging',
	communication: 'Communication',
	collaboration: 'Collaboration & Teamwork',
	recognition: 'Recognition & Reward',
	wellbeing: 'Wellbeing',
	career: 'Career Development'
};

/** Friendly label for a domain key. */
export function domainLabel(key: GradedDomainKey): string {
	return DOMAIN_LABELS[key] ?? key;
}

/** Lily token colour for a flag priority. */
export function priorityColor(priority: 'high' | 'medium' | 'low'): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Look up a friendly label in a ChoiceOption list (or '' if not found). */
export function optionLabel(options: ChoiceOption[], value: string): string {
	return options.find((o) => o.value === value)?.label ?? '';
}

export {
	DEPARTMENT_OPTIONS,
	HOURS_OPTIONS,
	RECOMMEND_OPTIONS,
	ROLE_LEVEL_OPTIONS,
	TENURE_OPTIONS,
	WORK_LOCATION_OPTIONS
};
