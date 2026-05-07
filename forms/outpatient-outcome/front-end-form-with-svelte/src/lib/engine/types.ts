// ──────────────────────────────────────────────
// Domain grade: A (best) through E (worst)
// '' means data is insufficient to grade
// ──────────────────────────────────────────────

export type DomainGrade = 'A' | 'B' | 'C' | 'D' | 'E' | '';

// ──────────────────────────────────────────────
// Patient Details (Step 1)
// ──────────────────────────────────────────────

export type Sex = 'male' | 'female' | 'other' | 'prefer_not_to_say' | '';

export interface PatientDetails {
	givenName: string;
	familyName: string;
	dateOfBirth: string;
	nhsNumber: string;
	sex: Sex;
}

// ──────────────────────────────────────────────
// Encounter Details (Step 2)
// ──────────────────────────────────────────────

export type Modality = 'in_person' | 'telephone' | 'video' | '';
export type AppointmentType = 'new' | 'follow_up' | 'pifu' | '';

export interface EncounterDetails {
	clinicDate: string;
	specialty: string;
	clinicianName: string;
	modality: Modality;
	appointmentType: AppointmentType;
}

// ──────────────────────────────────────────────
// Operational Efficiency (Step 3)
// ──────────────────────────────────────────────

export type NhsAttendanceOutcome =
	| 'attended_discharged'
	| 'attended_follow_up'
	| 'attended_pifu'
	| 'attended_onward_referral'
	| 'patient_cancelled'
	| 'patient_dna'
	| 'provider_cancelled'
	| '';

export interface OperationalEfficiency {
	referralDate: string;
	appointmentDate: string;
	waitTimeDays: number | null;
	serviceTargetDays: number | null;
	nhsAttendanceOutcome: NhsAttendanceOutcome;
}

// ──────────────────────────────────────────────
// Clinical Outcome (Step 4)
// ──────────────────────────────────────────────

export type OutcomeClassification =
	| 'resolved'
	| 'improved'
	| 'unchanged'
	| 'worsened'
	| 'died'
	| '';

export interface ClinicalOutcome {
	presentingComplaint: string;
	diagnosis: string;
	treatmentDelivered: string;
	outcomeClassification: OutcomeClassification;
}

// ──────────────────────────────────────────────
// PROM — EQ-5D-5L (Step 5)
// Levels 1–5; null = not answered
// ──────────────────────────────────────────────

export type Eq5dLevel = 1 | 2 | 3 | 4 | 5 | null;

export interface PromEq5d5l {
	beforeMobility: Eq5dLevel;
	beforeSelfCare: Eq5dLevel;
	beforeUsualActivities: Eq5dLevel;
	beforePainDiscomfort: Eq5dLevel;
	beforeAnxietyDepression: Eq5dLevel;
	beforeVas: number | null; // 0–100
	afterMobility: Eq5dLevel;
	afterSelfCare: Eq5dLevel;
	afterUsualActivities: Eq5dLevel;
	afterPainDiscomfort: Eq5dLevel;
	afterAnxietyDepression: Eq5dLevel;
	afterVas: number | null; // 0–100
}

// ──────────────────────────────────────────────
// PROM — GRC (Step 6)
// ──────────────────────────────────────────────

export type GrcValue = -3 | -2 | -1 | 0 | 1 | 2 | 3 | null;
export type SelfRatedHealth = 'excellent' | 'very_good' | 'good' | 'fair' | 'poor' | '';

export interface PromGrc {
	globalRatingOfChange: GrcValue;
	selfRatedHealth: SelfRatedHealth;
}

// ──────────────────────────────────────────────
// PROM — PROMIS Global Health v1.2 (Step 7)
// Items 1–5 scale; item 9 Pain 0–10; null = not answered
// ──────────────────────────────────────────────

export interface PromPromis {
	item1GeneralHealth: number | null; // 1–5
	item2QualityOfLife: number | null; // 1–5
	item3PhysicalHealth: number | null; // 1–5
	item4MentalHealth: number | null; // 1–5
	item5Satisfaction: number | null; // 1–5
	item6FatigueFrequency: number | null; // 1–5
	item7EmotionalProblems: number | null; // 1–5
	item8SocialActivities: number | null; // 1–5
	item9Pain: number | null; // 0–10
	item10EverydayActivities: number | null; // 1–5
	// Derived T-scores (computed by engine/utils.ts)
	globalPhysicalHealthTScore: number | null;
	globalMentalHealthTScore: number | null;
}

// ──────────────────────────────────────────────
// PREM — FFT (Step 8)
// ──────────────────────────────────────────────

export type FftResponse =
	| 'extremely_likely'
	| 'likely'
	| 'neither'
	| 'unlikely'
	| 'extremely_unlikely'
	| 'dont_know'
	| '';

export interface PremFft {
	fftResponse: FftResponse;
	fftComment: string;
}

// ──────────────────────────────────────────────
// Follow-up Plan (Step 9)
// ──────────────────────────────────────────────

export type Disposition = 'discharge' | 'pifu' | 'follow_up_booked' | 'onward_referral' | '';

export interface FollowupPlan {
	disposition: Disposition;
	nextAppointmentDate: string;
	onwardReferralSpecialty: string;
	followupNotes: string;
}

// ──────────────────────────────────────────────
// Sign-off (Step 10)
// ──────────────────────────────────────────────

export interface SignOff {
	reportingClinicianName: string;
	reportingClinicianRole: string;
	signedOffAt: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	patientDetails: PatientDetails;
	encounterDetails: EncounterDetails;
	operationalEfficiency: OperationalEfficiency;
	clinicalOutcome: ClinicalOutcome;
	promEq5d5l: PromEq5d5l;
	promGrc: PromGrc;
	promPromis: PromPromis;
	premFft: PremFft;
	followupPlan: FollowupPlan;
	signOff: SignOff;
}

// ──────────────────────────────────────────────
// Grading result types
// ──────────────────────────────────────────────

export interface FiredRule {
	id: string;
	domain: string;
	description: string;
	grade: DomainGrade;
}

export interface FlaggedIssue {
	id: string;
	category: string;
	message: string;
	priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	overallGrade: DomainGrade;
	clinicalGrade: DomainGrade;
	promGrade: DomainGrade;
	premGrade: DomainGrade;
	operationalGrade: DomainGrade;
	firedRules: FiredRule[];
	flaggedIssues: FlaggedIssue[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}
