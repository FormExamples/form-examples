import type { AssessmentData, FlagPriority, SectionKey } from './types';

/** True if a string is non-empty after trimming. */
export function hasText(s: string | null | undefined): boolean {
	return typeof s === 'string' && s.trim() !== '';
}

/** True if a numeric field has a usable value. */
export function hasNumber(n: number | null | undefined): boolean {
	return typeof n === 'number' && !isNaN(n);
}

/** True if a Yes/No field has been answered (either yes or no). */
export function isYesNoAnswered(value: string): boolean {
	return value === 'yes' || value === 'no';
}

/** True if any airway intervention has been recorded. */
export function hasAirwayIntervention(data: AssessmentData): boolean {
	const a = data.airway;
	return (
		a.interventionRepositioning ||
		a.interventionSuction ||
		a.interventionOpa ||
		a.interventionNpa ||
		a.interventionLma ||
		a.interventionBvm ||
		a.interventionEtt
	);
}

/** True if any breathing/oxygen intervention has been recorded. */
export function hasBreathingIntervention(data: AssessmentData): boolean {
	const b = data.breathing;
	return (
		b.oxygenNasalCannula ||
		b.oxygenMask ||
		b.oxygenNonRebreather ||
		b.oxygenBvm ||
		b.oxygenCpapBipap ||
		b.oxygenVentilator ||
		b.bronchodilator
	);
}

/** True if any circulation intervention (access or fluids or blood/epi) is recorded. */
export function hasCirculationIntervention(data: AssessmentData): boolean {
	const c = data.circulation;
	return (
		hasText(c.accessIvLocation) ||
		hasText(c.accessCvlLocation) ||
		hasText(c.accessIoLocation) ||
		hasNumber(c.ivfMls) ||
		c.bloodOrdered ||
		c.epinephrineGiven
	);
}

/** Human-readable label for a section key. */
export function sectionLabel(section: SectionKey): string {
	switch (section) {
		case 'patientRegistration':
			return 'Patient Registration';
		case 'chiefComplaintAndVitals':
			return 'Chief Complaint & Vitals';
		case 'highRiskSigns':
			return 'High Risk Signs';
		case 'airway':
			return 'Airway (A)';
		case 'breathing':
			return 'Breathing (B)';
		case 'circulation':
			return 'Circulation (C)';
		case 'disability':
			return 'Disability (D)';
		case 'historyOfPresentIllness':
			return 'History of Present Illness';
		case 'reviewOfSystems':
			return 'Review of Systems';
		case 'pastMedicalHistory':
			return 'Past Medical History';
		case 'physicalExam':
			return 'Physical Exam';
		case 'diagnostics':
			return 'Diagnostics';
		case 'additionalInterventions':
			return 'Additional Interventions';
		case 'assessmentAndPlan':
			return 'Assessment & Plan';
		case 'reassessment':
			return 'Reassessment';
		case 'disposition':
			return 'Disposition';
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
