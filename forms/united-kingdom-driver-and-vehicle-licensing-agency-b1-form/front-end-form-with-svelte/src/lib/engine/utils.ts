import type { AssessmentData, FlagPriority, SectionKey } from './types';

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

/** True if a string is non-empty after trimming. */
export function hasText(s: string | null | undefined): boolean {
	return typeof s === 'string' && s.trim() !== '';
}

/** True if a Yes/No field has been answered (either yes or no). */
export function isYesNoAnswered(value: string): boolean {
	return value === 'yes' || value === 'no';
}

/**
 * True if the patient must complete the epilepsy declaration. The declaration
 * is mandatory whenever the patient declares epilepsy or more than one
 * lifetime seizure (DVLA B1 question 6 group).
 */
export function epilepsyDeclarationRequired(data: AssessmentData): boolean {
	return (
		data.seizures.hadSeizures === 'yes' &&
		data.seizures.diagnosis === 'more-than-one-or-epilepsy'
	);
}

/** Human-readable label for a section key. */
export function sectionLabel(section: SectionKey): string {
	switch (section) {
		case 'personalDetails':
			return 'Personal Details';
		case 'healthcareProfessionals':
			return 'Healthcare Professionals';
		case 'conditionHistory':
			return 'Condition History (Q1)';
		case 'treatmentProvider':
			return 'Treatment Provider (Q2)';
		case 'blackouts':
			return 'Blackouts (Q3)';
		case 'seizures':
			return 'Seizures (Q4–Q6)';
		case 'medication':
			return 'Medication (Q7)';
		case 'vpShunt':
			return 'VP Shunt (Q8)';
		case 'dailyLiving':
			return 'Daily Living (Q9)';
		case 'doubleVision':
			return 'Double Vision (Q10)';
		case 'eyesight':
			return 'Eyesight (Q11)';
		case 'vehicleAdaptations':
			return 'Vehicle Adaptations (Q12)';
		case 'authorisation':
			return 'Authorisation';
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
