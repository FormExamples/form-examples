import type {
	CareSetting,
	ClinicianRole,
	MeasurementMethod,
	PercentileBand,
	Priority,
	RiskZone,
	Sex
} from './types';

/** Risk-zone label for display. */
export function riskZoneLabel(zone: RiskZone): string {
	switch (zone) {
		case 'low':
			return 'Low risk (< 40th centile)';
		case 'low-intermediate':
			return 'Low-intermediate risk (40th–75th)';
		case 'high-intermediate':
			return 'High-intermediate risk (75th–95th)';
		case 'high':
			return 'High risk (≥ 95th centile)';
		default:
			return 'Not classified';
	}
}

/**
 * Lily-token colour utility classes for the risk-zone badge/banner.
 * low → success; low-intermediate → info; high-intermediate → warning;
 * high → error.
 */
export function riskZoneColor(zone: RiskZone): string {
	switch (zone) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'low-intermediate':
			return 'bg-info text-info-content border-info';
		case 'high-intermediate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Percentile-band label for display. */
export function percentileBandLabel(band: PercentileBand): string {
	switch (band) {
		case '<40':
			return '< 40th percentile';
		case '40-75':
			return '40th–75th percentile';
		case '75-95':
			return '75th–95th percentile';
		case '>=95':
			return '≥ 95th percentile';
		default:
			return 'N/A';
	}
}

/** Gestation-band label for display. */
export function gestationBandLabel(band: string): string {
	switch (band) {
		case 'term':
			return 'Term (≥ 38 weeks)';
		case '37':
			return '37 weeks';
		case '36':
			return '36 weeks';
		case '35':
			return '35 weeks';
		case 'under35':
			return 'Below 35 weeks';
		default:
			return band;
	}
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

/** Assessing-clinician role label. */
export function clinicianRoleLabel(role: ClinicianRole): string {
	switch (role) {
		case 'midwife':
			return 'Midwife';
		case 'neonatal-nurse':
			return 'Neonatal / paediatric nurse';
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
		case 'postnatal-ward':
			return 'Postnatal ward';
		case 'neonatal-unit':
			return 'Neonatal unit';
		case 'midwife-led-unit':
			return 'Midwife-led unit';
		case 'community':
			return 'Community / midwifery follow-up';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Infant-sex label. */
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

/** Measurement-method label. */
export function measurementMethodLabel(method: MeasurementMethod): string {
	switch (method) {
		case 'serum':
			return 'Serum bilirubin (SBR)';
		case 'transcutaneous':
			return 'Transcutaneous (TcB)';
		default:
			return '';
	}
}

/** Format a TSB (µmol/L) value for display, or a dash when null. */
export function formatTsb(n: number | null): string {
	return n === null || n === undefined ? '—' : `${n} µmol/L`;
}
