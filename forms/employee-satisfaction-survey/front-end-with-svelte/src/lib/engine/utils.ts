import type {
	SatisfactionCategory,
	ENpsValue,
	ENpsClassification,
	GradedDomainKey
} from './types';

/** Friendly label for a SatisfactionCategory. */
export function categoryLabel(cat: SatisfactionCategory): string {
	switch (cat) {
		case 'excellent':
			return 'Excellent';
		case 'good':
			return 'Good';
		case 'satisfactory':
			return 'Satisfactory';
		case 'poor':
			return 'Poor';
		case 'very-poor':
			return 'Very Poor';
		default:
			return 'Unknown';
	}
}

/**
 * Lily token colour triple for a SatisfactionCategory badge / banner.
 * excellent → success, good → info, satisfactory/poor → warning,
 * very-poor → error.
 */
export function categoryColor(cat: SatisfactionCategory): string {
	switch (cat) {
		case 'excellent':
			return 'bg-success text-success-content border-success';
		case 'good':
			return 'bg-info text-info-content border-info';
		case 'satisfactory':
			return 'bg-warning text-warning-content border-warning';
		case 'poor':
			return 'bg-warning text-warning-content border-warning';
		case 'very-poor':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/**
 * Severity rank for picking the "worst" category.
 * Higher rank = worse experience (very-poor = 4).
 */
export function categoryRank(cat: SatisfactionCategory): number {
	switch (cat) {
		case 'excellent':
			return 0;
		case 'good':
			return 1;
		case 'satisfactory':
			return 2;
		case 'poor':
			return 3;
		case 'very-poor':
			return 4;
		default:
			return -1;
	}
}

/**
 * Classify a 0-100 score into a SatisfactionCategory.
 *   85-100  excellent
 *   70-84   good
 *   50-69   satisfactory
 *   25-49   poor
 *    0-24   very-poor
 */
export function classifyScore(score: number | null): SatisfactionCategory {
	if (score === null || score === undefined || isNaN(score)) return '';
	if (score >= 85) return 'excellent';
	if (score >= 70) return 'good';
	if (score >= 50) return 'satisfactory';
	if (score >= 25) return 'poor';
	return 'very-poor';
}

/**
 * Classify a raw eNPS 0-10 value.
 *   9-10    promoter
 *   7-8     passive
 *   0-6     detractor
 */
export function classifyENps(value: ENpsValue): ENpsClassification {
	if (value === null || value === undefined) return '';
	if (value >= 9) return 'promoter';
	if (value >= 7) return 'passive';
	return 'detractor';
}

/** Friendly label for an eNPS classification. */
export function enpsClassificationLabel(c: ENpsClassification): string {
	switch (c) {
		case 'promoter':
			return 'Promoter';
		case 'passive':
			return 'Passive';
		case 'detractor':
			return 'Detractor';
		default:
			return 'Not answered';
	}
}

/** Lily token colour triple for an eNPS classification. */
export function enpsColor(c: ENpsClassification): string {
	switch (c) {
		case 'promoter':
			return 'bg-success text-success-content border-success';
		case 'passive':
			return 'bg-warning text-warning-content border-warning';
		case 'detractor':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Human-readable title for a graded domain key. */
export function domainLabel(key: GradedDomainKey): string {
	switch (key) {
		case 'workload':
			return 'Workload & Work-Life Balance';
		case 'management':
			return 'Management & Leadership';
		case 'growth':
			return 'Growth & Development';
		case 'compensation':
			return 'Compensation & Benefits';
		case 'culture':
			return 'Culture & Inclusion';
		case 'environment':
			return 'Environment & Resources';
		case 'recognition':
			return 'Recognition & Engagement';
		case 'overall':
			return 'Overall Experience';
	}
}

/** Friendly label for a retention-intent value (raw enum string). */
export function retentionIntentLabel(value: string): string {
	switch (value) {
		case 'definitely-stay':
			return 'Definitely plans to stay';
		case 'probably-stay':
			return 'Probably plans to stay';
		case 'unsure':
			return 'Unsure';
		case 'probably-leave-12-months':
			return 'May leave within 12 months';
		case 'leaving-within-6-months':
			return 'Leaving within 6 months';
		default:
			return 'Not answered';
	}
}
