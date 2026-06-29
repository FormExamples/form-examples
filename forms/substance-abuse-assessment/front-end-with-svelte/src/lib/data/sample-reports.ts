import type { AssessmentData, AuditRiskCategory, RiskLevel } from '$lib/engine/types';
import { calculateSubstanceGrade } from '$lib/engine/substance-grader';
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
	auditScore: number;
	auditCategory: AuditRiskCategory;
	dastScore: number;
	riskLevel: RiskLevel;
	ivFlag: boolean;
	withdrawalFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: occasional alcohol, no drug use, stable life. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-04-12', sex: 'male', weight: 80, height: 180, bmi: 24.7 };
	d.alcoholUseAudit = { ...d.alcoholUseAudit, auditQ1Frequency: 2, auditQ2TypicalQuantity: 1, auditQ3BingeFrequency: 1 };
	d.substanceUseHistory = { ...d.substanceUseHistory, primarySubstance: 'alcohol', frequencyOfUse: 'weekly', durationOfUse: '1-5-years', currentUseStatus: 'early-recovery', ivDrugUse: 'no', needleSharing: 'no' };
	d.socialLegalImpact = { ...d.socialLegalImpact, employmentStatus: 'employed', housingStatus: 'stable', socialSupport: 'good' };
	d.treatmentPlanningGoals = { ...d.treatmentPlanningGoals, treatmentGoal: 'controlled-use', readinessToChange: 'action', motivationLevel: 'high', riskOfRelapse: 'low' };
	return d;
}

/** A moderate-risk assessment: hazardous drinking, moderate drug use. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1979-09-30', sex: 'female', weight: 68, height: 165, bmi: 25.0 };
	d.alcoholUseAudit = { ...d.alcoholUseAudit, auditQ1Frequency: 3, auditQ2TypicalQuantity: 2, auditQ3BingeFrequency: 2, auditQ4ImpairedControl: 1, auditQ7Guilt: 2 };
	d.drugUseDast = { ...d.drugUseDast, dastQ1NonMedicalUse: 'yes', dastQ5Guilt: 'yes', dastQ7Neglect: 'yes' };
	d.substanceUseHistory = { ...d.substanceUseHistory, primarySubstance: 'cannabis', frequencyOfUse: 'several-times-week', durationOfUse: '5-10-years', currentUseStatus: 'actively-using', ivDrugUse: 'no', needleSharing: 'no' };
	d.mentalHealthComorbidities = { ...d.mentalHealthComorbidities, depression: 'yes', depressionSeverity: 'moderate' };
	d.socialLegalImpact = { ...d.socialLegalImpact, employmentStatus: 'employed', housingStatus: 'stable', socialSupport: 'limited', financialDifficulties: 'yes' };
	d.treatmentPlanningGoals = { ...d.treatmentPlanningGoals, treatmentGoal: 'harm-reduction', readinessToChange: 'contemplation', motivationLevel: 'moderate', riskOfRelapse: 'moderate' };
	return d;
}

/** A high-risk assessment: harmful drinking, substantial drug use, IV use. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1972-01-22', sex: 'female', weight: 60, height: 162, bmi: 22.9 };
	d.alcoholUseAudit = { ...d.alcoholUseAudit, auditQ1Frequency: 4, auditQ2TypicalQuantity: 3, auditQ3BingeFrequency: 3, auditQ4ImpairedControl: 2, auditQ6MorningDrinking: 1, auditQ7Guilt: 2, auditQ10Concern: 2 };
	d.drugUseDast = { ...d.drugUseDast, dastQ1NonMedicalUse: 'yes', dastQ2PolyDrug: 'yes', dastQ4Blackouts: 'yes', dastQ5Guilt: 'yes', dastQ7Neglect: 'yes', dastQ10MedicalProblems: 'yes' };
	d.substanceUseHistory = { ...d.substanceUseHistory, primarySubstance: 'heroin', routeOfAdministration: 'injecting', frequencyOfUse: 'daily', durationOfUse: '5-10-years', currentUseStatus: 'actively-using', ivDrugUse: 'yes', needleSharing: 'no' };
	d.mentalHealthComorbidities = { ...d.mentalHealthComorbidities, depression: 'yes', depressionSeverity: 'severe', previousSuicideAttempts: 'yes' };
	d.physicalHealthImpact = { ...d.physicalHealthImpact, hepatitisC: 'yes' };
	d.socialLegalImpact = { ...d.socialLegalImpact, employmentStatus: 'unemployed', housingStatus: 'unstable', socialSupport: 'limited', criminalRecord: 'yes', financialDifficulties: 'yes' };
	d.treatmentPlanningGoals = { ...d.treatmentPlanningGoals, treatmentGoal: 'abstinence', readinessToChange: 'preparation', motivationLevel: 'moderate', riskOfRelapse: 'high', safetyPlanNeeded: 'yes' };
	return d;
}

/** A critical assessment: dependence-likely alcohol, severe drug use, active withdrawal. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1968-11-03', sex: 'male', weight: 72, height: 178, bmi: 22.7 };
	d.alcoholUseAudit = { ...d.alcoholUseAudit, auditQ1Frequency: 4, auditQ2TypicalQuantity: 4, auditQ3BingeFrequency: 4, auditQ4ImpairedControl: 3, auditQ5FailedExpectations: 3, auditQ6MorningDrinking: 3, auditQ7Guilt: 3, auditQ8Blackout: 2, auditQ9Injury: 2 };
	d.drugUseDast = { ...d.drugUseDast, dastQ1NonMedicalUse: 'yes', dastQ2PolyDrug: 'yes', dastQ3AbleToStop: 'no', dastQ4Blackouts: 'yes', dastQ5Guilt: 'yes', dastQ6Complaints: 'yes', dastQ7Neglect: 'yes', dastQ8IllegalActivities: 'yes', dastQ9Withdrawal: 'yes', dastQ10MedicalProblems: 'yes' };
	d.substanceUseHistory = { ...d.substanceUseHistory, primarySubstance: 'heroin', routeOfAdministration: 'injecting', frequencyOfUse: 'daily', durationOfUse: 'greater-10-years', currentUseStatus: 'in-withdrawal', ivDrugUse: 'yes', needleSharing: 'yes' };
	d.withdrawalAssessment = { ...d.withdrawalAssessment, currentlyInWithdrawal: 'yes', withdrawalSubstance: 'multiple', tremor: 'yes', sweating: 'yes', nauseaVomiting: 'yes', anxiety: 'severe', agitation: 'severe', seizureHistory: 'yes', deliriumTremensHistory: 'yes', hallucinations: 'yes', withdrawalSeverity: 'severe', medicallySupervisedDetoxNeeded: 'yes' };
	d.mentalHealthComorbidities = { ...d.mentalHealthComorbidities, depression: 'yes', depressionSeverity: 'severe', psychosis: 'yes', suicidalIdeation: 'yes', suicidalIdeationCurrent: 'yes', previousSuicideAttempts: 'yes', selfHarmHistory: 'yes' };
	d.physicalHealthImpact = { ...d.physicalHealthImpact, liverDisease: 'yes', liverDiseaseType: 'cirrhosis', hepatitisC: 'yes', hivStatus: 'positive', overdoseHistory: 'yes', overdoseCount: 2, lastOverdoseDate: '2026-03-10' };
	d.socialLegalImpact = { ...d.socialLegalImpact, employmentStatus: 'unemployed', housingStatus: 'homeless', socialSupport: 'none', childrenSafeguardingConcerns: 'yes', criminalRecord: 'yes', currentLegalIssues: 'yes', duiDwiHistory: 'yes', financialDifficulties: 'yes', domesticViolence: 'yes', domesticViolenceDetails: 'Recent assault by partner' };
	d.treatmentPlanningGoals = { ...d.treatmentPlanningGoals, treatmentGoal: 'abstinence', readinessToChange: 'preparation', motivationLevel: 'high', preferredTreatmentSetting: 'inpatient', riskOfRelapse: 'high', safetyPlanNeeded: 'yes', naloxoneProvided: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'SA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'SA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'SA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'SA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateSubstanceGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		auditScore: g.auditScore,
		auditCategory: g.auditRiskCategory,
		dastScore: g.dastScore,
		riskLevel: g.overallRisk,
		ivFlag: s.data.substanceUseHistory.ivDrugUse === 'yes',
		withdrawalFlag: s.data.withdrawalAssessment.currentlyInWithdrawal === 'yes',
		flagCount: g.additionalFlags.length
	};
});
