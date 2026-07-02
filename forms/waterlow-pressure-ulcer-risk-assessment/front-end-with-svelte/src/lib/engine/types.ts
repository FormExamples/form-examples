// ──────────────────────────────────────────────
// Core assessment data types (Waterlow pressure-ulcer risk assessment)
//
// camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_waterlow_pressure_ulcer_risk_assessment.sql`.
// ──────────────────────────────────────────────

export type NurseRole =
	| 'registered-nurse'
	| 'healthcare-assistant'
	| 'tissue-viability'
	| 'other'
	| '';
export type CareSetting = 'acute-ward' | 'community' | 'care-home' | 'hospice' | 'other' | '';
export type AssessmentReason = 'admission' | 'routine' | 'change-in-condition' | '';
export type AgeBand = '14-49' | '50-64' | '65-74' | '75-80' | '81-plus' | '';
export type Sex = 'female' | 'male' | '';
export type BuildWeightForHeight = 'average' | 'above-average' | 'obese' | 'below-average' | '';
export type SkinType =
	| 'healthy'
	| 'tissue-paper'
	| 'dry'
	| 'oedematous'
	| 'clammy-pyrexial'
	| 'discoloured'
	| 'broken'
	| '';
export type Continence =
	| 'complete-catheterised'
	| 'incontinent-urine'
	| 'incontinent-faeces'
	| 'doubly-incontinent'
	| '';
export type Mobility =
	| 'fully-mobile'
	| 'restless'
	| 'apathetic'
	| 'restricted'
	| 'bedbound'
	| 'chairbound'
	| '';
export type TissueMalnutrition =
	| 'none'
	| 'smoking'
	| 'anaemia'
	| 'peripheral-vascular-disease'
	| 'single-organ-failure'
	| 'multiple-organ-failure'
	| 'terminal-cachexia'
	| '';
export type NeurologicalDeficit = 'none' | 'mild' | 'moderate' | 'severe' | '';
export type MajorSurgeryTrauma =
	| 'none'
	| 'orthopaedic-spinal'
	| 'on-table-over-2h'
	| 'on-table-over-6h'
	| '';
export type Medication = 'none' | 'high-dose-steroids-cytotoxics-anti-inflammatory' | '';
export type ExistingPressureDamage = 'no' | 'yes' | '';
export type RiskBand = 'low' | 'at-risk' | 'high' | 'very-high';
export type Priority = 'high' | 'medium' | 'low';

/** Step 1 — assessment context. */
export interface Context {
	nurseName: string;
	nurseRole: NurseRole;
	/** ISO-ish datetime-local string; '' when unset. */
	assessedAt: string;
	careSetting: CareSetting;
	assessmentReason: AssessmentReason;
}

/** Step 2 — patient identification (age band and sex are scored categories). */
export interface Identification {
	patientIdentifier: string;
	ageBand: AgeBand;
	sex: Sex;
}

/** Step 3 — weighted core category inputs. */
export interface Core {
	buildWeightForHeight: BuildWeightForHeight;
	skinType: SkinType;
	continence: Continence;
	mobility: Mobility;
}

/** Step 4 — special-risk group inputs plus the existing-damage flag. */
export interface Special {
	tissueMalnutrition: TissueMalnutrition;
	neurologicalDeficit: NeurologicalDeficit;
	majorSurgeryTrauma: MajorSurgeryTrauma;
	medication: Medication;
	existingPressureDamage: ExistingPressureDamage;
}

/** Step 5 — clinician free-text note. */
export interface Note {
	clinicalNote: string;
}

/** The full Waterlow assessment data model. */
export interface AssessmentData {
	context: Context;
	identification: Identification;
	core: Core;
	special: Special;
	note: Note;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single category that contributed points, for the summary breakdown. */
export interface ContributingCategory {
	/** camelCase category key. */
	key: string;
	/** Human-readable category label. */
	label: string;
	/** The selected option's display label. */
	optionLabel: string;
	/** Points contributed (> 0). */
	points: number;
}

/** A clinician-facing safety flag (mirrors the grade_flag SQL table). */
export interface FlaggedIssue {
	id: string;
	category: string;
	priority: Priority;
	description: string;
	suggestedAction: string;
}

/** State section keys that hold scored category inputs. */
export type CategorySection = 'core' | 'identification' | 'special';

/** A Waterlow scoring category definition (one weighted enum input). */
export interface CategoryDef {
	/** camelCase category key + points field stem. */
	key: string;
	/** State section holding the input field. */
	section: CategorySection;
	/** camelCase field name within the section. */
	field: string;
	/** Point-map key in POINT_MAPS. */
	map: string;
	/** Name of the derived points field on the grade. */
	pointsField: keyof PointsFields;
	/** Human-readable category label. */
	label: string;
	/** True for the six core categories; false for the four special-risk groups. */
	core: boolean;
	/** True for the four special-risk groups. */
	special?: boolean;
}

/** The ten per-category derived point fields. */
export interface PointsFields {
	buildPoints: number;
	skinPoints: number;
	sexPoints: number;
	agePoints: number;
	continencePoints: number;
	mobilityPoints: number;
	tissueMalnutritionPoints: number;
	neurologicalDeficitPoints: number;
	majorSurgeryTraumaPoints: number;
	medicationPoints: number;
}

/** The full grading result for one assessment. */
export interface GradingResult extends PointsFields {
	waterlowScore: number;
	riskBand: RiskBand;
	preventionAction: string;
	contributingCategories: ContributingCategory[];
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
