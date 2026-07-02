import type {
	Acvpu,
	AgeBand,
	AirOrOxygen,
	ArrivalMode,
	CareSetting,
	Priority,
	PriorityColour,
	PriorityLevel,
	Sex,
	Subscores,
	TargetMinutes,
	YesNo
} from './types';

// ─── Priority (MTS level) display helpers ───────────────────────────

/** MTS priority colour token for a level. */
export function priorityColour(level: PriorityLevel): PriorityColour {
	switch (level) {
		case 1:
			return 'red';
		case 2:
			return 'orange';
		case 3:
			return 'yellow';
		case 4:
			return 'green';
		case 5:
			return 'blue';
		default:
			return 'green';
	}
}

/** MTS priority name for a level. */
export function priorityName(level: PriorityLevel): string {
	switch (level) {
		case 1:
			return 'Immediate';
		case 2:
			return 'Very urgent';
		case 3:
			return 'Urgent';
		case 4:
			return 'Standard';
		case 5:
			return 'Non-urgent';
		default:
			return '';
	}
}

/** Target time to first clinical assessment (minutes) for a level. */
export function targetMinutes(level: PriorityLevel): TargetMinutes {
	switch (level) {
		case 1:
			return 0;
		case 2:
			return 10;
		case 3:
			return 60;
		case 4:
			return 120;
		case 5:
			return 240;
		default:
			return 120;
	}
}

/** Human-friendly target-time label. */
export function targetLabel(level: PriorityLevel): string {
	const m = targetMinutes(level);
	return m === 0 ? 'Immediately (0 min)' : `Within ${m} min`;
}

/**
 * Lily-token colour utility classes for the priority-level badge/banner. MTS
 * levels 1-5 map onto the shared severity palette (error > warning > info >
 * success).
 */
export function priorityLevelColor(level: PriorityLevel): string {
	switch (level) {
		case 1:
			return 'bg-error text-error-content border-error';
		case 2:
			return 'bg-error text-error-content border-error';
		case 3:
			return 'bg-warning text-warning-content border-warning';
		case 4:
			return 'bg-success text-success-content border-success';
		case 5:
			return 'bg-info text-info-content border-info';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Lily-token colour utility classes for a NEWS2 parameter subscore pill (0-3). */
export function subscoreColor(points: number | null): string {
	if (points === null) return 'bg-base-300 text-base-content border-base-300';
	if (points >= 3) return 'bg-error text-error-content border-error';
	if (points === 2) return 'bg-warning text-warning-content border-warning';
	if (points === 1) return 'bg-warning text-warning-content border-warning';
	return 'bg-success text-success-content border-success';
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

// ─── Enum labels ────────────────────────────────────────────────────

/** Care-setting label. */
export function careSettingLabel(value: CareSetting): string {
	switch (value) {
		case 'emergency-department':
			return 'Emergency department';
		case 'urgent-treatment-centre':
			return 'Urgent treatment centre';
		case 'minor-injuries-unit':
			return 'Minor injuries unit';
		default:
			return '';
	}
}

/** Arrival-mode label. */
export function arrivalModeLabel(value: ArrivalMode): string {
	switch (value) {
		case 'walk-in':
			return 'Walk-in';
		case 'ambulance':
			return 'Ambulance';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Age-band label. */
export function ageBandLabel(value: AgeBand): string {
	switch (value) {
		case 'paediatric':
			return 'Paediatric';
		case 'adult':
			return 'Adult';
		case 'older-adult':
			return 'Older adult';
		default:
			return '';
	}
}

/** Sex label. */
export function sexLabel(value: Sex): string {
	switch (value) {
		case 'female':
			return 'Female';
		case 'male':
			return 'Male';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Air-or-oxygen label. */
export function airOrOxygenLabel(value: AirOrOxygen): string {
	switch (value) {
		case 'air':
			return 'Air';
		case 'oxygen':
			return 'Supplemental oxygen';
		default:
			return '';
	}
}

/** ACVPU consciousness label. */
export function acvpuLabel(value: Acvpu): string {
	switch (value) {
		case 'A':
			return 'Alert';
		case 'C':
			return 'New confusion';
		case 'V':
			return 'Voice';
		case 'P':
			return 'Pain';
		case 'U':
			return 'Unresponsive';
		default:
			return '';
	}
}

/** Yes/No label. */
export function yesNoLabel(value: YesNo): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return '';
	}
}

/** Human-readable label for a single NEWS2 parameter subscore key. */
export function subscoreLabel(key: keyof Subscores): string {
	switch (key) {
		case 'respiratoryRate':
			return 'Respiratory rate';
		case 'spo2':
			return 'Oxygen saturation (SpO2)';
		case 'oxygen':
			return 'Air or oxygen';
		case 'systolicBp':
			return 'Systolic blood pressure';
		case 'pulse':
			return 'Pulse';
		case 'consciousness':
			return 'Consciousness (ACVPU)';
		case 'temperature':
			return 'Temperature';
		default:
			return '';
	}
}
