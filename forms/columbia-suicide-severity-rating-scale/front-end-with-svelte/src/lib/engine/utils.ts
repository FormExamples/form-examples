import type {
	AccessToMeans,
	AgeBand,
	BehaviourRecency,
	CareSetting,
	ClinicianRole,
	IdeationTimeframe,
	Priority,
	RiskTier,
	ScaleVersion,
	Sex,
	YesNo
} from './types';

/** Risk-tier label for display. */
export function riskTierLabel(tier: RiskTier): string {
	switch (tier) {
		case 'low':
			return 'Low risk';
		case 'moderate':
			return 'Moderate risk';
		case 'high':
			return 'High risk';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the risk-tier badge/banner.
 * high → error; moderate → warning; low → success.
 */
export function riskTierColor(tier: RiskTier): string {
	switch (tier) {
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-success text-success-content border-success';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Five-point ideation-level label. */
export function ideationLevelLabel(level: number): string {
	switch (level) {
		case 0:
			return 'Level 0 — no suicidal ideation reported';
		case 1:
			return 'Level 1 — wish to be dead';
		case 2:
			return 'Level 2 — non-specific active suicidal thoughts';
		case 3:
			return 'Level 3 — active ideation with any methods (no plan)';
		case 4:
			return 'Level 4 — active ideation with some intent to act';
		case 5:
			return 'Level 5 — active ideation with specific plan and intent';
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
		case 'clinician':
			return 'Clinician';
		case 'nurse':
			return 'Nurse';
		case 'mental-health-practitioner':
			return 'Mental-health practitioner';
		case 'crisis-worker':
			return 'Crisis worker';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'mental-health':
			return 'Mental-health service';
		case 'emergency-department':
			return 'Emergency department';
		case 'primary-care':
			return 'Primary care';
		case 'crisis-service':
			return 'Crisis service';
		case 'inpatient':
			return 'Inpatient ward';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** C-SSRS scale-version label. */
export function scaleVersionLabel(version: ScaleVersion): string {
	switch (version) {
		case 'screener':
			return 'Screener (triage)';
		case 'full':
			return 'Full version';
		default:
			return '';
	}
}

/** Patient-sex label. */
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

/** Age-band label. */
export function ageBandLabel(band: AgeBand): string {
	switch (band) {
		case 'adolescent':
			return 'Adolescent';
		case 'adult':
			return 'Adult';
		default:
			return '';
	}
}

/** Ideation-timeframe label. */
export function ideationTimeframeLabel(value: IdeationTimeframe): string {
	switch (value) {
		case 'past-month':
			return 'Past month';
		case 'lifetime-worst':
			return 'Lifetime / worst';
		default:
			return '';
	}
}

/** Behaviour-recency label. */
export function behaviourRecencyLabel(value: BehaviourRecency): string {
	switch (value) {
		case 'within-3-months':
			return 'Within the past 3 months';
		case 'over-3-months':
			return 'More than 3 months ago / lifetime';
		default:
			return '';
	}
}

/** Access-to-lethal-means label. */
export function accessToMeansLabel(value: AccessToMeans): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		case 'unknown':
			return 'Unknown';
		default:
			return '';
	}
}

/** Yes / No label. */
export function yesNoLabel(value: YesNo): string {
	switch (value) {
		case 'yes':
			return 'Yes';
		case 'no':
			return 'No';
		default:
			return 'Not recorded';
	}
}

/** Lily-token colour utility classes for a yes/no item (yes → error emphasis). */
export function yesNoColor(value: YesNo): string {
	return value === 'yes'
		? 'bg-error text-error-content border-error'
		: 'bg-base-300 text-base-content border-base-300';
}
