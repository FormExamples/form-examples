// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type Sex = 'male' | 'female' | 'other' | '';
export type Laterality = 'left' | 'right' | 'both' | '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	occupation: string;
}

export interface PresentingComplaint {
	earSymptoms: YesNo;
	noseSymptoms: YesNo;
	throatSymptoms: YesNo;
	neckSymptoms: YesNo;
	chiefComplaint: string;
}

export interface HistoryOfPresentIllness {
	onsetDate: string;
	onsetType: 'sudden' | 'gradual' | '';
	progression: 'worsening' | 'stable' | 'improving' | 'fluctuating' | '';
	laterality: Laterality;
	previousEpisodes: YesNo;
	aggravatingFactors: string;
	relievingFactors: string;
	associatedSymptoms: string;
}

export interface PastENTHistory {
	priorEntSurgery: YesNo;
	priorEntSurgeryDetails: string;
	chronicSinusitis: YesNo;
	allergicRhinitis: YesNo;
	hearingLoss: YesNo;
	tinnitus: YesNo;
	vertigo: YesNo;
	hearingAids: YesNo;
	headNeckCancer: YesNo;
	headNeckRadiotherapy: YesNo;
	smoking: YesNo;
	alcohol: YesNo;
}

/**
 * SNOT-22 sino-nasal symptom scores. Each item rated 0 (no problem) to 5
 * (problem as bad as it can be); `null` when unanswered. Total 0-110.
 */
export interface Snot22Questionnaire {
	needToBlowNose: number | null;
	sneezing: number | null;
	runnyNose: number | null;
	nasalBlockage: number | null;
	lossOfSmellTaste: number | null;
	coughing: number | null;
	postNasalDischarge: number | null;
	thickNasalDischarge: number | null;
	earFullness: number | null;
	dizziness: number | null;
	earPain: number | null;
	facialPainPressure: number | null;
	difficultyFallingAsleep: number | null;
	wakingUpAtNight: number | null;
	lackOfGoodNightsSleep: number | null;
	wakingUpTired: number | null;
	fatigue: number | null;
	reducedProductivity: number | null;
	reducedConcentration: number | null;
	frustratedRestlessIrritable: number | null;
	sad: number | null;
	embarrassed: number | null;
}

export type Snot22Key = keyof Snot22Questionnaire;

export interface ExternalExamination {
	facialAsymmetry: YesNo;
	facialSwelling: YesNo;
	skinLesions: YesNo;
	externalEarFindings: string;
	externalNoseFindings: string;
	examinationNotes: string;
}

export interface OtoscopySide {
	tympanicMembrane:
		| 'normal'
		| 'erythematous'
		| 'bulging'
		| 'retracted'
		| 'perforated'
		| 'effusion'
		| '';
	canal: 'normal' | 'wax' | 'discharge' | 'foreign-body' | 'inflamed' | '';
	mobility: YesNo;
}

export interface Otoscopy {
	right: OtoscopySide;
	left: OtoscopySide;
	otoscopyNotes: string;
}

export interface AnteriorRhinoscopySide {
	septum: 'midline' | 'deviated-left' | 'deviated-right' | '';
	mucosa: 'normal' | 'pale' | 'congested' | 'pale-boggy' | '';
	polyps: 'none' | 'small' | 'medium' | 'large' | '';
	discharge: 'none' | 'clear' | 'mucoid' | 'purulent' | 'blood' | '';
	turbinateHypertrophy: 'normal' | 'mild' | 'moderate' | 'severe' | '';
}

export interface AnteriorRhinoscopy {
	right: AnteriorRhinoscopySide;
	left: AnteriorRhinoscopySide;
	rhinoscopyNotes: string;
}

export interface OropharyngealNeckExamination {
	oralMucosa: 'normal' | 'erythematous' | 'exudate' | 'ulcerated' | '';
	tonsils: 'normal' | 'enlarged' | 'absent' | 'asymmetric' | '';
	pharynx: 'normal' | 'erythematous' | 'cobblestone' | 'postNasalDrip' | '';
	palateMovement: 'normal' | 'asymmetric' | 'limited' | '';
	cervicalLymphadenopathy: YesNo;
	cervicalLymphadenopathyDetails: string;
	thyroidEnlarged: YesNo;
	neckMass: YesNo;
	neckMassDetails: string;
	examinationNotes: string;
}

export interface ClinicalImpressionPlan {
	workingDiagnosis: string;
	differentialDiagnosis: string;
	investigationsRequired: YesNo;
	investigationsDetails: string;
	medicationPrescribed: YesNo;
	medicationDetails: string;
	referralRequired: YesNo;
	referralDetails: string;
	surgeryConsidered: YesNo;
	surgeryDetails: string;
	followUpPlan: string;
	patientEducation: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	presentingComplaint: PresentingComplaint;
	historyOfPresentIllness: HistoryOfPresentIllness;
	pastEntHistory: PastENTHistory;
	snot22: Snot22Questionnaire;
	externalExamination: ExternalExamination;
	otoscopy: Otoscopy;
	anteriorRhinoscopy: AnteriorRhinoscopy;
	oropharyngealNeckExamination: OropharyngealNeckExamination;
	clinicalImpressionPlan: ClinicalImpressionPlan;
}

// ──────────────────────────────────────────────
// SNOT-22 grading types
// ──────────────────────────────────────────────

export type SeverityLevel = 'mild' | 'moderate' | 'severe';

export interface Snot22Rule {
	id: string;
	key: Snot22Key;
	category: string;
	description: string;
	evaluate: (data: AssessmentData) => { score: number; answered: boolean };
}

export interface FiredRule {
	id: string;
	category: string;
	description: string;
	score: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'urgent' | 'high' | 'medium' | 'low';
}

export interface GradingResult {
	totalScore: number;
	severityLevel: SeverityLevel;
	answeredCount: number;
	firedRules: FiredRule[];
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

// ──────────────────────────────────────────────
// SNOT-22 item catalogue + option scale
// ──────────────────────────────────────────────

/** Ordered SNOT-22 item keys + labels (used by grader, UI, progress). */
export const SNOT22_ITEMS: { key: Snot22Key; label: string }[] = [
	{ key: 'needToBlowNose', label: 'Need to blow nose' },
	{ key: 'sneezing', label: 'Sneezing' },
	{ key: 'runnyNose', label: 'Runny nose' },
	{ key: 'nasalBlockage', label: 'Nasal blockage' },
	{ key: 'lossOfSmellTaste', label: 'Loss of smell or taste' },
	{ key: 'coughing', label: 'Cough' },
	{ key: 'postNasalDischarge', label: 'Post-nasal discharge' },
	{ key: 'thickNasalDischarge', label: 'Thick nasal discharge' },
	{ key: 'earFullness', label: 'Ear fullness' },
	{ key: 'dizziness', label: 'Dizziness' },
	{ key: 'earPain', label: 'Ear pain' },
	{ key: 'facialPainPressure', label: 'Facial pain or pressure' },
	{ key: 'difficultyFallingAsleep', label: 'Difficulty falling asleep' },
	{ key: 'wakingUpAtNight', label: 'Waking up at night' },
	{ key: 'lackOfGoodNightsSleep', label: 'Lack of a good night’s sleep' },
	{ key: 'wakingUpTired', label: 'Waking up tired' },
	{ key: 'fatigue', label: 'Fatigue' },
	{ key: 'reducedProductivity', label: 'Reduced productivity' },
	{ key: 'reducedConcentration', label: 'Reduced concentration' },
	{ key: 'frustratedRestlessIrritable', label: 'Frustrated, restless, or irritable' },
	{ key: 'sad', label: 'Sad' },
	{ key: 'embarrassed', label: 'Embarrassed' }
];

/** The 0-5 SNOT-22 problem-severity scale. */
export const SNOT22_OPTIONS: { value: number; label: string }[] = [
	{ value: 0, label: 'No problem' },
	{ value: 1, label: 'Very mild' },
	{ value: 2, label: 'Mild' },
	{ value: 3, label: 'Moderate' },
	{ value: 4, label: 'Severe' },
	{ value: 5, label: 'As bad as it can be' }
];
