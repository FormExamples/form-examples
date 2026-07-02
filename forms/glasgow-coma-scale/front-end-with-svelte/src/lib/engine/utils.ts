import type { AssessorRole, Priority, Reactivity, Setting, SeverityBand } from './types';

/** Severity-band label for display. */
export function severityBandLabel(band: SeverityBand): string {
	switch (band) {
		case 'mild':
			return 'Mild (13-15)';
		case 'moderate':
			return 'Moderate (9-12)';
		case 'severe':
			return 'Severe (3-8) — coma';
		default:
			return 'Not scored';
	}
}

/**
 * Lily-token colour utility classes for the severity-band badge/banner.
 * Mild → success; moderate → warning; severe → error; unscored → neutral.
 */
export function severityBandColor(band: SeverityBand): string {
	switch (band) {
		case 'mild':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'severe':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
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

/** Assessing-observer role label. */
export function assessorRoleLabel(role: AssessorRole): string {
	switch (role) {
		case 'doctor':
			return 'Doctor';
		case 'nurse':
			return 'Nurse';
		case 'paramedic':
			return 'Paramedic';
		case 'emergency-medical-technician':
			return 'Emergency medical technician';
		case 'advanced-clinical-practitioner':
			return 'Advanced clinical practitioner';
		case 'neuro-observation-staff':
			return 'Neuro-observation staff';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function settingLabel(setting: Setting): string {
	switch (setting) {
		case 'ed':
			return 'Emergency department';
		case 'neuro':
			return 'Neuro / neurosurgical unit';
		case 'critical-care':
			return 'Critical care / HDU';
		case 'pre-hospital':
			return 'Pre-hospital / ambulance';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Pupil-reactivity label. */
export function reactivityLabel(reactivity: Reactivity): string {
	switch (reactivity) {
		case 'reactive':
			return 'Reactive';
		case 'sluggish':
			return 'Sluggish';
		case 'unreactive':
			return 'Unreactive';
		default:
			return '';
	}
}
