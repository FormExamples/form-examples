import type {
	StudyType,
	Indication,
	AppropriatenessBand,
	SafetyBand,
	RadiationDoseBand,
	TriageTier,
	Recommendation
} from './types';

// ──────────────────────────────────────────────
// Study-type / indication predicates
// ──────────────────────────────────────────────

/** Whether a study type uses ionising radiation (all fluoroscopy does). */
export function isIonisingStudy(studyType: string): boolean {
	return !!studyType && studyType !== '';
}

/** Whether a study type is a barium (insoluble-contrast) study. */
export function isBariumStudy(studyType: string): boolean {
	return (
		studyType === 'barium-swallow' ||
		studyType === 'barium-meal' ||
		studyType === 'barium-follow-through' ||
		studyType === 'barium-enema'
	);
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

const STUDY_TYPE_LABELS: Record<string, string> = {
	'barium-swallow': 'Barium swallow',
	'barium-meal': 'Barium meal',
	'barium-follow-through': 'Barium follow-through',
	'barium-enema': 'Barium enema',
	'water-soluble-contrast-swallow': 'Water-soluble contrast swallow',
	'defecating-proctogram': 'Defecating proctogram',
	hysterosalpingogram: 'Hysterosalpingogram',
	'micturating-cystourethrogram': 'Micturating cystourethrogram',
	arthrogram: 'Arthrogram',
	'fluoroscopy-guided-procedure': 'Fluoroscopy-guided procedure',
	other: 'Other'
};

/** Human-readable study-type label, falling back to a neutral placeholder. */
export function studyTypeLabel(value: StudyType | string): string {
	return STUDY_TYPE_LABELS[value] || (value ? String(value) : 'Unspecified');
}

const INDICATION_LABELS: Record<string, string> = {
	dysphagia: 'Dysphagia',
	reflux: 'Reflux',
	'suspected-obstruction': 'Suspected obstruction',
	'suspected-perforation': 'Suspected perforation',
	constipation: 'Constipation',
	'infertility-tubal-patency': 'Infertility / tubal patency',
	'vesicoureteric-reflux': 'Vesicoureteric reflux',
	'joint-assessment': 'Joint assessment',
	other: 'Other'
};

/** Human-readable indication label, falling back to a neutral placeholder. */
export function indicationLabel(value: Indication | string): string {
	return INDICATION_LABELS[value] || (value ? String(value) : 'Unspecified');
}

/** Axis A appropriateness display label. */
export function appropriatenessLabel(value: string): string {
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

/** Axis B safety display label. */
export function safetyLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'contraindicated':
			return 'Contraindicated';
		default:
			return 'Not graded';
	}
}

/** Axis B radiation-dose display label. */
export function radiationDoseLabel(value: string): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		default:
			return 'Not assessed';
	}
}

/** Axis D triage-tier display label. */
export function triageTierLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'urgent':
			return 'Urgent';
		case 'emergency':
			return 'Emergency';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
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

/** Axis B safety badge colour. */
export function safetyColor(value: SafetyBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'contraindicated':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B radiation-dose badge colour. */
export function radiationDoseColor(value: RadiationDoseBand | string): string {
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
		case 'emergency':
			return 'bg-error text-error-content border-error';
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
