// ──────────────────────────────────────────────
// Core assessment data types (Caprini VTE risk assessment)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_caprini_venous_thromboembolism_risk_assessment.sql`.
// ──────────────────────────────────────────────

export type ClinicianRole = 'doctor' | 'surgeon' | 'nurse' | 'pharmacist' | 'other' | '';
export type CareSetting =
	| 'surgical-ward'
	| 'medical-ward'
	| 'pre-operative-clinic'
	| 'other'
	| '';
export type AdmissionType = 'surgical' | 'medical' | '';
export type AgeBand = 'under-41' | '41-60' | '61-74' | '75-plus' | '';
export type Sex = 'female' | 'male' | 'intersex' | 'unknown' | '';
export type YesNo = 'yes' | 'no' | '';
export type RiskBand = 'very-low' | 'low' | 'moderate' | 'high';
export type Prophylaxis =
	| 'early-ambulation'
	| 'mechanical'
	| 'pharmacological-or-mechanical'
	| 'pharmacological-plus-mechanical';
export type Priority = 'high' | 'medium' | 'low';
export type WeightGroup = 'age' | '1-point' | '2-point' | '3-point' | '5-point';

/** Step 1 — assessment context. */
export interface Context {
	clinicianName: string;
	clinicianRole: ClinicianRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	admissionType: AdmissionType;
}

/** Step 2 — patient identification and age band. */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — 1-point risk factors (each yes/no; the weight applies on 'yes'). */
export interface OnePoint {
	minorSurgery: YesNo;
	recentMajorSurgery: YesNo;
	varicoseVeins: YesNo;
	inflammatoryBowelDisease: YesNo;
	swollenLegs: YesNo;
	obesity: YesNo;
	acuteMyocardialInfarction: YesNo;
	congestiveHeartFailure: YesNo;
	sepsis: YesNo;
	seriousLungDisease: YesNo;
	abnormalPulmonaryFunction: YesNo;
	medicalPatientBedRest: YesNo;
	oralContraceptiveOrHrt: YesNo;
	pregnancyOrPostpartum: YesNo;
	adversePregnancyHistory: YesNo;
}

/** Step 4 — 2-point risk factors. */
export interface TwoPoint {
	arthroscopicSurgery: YesNo;
	majorOpenSurgery: YesNo;
	laparoscopicSurgery: YesNo;
	malignancy: YesNo;
	confinedToBed: YesNo;
	immobilisingCast: YesNo;
	centralVenousAccess: YesNo;
}

/** Step 5 — 3-point risk factors. */
export interface ThreePoint {
	historyOfVte: YesNo;
	familyHistoryOfThrombosis: YesNo;
	factorVLeiden: YesNo;
	prothrombin20210a: YesNo;
	lupusAnticoagulant: YesNo;
	anticardiolipinAntibodies: YesNo;
	elevatedHomocysteine: YesNo;
	heparinInducedThrombocytopenia: YesNo;
	otherThrombophilia: YesNo;
}

/** Step 6 — 5-point risk factors. */
export interface FivePoint {
	stroke: YesNo;
	electiveArthroplasty: YesNo;
	hipPelvisLegFracture: YesNo;
	acuteSpinalCordInjury: YesNo;
	multipleTrauma: YesNo;
}

/** Step 7 — bleeding risk. */
export interface Bleeding {
	highBleedingRisk: YesNo;
}

/** Step 8 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Caprini assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	onePoint: OnePoint;
	twoPoint: TwoPoint;
	threePoint: ThreePoint;
	fivePoint: FivePoint;
	bleeding: Bleeding;
	note: Note;
}

/** The keys of the four weighted risk-factor sections. */
export type FactorSection = 'onePoint' | 'twoPoint' | 'threePoint' | 'fivePoint';

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single fired factor / audit row (mirrors the grade_rule SQL table). */
export interface FiredFactor {
	/** Stable rule id, e.g. R-HISTORY-OF-VTE-3POINT-01. */
	id: string;
	/** snake_case factor key, or `age_band` for the age row. */
	factor: string;
	weightGroup: WeightGroup;
	/** Points contributed. */
	points: number;
	category: string;
	description: string;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** A Caprini grading rule (one weighted yes/no risk factor). */
export interface CapriniRule {
	id: string;
	/** State section holding the field. */
	section: FactorSection;
	/** camelCase field name within the section. */
	field: string;
	/** snake_case factor key (mirrors the SQL column). */
	factor: string;
	weightGroup: '1-point' | '2-point' | '3-point' | '5-point';
	/** Points contributed when the rule fires. */
	points: number;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => boolean;
}

/** Per-weight-group subtotals. */
export interface GroupSubtotals {
	'1-point': number;
	'2-point': number;
	'3-point': number;
	'5-point': number;
}

/** The full grading result for one assessment. */
export interface GradingResult {
	ageBandPoints: number;
	groupSubtotals: GroupSubtotals;
	capriniScore: number;
	riskBand: RiskBand;
	baseProphylaxis: Prophylaxis;
	recommendedProphylaxis: Prophylaxis;
	bleedingDowngraded: boolean;
	firedFactors: FiredFactor[];
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
