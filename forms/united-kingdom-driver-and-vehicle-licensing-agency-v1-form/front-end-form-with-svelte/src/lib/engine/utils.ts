import type {
	AssessmentData,
	ContactPreference,
	EyesightStandard,
	MonocularAdaptation,
	MonocularDuration,
	ValidationSeverity,
	VisualFieldCause,
	WhichEye,
	WhichEyes
} from './types';

/** Calculate age from a date-of-birth string. Returns null on invalid input. */
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

// ──────────────────────────────────────────────
// Branch-active helpers
//
// DVLA V1 uses heavy conditional logic: most "No" answers skip downstream
// branches. These helpers describe the *active* branch — the questions the
// patient is required to answer given their earlier answers.
// ──────────────────────────────────────────────

/** Q2 No path → ask which eye, duration, monocular declaration. */
export function isMonocularBranchActive(d: AssessmentData): boolean {
	return d.visionInBothEyes.hasVisionInBothEyes === 'no';
}

/** Q3 Yes path → ask whether caused solely by an eye condition. */
export function isVisualFieldBranchActive(d: AssessmentData): boolean {
	return d.fieldOfVision.hasProblem === 'yes';
}

/** Q3b No path → ask specific cause (brain tumour, head injury, stroke, other). */
export function isVisualFieldCauseBranchActive(d: AssessmentData): boolean {
	return (
		d.fieldOfVision.hasProblem === 'yes' &&
		d.fieldOfVision.causedSolelyByEyeCondition === 'no'
	);
}

/** Q4 Yes path → ask which eye(s). */
export function isGlaucomaBranchActive(d: AssessmentData): boolean {
	return d.glaucoma.hasCondition === 'yes';
}

/** Q5 Yes path → ask which eye(s). */
export function isRetinitisPigmentosaBranchActive(d: AssessmentData): boolean {
	return d.retinitisPigmentosa.hasCondition === 'yes';
}

/** Q6 Yes path → ask treatment dates. */
export function isLaserTreatmentBranchActive(d: AssessmentData): boolean {
	return d.laserTreatment.hasHadTreatment === 'yes';
}

/** Q7 Yes path → ask which eye(s), treatment status, controlled status. */
export function isBlepharospasmBranchActive(d: AssessmentData): boolean {
	return d.blepharospasm.hasCondition === 'yes';
}

/** Q8 Yes path → ask which eye(s). */
export function isNightBlindnessBranchActive(d: AssessmentData): boolean {
	return d.nightBlindness.hasCondition === 'yes';
}

/** Q9 Yes path → ask controlled status, 6-month duration, declaration. */
export function isDoubleVisionBranchActive(d: AssessmentData): boolean {
	return d.doubleVision.hasCondition === 'yes';
}

/** Q10 Yes path → ask details. */
export function isOtherVisionBranchActive(d: AssessmentData): boolean {
	return d.otherVisionConditions.hasOther === 'yes';
}

/** Q11 Yes path → ask date of contact. */
export function isRecentContactBranchActive(d: AssessmentData): boolean {
	return d.recentContact.hadContact === 'yes';
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

export function eyesightStandardLabel(v: EyesightStandard | ''): string {
	switch (v) {
		case 'yes-without-correction':
			return 'Yes, without glasses or corrective lenses';
		case 'yes-with-correction':
			return 'Yes, with glasses or corrective lenses';
		case 'no':
			return 'No';
		default:
			return '';
	}
}

export function whichEyeLabel(v: WhichEye | ''): string {
	switch (v) {
		case 'left':
			return 'Left eye only';
		case 'right':
			return 'Right eye only';
		default:
			return '';
	}
}

export function whichEyesLabel(v: WhichEyes | ''): string {
	switch (v) {
		case 'both':
			return 'Both eyes';
		case 'left':
			return 'Left eye';
		case 'right':
			return 'Right eye';
		default:
			return '';
	}
}

export function monocularDurationLabel(v: MonocularDuration | ''): string {
	switch (v) {
		case 'since-birth-or-childhood':
			return 'Since birth or childhood';
		case 'health-or-injury':
			return 'As a result of a health condition, accident or injury';
		default:
			return '';
	}
}

export function monocularAdaptationLabel(v: MonocularAdaptation | ''): string {
	switch (v) {
		case 'adapted-advised':
			return 'Adapted, as advised by a healthcare professional';
		case 'adapted-self':
			return 'Adapted, but not advised by a healthcare professional';
		case 'not-adapted':
			return 'Not yet adapted';
		default:
			return '';
	}
}

export function visualFieldCauseLabel(v: VisualFieldCause | ''): string {
	switch (v) {
		case 'brain-tumour':
			return 'Brain tumour';
		case 'head-injury':
			return 'Head injury';
		case 'stroke':
			return 'Stroke';
		case 'other':
			return 'Other';
		default:
			return '';
	}
}

export function contactPreferenceLabel(v: ContactPreference | ''): string {
	switch (v) {
		case 'email':
			return 'Email';
		case 'sms':
			return 'SMS (Text)';
		default:
			return '';
	}
}

/** Tailwind colour classes for a validation severity badge. */
export function severityColor(severity: ValidationSeverity | ''): string {
	switch (severity) {
		case 'error':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'warning':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'info':
			return 'bg-blue-100 text-blue-800 border-blue-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

/** Human-readable severity label. */
export function severityLabel(severity: ValidationSeverity | ''): string {
	switch (severity) {
		case 'error':
			return 'Error';
		case 'warning':
			return 'Warning';
		case 'info':
			return 'Info';
		default:
			return '';
	}
}

/** Tailwind colour classes for a flag priority badge. */
export function priorityColor(priority: 'urgent' | 'high' | 'medium' | 'low' | ''): string {
	switch (priority) {
		case 'urgent':
			return 'bg-red-200 text-red-900 border-red-400';
		case 'high':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'medium':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'low':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
		default:
			return 'bg-gray-100 text-gray-700 border-gray-300';
	}
}

export function priorityLabel(priority: 'urgent' | 'high' | 'medium' | 'low' | ''): string {
	switch (priority) {
		case 'urgent':
			return 'Urgent';
		case 'high':
			return 'High';
		case 'medium':
			return 'Medium';
		case 'low':
			return 'Low';
		default:
			return '';
	}
}

/** Format an ISO date string (YYYY-MM-DD) as DD/MM/YYYY (UK convention). */
export function formatDateUk(iso: string): string {
	if (!iso) return '';
	const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
	if (!m) return iso;
	return `${m[3]}/${m[2]}/${m[1]}`;
}
