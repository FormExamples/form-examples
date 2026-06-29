import { describe, it, expect } from 'vitest';
import { calculateGrades } from './endocrine-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { axisRules } from './endocrine-rules';
import type { AssessmentData } from './types';

/** A fully-blank assessment (mirrors `createDefaultAssessment`, but with no
 * `$app/environment` dependency so the engine tests run outside SvelteKit). */
function blank(): AssessmentData {
	return {
		demographics: { firstName: '', lastName: '', dateOfBirth: '', sex: '', weight: null, height: null, bmi: null, ethnicity: '' },
		presentingSymptoms: { fatigue: '', weightChange: '', weightChangeDirection: '', heatIntolerance: '', coldIntolerance: '', palpitations: '', tremor: '', sweating: '', polyuria: '', polydipsia: '', mood: '', skinChanges: '', hairChanges: '', symptomDuration: '', otherSymptoms: '' },
		thyroidAxis: { tsh: null, ft4: null, ft3: null, antibodiesPositive: '', goitre: '', familyHistoryThyroid: '', thyroidNotes: '' },
		adrenalAxis: { morningCortisol: null, acth: null, aldosterone: null, renin: null, hyperpigmentation: '', cushingoidFeatures: '', posturalHypotension: '', adrenalNotes: '' },
		glucoseMetabolism: { hba1c: null, fastingGlucose: null, randomGlucose: null, knownDiabetes: '', diabetesType: '', hypoglycaemiaEpisodes: '', glucoseNotes: '' },
		reproductiveAxis: { fsh: null, lh: null, testosterone: null, oestradiol: null, menstrualIrregularity: '', infertility: '', libidoChange: '', galactorrhoea: '', reproductiveNotes: '' },
		pituitaryFunction: { prolactin: null, igf1: null, growthHormone: null, headaches: '', visualDisturbance: '', acromegalicFeatures: '', pituitaryImagingDone: '', pituitaryImagingFindings: '', pituitaryNotes: '' },
		boneCalcium: { pth: null, vitaminD: null, calciumCorrected: null, phosphate: null, fragilityFracture: '', bonePain: '', dexaScanDone: '', dexaResult: '', boneNotes: '' },
		medicationsLifestyle: { currentMedications: [], steroidUse: '', steroidDetails: '', hormoneTherapy: '', hormoneTherapyDetails: '', smoking: '', alcoholUnits: '', exerciseLevel: '', dietPattern: '', familyHistoryEndocrine: '' },
		clinicalImpression: { workingDiagnosis: '', differentialDiagnoses: '', investigationsRequested: '', managementPlan: '', followUpPlan: '', referralRequired: '', referralSpecialty: '', clinicianNotes: '' }
	};
}

describe('Endocrinology grading engine', () => {
	it('returns normal overall status and no fired rules for a blank assessment', () => {
		const result = calculateGrades(blank());
		expect(result.overallStatus).toBe('normal');
		expect(result.firedRules).toHaveLength(0);
		expect(result.answeredCount).toBe(0);
		expect(result.axisGrades).toHaveLength(axisRules.length);
	});

	it('grades the thyroid axis severe for overtly elevated TSH', () => {
		const d = blank();
		d.thyroidAxis.tsh = 14;
		const result = calculateGrades(d);
		const thyroid = result.axisGrades.find((g) => g.axis === 'Thyroid');
		expect(thyroid?.status).toBe('severe');
		expect(result.overallStatus).toBe('severe');
	});

	it('grades glucose subclinical in the pre-diabetes HbA1c range', () => {
		const d = blank();
		d.glucoseMetabolism.hba1c = 44;
		const result = calculateGrades(d);
		const glucose = result.axisGrades.find((g) => g.axis === 'Glucose');
		expect(glucose?.status).toBe('subclinical');
	});

	it('takes the most severe status across multiple axes as the overall status', () => {
		const d = blank();
		d.glucoseMetabolism.hba1c = 44; // subclinical
		d.boneCalcium.vitaminD = 20; // moderate (deficient)
		const result = calculateGrades(d);
		expect(result.overallStatus).toBe('moderate');
	});

	it('promotes subclinical thyroid to mild when symptoms coexist', () => {
		const d = blank();
		d.thyroidAxis.antibodiesPositive = 'yes'; // subclinical on its own
		d.presentingSymptoms.tremor = 'yes';
		const result = calculateGrades(d);
		const thyroid = result.axisGrades.find((g) => g.axis === 'Thyroid');
		expect(thyroid?.status).toBe('mild');
	});

	it('all axis rule IDs are unique', () => {
		const ids = axisRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Endocrinology flagged-issue detection', () => {
	it('returns no flags for a blank assessment', () => {
		expect(detectAdditionalFlags(blank())).toHaveLength(0);
	});

	it('flags suspected adrenal insufficiency (urgent)', () => {
		const d = blank();
		d.adrenalAxis.morningCortisol = 60;
		const flags = detectAdditionalFlags(d);
		const flag = flags.find((f) => f.id === 'FLAG-ADR-001');
		expect(flag?.priority).toBe('urgent');
	});

	it('flags severe hypercalcaemia (urgent)', () => {
		const d = blank();
		d.boneCalcium.calciumCorrected = 3.2;
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-BON-001')).toBe(true);
	});

	it('flags visual disturbance for pituitary mass effect (urgent)', () => {
		const d = blank();
		d.pituitaryFunction.visualDisturbance = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-PIT-001')).toBe(true);
	});

	it('sorts flags by priority (urgent first)', () => {
		const d = blank();
		d.adrenalAxis.morningCortisol = 60; // urgent
		d.thyroidAxis.antibodiesPositive = 'yes'; // medium
		d.medicationsLifestyle.familyHistoryEndocrine = 'MEN1'; // low
		const flags = detectAdditionalFlags(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});
});
