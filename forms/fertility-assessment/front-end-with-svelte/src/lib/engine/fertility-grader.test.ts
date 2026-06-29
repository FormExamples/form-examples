import { describe, it, expect } from 'vitest';
import { calculateConcern, classifyConcernScore } from './fertility-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { fertilityRules } from './rules';
import type { AssessmentData } from './types';

/** A young couple with normal investigations: should score zero and raise no flags. */
function createHealthyPatient(): AssessmentData {
	return {
		demographics: {
			patientFirstName: 'Anna',
			patientLastName: 'Doe',
			patientDateOfBirth: '1996-05-15',
			patientSex: 'female',
			partnerFirstName: 'Ben',
			partnerLastName: 'Doe',
			partnerDateOfBirth: '1994-03-10',
			partnerSex: 'male',
			relationshipDuration: 5,
			ethnicity: ''
		},
		reproductiveHistory: {
			durationTryingMonths: 6,
			priorPregnancies: 0,
			priorLiveBirths: 0,
			priorMiscarriages: 0,
			priorEctopic: 0,
			priorTerminations: 0,
			priorFertilityTreatment: 'no',
			priorTreatmentDetails: '',
			contraceptionStopped: 'yes',
			contraceptionStoppedDate: '2025-01-01'
		},
		menstrualCycle: {
			menarcheAge: 13,
			cycleLengthDays: 28,
			cycleRegularity: 'regular',
			periodDurationDays: 5,
			heavyBleeding: 'no',
			dysmenorrhoea: 'no',
			intermenstrualBleeding: 'no',
			lastMenstrualPeriod: '2026-06-01',
			cycleNotes: ''
		},
		medicalSurgicalHistory: {
			pelvicInflammatoryDisease: 'no',
			endometriosis: 'no',
			polycysticOvarySyndrome: 'no',
			fibroids: 'no',
			thyroidDisorder: 'no',
			diabetes: 'no',
			cancerHistory: 'no',
			cancerTreatmentDetails: '',
			pelvicSurgery: 'no',
			pelvicSurgeryDetails: '',
			sexuallyTransmittedInfections: 'no',
			stiDetails: '',
			otherConditions: ''
		},
		lifestyleFactors: {
			weight: 65,
			height: 168,
			bmi: 23,
			tobaccoStatus: 'never',
			cigarettesPerDay: null,
			alcoholLevel: 'low',
			alcoholUnitsPerWeek: 4,
			caffeineLevel: 'low',
			recreationalDrugs: 'no',
			recreationalDrugDetails: '',
			exerciseFrequency: 'moderate',
			occupationalHazards: 'no',
			occupationalHazardDetails: ''
		},
		medicationsSupplements: {
			currentMedications: [],
			folicAcid: 'yes',
			folicAcidDoseMcg: 400,
			vitaminD: 'yes',
			otherSupplements: ''
		},
		partnerSemen: {
			partnerAgeYears: 32,
			partnerSmoking: 'never',
			partnerAlcohol: 'low',
			partnerOccupationalHazards: '',
			partnerMedicalHistory: '',
			semenAnalysisDone: 'yes',
			semenAnalysisDate: '2026-05-01',
			semenVolumeMl: 3,
			semenConcentrationMillionPerMl: 60,
			semenTotalMotilityPercent: 55,
			semenProgressiveMotilityPercent: 45,
			semenNormalMorphologyPercent: 8,
			semenNotes: ''
		},
		hormoneProfile: {
			fsh: 6,
			lh: 5,
			amh: 25,
			oestradiol: 200,
			tsh: 1.5,
			prolactin: 300,
			testosterone: 1.2,
			progesteroneDay21: 45,
			hormoneTestDate: '2026-05-01',
			hormoneNotes: ''
		},
		investigations: {
			transvaginalUltrasound: 'yes-normal',
			antralFollicleCount: 14,
			hysterosalpingogramDone: 'yes',
			hysterosalpingogramResult: 'normal',
			hysteroscopyDone: 'no',
			hysteroscopyResult: '',
			laparoscopyDone: 'no',
			laparoscopyResult: '',
			otherInvestigations: ''
		},
		clinicalRecommendation: {
			clinicianName: '',
			assessmentDate: '',
			recommendation: '',
			referralUrgency: '',
			additionalNotes: ''
		}
	};
}

describe('Fertility classifyConcernScore', () => {
	it('maps score bands to concern levels', () => {
		expect(classifyConcernScore(0)).toBe('low');
		expect(classifyConcernScore(2)).toBe('low');
		expect(classifyConcernScore(3)).toBe('moderate');
		expect(classifyConcernScore(6)).toBe('moderate');
		expect(classifyConcernScore(7)).toBe('high');
		expect(classifyConcernScore(20)).toBe('high');
	});
});

describe('Fertility Grading Engine', () => {
	it('returns low concern with no fired rules for a healthy young couple', () => {
		const data = createHealthyPatient();
		const result = calculateConcern(data);
		expect(result.concernLevel).toBe('low');
		expect(result.concernScore).toBe(0);
		expect(result.firedRules).toHaveLength(0);
	});

	it('returns moderate concern for irregular cycles plus PCOS', () => {
		const data = createHealthyPatient();
		data.menstrualCycle.cycleRegularity = 'irregular'; // +2
		data.medicalSurgicalHistory.polycysticOvarySyndrome = 'yes'; // +1
		const result = calculateConcern(data);
		expect(result.concernScore).toBe(3);
		expect(result.concernLevel).toBe('moderate');
	});

	it('returns high concern for advanced age plus low ovarian reserve', () => {
		const data = createHealthyPatient();
		data.demographics.patientDateOfBirth = '1983-01-01'; // >= 40 → +2 +2
		data.hormoneProfile.amh = 4.0; // < 5.4 → +3
		const result = calculateConcern(data);
		expect(result.concernScore).toBeGreaterThanOrEqual(7);
		expect(result.concernLevel).toBe('high');
	});

	it('fires the severe male-factor rule for very low concentration', () => {
		const data = createHealthyPatient();
		data.partnerSemen.semenConcentrationMillionPerMl = 3;
		const result = calculateConcern(data);
		expect(result.firedRules.some((r) => r.id === 'FERT-SEM-006')).toBe(true);
		expect(result.firedRules.some((r) => r.id === 'FERT-SEM-002')).toBe(true);
	});

	it('has unique rule IDs', () => {
		const ids = fertilityRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Fertility Flagged Issues Detection', () => {
	it('returns no flags for a healthy young couple', () => {
		const data = createHealthyPatient();
		const flags = detectAdditionalFlags(data);
		expect(flags).toHaveLength(0);
	});

	it('flags advanced maternal age as urgent', () => {
		const data = createHealthyPatient();
		data.demographics.patientDateOfBirth = '1983-01-01';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-AGE-001' && f.priority === 'urgent')).toBe(true);
	});

	it('flags missing semen analysis when not yet completed', () => {
		const data = createHealthyPatient();
		data.partnerSemen.semenAnalysisDone = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-SEM-000')).toBe(true);
	});

	it('flags missing pre-conception folic acid', () => {
		const data = createHealthyPatient();
		data.medicationsSupplements.folicAcid = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-SUPP-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const data = createHealthyPatient();
		data.demographics.patientDateOfBirth = '1983-01-01'; // urgent
		data.medicationsSupplements.folicAcid = 'no'; // low
		const flags = detectAdditionalFlags(data);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => order[f.priority]);
		const sorted = [...priorities].sort((a, b) => a - b);
		expect(priorities).toEqual(sorted);
	});
});
