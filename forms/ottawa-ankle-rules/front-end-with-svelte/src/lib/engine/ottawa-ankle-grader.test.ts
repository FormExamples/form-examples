import { describe, it, expect } from 'vitest';
import { calculateOttawaDecision, gradeOttawaAnkleRules } from './ottawa-ankle-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { unableToBearWeight, ottawaRules } from './ottawa-ankle-rules';
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
			injuredSide: '',
			hoursSinceInjury: null
		},
		identification: { patientIdentifier: '', ageYears: null, sex: '' },
		applicability: { assessmentReliable: '' },
		painZones: { malleolarZonePain: '', midfootZonePain: '' },
		ankleTenderness: { lateralMalleolusTenderness: '', medialMalleolusTenderness: '' },
		footTenderness: { fifthMetatarsalBaseTenderness: '', navicularTenderness: '' },
		weightBearing: { ableToBearWeightImmediately: '', ableToBearWeightNow: '' },
		note: { clinicalNotes: '' }
	};
}

/** A fully-answered, all-negative (no X-ray indicated) adult assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'emergency-department',
		injuredSide: 'left',
		hoursSinceInjury: 2
	};
	d.identification = { patientIdentifier: 'ED-1001', ageYears: 34, sex: 'male' };
	d.applicability = { assessmentReliable: 'yes' };
	d.painZones = { malleolarZonePain: 'yes', midfootZonePain: 'yes' };
	d.ankleTenderness = { lateralMalleolusTenderness: 'no', medialMalleolusTenderness: 'no' };
	d.footTenderness = { fifthMetatarsalBaseTenderness: 'no', navicularTenderness: 'no' };
	d.weightBearing = { ableToBearWeightImmediately: 'yes', ableToBearWeightNow: 'yes' };
	return d;
}

describe('Ottawa Ankle / Foot decision engine', () => {
	it('indicates neither X-ray for a fully-negative patient', () => {
		const r = calculateOttawaDecision(createNegativePatient());
		expect(r.ankleXrayIndicated).toBe(false);
		expect(r.footXrayIndicated).toBe(false);
		expect(r.unableToBearWeight).toBe(false);
	});

	it('A1: lateral malleolus tenderness with malleolar-zone pain indicates an ankle X-ray only', () => {
		const d = createNegativePatient();
		d.ankleTenderness.lateralMalleolusTenderness = 'yes';
		const r = calculateOttawaDecision(d);
		expect(r.ankleXrayIndicated).toBe(true);
		expect(r.footXrayIndicated).toBe(false);
	});

	it('A2: medial malleolus tenderness with malleolar-zone pain indicates an ankle X-ray', () => {
		const d = createNegativePatient();
		d.ankleTenderness.medialMalleolusTenderness = 'yes';
		expect(calculateOttawaDecision(d).ankleXrayIndicated).toBe(true);
	});

	it('F1: fifth-metatarsal-base tenderness with midfoot-zone pain indicates a foot X-ray only', () => {
		const d = createNegativePatient();
		d.footTenderness.fifthMetatarsalBaseTenderness = 'yes';
		const r = calculateOttawaDecision(d);
		expect(r.footXrayIndicated).toBe(true);
		expect(r.ankleXrayIndicated).toBe(false);
	});

	it('F2: navicular tenderness with midfoot-zone pain indicates a foot X-ray', () => {
		const d = createNegativePatient();
		d.footTenderness.navicularTenderness = 'yes';
		expect(calculateOttawaDecision(d).footXrayIndicated).toBe(true);
	});

	it('zone-pain precondition gates each decision (tenderness without zone pain does nothing)', () => {
		const d = createNegativePatient();
		d.painZones.malleolarZonePain = 'no';
		d.painZones.midfootZonePain = 'no';
		d.ankleTenderness.lateralMalleolusTenderness = 'yes';
		d.footTenderness.navicularTenderness = 'yes';
		const r = calculateOttawaDecision(d);
		expect(r.ankleXrayIndicated).toBe(false);
		expect(r.footXrayIndicated).toBe(false);
	});

	it('unableToBearWeight is true only when unable both immediately and now', () => {
		const d = createNegativePatient();
		d.weightBearing = { ableToBearWeightImmediately: 'no', ableToBearWeightNow: 'yes' };
		expect(unableToBearWeight(d)).toBe(false);
		d.weightBearing = { ableToBearWeightImmediately: 'yes', ableToBearWeightNow: 'no' };
		expect(unableToBearWeight(d)).toBe(false);
		d.weightBearing = { ableToBearWeightImmediately: 'no', ableToBearWeightNow: 'no' };
		expect(unableToBearWeight(d)).toBe(true);
	});

	it('A3/F3: inability to bear weight drives BOTH decisions when both zone pains are present', () => {
		const d = createNegativePatient();
		d.weightBearing = { ableToBearWeightImmediately: 'no', ableToBearWeightNow: 'no' };
		const r = calculateOttawaDecision(d);
		expect(r.unableToBearWeight).toBe(true);
		expect(r.ankleXrayIndicated).toBe(true);
		expect(r.footXrayIndicated).toBe(true);
	});

	it('decision combinations: ankle only / foot only / both / neither', () => {
		// Ankle only.
		const ankle = createNegativePatient();
		ankle.painZones.midfootZonePain = 'no';
		ankle.ankleTenderness.lateralMalleolusTenderness = 'yes';
		let r = calculateOttawaDecision(ankle);
		expect([r.ankleXrayIndicated, r.footXrayIndicated]).toEqual([true, false]);

		// Foot only.
		const foot = createNegativePatient();
		foot.painZones.malleolarZonePain = 'no';
		foot.footTenderness.navicularTenderness = 'yes';
		r = calculateOttawaDecision(foot);
		expect([r.ankleXrayIndicated, r.footXrayIndicated]).toEqual([false, true]);

		// Both.
		const both = createNegativePatient();
		both.ankleTenderness.lateralMalleolusTenderness = 'yes';
		both.footTenderness.navicularTenderness = 'yes';
		r = calculateOttawaDecision(both);
		expect([r.ankleXrayIndicated, r.footXrayIndicated]).toEqual([true, true]);

		// Neither.
		r = calculateOttawaDecision(createNegativePatient());
		expect([r.ankleXrayIndicated, r.footXrayIndicated]).toEqual([false, false]);
	});

	it('collapses A3/F3 into a single both-region fired-criterion row', () => {
		const d = createNegativePatient();
		d.weightBearing = { ableToBearWeightImmediately: 'no', ableToBearWeightNow: 'no' };
		const g = gradeOttawaAnkleRules(d);
		const weightRows = g.firedCriteria.filter((c) => c.criterion === 'unable-to-bear-weight');
		expect(weightRows.length).toBe(1);
		expect(weightRows[0].region).toBe('both');
		expect(weightRows[0].id).toBe('A3/F3');
	});

	it('all rule IDs are unique', () => {
		const ids = ottawaRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Ottawa flagged-issue detection', () => {
	it('raises no high flags for a fully-negative complete patient', () => {
		const d = createNegativePatient();
		const flags = detectFlaggedIssues(d, calculateOttawaDecision(d));
		expect(flags.some((f) => f.priority === 'high')).toBe(false);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(false);
	});

	it('raises the ankle- and foot-indicated and unable-to-bear-weight flags', () => {
		const d = createNegativePatient();
		d.weightBearing = { ableToBearWeightImmediately: 'no', ableToBearWeightNow: 'no' };
		const flags = detectFlaggedIssues(d, calculateOttawaDecision(d));
		expect(flags.some((f) => f.id === 'F-ANKLE-XRAY-INDICATED-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-FOOT-XRAY-INDICATED-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-UNABLE-TO-BEAR-WEIGHT-001')).toBe(true);
	});

	it('raises the paediatric-age flag for a patient under 18', () => {
		const d = createNegativePatient();
		d.identification.ageYears = 12;
		const flags = detectFlaggedIssues(d, calculateOttawaDecision(d));
		expect(flags.some((f) => f.id === 'F-APPLICABILITY-AGE-001')).toBe(true);
	});

	it('raises the unreliable-assessment flag', () => {
		const d = createNegativePatient();
		d.applicability.assessmentReliable = 'no';
		const flags = detectFlaggedIssues(d, calculateOttawaDecision(d));
		expect(flags.some((f) => f.id === 'F-UNRELIABLE-ASSESSMENT-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when a criterion input is missing for a region with zone pain', () => {
		const d = createDefaultAssessment();
		d.painZones.malleolarZonePain = 'yes';
		const flags = detectFlaggedIssues(d, calculateOttawaDecision(d));
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.applicability.assessmentReliable = 'no'; // medium
		d.ankleTenderness.lateralMalleolusTenderness = 'yes'; // high (ankle indicated)
		const flags = detectFlaggedIssues(d, calculateOttawaDecision(d));
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
