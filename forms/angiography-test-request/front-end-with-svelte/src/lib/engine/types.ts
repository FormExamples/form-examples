// ──────────────────────────────────────────────
// Core request data types — Angiography Test Request
// ──────────────────────────────────────────────
//
// A UK NHS–aligned vascular angiography request (referral). The clinician
// completes a single-page wizard; the engine grades the request on four
// independent axes (appropriateness, contrast / radiation safety, request
// completeness, triage priority) and raises safety-critical flags. Property
// names are camelCase to match the front-end serde / examples convention.

export type AngiographyType =
	| 'ct-angiography'
	| 'mr-angiography'
	| 'catheter-dsa'
	| 'coronary-angiography'
	| 'peripheral-angiography'
	| 'cerebral-angiography'
	| 'other'
	| '';

export type BodyRegion =
	| 'coronary'
	| 'cerebral'
	| 'carotid'
	| 'aorta'
	| 'renal'
	| 'peripheral-lower-limb'
	| 'pulmonary'
	| 'mesenteric'
	| 'other'
	| '';

export type Indication =
	| 'suspected-coronary-disease'
	| 'peripheral-arterial-disease'
	| 'aneurysm'
	| 'stenosis'
	| 'suspected-pulmonary-embolism'
	| 'gi-bleeding'
	| 'pre-intervention-planning'
	| 'suspected-stroke'
	| 'other'
	| '';

export type ContrastRequirement = 'iodinated' | 'gadolinium' | 'none' | 'unknown' | '';
export type PregnancyStatus =
	| 'not-pregnant'
	| 'pregnant'
	| 'possible'
	| 'unknown'
	| 'not-applicable'
	| '';
export type Urgency = 'routine' | 'urgent' | 'emergency' | '';

export interface Clinician {
	clinicianName: string;
	clinicianRole: string;
	registrationBody: string;
	registrationNumber: string;
	requesterContact: string;
	supervisingConsultant: string;
	siteName: string;
	referralDate: string;
}

export interface Patient {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	nhsNumber: string;
	bodyMassIndex: number | null;
	interpreterRequired: boolean;
}

export interface RequestExamination {
	angiographyType: AngiographyType;
	bodyRegion: BodyRegion;
	primaryIndication: Indication;
	clinicalQuestion: string;
	relevantHistory: string;
}

export interface Contrast {
	contrastRequired: ContrastRequirement;
	egfr: number | null;
	contrastAllergy: boolean;
	diabetes: boolean;
	metformin: boolean;
}

export interface Bleeding {
	takingAnticoagulant: boolean;
	anticoagulantAgent: string;
	takingAntiplatelet: boolean;
	bleedingDisorder: boolean;
}

export interface Pregnancy {
	pregnancyStatus: PregnancyStatus;
	irMeRJustification: string;
}

export interface Triage {
	urgency: Urgency;
	requestedByDate: string;
	setting: string;
	notes: string;
}

// ──────────────────────────────────────────────
// Full request data model
// ──────────────────────────────────────────────

export interface RequestData {
	clinician: Clinician;
	patient: Patient;
	request: RequestExamination;
	contrast: Contrast;
	bleeding: Bleeding;
	pregnancy: Pregnancy;
	triage: Triage;
}

// ──────────────────────────────────────────────
// Grading types (four-axis grade + flags)
// ──────────────────────────────────────────────

export type AppropriatenessBand =
	| 'usually-appropriate'
	| 'may-be-appropriate'
	| 'usually-not-appropriate';
export type SafetyBand = 'ok' | 'caution' | 'contraindicated';
export type TriageTier = 'routine' | 'urgent' | 'emergency';
export type Recommendation = 'accept' | 'query-referrer' | 'redirect' | 'reject';

/** A rule that fired during grading. Rule IDs are stable across all front-ends. */
export interface FiredRule {
	ruleId: string;
	axis: 'appropriateness' | 'safety' | 'completeness' | 'triage';
	category: string;
	description: string;
}

/** A safety-critical flag raised independently of the four axes. */
export interface Flag {
	flagId: string;
	category: string;
	priority: 'high' | 'medium' | 'low';
	description: string;
	suggestedAction: string;
}

export interface GradingResult {
	appropriatenessScore: number;
	appropriatenessBand: AppropriatenessBand;
	safetyBand: SafetyBand;
	completenessPercent: number;
	triageTier: TriageTier;
	targetTimeframe: string;
	recommendation: Recommendation;
	recommendationLabel: string;
	firedRules: FiredRule[];
	flags: Flag[];
	timestamp: string;
}

// ──────────────────────────────────────────────
// Step configuration
// ──────────────────────────────────────────────

export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof RequestData;
}
