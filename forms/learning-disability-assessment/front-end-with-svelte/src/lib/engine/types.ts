// ──────────────────────────────────────────────
// Core assessment data types
// ──────────────────────────────────────────────

export type YesNo = 'yes' | 'no' | '';
export type YesNoUnknown = 'yes' | 'no' | 'unknown' | '';
export type Sex = 'male' | 'female' | 'other' | 'prefer-not-to-say' | '';
export type SupportLevel =
	| 'independent'
	| 'some-support'
	| 'significant-support'
	| 'full-support'
	| '';
export type SeverityCategory = 'mild' | 'moderate' | 'severe' | 'profound' | '';
export type VerbalAbility = 'verbal' | 'limited-verbal' | 'non-verbal' | '';

export interface Demographics {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	sex: Sex;
	nhsNumber: string;
	gpPractice: string;
	preferredName: string;
	ethnicity: string;
}

export interface CarerSupport {
	primaryCarerName: string;
	primaryCarerRelationship: string;
	primaryCarerPhone: string;
	livesWithCarer: YesNo;
	livingArrangement: string;
	hasSupportPlan: YesNo;
	hasSocialWorker: YesNo;
	socialWorkerName: string;
	otherSupports: string;
}

export interface CommunicationNeeds {
	usesEasyRead: YesNo;
	usesMakaton: YesNo;
	usesAac: YesNo;
	aacDetails: string;
	usesPictures: YesNo;
	needsInterpreter: YesNo;
	interpreterLanguage: string;
	verbalAbility: VerbalAbility;
	preferredCommunicationMethod: string;
	communicationNotes: string;
}

export interface MedicalReview {
	hasEpilepsy: YesNo;
	lastSeizureDate: string;
	seizuresPerMonth: number | null;
	hasMentalHealthDiagnosis: YesNo;
	mentalHealthDetails: string;
	takesPsychotropic: YesNo;
	stompReviewDone: YesNo;
	currentMedications: string;
	hasDysphagia: YesNo;
	hasConstipation: YesNo;
	hasIncontinence: YesNo;
	hasSleepProblems: YesNo;
	otherMedicalIssues: string;
}

export interface PhysicalExamination {
	weight: number | null;
	height: number | null;
	bmi: number | null;
	bloodPressureSystolic: number | null;
	bloodPressureDiastolic: number | null;
	pulse: number | null;
	visionChecked: YesNoUnknown;
	visionDate: string;
	hearingChecked: YesNoUnknown;
	hearingDate: string;
	dentalChecked: YesNoUnknown;
	dentalDate: string;
	vaccinationsUpToDate: YesNoUnknown;
	cervicalScreening: YesNoUnknown;
	breastScreening: YesNoUnknown;
	bowelScreening: YesNoUnknown;
}

export interface AdaptiveFunctioning {
	conceptualLanguage: SupportLevel;
	conceptualReadingWriting: SupportLevel;
	conceptualMoneyTime: SupportLevel;
	socialFriendships: SupportLevel;
	socialEmpathy: SupportLevel;
	socialCommunication: SupportLevel;
	practicalSelfCare: SupportLevel;
	practicalHomeLiving: SupportLevel;
	practicalCommunity: SupportLevel;
	practicalWorkSchool: SupportLevel;
}

export interface BehaviouralConcerns {
	selfInjurious: YesNo;
	aggression: YesNo;
	propertyDamage: YesNo;
	absconding: YesNo;
	sexualisedBehaviour: YesNo;
	knownTriggers: string;
	calmingStrategies: string;
	hasBehaviourSupportPlan: YesNo;
	usesPrn: YesNo;
	prnDetails: string;
}

export interface MentalCapacityConsent {
	canConsentToHealthCheck: YesNoUnknown;
	canConsentToMedication: YesNoUnknown;
	canConsentToFinances: YesNoUnknown;
	hasLpa: YesNo;
	lpaDetails: string;
	hasDols: YesNo;
	bestInterestsRequired: YesNo;
	bestInterestsNotes: string;
}

export interface ReasonableAdjustments {
	needsLongerAppointments: YesNo;
	needsQuietRoom: YesNo;
	needsFamiliarStaff: YesNo;
	needsEasyReadLetters: YesNo;
	needsHomeVisits: YesNo;
	needsDoubleAppointment: YesNo;
	flagOnRecord: YesNo;
	otherAdjustments: string;
}

export interface HealthActionItem {
	action: string;
	owner: string;
	dueDate: string;
}

export interface HealthActionPlan {
	actions: HealthActionItem[];
	nextReviewDate: string;
	sharedWith: string;
	planNotes: string;
}

// ──────────────────────────────────────────────
// Full assessment data model
// ──────────────────────────────────────────────

export interface AssessmentData {
	demographics: Demographics;
	carerSupport: CarerSupport;
	communicationNeeds: CommunicationNeeds;
	medicalReview: MedicalReview;
	physicalExamination: PhysicalExamination;
	adaptiveFunctioning: AdaptiveFunctioning;
	behaviouralConcerns: BehaviouralConcerns;
	mentalCapacityConsent: MentalCapacityConsent;
	reasonableAdjustments: ReasonableAdjustments;
	healthActionPlan: HealthActionPlan;
}

// ──────────────────────────────────────────────
// Learning-disability grading types
// ──────────────────────────────────────────────

export interface LDRule {
	id: string;
	category: string;
	description: string;
	/**
	 * Probe an adaptive-functioning item. Returns 0 if unanswered, or
	 * (levelScore + 1) so an answered "independent" (score 0) still counts as
	 * answered; the grader subtracts 1 to recover the true 0-3 weight.
	 */
	evaluate: (data: AssessmentData) => number;
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
	adaptiveScore: number;
	severityCategory: SeverityCategory;
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
