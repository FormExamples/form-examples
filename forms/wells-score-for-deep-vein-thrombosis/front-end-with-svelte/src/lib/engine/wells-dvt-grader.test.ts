import { describe, it, expect } from 'vitest';
import { calculateWellsGrade } from './wells-dvt-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { wellsRules } from './wells-dvt-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', assessedAt: '', careSetting: '' },
		identification: { patientIdentifier: '', ageBand: '', sex: '', symptomaticLeg: '' },
		predisposing: {
			activeCancer: '',
			paralysisOrImmobilisation: '',
			recentlyBedriddenOrSurgery: '',
			previouslyDocumentedDvt: ''
		},
		examination: {
			localisedTenderness: '',
			entireLegSwollen: '',
			calfSwellingOver3cm: '',
			pittingOedema: '',
			collateralSuperficialVeins: ''
		},
		alternative: { alternativeDiagnosisAsLikely: '' },
		note: { clinicalNotes: '' }
	};
}

/** A fully-answered, all-negative (score 0) assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department'
	};
	d.identification = {
		patientIdentifier: 'ED-1001',
		ageBand: '40-64',
		sex: 'male',
		symptomaticLeg: 'left'
	};
	d.predisposing = {
		activeCancer: 'no',
		paralysisOrImmobilisation: 'no',
		recentlyBedriddenOrSurgery: 'no',
		previouslyDocumentedDvt: 'no'
	};
	d.examination = {
		localisedTenderness: 'no',
		entireLegSwollen: 'no',
		calfSwellingOver3cm: 'no',
		pittingOedema: 'no',
		collateralSuperficialVeins: 'no'
	};
	d.alternative = { alternativeDiagnosisAsLikely: 'no' };
	return d;
}

describe('Wells DVT grading engine', () => {
	it('scores 0 for a fully-negative patient (DVT unlikely, low)', () => {
		const r = calculateWellsGrade(createNegativePatient());
		expect(r.wellsScore).toBe(0);
		expect(r.twoLevelBand).toBe('unlikely');
		expect(r.threeLevelBand).toBe('low');
		expect(r.recommendedInvestigation).toBe('d-dimer');
	});

	it('two-level boundary: 1 is unlikely, 2 is likely', () => {
		const d1 = createNegativePatient();
		d1.predisposing.activeCancer = 'yes'; // +1
		const r1 = calculateWellsGrade(d1);
		expect(r1.wellsScore).toBe(1);
		expect(r1.twoLevelBand).toBe('unlikely');

		const d2 = createNegativePatient();
		d2.predisposing.activeCancer = 'yes'; // +1
		d2.examination.entireLegSwollen = 'yes'; // +1
		const r2 = calculateWellsGrade(d2);
		expect(r2.wellsScore).toBe(2);
		expect(r2.twoLevelBand).toBe('likely');
		expect(r2.recommendedInvestigation).toBe('proximal-leg-vein-ultrasound');
	});

	it('three-level boundaries: 0 low, 1-2 moderate, >=3 high', () => {
		const d0 = createNegativePatient();
		expect(calculateWellsGrade(d0).threeLevelBand).toBe('low');

		const d1 = createNegativePatient();
		d1.predisposing.activeCancer = 'yes';
		expect(calculateWellsGrade(d1).threeLevelBand).toBe('moderate');

		const d2 = createNegativePatient();
		d2.predisposing.activeCancer = 'yes';
		d2.examination.entireLegSwollen = 'yes';
		expect(calculateWellsGrade(d2).threeLevelBand).toBe('moderate');

		const d3 = createNegativePatient();
		d3.predisposing.activeCancer = 'yes';
		d3.examination.entireLegSwollen = 'yes';
		d3.examination.pittingOedema = 'yes';
		expect(calculateWellsGrade(d3).threeLevelBand).toBe('high');
	});

	it('the alternative-diagnosis adjustment subtracts 2 and can go negative', () => {
		const d = createNegativePatient();
		d.predisposing.activeCancer = 'yes'; // +1
		d.alternative.alternativeDiagnosisAsLikely = 'yes'; // -2
		const r = calculateWellsGrade(d);
		expect(r.wellsScore).toBe(-1);
		expect(r.criterionPoints['alternative-diagnosis-as-likely']).toBe(-2);
		expect(r.twoLevelBand).toBe('unlikely');
		expect(r.threeLevelBand).toBe('low');
	});

	it('scores the −2 minimum (all criteria negative, alternative likely)', () => {
		const d = createNegativePatient();
		d.alternative.alternativeDiagnosisAsLikely = 'yes';
		expect(calculateWellsGrade(d).wellsScore).toBe(-2);
	});

	it('scores the 9 maximum (all nine criteria positive, no adjustment)', () => {
		const d = createNegativePatient();
		d.predisposing = {
			activeCancer: 'yes',
			paralysisOrImmobilisation: 'yes',
			recentlyBedriddenOrSurgery: 'yes',
			previouslyDocumentedDvt: 'yes'
		};
		d.examination = {
			localisedTenderness: 'yes',
			entireLegSwollen: 'yes',
			calfSwellingOver3cm: 'yes',
			pittingOedema: 'yes',
			collateralSuperficialVeins: 'yes'
		};
		const r = calculateWellsGrade(d);
		expect(r.wellsScore).toBe(9);
		expect(r.twoLevelBand).toBe('likely');
		expect(r.threeLevelBand).toBe('high');
	});

	it('a blank criterion contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateWellsGrade(d);
		expect(r.wellsScore).toBe(0);
		expect(r.twoLevelBand).toBe('unlikely');
	});

	it('all rule IDs are unique', () => {
		const ids = wellsRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Wells DVT flagged-issue detection', () => {
	it('raises the DVT-unlikely flag for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags.some((f) => f.id === 'F-DVT-UNLIKELY-D-DIMER-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-DVT-LIKELY-ULTRASOUND-001')).toBe(false);
	});

	it('raises the DVT-likely flag when Wells >= 2', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 3);
		expect(flags.some((f) => f.id === 'F-DVT-LIKELY-ULTRASOUND-001')).toBe(true);
	});

	it('raises active-cancer and previous-DVT flags', () => {
		const d = createNegativePatient();
		d.predisposing.activeCancer = 'yes';
		d.predisposing.previouslyDocumentedDvt = 'yes';
		const flags = detectFlaggedIssues(d, 2);
		expect(flags.some((f) => f.id === 'F-ACTIVE-CANCER-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-PREVIOUS-DVT-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a criterion input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.predisposing.activeCancer = 'yes'; // high
		const flags = detectFlaggedIssues(d, 2); // high (dvt-likely) + high (cancer)
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
