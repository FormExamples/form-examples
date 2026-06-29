// ──────────────────────────────────────────────
// Core assessment data types — Palliative Assessment
//
// Symptom-focused palliative care assessment built around the Edmonton
// Symptom Assessment System-revised (ESAS-r): ten symptom intensities
// (0-10) plus eight ancillary palliative-care sections covering diagnosis,
// performance status, advance-care planning, medications, psychosocial and
// spiritual concerns, carer support, and the multidisciplinary plan.
//
// Conventions:
//   - empty string ''     for unanswered text and enum fields
//   - null                for unanswered numeric fields (including ESAS items)
//   - empty array []      for unanswered list fields
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type ReporterRole = 'patient' | 'carer' | 'clinician' | 'family' | '';
export type PrognosisHorizon = 'days' | 'weeks' | 'months' | 'years' | 'uncertain' | '';
export type SymptomControl = 'good' | 'partial' | 'poor' | '';
export type CarerStrainLevel = 'low' | 'moderate' | 'high' | 'overwhelmed' | '';

/** ESAS-r severity band derived from the total symptom score (0-100). */
export type SeverityBand = 'none' | 'mild' | 'moderate' | 'severe';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	nhsOrMrnNumber: string;
	preferredLanguage: string;
	ethnicity: string;
	reporterRole: ReporterRole;
	reporterName: string;
	assessmentDate: string;
	assessmentSetting: string;
}

export interface PrimaryDiagnosisPrognosis {
	primaryDiagnosis: string;
	secondaryDiagnoses: string;
	dateOfDiagnosis: string;
	stageOrSeverity: string;
	diseaseProgressing: YesNo;
	prognosisHorizon: PrognosisHorizon;
	surpriseQuestion: YesNo;
	prognosticIndicators: string;
	relevantTreatmentHistory: string;
}

/** Numeric ESAS-r intensity for a single symptom (0-10) or null if unanswered. */
export type ESASScore = number | null;

export interface ESASrSymptoms {
	pain: ESASScore;
	tiredness: ESASScore;
	drowsiness: ESASScore;
	nausea: ESASScore;
	lackOfAppetite: ESASScore;
	shortnessOfBreath: ESASScore;
	depression: ESASScore;
	anxiety: ESASScore;
	wellbeing: ESASScore;
	other: ESASScore;
	otherLabel: string;
	symptomNotes: string;
}

/** Symptom keys scored by the ten-item ESAS-r. */
export type ESASSymptomKey = keyof Omit<ESASrSymptoms, 'otherLabel' | 'symptomNotes'>;

export interface PerformanceStatus {
	ppsScore: number | null;
	akpsScore: number | null;
	ecogScore: number | null;
	mobilityNotes: string;
	activityLevel: string;
	bedBound: YesNo;
	requiresAssistanceWithAdls: YesNo;
	adlNotes: string;
}

export interface GoalsOfCareACP {
	patientPrioritiesAndWishes: string;
	preferredPlaceOfCare: string;
	preferredPlaceOfDeath: string;
	respectFormCompleted: YesNoUnknown;
	respectFormDate: string;
	adrtCompleted: YesNoUnknown;
	adrtDate: string;
	lpaHealthAndWelfare: YesNoUnknown;
	lpaName: string;
	dnacprDocumented: YesNoUnknown;
	dnacprDate: string;
	ceilingOfTreatmentDiscussed: YesNo;
	ceilingOfTreatmentNotes: string;
}

export interface Medication {
	name: string;
	dose: string;
	route: string;
	frequency: string;
	indication: string;
}

export interface MedicationsSymptomControl {
	regularMedications: Medication[];
	asNeededMedications: Medication[];
	syringeDriverInUse: YesNo;
	syringeDriverDetails: string;
	anticipatoryMedsPrescribed: YesNo;
	anticipatoryMedsNotes: string;
	symptomControlOverall: SymptomControl;
	barriersToControl: string;
	planNotes: string;
}

export interface PsychosocialSpiritualConcerns {
	moodConcerns: YesNo;
	moodNotes: string;
	anxietyConcerns: YesNo;
	anxietyNotes: string;
	existentialDistress: YesNo;
	existentialNotes: string;
	spiritualSupportRequested: YesNo;
	faithOrBelief: string;
	chaplaincyNotes: string;
	unresolvedConcerns: YesNo;
	unresolvedNotes: string;
}

export interface CarerFamilySupport {
	primaryCarerName: string;
	primaryCarerRelationship: string;
	carerLivesWithPatient: YesNo;
	carerStrainReported: YesNo;
	carerStrainLevel: CarerStrainLevel;
	carerStrainNotes: string;
	respiteRequired: YesNo;
	respiteNotes: string;
	childrenInHousehold: YesNo;
	childrenSupportNotes: string;
	bereavementRiskIdentified: YesNo;
	bereavementNotes: string;
}

export interface MultidisciplinaryPlan {
	specialistPalliativeCareInvolved: YesNo;
	communityNursingInvolved: YesNo;
	hospiceReferralMade: YesNo;
	socialWorkReferralMade: YesNo;
	occupationalTherapyReferralMade: YesNo;
	physiotherapyReferralMade: YesNo;
	dieticianReferralMade: YesNo;
	chaplaincyReferralMade: YesNo;
	psychologyReferralMade: YesNo;
	otherReferrals: string;
	reviewInterval: string;
	keyWorkerName: string;
	planSummary: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	primaryDiagnosisPrognosis: PrimaryDiagnosisPrognosis;
	esasrSymptoms: ESASrSymptoms;
	performanceStatus: PerformanceStatus;
	goalsOfCareACP: GoalsOfCareACP;
	medicationsSymptomControl: MedicationsSymptomControl;
	psychosocialSpiritualConcerns: PsychosocialSpiritualConcerns;
	carerFamilySupport: CarerFamilySupport;
	multidisciplinaryPlan: MultidisciplinaryPlan;
}

// ──────────────────────────────────────────────
// Palliative (ESAS-r) grading types
// ──────────────────────────────────────────────

/** A declarative ESAS-r or ancillary palliative-care rule. */
export interface PalliativeRule {
	id: string;
	category: string;
	description: string;
	kind: 'esas' | 'ancillary';
	symptomKey?: ESASSymptomKey;
	evaluate: (data: AssessmentData) => number;
}

/** A rule that fired during grading, with the score it contributed. */
export interface FiredRule {
	id: string;
	category: string;
	description: string;
	score: number;
}

/** A per-symptom severe-symptom flag (ESAS-r intensity >= 7). */
export interface IndividualFlag {
	symptomKey: ESASSymptomKey;
	symptomLabel: string;
	score: number;
}

/** A clinician-facing safety flag, independent of the ESAS-r total. */
export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

/** The complete grading result produced by the engine. */
export interface GradingResult {
	esasTotal: number;
	severityBand: SeverityBand;
	answeredCount: number;
	firedRules: FiredRule[];
	individualFlags: IndividualFlag[];
	additionalFlags: AdditionalFlag[];
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
