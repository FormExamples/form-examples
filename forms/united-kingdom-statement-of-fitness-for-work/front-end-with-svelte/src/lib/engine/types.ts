/**
 * UK Statement of Fitness for Work (Med 3 / fit note) — TypeScript types.
 *
 * Field names use camelCase and mirror the SQL schema (snake_case) and the
 * Rust structs (`serde(rename_all = "camelCase")`).
 *
 * Empty string '' means "unanswered" for text and enum fields.
 * null means "unanswered" for numeric fields.
 */

export type YesNo = '' | 'yes' | 'no';

export type Profession =
	| ''
	| 'doctor'
	| 'nurse'
	| 'occupational_therapist'
	| 'pharmacist'
	| 'physiotherapist'
	| 'other';

export type RegistrationBody = '' | 'GMC' | 'NMC' | 'HCPC' | 'GPhC' | 'other';

export type MedicalPracticeSetting =
	| ''
	| 'primary_care'
	| 'secondary_care_inpatient'
	| 'secondary_care_discharge'
	| 'occupational_health'
	| 'pharmacy'
	| 'community_clinic'
	| 'private_practice';

export type AssessmentMethod =
	| ''
	| 'in_person'
	| 'video_call'
	| 'telephone'
	| 'written_report_from_other_hcp';

export type DiagnosisCategory =
	| ''
	| 'mental_health'
	| 'musculoskeletal'
	| 'respiratory'
	| 'cardiovascular'
	| 'neoplasm'
	| 'infection'
	| 'injury'
	| 'pregnancy'
	| 'neurological'
	| 'gastrointestinal'
	| 'endocrine'
	| 'other';

export type FitnessForWork = '' | 'not_fit' | 'may_be_fit';

export type PeriodType = '' | 'duration' | 'from_to';

export type PeriodDurationUnit = '' | 'days' | 'weeks' | 'months';

export type IssuedVia =
	| ''
	| 'digital'
	| 'printed_computer_generated'
	| 'printed_handwritten';

export interface Clinician {
	name: string;
	profession: Profession;
	registrationBody: RegistrationBody;
	registrationNumber: string;
	isPrivatePractice: YesNo;
}

export interface MedicalPractice {
	name: string;
	postalAddressAsFullText: string;
	postcode: string;
	odsCode: string;
	setting: MedicalPracticeSetting;
}

export interface Patient {
	name: string;
	birthDate: string;
	unitedKingdomNhsNumber: string;
	postalAddressAsFullText: string;
	postcode: string;
	employerName: string;
	occupation: string;
}

export interface FitNote {
	// Step 1
	clinician: Clinician;
	medicalPractice: MedicalPractice;
	// Step 2
	patient: Patient;
	// Step 3
	assessmentDate: string;
	assessmentMethod: AssessmentMethod;
	generalFitnessConsidered: YesNo;
	// Step 4
	diagnosisText: string;
	diagnosisSnomedCode: string;
	diagnosisSnomedDisplay: string;
	diagnosisCategory: DiagnosisCategory;
	conditionFirstRecordedDate: string;
	isAutomaticDisability: YesNo;
	isNonMedical: YesNo;
	// Step 5
	fitnessForWork: FitnessForWork;
	// Step 6
	adaptationPhasedReturn: YesNo;
	adaptationAlteredHours: YesNo;
	adaptationAmendedDuties: YesNo;
	adaptationWorkplaceAdaptations: YesNo;
	// Step 7
	comments: string;
	// Step 8
	periodType: PeriodType;
	periodDurationValue: number | null;
	periodDurationUnit: PeriodDurationUnit;
	periodFrom: string;
	periodTo: string;
	// Step 9
	willAssessAgain: YesNo;
	plannedReviewDate: string;
	// Step 10
	issuedAt: string;
	issuedVia: IssuedVia;
	issueSetting: MedicalPracticeSetting;
	safeguardingConcern: YesNo;
	safeguardingNotes: string;
}

/** Alias so the consolidated front-end shares the gold engine vocabulary. */
export type AssessmentData = FitNote;

export type RuleSet = 'validity' | 'adaptation' | 'period' | 'safety';
export type Severity = 'low' | 'medium' | 'high';
export type Priority = 'low' | 'medium' | 'high';

export interface FiredRule {
	ruleId: string;
	ruleSet: RuleSet;
	severity: Severity;
	description: string;
}

export type SafetyFlagCategory =
	| 'invalid_no_name'
	| 'invalid_no_profession'
	| 'invalid_no_practice_address'
	| 'may_be_fit_no_adaptations'
	| 'may_be_fit_no_comments'
	| 'non_medical_reason_detected'
	| 'automatic_disability'
	| 'duration_exceeds_3_months_in_first_6_months'
	| 'self_cert_range'
	| 'long_absence_four_weeks'
	| 'long_absence_twelve_weeks'
	| 'private_practice'
	| 'secondary_care_discharge'
	| 'new_authority_hcp'
	| 'mental_health_condition'
	| 'driving_restriction_recommended'
	| 'safeguarding_concern'
	| 'ongoing_review_required';

export interface SafetyFlag {
	flagId: string;
	category: SafetyFlagCategory;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

export type AdaptationIntensity =
	| ''
	| 'none'
	| 'light'
	| 'moderate'
	| 'substantial'
	| 'comprehensive';

export type PeriodCompliance =
	| ''
	| 'self_cert_range'
	| 'compliant'
	| 'exceeds_initial_max'
	| 'long_term'
	| 'very_long_term';

export type Recommendation =
	| ''
	| 'standard'
	| 'refer_occupational_health'
	| 'refer_access_to_work'
	| 'refer_employment_advisor'
	| 'review_for_validity';

export interface GradingResult {
	fitnessCategory: FitnessForWork;
	adaptationIntensity: AdaptationIntensity;
	adaptationCount: number;
	periodDays: number | null;
	periodCompliance: PeriodCompliance;
	isWithinFirstSixMonthsOfCondition: YesNo;
	isValid: 'yes' | 'no';
	recommendation: Recommendation;
	firedRules: FiredRule[];
	safetyFlags: SafetyFlag[];
	timestamp: string;
}

/** A blank fit note with all fields at their unanswered defaults. */
export function emptyFitNote(): FitNote {
	return {
		clinician: {
			name: '',
			profession: '',
			registrationBody: '',
			registrationNumber: '',
			isPrivatePractice: ''
		},
		medicalPractice: {
			name: '',
			postalAddressAsFullText: '',
			postcode: '',
			odsCode: '',
			setting: ''
		},
		patient: {
			name: '',
			birthDate: '',
			unitedKingdomNhsNumber: '',
			postalAddressAsFullText: '',
			postcode: '',
			employerName: '',
			occupation: ''
		},
		assessmentDate: '',
		assessmentMethod: '',
		generalFitnessConsidered: '',
		diagnosisText: '',
		diagnosisSnomedCode: '',
		diagnosisSnomedDisplay: '',
		diagnosisCategory: '',
		conditionFirstRecordedDate: '',
		isAutomaticDisability: '',
		isNonMedical: '',
		fitnessForWork: '',
		adaptationPhasedReturn: '',
		adaptationAlteredHours: '',
		adaptationAmendedDuties: '',
		adaptationWorkplaceAdaptations: '',
		comments: '',
		periodType: '',
		periodDurationValue: null,
		periodDurationUnit: '',
		periodFrom: '',
		periodTo: '',
		willAssessAgain: '',
		plannedReviewDate: '',
		issuedAt: '',
		issuedVia: '',
		issueSetting: '',
		safeguardingConcern: '',
		safeguardingNotes: ''
	};
}

export const PROFESSIONS: { value: Profession; label: string }[] = [
	{ value: 'doctor', label: 'Doctor (GMC)' },
	{ value: 'nurse', label: 'Nurse (NMC)' },
	{ value: 'occupational_therapist', label: 'Occupational therapist (HCPC)' },
	{ value: 'pharmacist', label: 'Pharmacist (GPhC)' },
	{ value: 'physiotherapist', label: 'Physiotherapist (HCPC)' },
	{ value: 'other', label: 'Other' }
];

export const REGISTRATION_BODIES: { value: RegistrationBody; label: string }[] = [
	{ value: 'GMC', label: 'GMC — General Medical Council' },
	{ value: 'NMC', label: 'NMC — Nursing & Midwifery Council' },
	{ value: 'HCPC', label: 'HCPC — Health & Care Professions Council' },
	{ value: 'GPhC', label: 'GPhC — General Pharmaceutical Council' },
	{ value: 'other', label: 'Other' }
];

export const PRACTICE_SETTINGS: { value: MedicalPracticeSetting; label: string }[] = [
	{ value: 'primary_care', label: 'Primary care (GP practice)' },
	{ value: 'secondary_care_inpatient', label: 'Secondary care (inpatient ward)' },
	{ value: 'secondary_care_discharge', label: 'Secondary care (discharge)' },
	{ value: 'occupational_health', label: 'Occupational health' },
	{ value: 'pharmacy', label: 'Pharmacy' },
	{ value: 'community_clinic', label: 'Community clinic' },
	{ value: 'private_practice', label: 'Private practice' }
];

export const ASSESSMENT_METHODS: { value: AssessmentMethod; label: string }[] = [
	{ value: 'in_person', label: 'In person (face-to-face)' },
	{ value: 'video_call', label: 'Video call' },
	{ value: 'telephone', label: 'Telephone' },
	{ value: 'written_report_from_other_hcp', label: 'Written report from another HCP' }
];

export const DIAGNOSIS_CATEGORIES: { value: DiagnosisCategory; label: string }[] = [
	{ value: 'mental_health', label: 'Mental health' },
	{ value: 'musculoskeletal', label: 'Musculoskeletal' },
	{ value: 'respiratory', label: 'Respiratory' },
	{ value: 'cardiovascular', label: 'Cardiovascular' },
	{ value: 'neoplasm', label: 'Neoplasm' },
	{ value: 'infection', label: 'Infection' },
	{ value: 'injury', label: 'Injury' },
	{ value: 'pregnancy', label: 'Pregnancy' },
	{ value: 'neurological', label: 'Neurological' },
	{ value: 'gastrointestinal', label: 'Gastrointestinal' },
	{ value: 'endocrine', label: 'Endocrine' },
	{ value: 'other', label: 'Other' }
];

export const ISSUED_VIA_OPTIONS: { value: IssuedVia; label: string }[] = [
	{ value: 'digital', label: 'Digital fit note (electronic)' },
	{ value: 'printed_computer_generated', label: 'Printed (computer generated)' },
	{ value: 'printed_handwritten', label: 'Printed (handwritten)' }
];

/** Days covered by the fit note, from either the duration or the from/to range. */
export function computePeriodDays(fitNote: FitNote): number | null {
	if (fitNote.periodType === 'duration' && fitNote.periodDurationValue) {
		const n = Number(fitNote.periodDurationValue);
		switch (fitNote.periodDurationUnit) {
			case 'days':
				return n;
			case 'weeks':
				return n * 7;
			case 'months':
				return Math.round(n * 30.4375);
			default:
				return null;
		}
	}
	if (fitNote.periodType === 'from_to' && fitNote.periodFrom && fitNote.periodTo) {
		const from = new Date(fitNote.periodFrom);
		const to = new Date(fitNote.periodTo);
		if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return null;
		return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
	}
	return null;
}

/** Number of workplace adaptations ticked (0..4). */
export function countAdaptations(fitNote: FitNote): number {
	return (
		(fitNote.adaptationPhasedReturn === 'yes' ? 1 : 0) +
		(fitNote.adaptationAlteredHours === 'yes' ? 1 : 0) +
		(fitNote.adaptationAmendedDuties === 'yes' ? 1 : 0) +
		(fitNote.adaptationWorkplaceAdaptations === 'yes' ? 1 : 0)
	);
}

/** One wizard step: number, full title, and a short label for the step list. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}
