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

/** True if a Yes/No/Unknown field has been answered. */
export function isYesNoUnknownAnswered(value: string): boolean {
	return value === 'yes' || value === 'no' || value === 'unknown';
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

/** True if any oxygen / ventilation intervention has been recorded. */
export function hasBreathingIntervention(data: AssessmentData): boolean {
	const b = data.breathing;
	return (
		hasNumber(b.oxygenLitres) ||
		b.oxygenNasalCannula ||
		b.oxygenFaceMask ||
		b.oxygenNonRebreather ||
		b.oxygenBvm ||
		b.oxygenBipapCpap ||
		hasText(b.oxygenOther)
	);
}

/** True if any IV/IO access or fluid bolus has been recorded. */
export function hasIvAccessOrFluids(data: AssessmentData): boolean {
	const c = data.circulation;
	return (
		hasText(c.accessIvSite) ||
		hasText(c.accessIoSite) ||
		hasNumber(c.ivfMls) ||
		c.ivfNs ||
		c.ivfLr ||
		hasText(c.ivfOther)
	);
}

/** GCS total or null when any component is missing. */
export function gcsTotal(data: AssessmentData): number | null {
	const d = data.disability;
	if (hasNumber(d.gcsEye) && hasNumber(d.gcsVerbal) && hasNumber(d.gcsMotor)) {
		return (d.gcsEye as number) + (d.gcsVerbal as number) + (d.gcsMotor as number);
	}
	return null;
}

/** True if the encounter is flagged as an injury (Step 2). */
export function isInjury(data: AssessmentData): boolean {
	return data.chiefComplaintAndVitals.injury === true;
}

/** True if any high risk sign is set (Step 3). */
export function hasAnyHighRiskSign(data: AssessmentData): boolean {
	const r = data.highRiskSigns;
	return Object.values(r).some((v) => v === true);
}

/** Human-readable label for a section key. */
export function sectionLabel(section: SectionKey): string {
	switch (section) {
		case 'callerAndScene':
			return 'Caller & Scene';
		case 'chiefComplaintAndVitals':
			return 'Chief Complaint & Vitals';
		case 'highRiskSigns':
			return 'High Risk Signs';
		case 'triage':
			return 'Triage';
		case 'airway':
			return 'Airway (A)';
		case 'breathing':
			return 'Breathing (B)';
		case 'circulation':
			return 'Circulation (C)';
		case 'disability':
			return 'Disability (D)';
		case 'exposure':
			return 'Exposure (E)';
		case 'sampleHistory':
			return 'SAMPLE History';
		case 'injuryDetails':
			return 'Injury Details';
		case 'physicalExam':
			return 'Physical Exam';
		case 'additionalInterventions':
			return 'Additional Interventions';
		case 'assessmentAndPlan':
			return 'Assessment & Plan';
		case 'reassessments':
			return 'Reassessment';
		case 'disposition':
			return 'Disposition';
	}
}

/** Lily status token classes for a flag priority badge. */
export function priorityColor(priority: FlagPriority): string {
	switch (priority) {
		case 'urgent':
			return 'bg-error text-error-content border-error';
		case 'high':
			return 'bg-error text-error-content border-error';
		case 'medium':
			return 'bg-warning text-warning-content border-warning';
		case 'low':
			return 'bg-warning text-warning-content border-warning';
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
