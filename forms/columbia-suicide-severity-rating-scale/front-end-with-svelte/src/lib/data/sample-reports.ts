import type { AssessmentData, CareSetting, RiskTier } from '$lib/engine/types';
import { calculateCssrsGrade } from '$lib/engine/cssrs-grader';
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
	patientIdentifier: string;
	patientName: string;
	careSetting: CareSetting;
	ideationLevel: number;
	riskTier: RiskTier;
	escalationFlag: boolean;
	flagCount: number;
	assessedDate: string;
}

/** Low risk — passive ideation only (level 1), no behaviour. */
function lowRiskPassive(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Osei',
		clinicianRole: 'clinician',
		assessedAt: '2026-06-24T09:30',
		careSetting: 'mental-health',
		scaleVersion: 'full',
		reasonForAssessment: 'Routine mental-health review; low mood reported.'
	};
	d.identification = { patientIdentifier: 'MH-100482', ageBand: 'adult', sex: 'female' };
	d.ideation = {
		wishToBeDead: 'yes',
		nonSpecificActiveThoughts: 'no',
		activeIdeationMethods: 'no',
		activeIdeationIntent: 'no',
		activeIdeationPlan: 'no',
		ideationTimeframe: 'past-month'
	};
	d.behaviour = {
		actualAttempt: 'no',
		interruptedAttempt: 'no',
		abortedAttempt: 'no',
		preparatoryActs: 'no',
		nonSuicidalSelfInjury: 'no',
		behaviourRecency: '',
		lifetimeAttemptCount: 0,
		mostRecentAttemptDate: ''
	};
	d.means = { accessToLethalMeans: 'no', protectiveFactors: 'Strong family support; engaged with care.' };
	d.summary = { clinicalNote: 'Passive wish to be dead only; no active ideation or behaviour.' };
	return d;
}

/** Moderate risk — active ideation with methods (level 3), no behaviour. */
function moderateRiskMethods(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'mental-health-practitioner',
		assessedAt: '2026-06-26T14:10',
		careSetting: 'emergency-department',
		scaleVersion: 'full',
		reasonForAssessment: 'Presented to ED in distress after relationship breakdown.'
	};
	d.identification = { patientIdentifier: 'ED-100517', ageBand: 'adult', sex: 'female' };
	d.ideation = {
		wishToBeDead: 'yes',
		nonSpecificActiveThoughts: 'yes',
		activeIdeationMethods: 'yes',
		activeIdeationIntent: 'no',
		activeIdeationPlan: 'no',
		ideationTimeframe: 'past-month'
	};
	d.intensity = {
		ideationFrequency: 3,
		ideationDuration: 2,
		ideationControllability: 2,
		ideationDeterrents: 3,
		ideationReasons: 2
	};
	d.behaviour = {
		actualAttempt: 'no',
		interruptedAttempt: 'no',
		abortedAttempt: 'no',
		preparatoryActs: 'no',
		nonSuicidalSelfInjury: 'yes',
		behaviourRecency: '',
		lifetimeAttemptCount: 0,
		mostRecentAttemptDate: ''
	};
	d.means = {
		accessToLethalMeans: 'unknown',
		protectiveFactors: 'Cites children as a reason for living.'
	};
	d.summary = { clinicalNote: 'Thinking of methods but denies intent or plan. NSSI noted.' };
	return d;
}

/** High risk — active plan and intent (level 5); access to means. */
function highRiskPlanIntent(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'B. Ahmed',
		clinicianRole: 'crisis-worker',
		assessedAt: '2026-06-26T21:15',
		careSetting: 'crisis-service',
		scaleVersion: 'full',
		reasonForAssessment: 'Crisis-line call; stated a plan to end their life tonight.'
	};
	d.identification = { patientIdentifier: 'CR-880204', ageBand: 'adult', sex: 'male' };
	d.ideation = {
		wishToBeDead: 'yes',
		nonSpecificActiveThoughts: 'yes',
		activeIdeationMethods: 'yes',
		activeIdeationIntent: 'yes',
		activeIdeationPlan: 'yes',
		ideationTimeframe: 'past-month'
	};
	d.intensity = {
		ideationFrequency: 5,
		ideationDuration: 4,
		ideationControllability: 4,
		ideationDeterrents: 1,
		ideationReasons: 4
	};
	d.behaviour = {
		actualAttempt: 'no',
		interruptedAttempt: 'no',
		abortedAttempt: 'yes',
		preparatoryActs: 'yes',
		nonSuicidalSelfInjury: 'no',
		behaviourRecency: 'within-3-months',
		lifetimeAttemptCount: 1,
		mostRecentAttemptDate: ''
	};
	d.means = {
		accessToLethalMeans: 'yes',
		protectiveFactors: 'Few identified; socially isolated.'
	};
	d.summary = { clinicalNote: 'Specific plan and intent with access to means. Kept on the line; crisis team dispatched.' };
	return d;
}

/** High risk — recent high-lethality actual attempt (behaviour + lethality). */
function highRiskRecentAttempt(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr R. Fletcher',
		clinicianRole: 'clinician',
		assessedAt: '2026-06-27T02:40',
		careSetting: 'inpatient',
		scaleVersion: 'full',
		reasonForAssessment: 'Admitted after an overdose requiring medical treatment.'
	};
	d.identification = { patientIdentifier: 'IN-573642', ageBand: 'adult', sex: 'female' };
	d.ideation = {
		wishToBeDead: 'yes',
		nonSpecificActiveThoughts: 'yes',
		activeIdeationMethods: 'no',
		activeIdeationIntent: 'no',
		activeIdeationPlan: 'no',
		ideationTimeframe: 'past-month'
	};
	d.behaviour = {
		actualAttempt: 'yes',
		interruptedAttempt: 'no',
		abortedAttempt: 'no',
		preparatoryActs: 'yes',
		nonSuicidalSelfInjury: 'no',
		behaviourRecency: 'within-3-months',
		lifetimeAttemptCount: 2,
		mostRecentAttemptDate: '2026-06-26'
	};
	d.lethality = { actualLethality: 4, potentialLethality: null };
	d.means = {
		accessToLethalMeans: 'yes',
		protectiveFactors: 'Engaged with liaison psychiatry post-admission.'
	};
	d.summary = { clinicalNote: 'Recent high-lethality attempt; ideation level 2 now but behaviour and lethality drive High tier.' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CSSRS-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: lowRiskPassive() },
	{
		id: 'CSSRS-2026-0002',
		patientName: 'Nowak, Zofia',
		assessedDate: '2026-06-26',
		data: moderateRiskMethods()
	},
	{
		id: 'CSSRS-2026-0003',
		patientName: 'Ahmed, Bilal',
		assessedDate: '2026-06-26',
		data: highRiskPlanIntent()
	},
	{
		id: 'CSSRS-2026-0004',
		patientName: 'Fletcher, Rosemary',
		assessedDate: '2026-06-27',
		data: highRiskRecentAttempt()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCssrsGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		ideationLevel: g.ideationLevel,
		riskTier: g.riskTier,
		escalationFlag: g.riskTier === 'high',
		flagCount: g.flaggedIssues.length,
		assessedDate: s.assessedDate
	};
});
