import { describe, it, expect } from 'vitest';
import { gradeOttawaKnee } from './ottawa-knee-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { ottawaRules } from './ottawa-knee-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			assessedAt: '',
			careSetting: '',
			injuryMechanism: '',
			hoursSinceInjury: null
		},
		identification: { patientIdentifier: '', sex: '', injuredSide: '' },
		age: { ageYears: null },
		tenderness: { patellarTenderness: '', otherBonyTenderness: '', fibularHeadTenderness: '' },
		flexion: { unableToFlex90: '' },
		weightBearing: { unableToBearWeight: '' },
		note: { clinicalNotes: '' }
	};
}

/** A fully-answered, all-negative (all criteria absent) assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department',
		injuryMechanism: 'twisting',
		hoursSinceInjury: 3
	};
	d.identification = { patientIdentifier: 'ED-1001', sex: 'male', injuredSide: 'left' };
	d.age = { ageYears: 30 };
	d.tenderness = {
		patellarTenderness: 'no',
		otherBonyTenderness: 'no',
		fibularHeadTenderness: 'no'
	};
	d.flexion = { unableToFlex90: 'no' };
	d.weightBearing = { unableToBearWeight: 'no' };
	return d;
}

describe('Ottawa Knee Rule decision engine', () => {
	it('does not indicate X-ray for a fully-negative patient', () => {
		const r = gradeOttawaKnee(createNegativePatient());
		expect(r.xrayIndicated).toBe(false);
		expect(r.decision).toBe('xray-not-indicated');
		expect(r.ageCriterion).toBe(false);
		expect(r.isolatedPatellarCriterion).toBe(false);
	});

	it('age boundary: 54 does not fire, 55 fires', () => {
		const d54 = createNegativePatient();
		d54.age.ageYears = 54;
		const r54 = gradeOttawaKnee(d54);
		expect(r54.ageCriterion).toBe(false);
		expect(r54.xrayIndicated).toBe(false);

		const d55 = createNegativePatient();
		d55.age.ageYears = 55;
		const r55 = gradeOttawaKnee(d55);
		expect(r55.ageCriterion).toBe(true);
		expect(r55.xrayIndicated).toBe(true);
		expect(r55.decision).toBe('xray-indicated');
	});

	it('fibular head tenderness alone indicates X-ray', () => {
		const d = createNegativePatient();
		d.tenderness.fibularHeadTenderness = 'yes';
		const r = gradeOttawaKnee(d);
		expect(r.fibularHeadCriterion).toBe(true);
		expect(r.xrayIndicated).toBe(true);
	});

	it('inability to flex to 90 degrees alone indicates X-ray', () => {
		const d = createNegativePatient();
		d.flexion.unableToFlex90 = 'yes';
		expect(gradeOttawaKnee(d).flexionCriterion).toBe(true);
		expect(gradeOttawaKnee(d).xrayIndicated).toBe(true);
	});

	it('inability to bear weight alone indicates X-ray', () => {
		const d = createNegativePatient();
		d.weightBearing.unableToBearWeight = 'yes';
		expect(gradeOttawaKnee(d).weightBearingCriterion).toBe(true);
		expect(gradeOttawaKnee(d).xrayIndicated).toBe(true);
	});

	it('isolated patellar tenderness fires only when there is no other bony tenderness', () => {
		// Patellar tenderness WITH other bony tenderness → NOT isolated → does not fire.
		const dNotIsolated = createNegativePatient();
		dNotIsolated.tenderness.patellarTenderness = 'yes';
		dNotIsolated.tenderness.otherBonyTenderness = 'yes';
		const rNot = gradeOttawaKnee(dNotIsolated);
		expect(rNot.isolatedPatellarCriterion).toBe(false);
		expect(rNot.xrayIndicated).toBe(false);

		// Patellar tenderness with NO other bony tenderness → isolated → fires.
		const dIsolated = createNegativePatient();
		dIsolated.tenderness.patellarTenderness = 'yes';
		dIsolated.tenderness.otherBonyTenderness = 'no';
		const rYes = gradeOttawaKnee(dIsolated);
		expect(rYes.isolatedPatellarCriterion).toBe(true);
		expect(rYes.xrayIndicated).toBe(true);
	});

	it('ANY-of: a single criterion produces the same decision as several', () => {
		const dOne = createNegativePatient();
		dOne.age.ageYears = 70;
		const dMany = createNegativePatient();
		dMany.age.ageYears = 70;
		dMany.tenderness.fibularHeadTenderness = 'yes';
		dMany.weightBearing.unableToBearWeight = 'yes';
		expect(gradeOttawaKnee(dOne).decision).toBe('xray-indicated');
		expect(gradeOttawaKnee(dMany).decision).toBe('xray-indicated');
	});

	it('a blank criterion does not fire (missing input treated as absent)', () => {
		const d = createDefaultAssessment();
		const r = gradeOttawaKnee(d);
		expect(r.xrayIndicated).toBe(false);
		expect(r.decision).toBe('xray-not-indicated');
	});

	it('all rule IDs are unique', () => {
		const ids = ottawaRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Ottawa Knee Rule flagged-issue detection', () => {
	it('raises the X-ray-indicated flag when a criterion fires', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), true);
		expect(flags.some((f) => f.id === 'F-XRAY-INDICATED-001')).toBe(true);
	});

	it('does not raise the X-ray-indicated flag when no criterion fires', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), false);
		expect(flags.some((f) => f.id === 'F-XRAY-INDICATED-001')).toBe(false);
	});

	it('raises unable-to-bear-weight and other-bony-tenderness flags', () => {
		const d = createNegativePatient();
		d.weightBearing.unableToBearWeight = 'yes';
		d.tenderness.otherBonyTenderness = 'yes';
		const flags = detectFlaggedIssues(d, true);
		expect(flags.some((f) => f.id === 'F-UNABLE-TO-BEAR-WEIGHT-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-OTHER-BONY-TENDERNESS-001')).toBe(true);
	});

	it('raises an applicability caution when time since injury is missing', () => {
		const d = createNegativePatient();
		d.context.hoursSinceInjury = null;
		const flags = detectFlaggedIssues(d, false);
		expect(flags.some((f) => f.id === 'F-APPLICABILITY-001')).toBe(true);
	});

	it('raises an applicability caution when the injury is not acute (> 168 h)', () => {
		const d = createNegativePatient();
		d.context.hoursSinceInjury = 200;
		const flags = detectFlaggedIssues(d, false);
		expect(flags.some((f) => f.id === 'F-APPLICABILITY-002')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a criterion input is missing', () => {
		const flags = detectFlaggedIssues(createDefaultAssessment(), false);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.weightBearing.unableToBearWeight = 'yes'; // high
		d.tenderness.otherBonyTenderness = 'yes'; // medium
		const flags = detectFlaggedIssues(d, true); // high (xray) + high (weight) + medium
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
