import { describe, it, expect } from 'vitest';
import { calculateKdigo } from './kdigo-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { kdigoRules } from './kdigo-rules';
import { classifyGfrCategory, classifyAlbuminuriaCategory } from './utils';
import type { AssessmentData } from './types';

// A blank assessment, built inline so the engine tests do not depend on the
// SvelteKit store (which imports `$app/environment`, unavailable under Vitest).
function patient(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', ethnicity: '', age: null, weight: null, height: null, bmi: null },
		presentingSymptoms: { fatigue: '', edema: '', foamyUrine: '', nocturia: '', hematuria: '', flankPain: '', reducedUrineOutput: '', pruritus: '', nauseaVomiting: '', appetiteLoss: '', dyspnea: '', confusion: '', symptomDuration: '', otherSymptoms: '' },
		ckdRiskFactors: { hypertension: '', diabetes: '', diabetesType: '', cardiovascularDisease: '', familyHistoryCkd: '', familyHistoryPolycysticKidney: '', priorAki: '', kidneyStones: '', recurrentUti: '', autoimmuneDisease: '', autoimmuneDetails: '', nephrotoxicDrugs: '', nephrotoxicDrugDetails: '', nsaidUse: '', smoking: '', obesity: '' },
		physicalExamination: { systolicBp: null, diastolicBp: null, heartRate: null, peripheralEdema: '', pulmonaryEdema: '', jvdElevated: '', pallor: '', uremicSkin: '', flankTenderness: '', palpableKidneys: '', bladderDistension: '', examNotes: '' },
		bloodTests: { serumCreatinine: null, egfr: null, bun: null, sodium: null, potassium: null, chloride: null, bicarbonate: null, calcium: null, phosphate: null, magnesium: null, albumin: null, hemoglobin: null, hba1c: null, pth: null, vitaminD: null, testDate: '' },
		urineTests: { acr: null, pcr: null, dipstickProtein: '', dipstickBlood: '', dipstickGlucose: '', dipstickLeukocytes: '', dipstickNitrites: '', microscopyCasts: '', castType: '', testDate: '' },
		imagingBiopsy: { renalUltrasoundDone: '', ultrasoundFindings: '', rightKidneyLengthMm: null, leftKidneyLengthMm: null, cysts: '', hydronephrosis: '', stones: '', ctOrMri: '', ctMriFindings: '', biopsyDone: '', biopsyResult: '', biopsyDate: '' },
		medicationReview: { currentMedications: [], aceiArb: '', sglt2Inhibitor: '', diuretic: '', statin: '', phosphateBinder: '', erythropoietinAgent: '', doseAdjustmentsNeeded: '', doseAdjustmentDetails: '', contrastImagingPlanned: '', medicationNotes: '' },
		clinicalImpression: { gfrCategory: '', albuminuriaCategory: '', suspectedEtiology: '', aksuperimposedOnCkd: '', nephrologyReferral: '', referralUrgency: '', dialysisDiscussionNeeded: '', transplantCandidate: '', managementPlan: '', followUpInterval: '', clinicianNotes: '' }
	};
}

describe('KDIGO classification helpers', () => {
	it('maps eGFR to the correct GFR category', () => {
		expect(classifyGfrCategory(95)).toBe('G1');
		expect(classifyGfrCategory(75)).toBe('G2');
		expect(classifyGfrCategory(50)).toBe('G3a');
		expect(classifyGfrCategory(35)).toBe('G3b');
		expect(classifyGfrCategory(20)).toBe('G4');
		expect(classifyGfrCategory(10)).toBe('G5');
		expect(classifyGfrCategory(null)).toBe('');
	});

	it('maps ACR to the correct albuminuria category', () => {
		expect(classifyAlbuminuriaCategory(1)).toBe('A1');
		expect(classifyAlbuminuriaCategory(15)).toBe('A2');
		expect(classifyAlbuminuriaCategory(50)).toBe('A3');
		expect(classifyAlbuminuriaCategory(null)).toBe('');
	});
});

describe('KDIGO grading engine', () => {
	it('returns unknown risk when staging inputs are missing', () => {
		const d = patient();
		const r = calculateKdigo(d);
		expect(r.riskLevel).toBe('unknown');
		expect(r.gfrCategory).toBe('');
		expect(r.albuminuriaCategory).toBe('');
	});

	it('returns low risk for G1/A1 (normal eGFR, normal ACR)', () => {
		const d = patient();
		d.bloodTests.egfr = 95;
		d.urineTests.acr = 1.0;
		const r = calculateKdigo(d);
		expect(r.gfrCategory).toBe('G1');
		expect(r.albuminuriaCategory).toBe('A1');
		expect(r.riskLevel).toBe('low');
		expect(r.firedRules.length).toBe(3);
	});

	it('returns moderate risk for G3a/A1', () => {
		const d = patient();
		d.bloodTests.egfr = 50;
		d.urineTests.acr = 1.0;
		const r = calculateKdigo(d);
		expect(r.gfrCategory).toBe('G3a');
		expect(r.riskLevel).toBe('moderate');
	});

	it('returns high risk for G3b/A1', () => {
		const d = patient();
		d.bloodTests.egfr = 35;
		d.urineTests.acr = 1.0;
		const r = calculateKdigo(d);
		expect(r.gfrCategory).toBe('G3b');
		expect(r.albuminuriaCategory).toBe('A1');
		expect(r.riskLevel).toBe('high');
	});

	it('returns very-high risk for G3b/A2', () => {
		const d = patient();
		d.bloodTests.egfr = 35;
		d.urineTests.acr = 18;
		const r = calculateKdigo(d);
		expect(r.gfrCategory).toBe('G3b');
		expect(r.albuminuriaCategory).toBe('A2');
		expect(r.riskLevel).toBe('very-high');
	});

	it('returns very-high risk for G5/A3', () => {
		const d = patient();
		d.bloodTests.egfr = 10;
		d.urineTests.acr = 120;
		const r = calculateKdigo(d);
		expect(r.gfrCategory).toBe('G5');
		expect(r.albuminuriaCategory).toBe('A3');
		expect(r.riskLevel).toBe('very-high');
	});

	it('estimates eGFR from creatinine + age + sex when no eGFR entered', () => {
		const d = patient();
		d.demographics.dateOfBirth = '1960-01-01';
		d.demographics.sex = 'male';
		d.bloodTests.serumCreatinine = 1.0;
		d.urineTests.acr = 1.0;
		const r = calculateKdigo(d);
		expect(r.egfr).not.toBeNull();
		expect(r.gfrCategory).not.toBe('');
	});

	it('honours clinician-entered category overrides', () => {
		const d = patient();
		d.clinicalImpression.gfrCategory = 'G4';
		d.clinicalImpression.albuminuriaCategory = 'A3';
		const r = calculateKdigo(d);
		expect(r.gfrCategory).toBe('G4');
		expect(r.albuminuriaCategory).toBe('A3');
		expect(r.riskLevel).toBe('very-high');
	});

	it('has unique rule IDs', () => {
		const ids = kdigoRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Renal flagged-issue detection', () => {
	it('returns no flags for a blank assessment', () => {
		expect(detectAdditionalFlags(patient())).toHaveLength(0);
	});

	it('flags severe hyperkalemia as urgent', () => {
		const d = patient();
		d.bloodTests.potassium = 6.8;
		const flags = detectAdditionalFlags(d);
		const f = flags.find((x) => x.id === 'FLAG-K-001');
		expect(f).toBeDefined();
		expect(f?.priority).toBe('urgent');
	});

	it('flags kidney failure (eGFR < 15) as urgent', () => {
		const d = patient();
		d.bloodTests.egfr = 10;
		const flags = detectAdditionalFlags(d);
		expect(flags.some((x) => x.id === 'FLAG-EGFR-001')).toBe(true);
	});

	it('flags AKI superimposed on CKD', () => {
		const d = patient();
		d.clinicalImpression.aksuperimposedOnCkd = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((x) => x.id === 'FLAG-AKI-001')).toBe(true);
	});

	it('flags nephrotoxic drug exposure', () => {
		const d = patient();
		d.ckdRiskFactors.nephrotoxicDrugs = 'yes';
		d.ckdRiskFactors.nephrotoxicDrugDetails = 'Gentamicin';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((x) => x.id === 'FLAG-NEPH-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = patient();
		d.bloodTests.potassium = 6.8; // urgent
		d.ckdRiskFactors.hypertension = 'yes'; // low
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
