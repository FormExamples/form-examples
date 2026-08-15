import type { AssessmentData, RiskLevel } from '#lib/engine/types.js';
import { calculateAntenatalRisk } from '#lib/engine/antenatal-grader.js';
import { carePathwayLabel } from '#lib/engine/utils.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the maternity-team dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	gestation: string;
	riskLevel: RiskLevel;
	carePathway: string;
	safeguardingFlag: boolean;
	mentalHealthFlag: boolean;
	flagCount: number;
}

/** A low-risk booking: no obstetric, medical, or social risk factors. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.maternalDemographics = {
		...d.maternalDemographics,
		firstName: 'Emily',
		lastName: 'Carter',
		dateOfBirth: '1996-02-14',
		ageAtBooking: 30,
		ethnicity: 'white-british',
		weight: 64,
		height: 166,
		bmi: 23.2
	};
	d.obstetricHistory = {
		...d.obstetricHistory,
		gravidity: 2,
		parity: 1,
		previousMiscarriages: 0,
		previousStillbirths: 0,
		previousNeonatalDeaths: 0,
		previousPretermBirth: 'no',
		previousPreEclampsia: 'no',
		previousCaesarean: 'no'
	};
	d.currentPregnancy = {
		...d.currentPregnancy,
		gestationWeeks: 12,
		gestationDays: 3,
		multiplePregnancy: 'no',
		ivfConception: 'no'
	};
	d.lifestyleSocialFactors = {
		...d.lifestyleSocialFactors,
		smokingStatus: 'never',
		alcoholUse: 'none',
		substanceUse: 'none'
	};
	return d;
}

/** A moderate-risk booking: raised BMI, previous GDM, current smoker. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.maternalDemographics = {
		...d.maternalDemographics,
		firstName: 'Priya',
		lastName: 'Sharma',
		dateOfBirth: '1988-11-02',
		ageAtBooking: 37,
		ethnicity: 'asian-indian',
		weight: 84,
		height: 160,
		bmi: 32.8
	};
	d.obstetricHistory = {
		...d.obstetricHistory,
		gravidity: 3,
		parity: 2,
		previousGestationalDiabetes: 'yes',
		previousCaesarean: 'yes',
		previousCaesareanCount: 1
	};
	d.currentPregnancy = {
		...d.currentPregnancy,
		gestationWeeks: 16,
		gestationDays: 0,
		multiplePregnancy: 'no'
	};
	d.lifestyleSocialFactors = {
		...d.lifestyleSocialFactors,
		smokingStatus: 'current',
		cigarettesPerDay: 8,
		alcoholUse: 'none',
		substanceUse: 'none'
	};
	d.mentalHealthAssessment = {
		...d.mentalHealthAssessment,
		whooley1: 'no',
		whooley2: 'no'
	};
	return d;
}

/** A high-risk booking: pre-existing diabetes, chronic hypertension, twins. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.maternalDemographics = {
		...d.maternalDemographics,
		firstName: 'Margaret',
		lastName: 'Jones',
		dateOfBirth: '1983-06-22',
		ageAtBooking: 42,
		ethnicity: 'white-british',
		weight: 96,
		height: 162,
		bmi: 36.6
	};
	d.obstetricHistory = {
		...d.obstetricHistory,
		gravidity: 4,
		parity: 2,
		previousPreEclampsia: 'yes',
		previousPretermBirth: 'yes'
	};
	d.medicalHistory = {
		...d.medicalHistory,
		chronicHypertension: 'yes',
		preExistingDiabetes: 'yes'
	};
	d.currentPregnancy = {
		...d.currentPregnancy,
		gestationWeeks: 14,
		gestationDays: 2,
		multiplePregnancy: 'yes',
		chorionicity: 'dcda',
		ivfConception: 'yes'
	};
	d.lifestyleSocialFactors = {
		...d.lifestyleSocialFactors,
		smokingStatus: 'ex',
		alcoholUse: 'none',
		substanceUse: 'none'
	};
	return d;
}

/** A high-risk booking driven by safeguarding and mental-health concerns. */
function highRiskSafeguarding(): AssessmentData {
	const d = createDefaultAssessment();
	d.maternalDemographics = {
		...d.maternalDemographics,
		firstName: 'Chloe',
		lastName: 'Walker',
		dateOfBirth: '2009-04-18',
		ageAtBooking: 17,
		ethnicity: 'white-british',
		weight: 58,
		height: 164,
		bmi: 21.6
	};
	d.obstetricHistory = {
		...d.obstetricHistory,
		gravidity: 1,
		parity: 0
	};
	d.currentPregnancy = {
		...d.currentPregnancy,
		gestationWeeks: 20,
		gestationDays: 5,
		multiplePregnancy: 'no'
	};
	d.lifestyleSocialFactors = {
		...d.lifestyleSocialFactors,
		smokingStatus: 'current',
		cigarettesPerDay: 5,
		alcoholUse: 'occasional',
		substanceUse: 'occasional',
		domesticAbuse: 'yes',
		safeguardingConcerns: 'yes',
		housingInsecurity: 'yes'
	};
	d.mentalHealthAssessment = {
		...d.mentalHealthAssessment,
		whooley1: 'yes',
		whooley2: 'yes',
		previousSevereMentalIllness: 'yes',
		selfHarmIdeation: 'yes'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OB-2026-0001', patientName: 'Carter, Emily', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'OB-2026-0002', patientName: 'Sharma, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'OB-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'OB-2026-0004', patientName: 'Walker, Chloe', assessedDate: '2026-06-18', data: highRiskSafeguarding() }
];

/** Format a gestation as "W+D weeks" (or a dash if unknown). */
function formatGestation(data: AssessmentData): string {
	const w = data.currentPregnancy.gestationWeeks;
	const d = data.currentPregnancy.gestationDays;
	if (w == null) return '—';
	return `${w}+${d ?? 0} wks`;
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateAntenatalRisk(s.data);
	const safeguarding = g.additionalFlags.some(
		(f) => f.category === 'Safeguarding' || f.id.startsWith('FLAG-SAFEGUARD')
	);
	const mentalHealth = g.additionalFlags.some((f) => f.category === 'Mental Health');
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		gestation: formatGestation(s.data),
		riskLevel: g.riskLevel,
		carePathway: carePathwayLabel(g.riskLevel),
		safeguardingFlag: safeguarding,
		mentalHealthFlag: mentalHealth,
		flagCount: g.additionalFlags.length
	};
});
