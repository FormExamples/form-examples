import { describe, it, expect } from 'vitest';
import { calculateAntenatalRisk } from './antenatal-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { ng201Rules } from './antenatal-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment with every field at its unanswered default. Defined
 * locally so the engine tests do not depend on the SvelteKit store (which
 * imports `$app/environment`, unavailable under plain Vitest).
 */
function blankAssessment(): AssessmentData {
	return {
		maternalDemographics: {
			firstName: '', lastName: '', dateOfBirth: '', ageAtBooking: null, ethnicity: '',
			weight: null, height: null, bmi: null, occupation: '', partnerStatus: ''
		},
		obstetricHistory: {
			gravidity: null, parity: null, previousMiscarriages: null, previousTerminations: null,
			previousStillbirths: null, previousNeonatalDeaths: null, previousPretermBirth: '',
			previousPreEclampsia: '', previousGestationalDiabetes: '', previousCaesarean: '',
			previousCaesareanCount: null, previousShoulderDystocia: '', previousPostpartumHaemorrhage: '',
			previousLargeBaby: '', previousSmallBaby: '', previousCongenitalAnomaly: '', obstetricNotes: ''
		},
		medicalHistory: {
			chronicHypertension: '', cardiacDisease: '', preExistingDiabetes: '', thyroidDisease: '',
			renalDisease: '', epilepsy: '', asthma: '', autoimmuneDisease: '', hivPositive: '',
			hepatitis: '', previousVte: '', thrombophilia: '', mentalHealthHistory: '',
			bariatricSurgery: '', otherMedicalConditions: '', currentMedications: ''
		},
		currentPregnancy: {
			lastMenstrualPeriod: '', estimatedDueDate: '', datingScanDate: '', gestationWeeks: null,
			gestationDays: null, multiplePregnancy: '', chorionicity: '', ivfConception: '',
			folicAcidPreconception: '', firstAntenatalContact: '', bookingDate: ''
		},
		lifestyleSocialFactors: {
			smokingStatus: '', cigarettesPerDay: null, alcoholUse: '', substanceUse: '',
			domesticAbuse: '', safeguardingConcerns: '', housingInsecurity: '', financialDifficulty: '',
			requiresInterpreter: '', interpreterLanguage: '', asylumOrRefugee: '',
			femaleGenitalMutilation: '', socialNotes: ''
		},
		screeningResults: {
			combinedTestResult: '', combinedTestRisk: '', anomalyScanCompleted: '',
			anomalyScanFindings: '', gttResult: '', gttFasting: null, gttTwoHour: null, bloodGroup: '',
			rhesusStatus: '', antibodyScreenPositive: '', infectionScreenAbnormal: '',
			infectionScreenDetails: '', haemoglobin: '', screeningNotes: ''
		},
		mentalHealthAssessment: {
			whooley1: '', whooley2: '', gad2Q1: '', gad2Q2: '', previousPostnatalDepression: '',
			previousSevereMentalIllness: '', currentlyOnPsychotropicMeds: '', selfHarmIdeation: '',
			mentalHealthNotes: ''
		},
		fetalAssessment: {
			fundalHeight: null, fetalLie: '', fetalPresentation: '', engaged: '',
			fetalMovementsReported: '', fetalHeartRate: null, reducedFetalMovements: '',
			growthConcern: '', growthConcernDetails: '', fetalNotes: ''
		},
		birthPreferences: {
			preferredBirthSetting: '', preferredAnalgesia: '', birthPartnerPlanned: '',
			birthPlanCompleted: '', feedingChoiceBreast: '', feedingChoiceFormula: '', vbacRequested: '',
			birthPreferenceNotes: ''
		},
		carePlanFollowup: {
			recommendedCarePathway: '', consultantReferralRequired: '', mentalHealthReferralRequired: '',
			safeguardingReferralRequired: '', aspirinProphylaxisIndicated: '', vteProphylaxisIndicated: '',
			nextAppointmentDate: '', carePlanNotes: ''
		}
	};
}

/** A low-risk pregnancy: no obstetric, medical, or social risk factors. */
function lowRiskPregnancy(): AssessmentData {
	const d = blankAssessment();
	d.maternalDemographics.firstName = 'Anna';
	d.maternalDemographics.lastName = 'Brown';
	d.maternalDemographics.dateOfBirth = '1996-03-20';
	d.maternalDemographics.ageAtBooking = 30;
	d.maternalDemographics.bmi = 23;
	d.obstetricHistory.gravidity = 2;
	d.obstetricHistory.parity = 1;
	d.obstetricHistory.previousMiscarriages = 0;
	d.lifestyleSocialFactors.smokingStatus = 'never';
	d.lifestyleSocialFactors.alcoholUse = 'none';
	d.lifestyleSocialFactors.substanceUse = 'none';
	return d;
}

describe('NG201 Antenatal Risk Grader', () => {
	it('returns low risk for a pregnancy with no risk factors', () => {
		const result = calculateAntenatalRisk(lowRiskPregnancy());
		expect(result.riskLevel).toBe('low');
		expect(result.firedRules).toHaveLength(0);
	});

	it('returns moderate risk for maternal age 35-39 plus current smoking', () => {
		const d = lowRiskPregnancy();
		d.maternalDemographics.ageAtBooking = 37;
		d.lifestyleSocialFactors.smokingStatus = 'current';
		const result = calculateAntenatalRisk(d);
		expect(result.riskLevel).toBe('moderate');
		expect(result.firedRules.some((r) => r.id === 'NG201-AGE-002')).toBe(true);
		expect(result.firedRules.some((r) => r.id === 'NG201-SOCIAL-001')).toBe(true);
	});

	it('returns high risk for pre-existing diabetes', () => {
		const d = lowRiskPregnancy();
		d.medicalHistory.preExistingDiabetes = 'yes';
		const result = calculateAntenatalRisk(d);
		expect(result.riskLevel).toBe('high');
		expect(result.firedRules.some((r) => r.risk === 'high')).toBe(true);
	});

	it('returns high risk for a multiple pregnancy with previous pre-eclampsia', () => {
		const d = lowRiskPregnancy();
		d.currentPregnancy.multiplePregnancy = 'yes';
		d.obstetricHistory.previousPreEclampsia = 'yes';
		const result = calculateAntenatalRisk(d);
		expect(result.riskLevel).toBe('high');
		expect(result.firedRules.some((r) => r.id === 'NG201-PREG-001')).toBe(true);
		expect(result.firedRules.some((r) => r.id === 'NG201-OBS-002')).toBe(true);
	});

	it('sorts fired rules high-risk first', () => {
		const d = lowRiskPregnancy();
		d.maternalDemographics.ageAtBooking = 37; // moderate
		d.medicalHistory.cardiacDisease = 'yes'; // high
		const result = calculateAntenatalRisk(d);
		expect(result.firedRules[0].risk).toBe('high');
	});

	it('all rule IDs are unique', () => {
		const ids = ng201Rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('counts answered inputs', () => {
		const result = calculateAntenatalRisk(lowRiskPregnancy());
		expect(result.answeredCount).toBeGreaterThan(0);
	});
});

describe('Antenatal Flagged Issues Detection', () => {
	it('returns no flags for a low-risk pregnancy', () => {
		const flags = detectAdditionalFlags(lowRiskPregnancy());
		expect(flags).toHaveLength(0);
	});

	it('raises an urgent flag for disclosed self-harm ideation', () => {
		const d = lowRiskPregnancy();
		d.mentalHealthAssessment.selfHarmIdeation = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-MH-001' && f.priority === 'urgent')).toBe(true);
	});

	it('raises an urgent flag for domestic abuse', () => {
		const d = lowRiskPregnancy();
		d.lifestyleSocialFactors.domesticAbuse = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-SAFEGUARD-001')).toBe(true);
	});

	it('flags an aspirin indication for previous pre-eclampsia', () => {
		const d = lowRiskPregnancy();
		d.obstetricHistory.previousPreEclampsia = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-OBS-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = lowRiskPregnancy();
		d.mentalHealthAssessment.selfHarmIdeation = 'yes'; // urgent
		d.obstetricHistory.previousGestationalDiabetes = 'yes'; // medium
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => order[f.priority]);
		expect(priorities).toEqual([...priorities].sort((a, b) => a - b));
	});
});
