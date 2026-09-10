import type { AssessmentData, Referral, ReviewPathway, Risk } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/podiatry-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	rightFootRisk: Risk;
	leftFootRisk: Risk;
	overallRisk: Risk;
	reviewPathway: ReviewPathway;
	referral: Referral;
	urgentFlag: boolean;
	flagCount: number;
	assessedDate: string;
}

/** No risk factors on either foot — annual review. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = { assessedAt: '2026-06-10', assessmentSetting: 'annual-review' };
	d.riskFactors = {
		diabetesType: 'type-2',
		yearsSinceDiagnosis: 4,
		onRenalReplacementTherapy: 'no',
		visualAcuityImpairment: 'no',
		selfCareAbility: 'independent',
		footwearAppropriate: 'yes'
	};
	d.rightFoot = {
		neuropathyStatus: 'sensate',
		pulsesStatus: 'normal',
		deformity: 'no',
		callus: 'no',
		skinBreakdown: 'no',
		activeUlcer: 'no',
		ulcerSeverity: '',
		previousUlcer: 'no',
		previousAmputation: 'none',
		suspectedCharcot: 'no'
	};
	d.leftFoot = { ...d.rightFoot };
	d.note.clinicalContext = 'No risk factors either foot. Continue annual review.';
	return d;
}

/** One risk factor (deformity) on the worse foot — moderate risk. */
function moderateRisk(): AssessmentData {
	const d = lowRisk();
	d.context = { assessedAt: '2026-06-14', assessmentSetting: 'annual-review' };
	d.riskFactors.diabetesType = 'type-1';
	d.riskFactors.yearsSinceDiagnosis = 12;
	d.rightFoot.deformity = 'yes';
	d.note.clinicalContext = 'Mild claw-toe deformity right foot. Place on 6-monthly foot protection review.';
	return d;
}

/** Two combined risk factors on one foot, no history — high risk, 3-month interval. */
function highRiskCombined(): AssessmentData {
	const d = lowRisk();
	d.context = { assessedAt: '2026-06-18', assessmentSetting: 'foot-protection-clinic' };
	d.riskFactors.diabetesType = 'type-2';
	d.riskFactors.yearsSinceDiagnosis = 19;
	d.riskFactors.footwearAppropriate = 'no';
	d.rightFoot.neuropathyStatus = 'insensate';
	d.rightFoot.pulsesStatus = 'diminished';
	d.leftFoot.deformity = 'yes';
	d.note.clinicalContext =
		'Insensate right foot with diminished pulses; left foot deformity. Refer to multidisciplinary foot team, footwear review.';
	return d;
}

/** Previous ulcer history on the worse foot — high risk, tighter 1-month interval. */
function highRiskWithHistory(): AssessmentData {
	const d = lowRisk();
	d.context = { assessedAt: '2026-06-20', assessmentSetting: 'foot-protection-clinic' };
	d.riskFactors.diabetesType = 'type-2';
	d.riskFactors.yearsSinceDiagnosis = 24;
	d.riskFactors.onRenalReplacementTherapy = 'yes';
	d.leftFoot.previousUlcer = 'yes';
	d.leftFoot.neuropathyStatus = 'insensate';
	d.note.clinicalContext = 'Previous left-foot ulcer, now healed; on haemodialysis. Monthly MDFT review.';
	return d;
}

/** Active ulceration on one foot, low-risk other foot — active-urgent (mismatched feet). */
function activeUrgent(): AssessmentData {
	const d = lowRisk();
	d.context = { assessedAt: '2026-06-24', assessmentSetting: 'hospital-admission' };
	d.riskFactors.diabetesType = 'type-1';
	d.riskFactors.yearsSinceDiagnosis = 31;
	d.riskFactors.selfCareAbility = 'unable';
	d.riskFactors.visualAcuityImpairment = 'yes';
	d.rightFoot.activeUlcer = 'yes';
	d.rightFoot.ulcerSeverity = 'infected';
	d.rightFoot.neuropathyStatus = 'insensate';
	d.rightFoot.pulsesStatus = 'diminished';
	// leftFoot stays low-risk — mismatched feet.
	d.note.clinicalContext = 'Infected right-foot ulcer on admission. Urgent MDFT referral raised same day.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{
		id: 'DPA-2026-0001',
		patientName: 'Whitfield, Susan',
		assessedDate: '2026-06-10',
		data: lowRisk()
	},
	{
		id: 'DPA-2026-0002',
		patientName: 'Marsh, Thomas',
		assessedDate: '2026-06-14',
		data: moderateRisk()
	},
	{
		id: 'DPA-2026-0003',
		patientName: 'Okafor, Ifeoma',
		assessedDate: '2026-06-18',
		data: highRiskCombined()
	},
	{
		id: 'DPA-2026-0004',
		patientName: 'Novak, Zdenek',
		assessedDate: '2026-06-20',
		data: highRiskWithHistory()
	},
	{
		id: 'DPA-2026-0005',
		patientName: 'Bianchi, Rosa',
		assessedDate: '2026-06-24',
		data: activeUrgent()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		rightFootRisk: g.rightFootRisk,
		leftFootRisk: g.leftFootRisk,
		overallRisk: g.overallRisk,
		reviewPathway: g.reviewPathway,
		referral: g.referral,
		urgentFlag: g.overallRisk === 'active-urgent',
		flagCount: g.flaggedIssues.length,
		assessedDate: s.assessedDate
	};
});
