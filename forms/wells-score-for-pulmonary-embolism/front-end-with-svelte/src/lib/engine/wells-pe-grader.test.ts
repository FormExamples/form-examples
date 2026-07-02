import { describe, it, expect } from 'vitest';
import { calculateWellsGrade } from './wells-pe-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { wellsRules } from './wells-pe-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', assessedAt: '', careSetting: '' },
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		haemodynamic: { haemodynamicStatus: '' },
		criteria: {
			dvtSigns: '',
			peMostLikely: '',
			immobilisationSurgery: '',
			previousDvtPe: '',
			haemoptysis: '',
			malignancy: ''
		},
		observations: { heartRate: null },
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
	d.identification = { patientIdentifier: 'ED-1001', ageBand: '40-64', sex: 'male' };
	d.haemodynamic = { haemodynamicStatus: 'stable' };
	d.criteria = {
		dvtSigns: 'no',
		peMostLikely: 'no',
		immobilisationSurgery: 'no',
		previousDvtPe: 'no',
		haemoptysis: 'no',
		malignancy: 'no'
	};
	d.observations = { heartRate: 80 };
	return d;
}

describe('Wells PE grading engine', () => {
	it('scores 0 for a fully-negative patient (PE unlikely, low)', () => {
		const r = calculateWellsGrade(createNegativePatient());
		expect(r.wellsScore).toBe(0);
		expect(r.twoLevelBand).toBe('unlikely');
		expect(r.threeLevelBand).toBe('low');
		expect(r.recommendedPathway).toBe('d-dimer');
	});

	it('awards each criterion its weight', () => {
		const d = createNegativePatient();
		d.criteria.dvtSigns = 'yes';
		expect(calculateWellsGrade(d).criterionPoints['dvt-signs']).toBe(3);

		const d2 = createNegativePatient();
		d2.criteria.peMostLikely = 'yes';
		expect(calculateWellsGrade(d2).criterionPoints['pe-most-likely']).toBe(3);

		const d3 = createNegativePatient();
		d3.criteria.immobilisationSurgery = 'yes';
		expect(calculateWellsGrade(d3).criterionPoints['immobilisation-surgery']).toBe(1.5);

		const d4 = createNegativePatient();
		d4.criteria.previousDvtPe = 'yes';
		expect(calculateWellsGrade(d4).criterionPoints['previous-dvt-pe']).toBe(1.5);

		const d5 = createNegativePatient();
		d5.criteria.haemoptysis = 'yes';
		expect(calculateWellsGrade(d5).criterionPoints['haemoptysis']).toBe(1);

		const d6 = createNegativePatient();
		d6.criteria.malignancy = 'yes';
		expect(calculateWellsGrade(d6).criterionPoints['malignancy']).toBe(1);
	});

	it('heart-rate criterion fires only above 100 (100 no, 101 yes)', () => {
		const d100 = createNegativePatient();
		d100.observations.heartRate = 100;
		expect(calculateWellsGrade(d100).criterionPoints['heart-rate-over-100']).toBe(0);

		const d101 = createNegativePatient();
		d101.observations.heartRate = 101;
		expect(calculateWellsGrade(d101).criterionPoints['heart-rate-over-100']).toBe(1.5);
	});

	it('two-level boundary: 4 is unlikely, 4.5 is likely', () => {
		// 3 (dvtSigns) + 1 (haemoptysis) = 4 → unlikely
		const d4 = createNegativePatient();
		d4.criteria.dvtSigns = 'yes';
		d4.criteria.haemoptysis = 'yes';
		const r4 = calculateWellsGrade(d4);
		expect(r4.wellsScore).toBe(4);
		expect(r4.twoLevelBand).toBe('unlikely');

		// 3 (dvtSigns) + 1.5 (immobilisation) = 4.5 → likely
		const d45 = createNegativePatient();
		d45.criteria.dvtSigns = 'yes';
		d45.criteria.immobilisationSurgery = 'yes';
		const r45 = calculateWellsGrade(d45);
		expect(r45.wellsScore).toBe(4.5);
		expect(r45.twoLevelBand).toBe('likely');
		expect(r45.recommendedPathway).toBe('ctpa');
	});

	it('three-level boundaries: <2 low, 2-6 moderate, >6 high', () => {
		// 1.5 → low
		const dLow = createNegativePatient();
		dLow.observations.heartRate = 110; // +1.5
		expect(calculateWellsGrade(dLow).threeLevelBand).toBe('low');

		// 2 → moderate
		const dMod = createNegativePatient();
		dMod.criteria.haemoptysis = 'yes'; // +1
		dMod.criteria.malignancy = 'yes'; // +1
		expect(calculateWellsGrade(dMod).threeLevelBand).toBe('moderate');

		// 6 → moderate
		const d6 = createNegativePatient();
		d6.criteria.dvtSigns = 'yes'; // +3
		d6.criteria.peMostLikely = 'yes'; // +3
		expect(calculateWellsGrade(d6).wellsScore).toBe(6);
		expect(calculateWellsGrade(d6).threeLevelBand).toBe('moderate');

		// 6.5 → high
		const d65 = createNegativePatient();
		d65.criteria.dvtSigns = 'yes'; // +3
		d65.criteria.immobilisationSurgery = 'yes'; // +1.5
		d65.criteria.haemoptysis = 'yes'; // +1
		d65.criteria.malignancy = 'yes'; // +1
		expect(calculateWellsGrade(d65).wellsScore).toBe(6.5);
		expect(calculateWellsGrade(d65).threeLevelBand).toBe('high');
	});

	it('scores the 12.5 maximum (all seven criteria positive)', () => {
		const d = createNegativePatient();
		d.criteria = {
			dvtSigns: 'yes',
			peMostLikely: 'yes',
			immobilisationSurgery: 'yes',
			previousDvtPe: 'yes',
			haemoptysis: 'yes',
			malignancy: 'yes'
		};
		d.observations.heartRate = 130;
		const r = calculateWellsGrade(d);
		expect(r.wellsScore).toBe(12.5);
		expect(r.twoLevelBand).toBe('likely');
		expect(r.threeLevelBand).toBe('high');
	});

	it('a blank criterion contributes 0 points', () => {
		const d = createDefaultAssessment();
		const r = calculateWellsGrade(d);
		expect(r.wellsScore).toBe(0);
		expect(r.twoLevelBand).toBe('unlikely');
	});

	it('a missing (null) heart rate contributes 0 points', () => {
		const d = createNegativePatient();
		d.observations.heartRate = null;
		expect(calculateWellsGrade(d).criterionPoints['heart-rate-over-100']).toBe(0);
	});

	it('all rule IDs are unique', () => {
		const ids = wellsRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Wells PE flagged-issue detection', () => {
	it('raises the PE-unlikely flag for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags.some((f) => f.id === 'F-PE-UNLIKELY-D-DIMER-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-PE-LIKELY-CTPA-001')).toBe(false);
	});

	it('raises the PE-likely flag when Wells > 4', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 4.5);
		expect(flags.some((f) => f.id === 'F-PE-LIKELY-CTPA-001')).toBe(true);
	});

	it('raises the haemodynamic-instability flag when unstable', () => {
		const d = createNegativePatient();
		d.haemodynamic.haemodynamicStatus = 'unstable';
		const flags = detectFlaggedIssues(d, 6);
		expect(flags.some((f) => f.id === 'F-HAEMODYNAMIC-INSTABILITY-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a criterion input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when heart rate is unmeasured', () => {
		const d = createNegativePatient();
		d.observations.heartRate = null;
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.haemodynamic.haemodynamicStatus = 'unstable'; // high
		const flags = detectFlaggedIssues(d, 6); // high (instability) + high (pe-likely)
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
