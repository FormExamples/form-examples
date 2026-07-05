import type {
	NeurodiversityAdjustmentRequest,
	EligibilityBand,
	ImpactBand,
	PriorityTier,
	Recommendation,
	RequestStatus,
	CurrentImpact
} from './types';

// ──────────────────────────────────────────────
// Domain helpers
// ──────────────────────────────────────────────

/** Any of the seven condition* booleans true, or other-detail supplied. */
export function anyCondition(r: NeurodiversityAdjustmentRequest): boolean {
	return (
		r.conditionAdhd ||
		r.conditionAutism ||
		r.conditionDyslexia ||
		r.conditionDyspraxia ||
		r.conditionDyscalculia ||
		r.conditionTourettes ||
		r.conditionOther ||
		r.conditionOtherDetail.trim() !== ''
	);
}

/** Any of the eight difficulty* booleans true. */
export function anyDifficulty(r: NeurodiversityAdjustmentRequest): boolean {
	return (
		r.difficultyConcentration ||
		r.difficultyWrittenCommunication ||
		r.difficultyOrganisationTime ||
		r.difficultySensoryOverload ||
		r.difficultyBalanceCoordination ||
		r.difficultySocialCommunication ||
		r.difficultyMemory ||
		r.difficultyBurnoutWellbeing
	);
}

/** Any of the eight adjustment* booleans true. */
export function anyAdjustment(r: NeurodiversityAdjustmentRequest): boolean {
	return (
		r.adjustmentWorkingEnvironment ||
		r.adjustmentEquipmentTechnology ||
		r.adjustmentWorkingArrangements ||
		r.adjustmentCommunication ||
		r.adjustmentSupportMentoring ||
		r.adjustmentRecruitmentProcess ||
		r.adjustmentPolicyDress ||
		r.adjustmentOther
	);
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/** Axis A eligibility display label. */
export function eligibilityLabel(value: string): string {
	switch (value) {
		case 'likely-covered':
			return 'Likely covered';
		case 'possibly-covered':
			return 'Possibly covered';
		case 'unclear':
			return 'Unclear';
		default:
			return 'Not graded';
	}
}

/** Axis B impact / wellbeing display label. */
export function impactLabel(value: string): string {
	switch (value) {
		case 'ok':
			return 'OK';
		case 'caution':
			return 'Caution';
		case 'high-risk':
			return 'High risk';
		default:
			return 'Not graded';
	}
}

/** Axis D priority-tier display label. */
export function priorityTierLabel(value: string): string {
	switch (value) {
		case 'routine':
			return 'Routine';
		case 'soon':
			return 'Soon';
		case 'urgent':
			return 'Urgent';
		default:
			return 'Not graded';
	}
}

/** Overall recommendation display label. */
export function recommendationLabel(value: string): string {
	switch (value) {
		case 'progress-to-meeting':
			return 'Progress to an adjustments meeting';
		case 'seek-occupational-health':
			return 'Seek an occupational-health assessment';
		case 'request-more-detail':
			return 'Request more detail from the worker';
		case 'signpost-access-to-work':
			return 'Signpost the Access to Work scheme';
		default:
			return 'Not graded';
	}
}

/** Human-readable current-impact label. */
export function currentImpactLabel(value: CurrentImpact | string): string {
	switch (value) {
		case 'low':
			return 'Low';
		case 'moderate':
			return 'Moderate';
		case 'high':
			return 'High';
		case 'severe':
			return 'Severe';
		default:
			return 'Unspecified';
	}
}

/** Human-readable request-status label. */
export function statusLabel(value: RequestStatus | string): string {
	switch (value) {
		case 'draft':
			return 'Draft';
		case 'submitted':
			return 'Submitted';
		case 'under-review':
			return 'Under review';
		case 'agreed':
			return 'Agreed';
		case 'partially-agreed':
			return 'Partially agreed';
		case 'declined':
			return 'Declined';
		case 'withdrawn':
			return 'Withdrawn';
		default:
			return 'Unspecified';
	}
}

/** A human-readable list of the worker's recorded neurodivergent conditions. */
export function conditionList(r: NeurodiversityAdjustmentRequest): string[] {
	const list: string[] = [];
	if (r.conditionAdhd) list.push('ADHD');
	if (r.conditionAutism) list.push('Autism');
	if (r.conditionDyslexia) list.push('Dyslexia');
	if (r.conditionDyspraxia) list.push('Dyspraxia');
	if (r.conditionDyscalculia) list.push('Dyscalculia');
	if (r.conditionTourettes) list.push("Tourette's syndrome");
	if (r.conditionOther)
		list.push(r.conditionOtherDetail.trim() !== '' ? r.conditionOtherDetail.trim() : 'Other');
	return list;
}

/** A human-readable list of the worker's recorded functional difficulties. */
export function difficultyList(r: NeurodiversityAdjustmentRequest): string[] {
	const list: string[] = [];
	if (r.difficultyConcentration) list.push('Concentration / focus');
	if (r.difficultyWrittenCommunication) list.push('Reading / written communication');
	if (r.difficultyOrganisationTime) list.push('Organisation / time management');
	if (r.difficultySensoryOverload) list.push('Sensory overload');
	if (r.difficultyBalanceCoordination) list.push('Balance / coordination');
	if (r.difficultySocialCommunication) list.push('Social communication');
	if (r.difficultyMemory) list.push('Working memory / recall');
	if (r.difficultyBurnoutWellbeing) list.push('Fatigue / burnout / wellbeing');
	return list;
}

/** A human-readable list of the requested adjustment categories. */
export function adjustmentList(r: NeurodiversityAdjustmentRequest): string[] {
	const list: string[] = [];
	if (r.adjustmentWorkingEnvironment) list.push('Working environment');
	if (r.adjustmentEquipmentTechnology) list.push('Equipment / technology');
	if (r.adjustmentWorkingArrangements) list.push('Working arrangements');
	if (r.adjustmentCommunication) list.push('Communication');
	if (r.adjustmentSupportMentoring) list.push('Support / mentoring');
	if (r.adjustmentRecruitmentProcess) list.push('Recruitment process');
	if (r.adjustmentPolicyDress) list.push('Policy / dress code');
	if (r.adjustmentOther) list.push('Other');
	return list;
}

// ──────────────────────────────────────────────
// Display colours (Tailwind utility classes)
// ──────────────────────────────────────────────

/** Axis A eligibility badge colour. */
export function eligibilityColor(value: EligibilityBand | string): string {
	switch (value) {
		case 'likely-covered':
			return 'bg-info text-info-content border-info';
		case 'possibly-covered':
			return 'bg-warning text-warning-content border-warning';
		case 'unclear':
			return 'bg-base-300 text-base-content border-base-300';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis B impact / wellbeing badge colour. */
export function impactColor(value: ImpactBand | string): string {
	switch (value) {
		case 'ok':
			return 'bg-success text-success-content border-success';
		case 'caution':
			return 'bg-warning text-warning-content border-warning';
		case 'high-risk':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Axis D priority-tier badge colour. */
export function priorityTierColor(value: PriorityTier | string): string {
	switch (value) {
		case 'routine':
			return 'bg-success text-success-content border-success';
		case 'soon':
			return 'bg-warning text-warning-content border-warning';
		case 'urgent':
			return 'bg-error text-error-content border-error';
		default:
			return 'bg-base-300 text-base-content border-base-300';
	}
}

/** Overall recommendation badge colour. */
export function recommendationColor(value: Recommendation | string): string {
	switch (value) {
		case 'progress-to-meeting':
			return 'bg-success text-success-content border-success';
		case 'seek-occupational-health':
			return 'bg-info text-info-content border-info';
		case 'request-more-detail':
			return 'bg-warning text-warning-content border-warning';
		case 'signpost-access-to-work':
			return 'bg-info text-info-content border-info';
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
