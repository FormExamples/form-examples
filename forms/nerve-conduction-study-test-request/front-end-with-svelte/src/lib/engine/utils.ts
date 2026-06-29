import type {
	StudyType,
	Region,
	Indication,
	Laterality,
	SymptomDuration,
	AppropriatenessBand,
	ProceduralRiskBand,
	TriageTier,
	Recommendation
} from './types';

// ──────────────────────────────────────────────
// Study-type predicates
// ──────────────────────────────────────────────

/** Whether the requested study involves a needle-EMG component. */
export function involvesNeedleEmg(studyType: StudyType | string): boolean {
	return studyType === 'emg' || studyType === 'nerve-conduction-and-emg';
}

/** Whether the requested study involves electrical stimulation. */
export function involvesStimulation(studyType: StudyType | string): boolean {
	return (
		studyType === 'nerve-conduction' ||
		studyType === 'nerve-conduction-and-emg' ||
		studyType === 'repetitive-stimulation'
	);
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Human-readable study-type label. */
export function studyTypeLabel(value: StudyType | string): string {
	switch (value) {
		case 'nerve-conduction':
			return 'Nerve conduction';
		case 'emg':
			return 'Needle EMG';
		case 'nerve-conduction-and-emg':
			return 'Nerve conduction + EMG';
		case 'repetitive-stimulation':
			return 'Repetitive stimulation';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable anatomical-region label. */
export function regionLabel(value: Region | string): string {
	switch (value) {
		case 'upper-limb':
			return 'Upper limb';
		case 'lower-limb':
			return 'Lower limb';
		case 'all-limbs':
			return 'All limbs';
		case 'cranial':
			return 'Cranial';
		case 'generalised':
			return 'Generalised';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable primary-indication label. */
export function indicationLabel(value: Indication | string): string {
	switch (value) {
		case 'carpal-tunnel':
			return 'Carpal tunnel';
		case 'peripheral-neuropathy':
			return 'Peripheral neuropathy';
		case 'radiculopathy':
			return 'Radiculopathy';
		case 'suspected-motor-neurone-disease':
			return 'Suspected motor neurone disease';
		case 'myopathy':
			return 'Myopathy';
		case 'plexopathy':
			return 'Plexopathy';
		case 'suspected-myasthenia':
			return 'Suspected myasthenia';
		case 'nerve-injury':
			return 'Nerve injury';
		case 'other':
			return 'Other';
		default:
			return 'Unspecified';
	}
}

/** Human-readable laterality label. */
export function lateralityLabel(value: Laterality | string): string {
	switch (value) {
		case 'left':
			return 'Left';
		case 'right':
			return 'Right';
		case 'bilateral':
			return 'Bilateral';
		case 'not-applicable':
			return 'Not applicable';
		default:
			return 'Unspecified';
	}
}

/** Human-readable symptom-duration label. */
export function symptomDurationLabel(value: SymptomDuration | string): string {
	switch (value) {
		case 'less-than-6-weeks':
			return 'Less than 6 weeks';
		case '6-weeks-to-3-months':
			return '6 weeks to 3 months';
		case '3-to-12-months':
			return '3 to 12 months';
		case 'over-12-months':
			return 'Over 12 months';
		default:
			return 'Unspecified';
	}
}

/** Axis A appropriateness-band display label. */
export function appropriatenessLabel(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'Usually appropriate';
		case 'may-be-appropriate':
			return 'May be appropriate';
		case 'usually-not-appropriate':
			return 'Usually not appropriate';
		default:
			return 'Not graded';
	}
}

/** Axis B procedural-risk display label. */
export function proceduralRiskLabel(value: ProceduralRiskBand | string): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		default:
			return 'Not graded';
	}
}

/** Axis D triage-tier display label. */
export function triageTierLabel(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'Accept and book';
		case 'query-referrer':
			return 'Query the referrer';
		case 'redirect':
			return 'Redirect to a more suitable study';
		case 'reject':
			return 'Reject';
		default:
			return 'Not graded';
	}
}

// ──────────────────────────────────────────────
// Display colours (Lily token utility classes)
// ──────────────────────────────────────────────

/** Axis A appropriateness badge colour. */
export function appropriatenessColor(value: AppropriatenessBand | string): string {
	switch (value) {
		case 'usually-appropriate':
			return 'bg-success text-success-content border-success';
		case 'may-be-appropriate':
			return 'bg-warning text-warning-content border-warning';
		case 'usually-not-appropriate':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B procedural-risk badge colour. */
export function proceduralRiskColor(value: ProceduralRiskBand | string): string {
	switch (value) {
		case 'low':
			return 'bg-success text-success-content border-success';
		case 'moderate':
			return 'bg-warning text-warning-content border-warning';
		case 'high':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D triage-tier badge colour. */
export function triageTierColor(value: TriageTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'urgent':
			return 'bg-warning text-warning-content border-warning';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation badge colour. */
export function recommendationColor(value: Recommendation | string): string {
	switch (value) {
		case 'accept':
			return 'bg-success text-success-content border-success';
		case 'query-referrer':
			return 'bg-info text-info-content border-info';
		case 'redirect':
			return 'bg-warning text-warning-content border-warning';
		case 'reject':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Flag-priority badge colour. */
export function priorityColor(value: string): string {
	switch (value) {
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
