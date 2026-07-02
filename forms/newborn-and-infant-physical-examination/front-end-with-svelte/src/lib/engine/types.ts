// ──────────────────────────────────────────────
// Core examination data types (Newborn and Infant Physical Examination — NIPE)
//
// NIPE is a classification / completeness instrument, not a numeric-score form:
// the engine classifies each of the four key screening components (eyes, heart,
// hips, testes) as satisfactory / refer / not-examined, rolls the applicable
// components up into an overall screening outcome (satisfactory / refer /
// incomplete), and emits referral pathways — it does not sum a total. camelCase
// property names mirror the snake_case SQL columns in
// `sql/04_create_table_newborn_and_infant_physical_examination.sql`.
// ──────────────────────────────────────────────

export type PractitionerRole =
	| 'midwife'
	| 'neonatal-nurse'
	| 'paediatrician'
	| 'gp'
	| 'nurse-practitioner'
	| 'other'
	| '';
export type ExaminationContext = 'newborn-72h' | 'infant-6-8-week' | '';
export type CareSetting =
	| 'maternity-ward'
	| 'neonatal-unit'
	| 'community'
	| 'gp-surgery'
	| 'home'
	| 'other'
	| '';
export type Sex = 'male' | 'female' | 'indeterminate' | '';
export type YesNo = 'yes' | 'no' | '';
export type NormalAbnormal = 'normal' | 'abnormal' | 'not-examined' | '';
export type RedReflex = 'present' | 'absent' | 'not-examined' | '';
export type Murmur = 'none' | 'present' | 'not-examined' | '';
export type FemoralPulse = 'present' | 'weak' | 'absent' | 'not-examined' | '';
export type Cyanosis = 'absent' | 'present' | 'not-examined' | '';
export type BarlowOrtolani = 'negative' | 'positive' | 'not-examined' | '';
export type HipAbduction = 'normal' | 'limited' | 'not-examined' | '';
export type Testis = 'descended' | 'undescended' | 'not-palpable' | 'not-examined' | '';

export type ComponentResult = 'satisfactory' | 'refer' | 'not-examined';
export type TestesResult = ComponentResult | 'not-applicable';
export type OverallOutcome = 'satisfactory' | 'refer' | 'incomplete';
export type Completeness = 'complete' | 'incomplete';
export type Priority = 'high' | 'medium' | 'low';
export type Urgency = 'same-day' | 'within-2-weeks' | 'by-6-weeks' | 'review-6-8-weeks';

/** Step 1 — examination context. */
export interface Context {
	practitionerName: string;
	practitionerRole: PractitionerRole;
	/** ISO-ish datetime-local string; '' when unset. */
	examinedAt: string;
	examinationContext: ExaminationContext;
	careSetting: CareSetting;
}

/** Step 2 — baby identification. */
export interface Identification {
	babyIdentifier: string;
	babyName: string;
	/** ISO date string; '' when unset. */
	dateOfBirth: string;
	sex: Sex;
	gestationalAgeWeeks: number | null;
	birthWeightGrams: number | null;
}

/** Step 3 — hip risk factors. */
export interface RiskFactors {
	breechPresentation: YesNo;
	familyHistoryHipProblems: YesNo;
	antenatalConcerns: string;
}

/** Step 4 — eyes key component. */
export interface Eyes {
	eyesRedReflexRight: RedReflex;
	eyesRedReflexLeft: RedReflex;
	eyesAppearance: NormalAbnormal;
}

/** Step 5 — heart key component. */
export interface Heart {
	heartMurmur: Murmur;
	femoralPulsesRight: FemoralPulse;
	femoralPulsesLeft: FemoralPulse;
	centralCyanosis: Cyanosis;
	oxygenSaturationPreductal: number | null;
	oxygenSaturationPostductal: number | null;
}

/** Step 6 — hips key component. */
export interface Hips {
	barlowTest: BarlowOrtolani;
	ortolaniTest: BarlowOrtolani;
	hipAbduction: HipAbduction;
}

/** Step 7 — testes key component (boys). */
export interface Testes {
	testisRight: Testis;
	testisLeft: Testis;
}

/** Step 8 — head-to-toe systematic examination and measurements. */
export interface Systematic {
	generalAppearance: NormalAbnormal;
	skin: NormalAbnormal;
	headAndFontanelles: NormalAbnormal;
	faceAndPalate: NormalAbnormal;
	neckAndClavicles: NormalAbnormal;
	chestAndLungs: NormalAbnormal;
	abdomen: NormalAbnormal;
	genitalia: NormalAbnormal;
	anusAndSpine: NormalAbnormal;
	limbsAndDigits: NormalAbnormal;
	feet: NormalAbnormal;
	toneAndMovement: NormalAbnormal;
	weightGrams: number | null;
	headCircumferenceCm: number | null;
	lengthCm: number | null;
}

/** Step 9 — summary: optional recorded results and free-text note. */
export interface Summary {
	eyesResultRecorded: ComponentResult | '';
	heartResultRecorded: ComponentResult | '';
	hipsResultRecorded: ComponentResult | '';
	testesResultRecorded: TestesResult | '';
	clinicalNote: string;
}

/** The full NIPE examination data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	riskFactors: RiskFactors;
	eyes: Eyes;
	heart: Heart;
	hips: Hips;
	testes: Testes;
	systematic: Systematic;
	summary: Summary;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single evaluated / derived rule row (mirrors the grade_rule SQL table). */
export interface FiredRule {
	/** Stable rule id, e.g. R-HIPS-REFER-01. */
	id: string;
	/** eyes | heart | hips | testes | overall */
	component: string;
	category: string;
	description: string;
}

/** An onward-referral pathway, one per component classed Refer. */
export interface Referral {
	/** eyes | heart | hips | testes */
	component: string;
	pathway: string;
	urgency: Urgency;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A NIPE component refer-trigger rule. */
export interface NipeRule {
	id: string;
	/** eyes | heart | hips | testes */
	component: 'eyes' | 'heart' | 'hips' | 'testes';
	category: string;
	description: string;
	/** true when the component's refer trigger fires. */
	evaluate: (data: AssessmentData) => boolean;
}

/** The full classification result for one examination. */
export interface GradingResult {
	eyesResult: ComponentResult;
	heartResult: ComponentResult;
	hipsResult: ComponentResult;
	testesResult: TestesResult;
	overallOutcome: OverallOutcome;
	completeness: Completeness;
	completenessPercent: number;
	referrals: Referral[];
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
	section: keyof AssessmentData;
}
