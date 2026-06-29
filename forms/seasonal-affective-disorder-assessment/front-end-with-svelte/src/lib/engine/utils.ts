import type { CombinedSeverity, SpaqBand, Phq9Band } from './types';
import { combinedSeverityLabel, spaqBandLabel, phq9BandLabel } from './sad-rules';

export { combinedSeverityLabel, spaqBandLabel, phq9BandLabel };

/** Calculate age from a date-of-birth string. Returns null if invalid. */
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

/** Lily-token colour triple for a combined severity badge/banner. */
export function combinedSeverityColor(severity: CombinedSeverity): string {
	switch (severity) {
		case 'no-sad':
			return 'bg-success text-success-content border-success';
		case 'mild':
			return 'bg-info text-info-content border-info';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-warning text-warning-content border-warning';
		case 'critical':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour triple for a SPAQ band. */
export function spaqBandColor(band: SpaqBand): string {
	switch (band) {
		case 'no-sad':
			return 'bg-success text-success-content border-success';
		case 'subsyndromal':
			return 'bg-warning text-warning-content border-warning';
		case 'sad-likely':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour triple for a PHQ-9 band. */
export function phq9BandColor(band: Phq9Band): string {
	switch (band) {
		case 'minimal':
			return 'bg-success text-success-content border-success';
		case 'mild':
			return 'bg-info text-info-content border-info';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'moderately-severe':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}
