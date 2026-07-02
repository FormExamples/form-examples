import type {
	Band,
	CareSetting,
	ClinicianRole,
	ModeOfDelivery,
	Priority,
	Sex,
	SignField,
	Trend
} from './types';
import { SIGNS } from './apgar-rules';

/** Band label for display. */
export function bandLabel(band: Band): string {
	switch (band) {
		case 'reassuring':
			return 'Reassuring (7-10)';
		case 'moderately-low':
			return 'Moderately low (4-6)';
		case 'low':
			return 'Low (0-3)';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the band badge/banner.
 * reassuring → success; moderately-low → warning; low → error.
 */
export function bandColor(band: Band): string {
	switch (band) {
		case 'reassuring':
			return 'bg-success text-success-content border-success';
		case 'moderately-low':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Trend label for display. */
export function trendLabel(trend: Trend): string {
	switch (trend) {
		case 'improving':
			return 'Improving';
		case 'static':
			return 'Static';
		case 'falling':
			return 'Falling';
		case 'insufficient':
			return 'Insufficient data';
		default:
			return '';
	}
}

/** Human label for a single 0/1/2 sign score. */
export function signScoreLabel(field: SignField, score: string): string {
	const sign = SIGNS.find((s) => s.field === field);
	if (!sign || score === '' || score == null) return '';
	return sign.scores[score as '0' | '1' | '2'] || '';
}

/** Lily-token colour utility classes for a flag priority. */
export function priorityColor(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority label. */
export function priorityLabel(priority: Priority): string {
	switch (priority) {
		case 'high':
			return 'HIGH';
		case 'medium':
			return 'MEDIUM';
		case 'low':
			return 'LOW';
		default:
			return '';
	}
}

/** Attending-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'midwife':
			return 'Midwife';
		case 'obstetrician':
			return 'Obstetrician';
		case 'neonatologist':
			return 'Neonatologist';
		case 'neonatal-nurse':
			return 'Neonatal nurse';
		case 'paediatrician':
			return 'Paediatrician';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'delivery-room':
			return 'Delivery room';
		case 'theatre':
			return 'Obstetric theatre';
		case 'birth-centre':
			return 'Birth centre';
		case 'home':
			return 'Home birth';
		case 'neonatal-unit':
			return 'Neonatal unit';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Mode-of-delivery label. */
export function modeOfDeliveryLabel(mode: ModeOfDelivery): string {
	switch (mode) {
		case 'vaginal':
			return 'Vaginal';
		case 'assisted':
			return 'Assisted (forceps / ventouse)';
		case 'caesarean':
			return 'Caesarean';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Newborn-sex label. */
export function sexLabel(sex: Sex): string {
	switch (sex) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		case 'intersex':
			return 'Intersex';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}
