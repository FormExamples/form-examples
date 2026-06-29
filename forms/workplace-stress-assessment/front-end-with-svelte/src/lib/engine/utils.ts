import type { DomainKey, RiskLevel } from './types';
import {
	DEPARTMENT_OPTIONS,
	TENURE_OPTIONS,
	HOURS_OPTIONS,
	DOMAINS,
	type DomainMeta
} from './rules';

/** Friendly label for a concern RiskLevel. */
export function riskLevelLabel(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'Low concern';
		case 'moderate':
			return 'Moderate concern';
		case 'high':
			return 'High concern';
		case 'very-high':
			return 'Very high concern';
		default:
			return 'Not assessed';
	}
}

/** Short label for compact contexts (dashboard cells, badges). */
export function riskLevelShortLabel(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		case 'very-high':
			return 'Very High';
		default:
			return '—';
	}
}

/**
 * Lily token colour triple for a concern RiskLevel badge.
 * low → success, moderate → warning, high → warning, very-high → error.
 */
export function riskLevelColor(level: RiskLevel): string {
	switch (level) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-warning text-warning-content border-warning';
		case 'very-high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/**
 * Numeric severity rank (low = 0 … very-high = 3) for picking the worst domain
 * when computing overall risk. Unknown (`''`) ranks below everything.
 */
export function riskLevelRank(level: RiskLevel): number {
	switch (level) {
		case 'low':
			return 0;
		case 'moderate':
			return 1;
		case 'high':
			return 2;
		case 'very-high':
			return 3;
		default:
			return -1;
	}
}

/** Display title for a domain key (e.g. 'managerSupport' → 'Manager Support'). */
export function domainTitle(key: DomainKey): string {
	const meta = DOMAINS.find((d: DomainMeta) => d.key === key);
	return meta ? meta.title : key;
}

/** Format a domain mean to one decimal place, or '—' when unanswered. */
export function formatMean(mean: number | null): string {
	if (mean === null || Number.isNaN(mean)) return '—';
	return mean.toFixed(1);
}

/** Friendly label for a department value. */
export function departmentLabel(value: string): string {
	return DEPARTMENT_OPTIONS.find((o) => o.value === value)?.label ?? (value || '—');
}

/** Friendly label for a tenure-band value. */
export function tenureBandLabel(value: string): string {
	return TENURE_OPTIONS.find((o) => o.value === value)?.label ?? (value || '—');
}

/** Friendly label for an hours-band value. */
export function hoursBandLabel(value: string): string {
	return HOURS_OPTIONS.find((o) => o.value === value)?.label ?? (value || '—');
}
