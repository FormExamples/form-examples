import type { AssessmentData, DassItem, DassSeverity } from '$lib/engine/types';
import { calculateDass21 } from '$lib/engine/dass21-grader';
import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	depressionSeverity: DassSeverity;
	anxietySeverity: DassSeverity;
	stressSeverity: DassSeverity;
	highestSeverity: DassSeverity;
	suicidalIdeationFlag: boolean;
	flagCount: number;
}

/** Severity rank used to derive the highest subscale band for a record. */
const SEVERITY_RANK: Record<DassSeverity, number> = {
	normal: 0,
	mild: 1,
	moderate: 2,
	severe: 3,
	'extremely-severe': 4
};

/** Populate the seven Depression subscale items from an ordered array. */
function depression(v: DassItem[]): AssessmentData['dassDepression'] {
	return {
		item3CouldNotExperiencePositive: v[0],
		item5DifficultInitiating: v[1],
		item10NothingToLookForwardTo: v[2],
		item13DownheartedBlue: v[3],
		item16UnableToBecomeEnthusiastic: v[4],
		item17NotWorthMuch: v[5],
		item21LifeMeaningless: v[6]
	};
}

/** Populate the seven Anxiety subscale items from an ordered array. */
function anxiety(v: DassItem[]): AssessmentData['dassAnxiety'] {
	return {
		item2DrynessOfMouth: v[0],
		item4BreathingDifficulty: v[1],
		item7Trembling: v[2],
		item9PanicWorry: v[3],
		item15ClosedToPanic: v[4],
		item19HeartActionAware: v[5],
		item20ScaredWithoutReason: v[6]
	};
}

/** Populate the seven Stress subscale items from an ordered array. */
function stress(v: DassItem[]): AssessmentData['dassStress'] {
	return {
		item1HardToWindDown: v[0],
		item6OverReact: v[1],
		item8NervousEnergy: v[2],
		item11AgitatedEasily: v[3],
		item12DifficultToRelax: v[4],
		item14Intolerant: v[5],
		item18TouchyEasily: v[6]
	};
}

/** A normal-range self-report: no elevated symptoms, no risk flags. */
function normalRange(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1991-03-22', sex: 'female', occupation: 'Teacher' };
	d.reasonForAssessment = { reason: 'self-referral', reasonDetails: '', primaryConcern: 'Occasional low mood', symptomDurationWeeks: 2 };
	d.dassDepression = depression([0, 0, 1, 0, 0, 0, 0]);
	d.dassAnxiety = anxiety([0, 0, 0, 1, 0, 0, 0]);
	d.dassStress = stress([1, 0, 1, 0, 0, 0, 0]);
	d.functionalImpact = { workImpact: 'none', relationshipImpact: 'mild', dailyActivitiesImpact: 'none', sleepImpact: 'mild', notes: '' };
	d.riskScreen = { suicidalIdeation: 'no', suicidalIdeationDetails: '', selfHarm: 'no', harmToOthers: 'no', psychiatricEmergencyHistory: 'no', hasSafetyPlan: 'yes' };
	d.supportAndHistory = { previousMentalHealthCare: 'no', previousMentalHealthDetails: '', currentlyInTreatment: 'no', currentTreatmentDetails: '', currentMedications: '', familyMentalHealthHistory: 'no', familyMentalHealthDetails: '', socialSupport: 'strong', substanceUseConcern: 'no' };
	return d;
}

/** A mild-to-moderate self-report: elevated symptoms, no risk flags. */
function mildModerate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1985-09-30', sex: 'female', occupation: 'Nurse' };
	d.reasonForAssessment = { reason: 'gp-referral', reasonDetails: 'GP concerned about anxiety', primaryConcern: 'Persistent worry and poor sleep', symptomDurationWeeks: 8 };
	// Depression raw 6 → scaled 12 (mild)
	d.dassDepression = depression([1, 1, 1, 1, 1, 1, 0]);
	// Anxiety raw 6 → scaled 12 (moderate)
	d.dassAnxiety = anxiety([1, 1, 1, 1, 1, 1, 0]);
	// Stress raw 8 → scaled 16 (mild)
	d.dassStress = stress([2, 1, 1, 1, 1, 1, 1]);
	d.functionalImpact = { workImpact: 'moderate', relationshipImpact: 'mild', dailyActivitiesImpact: 'mild', sleepImpact: 'moderate', notes: 'Sleep disturbance most nights.' };
	d.riskScreen = { suicidalIdeation: 'no', suicidalIdeationDetails: '', selfHarm: 'no', harmToOthers: 'no', psychiatricEmergencyHistory: 'no', hasSafetyPlan: 'yes' };
	d.supportAndHistory = { previousMentalHealthCare: 'yes', previousMentalHealthDetails: 'CBT in 2022', currentlyInTreatment: 'no', currentTreatmentDetails: '', currentMedications: '', familyMentalHealthHistory: 'yes', familyMentalHealthDetails: 'Mother — anxiety', socialSupport: 'adequate', substanceUseConcern: 'no' };
	return d;
}

/** A severe self-report with positive suicidal-ideation risk screen. */
function severeWithRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1972-01-22', sex: 'female', occupation: 'Accountant' };
	d.reasonForAssessment = { reason: 'gp-referral', reasonDetails: '', primaryConcern: 'Low mood, hopelessness', symptomDurationWeeks: 16 };
	// Depression raw 12 → scaled 24 (severe)
	d.dassDepression = depression([2, 2, 2, 2, 2, 1, 1]);
	// Anxiety raw 9 → scaled 18 (severe)
	d.dassAnxiety = anxiety([2, 1, 1, 2, 1, 1, 1]);
	// Stress raw 11 → scaled 22 (moderate)
	d.dassStress = stress([2, 2, 2, 1, 2, 1, 1]);
	d.functionalImpact = { workImpact: 'severe', relationshipImpact: 'severe', dailyActivitiesImpact: 'moderate', sleepImpact: 'severe', notes: 'Struggling to work; withdrawn.' };
	d.riskScreen = { suicidalIdeation: 'yes', suicidalIdeationDetails: 'Passive thoughts, no plan', selfHarm: 'yes', harmToOthers: 'no', psychiatricEmergencyHistory: 'no', hasSafetyPlan: 'no' };
	d.supportAndHistory = { previousMentalHealthCare: 'yes', previousMentalHealthDetails: 'Counselling 2019', currentlyInTreatment: 'yes', currentTreatmentDetails: 'GP-managed', currentMedications: 'Sertraline 50 mg', familyMentalHealthHistory: 'yes', familyMentalHealthDetails: 'Father — depression', socialSupport: 'limited', substanceUseConcern: 'no' };
	return d;
}

/** An extremely-severe self-report with multiple urgent risk flags. */
function extremelySevere(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1968-11-03', sex: 'male', occupation: 'Driver' };
	d.reasonForAssessment = { reason: 'follow-up', reasonDetails: '', primaryConcern: 'Crisis — severe distress', symptomDurationWeeks: 24 };
	// All subscales raw 21 → scaled 42 (extremely severe)
	d.dassDepression = depression([3, 3, 3, 3, 3, 3, 3]);
	d.dassAnxiety = anxiety([3, 3, 3, 3, 3, 3, 3]);
	d.dassStress = stress([3, 3, 3, 3, 3, 3, 3]);
	d.functionalImpact = { workImpact: 'severe', relationshipImpact: 'severe', dailyActivitiesImpact: 'severe', sleepImpact: 'severe', notes: 'Unable to function in most domains.' };
	d.riskScreen = { suicidalIdeation: 'yes', suicidalIdeationDetails: 'Active thoughts with intent', selfHarm: 'yes', harmToOthers: 'yes', psychiatricEmergencyHistory: 'yes', hasSafetyPlan: 'no' };
	d.supportAndHistory = { previousMentalHealthCare: 'yes', previousMentalHealthDetails: 'Inpatient admission 2020', currentlyInTreatment: 'yes', currentTreatmentDetails: 'Community mental-health team', currentMedications: 'Venlafaxine 150 mg', familyMentalHealthHistory: 'yes', familyMentalHealthDetails: 'Sibling — bipolar', socialSupport: 'isolated', substanceUseConcern: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PA-2026-0001', patientName: 'Smith, Jane', assessedDate: '2026-06-10', data: normalRange() },
	{ id: 'PA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mildModerate() },
	{ id: 'PA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: severeWithRisk() },
	{ id: 'PA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: extremelySevere() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { depression: dep, anxiety: anx, stress: str, firedRules } = calculateDass21(s.data);
	const flags = detectAdditionalFlags(s.data, dep, anx, str);
	void firedRules;
	const highestSeverity = [dep.severity, anx.severity, str.severity].reduce(
		(a, b) => (SEVERITY_RANK[b] > SEVERITY_RANK[a] ? b : a),
		'normal' as DassSeverity
	);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		depressionSeverity: dep.severity,
		anxietySeverity: anx.severity,
		stressSeverity: str.severity,
		highestSeverity,
		suicidalIdeationFlag: s.data.riskScreen.suicidalIdeation === 'yes',
		flagCount: flags.length
	};
});
