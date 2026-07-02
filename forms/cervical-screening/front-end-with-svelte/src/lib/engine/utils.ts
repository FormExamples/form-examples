import type {
	CareSetting,
	CytologyGrade,
	HpvResult,
	ManagementAction,
	Priority,
	RecallInterval,
	ResultClass,
	SampleAdequacy,
	SampleTakerRole,
	Status
} from './types';

/** Result-classification label for display. */
export function resultClassLabel(resultClass: ResultClass): string {
	switch (resultClass) {
		case 'inadequate':
			return 'Inadequate sample';
		case 'hpv-negative':
			return 'HPV negative';
		case 'hpv-positive-cytology-normal':
			return 'HPV positive, cytology normal';
		case 'hpv-positive-cytology-abnormal-low':
			return 'HPV positive, cytology abnormal (low grade)';
		case 'hpv-positive-cytology-abnormal-high':
			return 'HPV positive, cytology abnormal (high grade)';
		case 'hpv-positive-cytology-pending':
			return 'HPV positive, cytology outstanding';
		case 'cease-not-eligible':
			return 'Cease / not eligible';
		case 'pending':
			return 'Pending';
		default:
			return '';
	}
}

/**
 * Lily-token colour utility classes for the result-class badge/banner.
 * hpv-negative → success; abnormal-high → error; abnormal-low → warning;
 * everything else → info / neutral.
 */
export function resultClassColor(resultClass: ResultClass): string {
	switch (resultClass) {
		case 'hpv-negative':
			return 'bg-success text-success-content border-success';
		case 'hpv-positive-cytology-abnormal-high':
			return 'bg-error text-error-content border-error';
		case 'hpv-positive-cytology-abnormal-low':
			return 'bg-warning text-warning-content border-warning';
		case 'inadequate':
		case 'hpv-positive-cytology-normal':
		case 'hpv-positive-cytology-pending':
		case 'cease-not-eligible':
		case 'pending':
			return 'bg-info text-info-content border-info';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Recommended management-action label for display. */
export function managementActionLabel(action: ManagementAction): string {
	switch (action) {
		case 'routine-recall':
			return 'Routine recall';
		case 'early-repeat-12-months':
			return 'Early repeat HPV test at 12 months';
		case 'colposcopy-referral':
			return 'Colposcopy referral (routine)';
		case 'urgent-colposcopy-referral':
			return 'Urgent colposcopy referral';
		case 'repeat-sample-3-months':
			return 'Repeat sample in ~3 months';
		case 'cease-screening':
			return 'Cease screening; no recall';
		case 'awaiting-cytology':
			return 'Awaiting reflex cytology';
		case 'awaiting-result':
			return 'Awaiting result';
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

/** Sample-taker role label. */
export function sampleTakerRoleLabel(role: SampleTakerRole): string {
	switch (role) {
		case 'practice-nurse':
			return 'Practice nurse';
		case 'gp':
			return 'GP';
		case 'smear-taker':
			return 'Trained smear-taker';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Care-setting label. */
export function careSettingLabel(setting: CareSetting): string {
	switch (setting) {
		case 'general-practice':
			return 'General practice';
		case 'sexual-health':
			return 'Sexual & reproductive health';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

/** Recall-interval label. */
export function recallIntervalLabel(interval: RecallInterval): string {
	switch (interval) {
		case 'three-yearly':
			return '3-yearly (ages 25-49)';
		case 'five-yearly':
			return '5-yearly (ages 50-64)';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return '';
	}
}

/** Primary hrHPV result label. */
export function hpvResultLabel(result: HpvResult): string {
	switch (result) {
		case 'negative':
			return 'Negative (not detected)';
		case 'positive':
			return 'Positive (detected)';
		case 'not-tested':
			return 'Not tested';
		default:
			return '';
	}
}

/** Reflex cytology grade label. */
export function cytologyGradeLabel(grade: CytologyGrade): string {
	switch (grade) {
		case 'negative':
			return 'Negative (normal)';
		case 'borderline':
			return 'Borderline changes';
		case 'low-grade':
			return 'Low-grade dyskaryosis';
		case 'high-grade':
			return 'High-grade dyskaryosis / ?glandular / ?invasive';
		case 'not-performed':
			return 'Not performed';
		default:
			return '';
	}
}

/** Sample-adequacy label. */
export function sampleAdequacyLabel(adequacy: SampleAdequacy): string {
	switch (adequacy) {
		case 'adequate':
			return 'Adequate';
		case 'inadequate':
			return 'Inadequate / unsatisfactory';
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
