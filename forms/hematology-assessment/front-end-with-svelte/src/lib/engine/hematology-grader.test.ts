import { describe, it, expect } from 'vitest';
import { calculateAbnormality, gradeAssessment } from './hematology-grader';
import type { AssessmentData } from './types';

/** A blank assessment, built locally to avoid importing the `$app`-dependent store. */
function emptyData(): AssessmentData {
	return {
		patientInformation: {
			patientName: '',
			dateOfBirth: '',
			medicalRecordNumber: '',
			referringPhysician: '',
			clinicalIndication: '',
			specimenDate: '',
			specimenType: ''
		},
		bloodCountAnalysis: {
			hemoglobin: null,
			hematocrit: null,
			redBloodCellCount: null,
			whiteBloodCellCount: null,
			plateletCount: null,
			meanCorpuscularVolume: null,
			meanCorpuscularHemoglobin: null,
			redCellDistributionWidth: null
		},
		coagulationStudies: {
			prothrombinTime: null,
			inr: null,
			activatedPartialThromboplastinTime: null,
			fibrinogen: null,
			dDimer: null,
			bleedingTime: null
		},
		peripheralBloodFilm: {
			redCellMorphology: '',
			whiteBloodCellDifferential: '',
			plateletMorphology: '',
			abnormalCellMorphology: '',
			filmQuality: null,
			filmComments: ''
		},
		ironStudies: {
			serumIron: null,
			totalIronBindingCapacity: null,
			transferrinSaturation: null,
			serumFerritin: null,
			reticulocyteCount: null
		},
		hemoglobinopathyScreening: {
			hemoglobinElectrophoresis: '',
			sickleCellScreen: '',
			thalassemiaScreen: '',
			hplcResults: '',
			geneticTestingNotes: ''
		},
		boneMarrowAssessment: {
			aspirateFindings: '',
			biopsyFindings: '',
			cellularity: null,
			cytogeneticsResults: '',
			flowCytometryResults: '',
			boneMarrowComments: ''
		},
		transfusionHistory: {
			previousTransfusions: '',
			transfusionReactions: '',
			bloodGroupType: '',
			antibodyScreen: '',
			crossmatchResults: ''
		},
		treatmentMedications: {
			currentMedications: '',
			chemotherapyRegimen: '',
			anticoagulantTherapy: '',
			ironTherapy: '',
			treatmentResponse: '',
			adverseEffects: ''
		},
		clinicalReview: {
			clinicalSummary: '',
			diagnosis: '',
			followUpPlan: '',
			urgencyLevel: null,
			reviewerName: '',
			reviewDate: '',
			additionalNotes: ''
		}
	};
}

function withBloodCount(overrides: Partial<AssessmentData['bloodCountAnalysis']>): AssessmentData {
	const d = emptyData();
	d.bloodCountAnalysis = { ...d.bloodCountAnalysis, ...overrides };
	return d;
}

describe('calculateAbnormality', () => {
	it('returns draft when fewer than 3 numeric items are answered', () => {
		const d = withBloodCount({ hemoglobin: 14, hematocrit: 44 });
		const r = calculateAbnormality(d);
		expect(r.abnormalityLevel).toBe('draft');
		expect(r.abnormalityScore).toBe(0);
		expect(r.firedRules).toEqual([]);
	});

	it('classifies a fully normal panel as normal with score 0', () => {
		const d = withBloodCount({
			hemoglobin: 14,
			hematocrit: 44,
			whiteBloodCellCount: 7,
			plateletCount: 250,
			meanCorpuscularVolume: 90
		});
		const r = calculateAbnormality(d);
		expect(r.abnormalityScore).toBe(0);
		expect(r.abnormalityLevel).toBe('normal');
	});

	it('classifies a severely deranged panel as critical', () => {
		const d = withBloodCount({
			hemoglobin: 5,
			hematocrit: 18,
			whiteBloodCellCount: 0.8,
			plateletCount: 12,
			meanCorpuscularVolume: 105
		});
		const r = calculateAbnormality(d);
		expect(r.abnormalityScore).toBeGreaterThan(75);
		expect(r.abnormalityLevel).toBe('critical');
	});
});

describe('gradeAssessment', () => {
	it('returns a full grading result with flags and timestamp', () => {
		const d = withBloodCount({
			hemoglobin: 8,
			whiteBloodCellCount: 3,
			plateletCount: 90,
			meanCorpuscularVolume: 76,
			hematocrit: 27
		});
		const r = gradeAssessment(d);
		expect(r).toHaveProperty('abnormalityLevel');
		expect(r).toHaveProperty('abnormalityScore');
		expect(Array.isArray(r.firedRules)).toBe(true);
		expect(Array.isArray(r.additionalFlags)).toBe(true);
		expect(typeof r.timestamp).toBe('string');
	});

	it('raises a pancytopenia flag when all three cell lines are depressed', () => {
		const d = withBloodCount({
			hemoglobin: 8,
			whiteBloodCellCount: 2,
			plateletCount: 90,
			meanCorpuscularVolume: 88
		});
		const r = gradeAssessment(d);
		expect(r.additionalFlags.some((f) => f.id === 'FLAG-CBC-001')).toBe(true);
	});
});
