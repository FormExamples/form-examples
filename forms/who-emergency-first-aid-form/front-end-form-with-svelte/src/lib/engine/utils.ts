import type {
	AssessmentData,
	Airway,
	Breathing,
	Circulation,
	Disability,
	Exposure,
	FlagPriority,
	MajorBleeding,
	SectionKey
} from './types';

/** True if a string is non-empty after trimming. */
export function hasText(s: string | null | undefined): boolean {
	return typeof s === 'string' && s.trim() !== '';
}

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

/**
 * For a CABCDE category, the assessment is "answered" when either the Normal
 * checkbox is ticked or the free-text findings have been filled in.
 */
export function isAssessmentAnswered(section: {
	assessmentNormal: boolean;
	assessmentFindings: string;
}): boolean {
	return section.assessmentNormal || hasText(section.assessmentFindings);
}

/** True if any intervention checkbox in a Major Bleeding block is selected. */
export function hasAnyMajorBleedingIntervention(s: MajorBleeding): boolean {
	const i = s.interventions;
	return (
		i.directPressure ||
		i.deepWoundPacking ||
		i.tourniquet ||
		i.uterineMassage ||
		i.none
	);
}

/** True if any intervention checkbox in an Airway block is selected. */
export function hasAnyAirwayIntervention(s: Airway): boolean {
	const i = s.interventions;
	return i.neckImmobilization || i.headTiltChinLift || i.jawThrust || i.chokingCare || i.none;
}

/** True if any intervention checkbox in a Breathing block is selected. */
export function hasAnyBreathingIntervention(s: Breathing): boolean {
	const i = s.interventions;
	return i.maintainedPositionOfComfort || i.none;
}

/** True if any intervention checkbox in a Circulation block is selected. */
export function hasAnyCirculationIntervention(s: Circulation): boolean {
	const i = s.interventions;
	return (
		i.pelvicBinder ||
		i.controlMinorBleeding ||
		i.fractureCare ||
		i.oralHydration ||
		i.leftLateralPosition ||
		i.none
	);
}

/** True if any intervention checkbox in a Disability block is selected. */
export function hasAnyDisabilityIntervention(s: Disability): boolean {
	const i = s.interventions;
	return (
		i.spinalImmobilisation ||
		i.glucoseGiven ||
		i.seizureCare ||
		i.highTemperatureCare ||
		i.lowTemperatureCare ||
		i.none
	);
}

/** True if any intervention checkbox in an Exposure block is selected. */
export function hasAnyExposureIntervention(s: Exposure): boolean {
	const i = s.interventions;
	return (
		i.recoveryPosition ||
		i.burnCare ||
		i.woundCare ||
		i.drowningCare ||
		i.snakebiteCare ||
		i.none
	);
}

/**
 * True if a (non-tourniquet) life-saving intervention has been performed for
 * major bleeding — used to detect "tourniquet without time" and similar
 * data-quality flags.
 */
export function hasNonTourniquetBleedingIntervention(s: MajorBleeding): boolean {
	const i = s.interventions;
	return i.directPressure || i.deepWoundPacking || i.uterineMassage;
}

/** Active medication-narrative branch on the Exposure step. */
export function medicationTakenAnswered(data: AssessmentData): boolean {
	return data.exposure.medicationTakenNone || hasText(data.exposure.medicationTakenDetails);
}

/** Human-readable label for a section key. */
export function sectionLabel(section: SectionKey): string {
	switch (section) {
		case 'patientIdentification':
			return 'Patient Identification';
		case 'referralTransport':
			return 'Referral & Transport';
		case 'situation':
			return 'Situation';
		case 'background':
			return 'Background';
		case 'majorBleeding':
			return 'Major Bleeding (C)';
		case 'airway':
			return 'Airway (A)';
		case 'breathing':
			return 'Breathing (B)';
		case 'circulation':
			return 'Circulation (C)';
		case 'disability':
			return 'Disability (D)';
		case 'exposure':
			return 'Exposure / Other (E)';
		case 'recommendations':
			return 'Recommendations';
		case 'responderDetails':
			return 'Responder Details';
	}
}

/** Tailwind colour classes for a flag priority badge. */
export function priorityColor(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-red-200 text-red-900 border-red-400';
		case 'high':
			return 'bg-red-100 text-red-800 border-red-300';
		case 'medium':
			return 'bg-orange-100 text-orange-800 border-orange-300';
		case 'low':
			return 'bg-yellow-100 text-yellow-800 border-yellow-300';
	}
}

/** Human-readable label for a flag priority. */
export function priorityLabel(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'Urgent';
		case 'high':
			return 'High';
		case 'medium':
			return 'Medium';
		case 'low':
			return 'Low';
	}
}
