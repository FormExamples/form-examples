import type { AssessmentData, CareSetting, CompletenessStatus, RiskLevel } from '$lib/engine/types';
import { calculateMseGrade } from '$lib/engine/mse-grader';
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
	status: CompletenessStatus;
	completenessPercent: number;
	riskLevel: RiskLevel;
	highFlagCount: number;
	flagCount: number;
	assessedDate: string;
}

/** High risk, complete — active suicidal ideation with a plan, low mood. */
function highRiskComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Okafor',
		clinicianRole: 'psychiatrist',
		assessedAt: '2026-06-24T09:30',
		careSetting: 'crisis',
		assessmentReason: 'Crisis team referral following overdose ideation.'
	};
	d.identification = { patientIdentifier: 'MRN-482201', ageBand: '26-39', sex: 'female' };
	d.appearance = {
		appearanceGrooming: 'dishevelled',
		appearanceEyeContact: 'avoidant',
		appearanceRapport: 'withdrawn',
		appearancePsychomotor: 'retardation',
		appearanceAbnormalMovements: '',
		appearanceNotes: 'Tearful throughout, poor self-care over recent week.'
	};
	d.speech = {
		speechRate: 'slow',
		speechVolume: 'quiet',
		speechQuantity: 'poverty',
		speechFluency: 'fluent',
		speechNotes: 'Long latency to respond.'
	};
	d.emotion = {
		moodSubjective: '"empty and hopeless"',
		moodDescriptor: 'low',
		affectRange: 'restricted',
		affectCongruence: 'congruent',
		affectReactivity: 'non-reactive',
		emotionNotes: 'Pervasive low mood with anhedonia.'
	};
	d.perception = {
		hallucinationsPresent: 'none',
		commandHallucinations: 'not-applicable',
		illusions: 'absent',
		depersonalisation: 'absent',
		derealisation: 'absent',
		perceptionNotes: 'No perceptual abnormality elicited.'
	};
	d.thought = {
		thoughtForm: 'linear',
		delusions: 'none',
		obsessions: 'absent',
		suicidalIdeation: 'active-with-plan',
		homicidalIdeation: 'none',
		selfHarmThoughts: 'thoughts',
		thoughtNotes: 'Specific plan disclosed; means available at home.'
	};
	d.insight = {
		insightLevel: 'partial',
		treatmentUnderstanding: 'ambivalent',
		judgement: 'impaired',
		insightNotes: 'Accepts low mood, uncertain about admission.'
	};
	d.cognition = {
		orientation: 'orientated',
		attention: 'impaired',
		memory: 'intact',
		cognitiveImpression: 'no-concern',
		cognitionNotes: 'Attention reduced in keeping with mood.'
	};
	d.summary = {
		clinicalFormulation:
			'Severe depressive episode with active suicidal ideation and a plan. High risk; requires urgent risk assessment and likely admission.'
	};
	return d;
}

/** High risk, complete — command hallucinations and homicidal intent (psychosis). */
function highRiskPsychosis(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr Z. Nowak',
		clinicianRole: 'liaison',
		assessedAt: '2026-06-25T21:15',
		careSetting: 'inpatient',
		assessmentReason: 'Ward referral: acute behavioural disturbance.'
	};
	d.identification = { patientIdentifier: 'MRN-880204', ageBand: '18-25', sex: 'male' };
	d.appearance = {
		appearanceGrooming: 'other',
		appearanceEyeContact: 'intense',
		appearanceRapport: 'hostile',
		appearancePsychomotor: 'agitation',
		appearanceAbnormalMovements: 'Restless, pacing.',
		appearanceNotes: 'Guarded and suspicious.'
	};
	d.speech = {
		speechRate: 'rapid',
		speechVolume: 'loud',
		speechQuantity: 'excessive',
		speechFluency: 'fluent',
		speechNotes: 'Difficult to interrupt.'
	};
	d.emotion = {
		moodSubjective: '"angry"',
		moodDescriptor: 'irritable',
		affectRange: 'full',
		affectCongruence: 'congruent',
		affectReactivity: 'reactive',
		emotionNotes: 'Labile and irritable.'
	};
	d.perception = {
		hallucinationsPresent: 'auditory',
		commandHallucinations: 'yes',
		illusions: 'absent',
		depersonalisation: 'absent',
		derealisation: 'absent',
		perceptionNotes: 'Third-person voices commanding him to act.'
	};
	d.thought = {
		thoughtForm: 'flight-of-ideas',
		delusions: 'persecutory',
		obsessions: 'absent',
		suicidalIdeation: 'none',
		homicidalIdeation: 'intent',
		selfHarmThoughts: 'none',
		thoughtNotes: 'Believes staff intend to harm him; threats made toward a named nurse.'
	};
	d.insight = {
		insightLevel: 'none',
		treatmentUnderstanding: 'refuses',
		judgement: 'impaired',
		insightNotes: 'No insight into illness; declining medication.'
	};
	d.cognition = {
		orientation: 'orientated',
		attention: 'impaired',
		memory: 'intact',
		cognitiveImpression: 'mild-concern',
		cognitionNotes: 'Distractible.'
	};
	d.summary = {
		clinicalFormulation:
			'Acute psychotic presentation with command hallucinations, persecutory delusions, and homicidal intent. High risk; urgent psychiatric review and Mental Health Act assessment.'
	};
	return d;
}

/** Moderate risk, complete — passive ideation and delusional content. */
function moderateRiskComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr I. Mackenzie',
		clinicianRole: 'gp',
		assessedAt: '2026-06-25T14:10',
		careSetting: 'primary-care',
		assessmentReason: 'Routine review of low mood.'
	};
	d.identification = { patientIdentifier: 'MRN-573110', ageBand: '40-64', sex: 'male' };
	d.appearance = {
		appearanceGrooming: 'well-kempt',
		appearanceEyeContact: 'reduced',
		appearanceRapport: 'guarded',
		appearancePsychomotor: 'normal',
		appearanceAbnormalMovements: '',
		appearanceNotes: 'Cooperative but reserved.'
	};
	d.speech = {
		speechRate: 'normal',
		speechVolume: 'normal',
		speechQuantity: 'normal',
		speechFluency: 'fluent',
		speechNotes: ''
	};
	d.emotion = {
		moodSubjective: '"flat"',
		moodDescriptor: 'low',
		affectRange: 'restricted',
		affectCongruence: 'congruent',
		affectReactivity: 'reactive',
		emotionNotes: ''
	};
	d.perception = {
		hallucinationsPresent: 'none',
		commandHallucinations: 'not-applicable',
		illusions: 'absent',
		depersonalisation: 'absent',
		derealisation: 'absent',
		perceptionNotes: ''
	};
	d.thought = {
		thoughtForm: 'circumstantial',
		delusions: 'reference',
		obsessions: 'absent',
		suicidalIdeation: 'passive',
		homicidalIdeation: 'none',
		selfHarmThoughts: 'none',
		thoughtNotes: 'Passive thoughts of being better off dead; ideas of reference on television.'
	};
	d.insight = {
		insightLevel: 'partial',
		treatmentUnderstanding: 'accepts',
		judgement: 'intact',
		insightNotes: ''
	};
	d.cognition = {
		orientation: 'orientated',
		attention: 'normal',
		memory: 'intact',
		cognitiveImpression: 'no-concern',
		cognitionNotes: ''
	};
	d.summary = {
		clinicalFormulation:
			'Depressive episode with passive ideation and ideas of reference. Moderate risk; safety plan and psychiatry referral.'
	};
	return d;
}

/** Low risk, partial — only appearance and speech documented, no findings. */
function lowRiskPartial(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'RMN S. Patel',
		clinicianRole: 'mental-health-nurse',
		assessedAt: '2026-06-26T10:00',
		careSetting: 'outpatient',
		assessmentReason: 'Brief follow-up; full examination deferred.'
	};
	d.identification = { patientIdentifier: 'MRN-100517', ageBand: '65-plus', sex: 'female' };
	d.appearance = {
		appearanceGrooming: 'well-kempt',
		appearanceEyeContact: 'normal',
		appearanceRapport: 'good',
		appearancePsychomotor: 'normal',
		appearanceAbnormalMovements: '',
		appearanceNotes: 'Settled and engaged.'
	};
	d.speech = {
		speechRate: 'normal',
		speechVolume: 'normal',
		speechQuantity: 'normal',
		speechFluency: 'fluent',
		speechNotes: ''
	};
	// Emotion, perception, thought, insight, and cognition left undocumented →
	// partial examination (2 of 7 domains).
	d.summary = {
		clinicalFormulation: 'Brief review only; full ASEPTIC examination to be completed next visit.'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'MSE-2026-0001',
		patientName: 'Adeyemi, Grace',
		assessedDate: '2026-06-24',
		data: highRiskComplete()
	},
	{
		id: 'MSE-2026-0002',
		patientName: 'Novak, Jan',
		assessedDate: '2026-06-25',
		data: highRiskPsychosis()
	},
	{
		id: 'MSE-2026-0003',
		patientName: 'Mackenzie, Ian',
		assessedDate: '2026-06-25',
		data: moderateRiskComplete()
	},
	{
		id: 'MSE-2026-0004',
		patientName: 'Patel, Sunita',
		assessedDate: '2026-06-26',
		data: lowRiskPartial()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateMseGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		careSetting: s.data.context.careSetting,
		status: g.status,
		completenessPercent: g.completenessPercent,
		riskLevel: g.riskLevel,
		highFlagCount: g.flags.filter((f) => f.priority === 'high').length,
		flagCount: g.flags.length,
		assessedDate: s.assessedDate
	};
});
