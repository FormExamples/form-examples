import type {
	AssessmentSetting,
	DiabetesType,
	NeuropathyStatus,
	PreviousAmputation,
	Priority,
	PulsesStatus,
	Referral,
	ReviewPathway,
	Risk,
	SelfCareAbility,
	Status,
	UlcerSeverity
} from './types';

/** Risk category label for display. */
export function riskLabel(risk: Risk | string): string {
	switch (risk) {
		case 'low':
			return 'Low risk';
		case 'moderate':
			return 'Moderate risk';
		case 'high':
			return 'High risk';
		case 'active-urgent':
			return 'Active / urgent';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk badge/banner.
 * low → success; moderate → warning; high / active-urgent → error.
 */
export function riskColor(risk: Risk | string): string {
	switch (risk) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
		case 'active-urgent':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Review pathway label for display. */
export function reviewPathwayLabel(pathway: ReviewPathway | string): string {
	switch (pathway) {
		case 'urgent-mdt-referral':
			return 'Urgent referral to multidisciplinary foot team';
		case 'high-risk-review':
			return 'High-risk review by multidisciplinary foot team';
		case 'moderate-risk-review':
			return 'Moderate-risk review by foot protection service';
		case 'annual-review':
			return 'Annual review';
		default:
			return '';
	}
}

/** Referral destination label. */
export function referralLabel(referral: Referral | string): string {
	switch (referral) {
		case 'none':
			return 'No referral';
		case 'foot-protection-service':
			return 'Foot protection service';
		case 'multidisciplinary-foot-team':
			return 'Multidisciplinary foot team';
		case 'urgent-mdt':
			return 'Urgent multidisciplinary foot team (same/next working day)';
		default:
			return '';
	}
}

/** Review-interval label. */
export function reviewIntervalLabel(months: 1 | 3 | 6 | 12 | null): string {
	if (months === 1) return '1 month';
	if (months === 3) return '3 months';
	if (months === 6) return '6 months';
	if (months === 12) return '12 months';
	return 'No routine interval (urgent referral)';
}

/** Neuropathy status label. */
export function neuropathyStatusLabel(status: NeuropathyStatus | string): string {
	switch (status) {
		case 'sensate':
			return 'Sensate (normal)';
		case 'insensate':
			return 'Insensate (loss of protective sensation)';
		case 'not-tested':
			return 'Not tested';
		default:
			return '';
	}
}

/** Pedal pulses status label. */
export function pulsesStatusLabel(status: PulsesStatus | string): string {
	switch (status) {
		case 'normal':
			return 'Normal';
		case 'diminished':
			return 'Diminished';
		case 'absent':
			return 'Absent';
		case 'not-tested':
			return 'Not tested';
		default:
			return '';
	}
}

/** Ulcer severity label. */
export function ulcerSeverityLabel(severity: UlcerSeverity | string): string {
	switch (severity) {
		case 'superficial':
			return 'Superficial';
		case 'deep':
			return 'Deep';
		case 'infected':
			return 'Infected';
		case 'critical-ischaemia':
			return 'Critical limb ischaemia';
		default:
			return '';
	}
}

/** Previous amputation label. */
export function previousAmputationLabel(value: PreviousAmputation | string): string {
	switch (value) {
		case 'none':
			return 'None';
		case 'minor':
			return 'Minor (toe / partial foot)';
		case 'major':
			return 'Major (below / above knee)';
		default:
			return '';
	}
}

/** Assessment-setting label. */
export function assessmentSettingLabel(setting: AssessmentSetting | string): string {
	switch (setting) {
		case 'annual-review':
			return 'Annual diabetes review';
		case 'foot-protection-clinic':
			return 'Foot protection clinic';
		case 'hospital-admission':
			return 'Hospital admission';
		case 'pre-discharge':
			return 'Pre-discharge check';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Diabetes-type label. */
export function diabetesTypeLabel(type: DiabetesType | string): string {
	switch (type) {
		case 'type-1':
			return 'Type 1';
		case 'type-2':
			return 'Type 2';
		case 'other':
			return 'Other';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Self-care ability label. */
export function selfCareAbilityLabel(ability: SelfCareAbility | string): string {
	switch (ability) {
		case 'independent':
			return 'Independent';
		case 'partial':
			return 'Partial support needed';
		case 'unable':
			return 'Unable (relies on carer)';
		default:
			return '';
	}
}

/** Completeness-status label. */
export function statusLabel(status: Status): string {
	switch (status) {
		case 'complete':
			return 'Complete';
		case 'incomplete':
			return 'Incomplete';
		default:
			return '';
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

/** Yes/No label for a plain boolean-shaped enum field. */
export function yesNoLabel(value: 'yes' | 'no' | '' | string): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return '';
	}
}
