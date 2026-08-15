import type { AssessmentData, ConcernLevel } from '#lib/engine/types.js';
import { calculateConcern } from '#lib/engine/fertility-grader.js';
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
	assessedDate: string;
	concernLevel: ConcernLevel;
	concernScore: number;
	semenAnalysisDone: boolean;
	recommendation: string;
	flagCount: number;
}

/** Low concern: young couple, regular cycle, normal investigations. */
function lowConcern(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, patientFirstName: 'Emma', patientLastName: 'Adams', patientDateOfBirth: '1996-04-12', patientSex: 'female', partnerFirstName: 'Tom', partnerLastName: 'Adams', partnerDateOfBirth: '1994-02-20', partnerSex: 'male', relationshipDuration: 4 };
	d.reproductiveHistory = { ...d.reproductiveHistory, durationTryingMonths: 8, priorPregnancies: 0, priorLiveBirths: 0, priorMiscarriages: 0, priorEctopic: 0, contraceptionStopped: 'yes', contraceptionStoppedDate: '2025-08-01' };
	d.menstrualCycle = { ...d.menstrualCycle, menarcheAge: 13, cycleLengthDays: 28, cycleRegularity: 'regular', periodDurationDays: 5, heavyBleeding: 'no', dysmenorrhoea: 'no' };
	d.lifestyleFactors = { ...d.lifestyleFactors, weight: 64, height: 168, bmi: 22.7, tobaccoStatus: 'never', alcoholLevel: 'low', caffeineLevel: 'low', recreationalDrugs: 'no', exerciseFrequency: 'moderate' };
	d.medicationsSupplements = { ...d.medicationsSupplements, folicAcid: 'yes', folicAcidDoseMcg: 400, vitaminD: 'yes' };
	d.partnerSemen = { ...d.partnerSemen, partnerAgeYears: 32, partnerSmoking: 'never', partnerAlcohol: 'low', semenAnalysisDone: 'yes', semenAnalysisDate: '2026-04-20', semenVolumeMl: 3, semenConcentrationMillionPerMl: 60, semenTotalMotilityPercent: 55, semenProgressiveMotilityPercent: 45, semenNormalMorphologyPercent: 8 };
	d.hormoneProfile = { ...d.hormoneProfile, fsh: 6, lh: 5, amh: 24, tsh: 1.5, prolactin: 300, progesteroneDay21: 45 };
	d.investigations = { ...d.investigations, transvaginalUltrasound: 'yes-normal', antralFollicleCount: 15, hysterosalpingogramDone: 'yes', hysterosalpingogramResult: 'normal' };
	d.clinicalRecommendation = { ...d.clinicalRecommendation, clinicianName: 'Dr Okafor', assessmentDate: '2026-05-02', recommendation: 'continue-attempts', referralUrgency: 'routine' };
	return d;
}

/** Moderate concern: irregular cycles, PCOS, raised BMI. */
function moderateConcern(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, patientFirstName: 'Sophie', patientLastName: 'Brennan', patientDateOfBirth: '1991-11-30', patientSex: 'female', partnerFirstName: 'James', partnerLastName: 'Brennan', partnerDateOfBirth: '1990-06-15', partnerSex: 'male', relationshipDuration: 6 };
	d.reproductiveHistory = { ...d.reproductiveHistory, durationTryingMonths: 14, priorPregnancies: 0, priorLiveBirths: 0, priorMiscarriages: 0, contraceptionStopped: 'yes' };
	d.menstrualCycle = { ...d.menstrualCycle, menarcheAge: 12, cycleLengthDays: 42, cycleRegularity: 'irregular', periodDurationDays: 6, heavyBleeding: 'no', dysmenorrhoea: 'yes' };
	d.medicalSurgicalHistory = { ...d.medicalSurgicalHistory, polycysticOvarySyndrome: 'yes', endometriosis: 'no' };
	d.lifestyleFactors = { ...d.lifestyleFactors, weight: 88, height: 165, bmi: 32.3, tobaccoStatus: 'never', alcoholLevel: 'low', caffeineLevel: 'moderate', recreationalDrugs: 'no', exerciseFrequency: 'low' };
	d.medicationsSupplements = { ...d.medicationsSupplements, currentMedications: [{ name: 'Metformin', dose: '500 mg', frequency: 'BD' }], folicAcid: 'yes', folicAcidDoseMcg: 400, vitaminD: 'no' };
	d.partnerSemen = { ...d.partnerSemen, partnerAgeYears: 36, partnerSmoking: 'former', partnerAlcohol: 'moderate', semenAnalysisDone: 'yes', semenAnalysisDate: '2026-05-10', semenVolumeMl: 2.5, semenConcentrationMillionPerMl: 40, semenTotalMotilityPercent: 50, semenProgressiveMotilityPercent: 38, semenNormalMorphologyPercent: 6 };
	d.hormoneProfile = { ...d.hormoneProfile, fsh: 5.5, lh: 11, amh: 38, tsh: 2.1, prolactin: 350, progesteroneDay21: 12 };
	d.investigations = { ...d.investigations, transvaginalUltrasound: 'yes-abnormal', antralFollicleCount: 28 };
	d.clinicalRecommendation = { ...d.clinicalRecommendation, clinicianName: 'Dr Okafor', assessmentDate: '2026-05-18', recommendation: 'lifestyle-optimisation', referralUrgency: 'soon' };
	return d;
}

/** High concern: advanced maternal age and low ovarian reserve. */
function highConcernAge(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, patientFirstName: 'Rachel', patientLastName: 'Clarke', patientDateOfBirth: '1984-01-22', patientSex: 'female', partnerFirstName: 'Mark', partnerLastName: 'Clarke', partnerDateOfBirth: '1982-09-03', partnerSex: 'male', relationshipDuration: 9 };
	d.reproductiveHistory = { ...d.reproductiveHistory, durationTryingMonths: 18, priorPregnancies: 1, priorLiveBirths: 0, priorMiscarriages: 1, priorEctopic: 0, contraceptionStopped: 'yes' };
	d.menstrualCycle = { ...d.menstrualCycle, menarcheAge: 14, cycleLengthDays: 26, cycleRegularity: 'regular', periodDurationDays: 4, heavyBleeding: 'no', dysmenorrhoea: 'no' };
	d.lifestyleFactors = { ...d.lifestyleFactors, weight: 62, height: 170, bmi: 21.5, tobaccoStatus: 'former', alcoholLevel: 'low', caffeineLevel: 'moderate', recreationalDrugs: 'no', exerciseFrequency: 'moderate' };
	d.medicationsSupplements = { ...d.medicationsSupplements, folicAcid: 'yes', folicAcidDoseMcg: 400, vitaminD: 'yes' };
	d.partnerSemen = { ...d.partnerSemen, partnerAgeYears: 43, partnerSmoking: 'never', partnerAlcohol: 'low', semenAnalysisDone: 'yes', semenAnalysisDate: '2026-04-28', semenVolumeMl: 3.2, semenConcentrationMillionPerMl: 55, semenTotalMotilityPercent: 48, semenProgressiveMotilityPercent: 35, semenNormalMorphologyPercent: 7 };
	d.hormoneProfile = { ...d.hormoneProfile, fsh: 11.2, lh: 6, amh: 4.0, tsh: 1.8, prolactin: 280, progesteroneDay21: 38 };
	d.investigations = { ...d.investigations, transvaginalUltrasound: 'yes-normal', antralFollicleCount: 5, hysterosalpingogramDone: 'yes', hysterosalpingogramResult: 'normal' };
	d.clinicalRecommendation = { ...d.clinicalRecommendation, clinicianName: 'Dr Okafor', assessmentDate: '2026-05-20', recommendation: 'art-referral', referralUrgency: 'urgent' };
	return d;
}

/** High concern: severe male factor on semen analysis. */
function highConcernMaleFactor(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, patientFirstName: 'Laura', patientLastName: 'Davies', patientDateOfBirth: '1992-07-08', patientSex: 'female', partnerFirstName: 'Owen', partnerLastName: 'Davies', partnerDateOfBirth: '1990-12-01', partnerSex: 'male', relationshipDuration: 5 };
	d.reproductiveHistory = { ...d.reproductiveHistory, durationTryingMonths: 16, priorPregnancies: 0, priorLiveBirths: 0, priorMiscarriages: 0, contraceptionStopped: 'yes' };
	d.menstrualCycle = { ...d.menstrualCycle, menarcheAge: 12, cycleLengthDays: 30, cycleRegularity: 'regular', periodDurationDays: 5, heavyBleeding: 'no', dysmenorrhoea: 'no' };
	d.lifestyleFactors = { ...d.lifestyleFactors, weight: 60, height: 164, bmi: 22.3, tobaccoStatus: 'never', alcoholLevel: 'none', caffeineLevel: 'low', recreationalDrugs: 'no', exerciseFrequency: 'high' };
	d.medicationsSupplements = { ...d.medicationsSupplements, folicAcid: 'yes', folicAcidDoseMcg: 400, vitaminD: 'yes' };
	d.partnerSemen = { ...d.partnerSemen, partnerAgeYears: 35, partnerSmoking: 'current', partnerAlcohol: 'moderate', semenAnalysisDone: 'yes', semenAnalysisDate: '2026-05-12', semenVolumeMl: 1.8, semenConcentrationMillionPerMl: 3, semenTotalMotilityPercent: 28, semenProgressiveMotilityPercent: 18, semenNormalMorphologyPercent: 2 };
	d.hormoneProfile = { ...d.hormoneProfile, fsh: 5.8, lh: 5, amh: 22, tsh: 1.6, prolactin: 290, progesteroneDay21: 42 };
	d.investigations = { ...d.investigations, transvaginalUltrasound: 'yes-normal', antralFollicleCount: 16 };
	d.clinicalRecommendation = { ...d.clinicalRecommendation, clinicianName: 'Dr Okafor', assessmentDate: '2026-05-22', recommendation: 'specialist-referral', referralUrgency: 'soon' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'FA-2026-0001', patientName: 'Adams, Emma', assessedDate: '2026-05-02', data: lowConcern() },
	{ id: 'FA-2026-0002', patientName: 'Brennan, Sophie', assessedDate: '2026-05-18', data: moderateConcern() },
	{ id: 'FA-2026-0003', patientName: 'Clarke, Rachel', assessedDate: '2026-05-20', data: highConcernAge() },
	{ id: 'FA-2026-0004', patientName: 'Davies, Laura', assessedDate: '2026-05-22', data: highConcernMaleFactor() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateConcern(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		concernLevel: g.concernLevel,
		concernScore: g.concernScore,
		semenAnalysisDone: s.data.partnerSemen.semenAnalysisDone === 'yes',
		recommendation: s.data.clinicalRecommendation.recommendation,
		flagCount: g.additionalFlags.length
	};
});
