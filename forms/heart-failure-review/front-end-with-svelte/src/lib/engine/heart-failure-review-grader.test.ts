import { describe, it, expect } from 'vitest';
import {
	deriveFunctionalStatus,
	deriveMedicationOptimisation,
	gradeReview
} from './heart-failure-review-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { reviewDomainRules } from './heart-failure-review-rules';
import type { AssessmentData } from './types';

/**
 * A blank review (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			reviewDate: '',
			careSetting: '',
			reviewType: '',
			lastReviewDate: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		diagnosis: {
			yearOfDiagnosis: null,
			heartFailureType: '',
			latestLvef: null,
			lastEchoDate: '',
			aetiology: ''
		},
		functional: {
			nyhaClass: null,
			breathlessness: '',
			orthopnoea: '',
			paroxysmalNocturnalDyspnoea: '',
			fatigue: '',
			changeSinceLastReview: '',
			decompensation: ''
		},
		fluid: {
			weightKg: null,
			weightChangeKg: null,
			peripheralOedema: '',
			raisedJvp: '',
			lungCrackles: '',
			systolicBloodPressure: null,
			diastolicBloodPressure: null,
			heartRate: null,
			heartRhythm: ''
		},
		investigations: {
			ntProBnp: null,
			sodium: null,
			potassium: null,
			urea: null,
			creatinine: null,
			egfr: null,
			haemoglobin: null,
			ferritin: null,
			transferrinSaturation: null,
			hba1c: null,
			bloodsDate: ''
		},
		medication: {
			raasInhibitorStatus: '',
			raasInhibitorAgent: '',
			raasInhibitorDose: '',
			raasInhibitorAtTargetDose: '',
			raasInhibitorAdherence: '',
			betaBlockerStatus: '',
			betaBlockerAgent: '',
			betaBlockerDose: '',
			betaBlockerAtTargetDose: '',
			betaBlockerAdherence: '',
			mraStatus: '',
			mraAgent: '',
			mraDose: '',
			mraAtTargetDose: '',
			mraAdherence: '',
			sglt2InhibitorStatus: '',
			sglt2InhibitorAgent: '',
			sglt2InhibitorDose: '',
			sglt2InhibitorAtTargetDose: '',
			sglt2InhibitorAdherence: '',
			loopDiureticAgent: '',
			loopDiureticDose: '',
			otherMedications: ''
		},
		devices: { icd: '', crt: '', pacemaker: '', deviceCheckStatus: '' },
		vaccinations: {
			influenzaVaccination: '',
			pneumococcalVaccination: '',
			covidVaccination: '',
			smokingStatus: '',
			alcoholStatus: '',
			dailyWeights: '',
			selfManagementPlan: '',
			cardiacRehab: ''
		},
		summary: { reviewContext: '' }
	};
}

/** A fully documented HFrEF review with all four pillars prescribed. */
function createOptimisedHfref(): AssessmentData {
	const d = createDefaultAssessment();
	d.diagnosis.heartFailureType = 'reduced';
	d.functional.nyhaClass = 2;
	d.fluid.weightKg = 78;
	d.investigations.potassium = 4.4;
	d.investigations.egfr = 62;
	d.investigations.bloodsDate = '2026-06-01';
	d.medication.raasInhibitorStatus = 'prescribed';
	d.medication.betaBlockerStatus = 'prescribed';
	d.medication.mraStatus = 'prescribed';
	d.medication.sglt2InhibitorStatus = 'prescribed';
	d.vaccinations.influenzaVaccination = 'yes';
	d.vaccinations.selfManagementPlan = 'yes';
	return d;
}

describe('NYHA functional status', () => {
	it('is unknown when no NYHA class is recorded', () => {
		expect(deriveFunctionalStatus(createDefaultAssessment())).toBe('unknown');
	});
	it('maps NYHA I–II to stable', () => {
		const d = createDefaultAssessment();
		d.functional.nyhaClass = 1;
		expect(deriveFunctionalStatus(d)).toBe('stable');
		d.functional.nyhaClass = 2;
		expect(deriveFunctionalStatus(d)).toBe('stable');
	});
	it('maps NYHA III to symptomatic', () => {
		const d = createDefaultAssessment();
		d.functional.nyhaClass = 3;
		expect(deriveFunctionalStatus(d)).toBe('symptomatic');
	});
	it('maps NYHA IV to advanced', () => {
		const d = createDefaultAssessment();
		d.functional.nyhaClass = 4;
		expect(deriveFunctionalStatus(d)).toBe('advanced');
	});
});

describe('HFrEF four-pillar medication optimisation', () => {
	it('indicates all four pillars for HFrEF', () => {
		const d = createDefaultAssessment();
		d.diagnosis.heartFailureType = 'reduced';
		expect(deriveMedicationOptimisation(d).indicatedPillars).toBe(4);
	});

	it('grades optimised when all four indicated pillars are prescribed', () => {
		const o = deriveMedicationOptimisation(createOptimisedHfref());
		expect(o.status).toBe('optimised');
		expect(o.prescribedPillars).toBe(4);
		expect(o.missingPillars).toHaveLength(0);
	});

	it('counts a contraindicated pillar as addressed (still optimised)', () => {
		const d = createOptimisedHfref();
		d.medication.mraStatus = 'contraindicated';
		const o = deriveMedicationOptimisation(d);
		expect(o.status).toBe('optimised');
		expect(o.prescribedPillars).toBe(3);
		expect(o.missingPillars).toHaveLength(0);
	});

	it('grades partial when some but not all indicated pillars are prescribed', () => {
		const d = createOptimisedHfref();
		d.medication.mraStatus = 'not-prescribed';
		d.medication.sglt2InhibitorStatus = 'not-prescribed';
		const o = deriveMedicationOptimisation(d);
		expect(o.status).toBe('partial');
		expect(o.prescribedPillars).toBe(2);
		expect(o.missingPillars).toEqual(['mra', 'sglt2Inhibitor']);
	});

	it('grades suboptimal when no indicated pillar is prescribed', () => {
		const d = createDefaultAssessment();
		d.diagnosis.heartFailureType = 'reduced';
		d.medication.raasInhibitorStatus = 'not-prescribed';
		d.medication.betaBlockerStatus = 'not-prescribed';
		d.medication.mraStatus = 'not-prescribed';
		d.medication.sglt2InhibitorStatus = 'not-prescribed';
		expect(deriveMedicationOptimisation(d).status).toBe('suboptimal');
	});

	it('indicates only the SGLT2 inhibitor for HFmrEF / HFpEF', () => {
		const d = createDefaultAssessment();
		d.diagnosis.heartFailureType = 'preserved';
		d.medication.sglt2InhibitorStatus = 'prescribed';
		const o = deriveMedicationOptimisation(d);
		expect(o.indicatedPillars).toBe(1);
		expect(o.status).toBe('optimised');
	});

	it('is not-applicable when heart-failure type is unknown', () => {
		const d = createDefaultAssessment();
		d.diagnosis.heartFailureType = 'unknown';
		expect(deriveMedicationOptimisation(d).status).toBe('not-applicable');
	});
});

describe('review completeness', () => {
	it('grades an empty record incomplete with 0%', () => {
		const r = gradeReview(createDefaultAssessment());
		expect(r.reviewStatus).toBe('incomplete');
		expect(r.completenessScore).toBe(0);
	});

	it('grades a fully documented record complete with 100%', () => {
		const r = gradeReview(createOptimisedHfref());
		expect(r.reviewStatus).toBe('complete');
		expect(r.completenessScore).toBe(100);
	});

	it('grades a partially documented record partial (4 of 6)', () => {
		const d = createOptimisedHfref();
		// Drop two domains: vaccinations + self-management → 4 of 6.
		d.vaccinations.influenzaVaccination = '';
		d.vaccinations.selfManagementPlan = '';
		const r = gradeReview(d);
		expect(r.reviewStatus).toBe('partial');
		expect(r.completenessScore).toBe(Math.round((100 * 4) / 6)); // 67
	});
});

describe('flagged issues', () => {
	it('raises no flags for a complete, optimised, stable HFrEF review', () => {
		const r = gradeReview(createOptimisedHfref());
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises the urgent-review flag for NYHA III', () => {
		const d = createOptimisedHfref();
		d.functional.nyhaClass = 3;
		const r = gradeReview(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-URGENT-REVIEW-001')).toBe(true);
	});

	it('raises a high optimisation-gap flag for HFrEF with >= 2 missing pillars', () => {
		const d = createOptimisedHfref();
		d.medication.mraStatus = 'not-prescribed';
		d.medication.sglt2InhibitorStatus = 'not-prescribed';
		const flags = detectFlaggedIssues(d, {
			medicationOptimisation: deriveMedicationOptimisation(d),
			reviewStatus: 'complete'
		});
		const gap = flags.find((f) => f.id === 'F-OPTIMISATION-GAP-001');
		expect(gap?.priority).toBe('high');
	});

	it('raises the hyperkalaemia flag above 5.5 mmol/L', () => {
		const d = createOptimisedHfref();
		d.investigations.potassium = 5.8;
		const r = gradeReview(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-HYPERKALAEMIA-001')).toBe(true);
	});

	it('raises the hypokalaemia flag below 3.5 mmol/L', () => {
		const d = createOptimisedHfref();
		d.investigations.potassium = 3.1;
		const r = gradeReview(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-HYPOKALAEMIA-001')).toBe(true);
	});

	it('raises the renal-impairment flag below eGFR 30', () => {
		const d = createOptimisedHfref();
		d.investigations.egfr = 24;
		const r = gradeReview(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-RENAL-IMPAIRMENT-001')).toBe(true);
	});

	it('raises the fluid-overload flag for weight gain >= 2 kg', () => {
		const d = createOptimisedHfref();
		d.fluid.weightChangeKg = 3;
		const r = gradeReview(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-FLUID-OVERLOAD-001')).toBe(true);
	});

	it('raises the missing-monitoring flag on RAAS/MRA without bloods', () => {
		const d = createDefaultAssessment();
		d.diagnosis.heartFailureType = 'reduced';
		d.medication.raasInhibitorStatus = 'prescribed';
		// no potassium / egfr / bloodsDate recorded
		const r = gradeReview(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-MISSING-MONITORING-001')).toBe(true);
	});

	it('raises the incomplete-review flag for a partial review', () => {
		const r = gradeReview(createDefaultAssessment());
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.diagnosis.heartFailureType = 'reduced';
		d.functional.nyhaClass = 4; // high
		d.medication.raasInhibitorStatus = 'not-prescribed'; // gap
		const r = gradeReview(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('all review-domain rule IDs are unique', () => {
		const ids = reviewDomainRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
