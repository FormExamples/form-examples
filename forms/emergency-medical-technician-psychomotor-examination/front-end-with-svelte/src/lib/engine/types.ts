// ──────────────────────────────────────────────
// Core examination data types
//
// NREMT-style EMT Psychomotor Skills Examination (Patient Assessment —
// Medical station). Each checklist item is recorded as a tri-state value;
// the grader awards points for `yes`, zero for `no`, and excludes `na` /
// unanswered items. Any critical-criterion firing `no` forces a Fail.
// ──────────────────────────────────────────────

/**
 * Tri-state checklist response.
 *  - 'yes' : skill performed correctly (awards points)
 *  - 'no'  : skill not performed / performed incorrectly (no points)
 *  - 'na'  : item not applicable to this scenario (excluded)
 *  - ''    : examiner has not yet recorded an answer (excluded)
 */
export type TriState = 'yes' | 'no' | 'na' | '';

/** Whether the candidate is sitting their first attempt or a retest. */
export type ExamAttempt = 'first-attempt' | 'retest' | '';

/** Overall pass/fail outcome (empty until graded). */
export type Outcome = 'pass' | 'fail' | '';

export interface CandidateExaminerScenario {
	candidateFirstName: string;
	candidateLastName: string;
	candidateId: string;
	attempt: ExamAttempt;
	examinerName: string;
	sessionDate: string;
	stationLocation: string;
	scenarioSummary: string;
	chiefComplaintGiven: string;
}

export interface SceneSizeUp {
	ppePrecautions: TriState; // critical
	sceneSafe: TriState; // critical
	mechanismOrNature: TriState;
	numberOfPatients: TriState;
	additionalResources: TriState;
	considersCspine: TriState;
}

export interface PrimarySurvey {
	generalImpression: TriState;
	mentalStatus: TriState;
	airway: TriState; // critical
	breathing: TriState; // critical
	oxygenTherapy: TriState; // critical
	circulation: TriState; // critical
	transportPriority: TriState; // critical
}

export interface HistorySecondaryAssessment {
	chiefComplaint: TriState;
	historyOnsetOpqrst: TriState;
	sampleSignsSymptoms: TriState;
	sampleAllergies: TriState;
	sampleMedications: TriState;
	samplePastHistory: TriState;
	sampleLastIntake: TriState;
	sampleEvents: TriState;
	focusedExam: TriState;
	baselineVitalsBp: TriState;
	baselineVitalsPulse: TriState;
	baselineVitalsRespirations: TriState;
	fieldImpression: TriState;
	interventions: TriState;
}

export interface Reassessment {
	repeatsMentalStatus: TriState;
	repeatsAirway: TriState;
	repeatsBreathing: TriState;
	repeatsCirculation: TriState;
	repeatsVitals: TriState;
	repeatsFocusedExam: TriState;
	evaluatesInterventions: TriState;
	transportInterventions: TriState;
	fifteenMinuteCall: TriState; // critical
}

export interface CriticalCriteriaReview {
	dangerousIntervention: TriState; // critical
	spinalProtection: TriState; // critical
	examinerNotes: string;
	debriefNotes: string;
}

// ──────────────────────────────────────────────
// Full examination data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	candidateExaminerScenario: CandidateExaminerScenario;
	sceneSizeUp: SceneSizeUp;
	primarySurvey: PrimarySurvey;
	historySecondaryAssessment: HistorySecondaryAssessment;
	reassessment: Reassessment;
	criticalCriteriaReview: CriticalCriteriaReview;
}

// ──────────────────────────────────────────────
// Grading types
// ──────────────────────────────────────────────

/** A single declarative checklist rule. */
export interface PsychomotorRule {
	id: string;
	step: number;
	category: string;
	label: string;
	critical: boolean;
	points: number;
	evaluate: (data: AssessmentData) => TriState;
}

/** A rule after evaluation, with the recorded status and points awarded. */
export interface FiredRule {
	id: string;
	step: number;
	category: string;
	description: string;
	critical: boolean;
	points: number;
	status: TriState;
	pointsAwarded: number;
}

export interface AdditionalFlag {
	id: string;
	category: string;
	message: string;
	priority: 'high' | 'medium' | 'low';
}

export interface GradingResult {
	outcome: Outcome;
	points: number;
	maxPoints: number;
	percent: number;
	criticalFailures: FiredRule[];
	firedRules: FiredRule[];
	additionalFlags: AdditionalFlag[];
	answeredCount: number;
	totalRules: number;
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
