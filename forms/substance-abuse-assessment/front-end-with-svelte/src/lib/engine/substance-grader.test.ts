import { describe, it, expect } from 'vitest';
import { calculateSubstanceGrade } from './substance-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { calculateAuditScore, calculateDastScore, auditRiskCategory, dastRiskCategory } from './utils';
import type { AssessmentData } from './types';

/** A blank assessment with all fields at their unanswered defaults (no store dependency). */
function blank(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', weight: null, height: null, bmi: null },
		alcoholUseAudit: {
			auditQ1Frequency: 0, auditQ2TypicalQuantity: 0, auditQ3BingeFrequency: 0, auditQ4ImpairedControl: 0,
			auditQ5FailedExpectations: 0, auditQ6MorningDrinking: 0, auditQ7Guilt: 0, auditQ8Blackout: 0,
			auditQ9Injury: 0, auditQ10Concern: 0
		},
		drugUseDast: {
			dastQ1NonMedicalUse: '', dastQ2PolyDrug: '', dastQ3AbleToStop: '', dastQ4Blackouts: '', dastQ5Guilt: '',
			dastQ6Complaints: '', dastQ7Neglect: '', dastQ8IllegalActivities: '', dastQ9Withdrawal: '', dastQ10MedicalProblems: ''
		},
		substanceUseHistory: {
			ageFirstAlcoholUse: null, ageFirstDrugUse: null, primarySubstance: '', primarySubstanceOther: '',
			secondarySubstances: '', routeOfAdministration: '', frequencyOfUse: '', durationOfUse: '', lastUseDate: '',
			currentUseStatus: '', ivDrugUse: '', needleSharing: ''
		},
		withdrawalAssessment: {
			currentlyInWithdrawal: '', withdrawalSubstance: '', tremor: '', sweating: '', nauseaVomiting: '',
			anxiety: '', agitation: '', seizureHistory: '', deliriumTremensHistory: '', hallucinations: '',
			lastDrinkDrugHours: null, withdrawalSeverity: '', medicallySupervisedDetoxNeeded: ''
		},
		mentalHealthComorbidities: {
			depression: '', depressionSeverity: '', anxietyDisorder: '', anxietyDisorderType: '', ptsd: '', ptsdDetails: '',
			bipolarDisorder: '', psychosis: '', personalityDisorder: '', eatingDisorder: '', adhd: '', suicidalIdeation: '',
			suicidalIdeationCurrent: '', selfHarmHistory: '', previousSuicideAttempts: '', psychiatricMedication: '',
			psychiatricMedicationDetails: ''
		},
		physicalHealthImpact: {
			liverDisease: '', liverDiseaseType: '', hepatitisB: '', hepatitisC: '', hivStatus: '', cardiovascularIssues: '',
			cardiovascularDetails: '', respiratoryIssues: '', respiratoryDetails: '', gastrointestinalIssues: '',
			gastrointestinalDetails: '', neurologicalIssues: '', neurologicalDetails: '', nutritionalDeficiency: '',
			chronicPain: '', chronicPainDetails: '', overdoseHistory: '', overdoseCount: null, lastOverdoseDate: ''
		},
		socialLegalImpact: {
			employmentStatus: '', occupation: '', employmentAffected: '', housingStatus: '', relationshipStatus: '',
			relationshipImpact: 'none', dependents: null, childrenSafeguardingConcerns: '', socialSupport: '',
			criminalRecord: '', criminalRecordDetails: '', currentLegalIssues: '', currentLegalDetails: '',
			duiDwiHistory: '', financialDifficulties: '', domesticViolence: '', domesticViolenceDetails: ''
		},
		previousTreatmentHistory: {
			previousTreatment: '', numberOfTreatmentEpisodes: null, previousDetox: '', detoxSetting: '', previousRehab: '',
			rehabType: '', previousCounselling: '', counsellingType: '', previousMedicationAssisted: '', matMedication: '',
			selfHelpGroups: '', selfHelpGroupType: '', longestPeriodAbstinent: '', relapseTriggers: ''
		},
		treatmentPlanningGoals: {
			treatmentGoal: '', readinessToChange: '', motivationLevel: '', preferredTreatmentSetting: '',
			interestedInCounselling: '', interestedInMedication: '', interestedInSelfHelp: '', barriersToTreatment: '',
			supportNetworkAvailable: '', supportNetworkDetails: '', riskOfRelapse: '', safetyPlanNeeded: '',
			naloxoneProvided: '', followUpPlan: ''
		}
	};
}

describe('AUDIT scoring', () => {
	it('sums the ten AUDIT items', () => {
		const d = blank();
		d.alcoholUseAudit.auditQ1Frequency = 4;
		d.alcoholUseAudit.auditQ2TypicalQuantity = 4;
		d.alcoholUseAudit.auditQ3BingeFrequency = 4;
		expect(calculateAuditScore(d.alcoholUseAudit)).toBe(12);
	});

	it('maps scores to risk categories', () => {
		expect(auditRiskCategory(5)).toBe('low-risk');
		expect(auditRiskCategory(10)).toBe('hazardous');
		expect(auditRiskCategory(17)).toBe('harmful');
		expect(auditRiskCategory(25)).toBe('dependence-likely');
	});
});

describe('DAST-10 scoring', () => {
	it('scores yes answers and the inverse Q3', () => {
		const d = blank();
		d.drugUseDast.dastQ1NonMedicalUse = 'yes';
		d.drugUseDast.dastQ2PolyDrug = 'yes';
		d.drugUseDast.dastQ3AbleToStop = 'no'; // inverse: scores
		expect(calculateDastScore(d.drugUseDast)).toBe(3);
	});

	it('maps scores to risk categories', () => {
		expect(dastRiskCategory(0)).toBe('no-problems');
		expect(dastRiskCategory(2)).toBe('low');
		expect(dastRiskCategory(4)).toBe('moderate');
		expect(dastRiskCategory(7)).toBe('substantial');
		expect(dastRiskCategory(10)).toBe('severe');
	});
});

describe('calculateSubstanceGrade', () => {
	it('returns low risk for a blank assessment', () => {
		const result = calculateSubstanceGrade(blank());
		expect(result.overallRisk).toBe('low');
		expect(result.auditScore).toBe(0);
		expect(result.dastScore).toBe(0);
	});

	it('returns critical risk for active withdrawal', () => {
		const d = blank();
		d.withdrawalAssessment.currentlyInWithdrawal = 'yes';
		const result = calculateSubstanceGrade(d);
		expect(result.overallRisk).toBe('critical');
		expect(result.firedRules.some((r) => r.id === 'WD-001')).toBe(true);
	});

	it('returns critical risk for a high AUDIT score', () => {
		const d = blank();
		d.alcoholUseAudit.auditQ1Frequency = 4;
		d.alcoholUseAudit.auditQ2TypicalQuantity = 4;
		d.alcoholUseAudit.auditQ3BingeFrequency = 4;
		d.alcoholUseAudit.auditQ4ImpairedControl = 4;
		d.alcoholUseAudit.auditQ5FailedExpectations = 4;
		const result = calculateSubstanceGrade(d);
		expect(result.auditScore).toBeGreaterThanOrEqual(20);
		expect(result.overallRisk).toBe('critical');
	});
});

describe('detectAdditionalFlags', () => {
	it('flags current suicidal ideation as high priority', () => {
		const d = blank();
		d.mentalHealthComorbidities.suicidalIdeationCurrent = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-SI-001' && f.priority === 'high')).toBe(true);
	});

	it('flags needle sharing for BBV screening', () => {
		const d = blank();
		d.substanceUseHistory.needleSharing = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-BBV-001')).toBe(true);
	});

	it('returns no flags for a blank assessment', () => {
		expect(detectAdditionalFlags(blank())).toHaveLength(0);
	});
});
