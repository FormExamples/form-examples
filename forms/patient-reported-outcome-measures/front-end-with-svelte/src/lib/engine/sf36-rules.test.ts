import { describe, expect, it } from 'vitest';
import { computeSf36 } from './sf36-rules';
import type { Sf36Response } from './types';

// Worked-example assertions mirroring the ones used to verify the
// vanilla-JS engine (../../../front-end-with-html/js/sf36-rules.js):
// all-best-answers -> every domain = 100, all-worst-answers -> every
// domain = 0.

/** Every item answered at its own best-health raw value. */
const allBest: Sf36Response = {
	generalHealth: 1, // lowIsBest
	healthChangeVsYearAgo: 1, // not scored into any domain
	vigorousActivities: 3,
	moderateActivities: 3,
	liftingCarryingGroceries: 3,
	climbingSeveralFlights: 3,
	climbingOneFlight: 3,
	bendingKneelingStooping: 3,
	walkingMoreThanMile: 3,
	walkingSeveralHundredYards: 3,
	walkingOneHundredYards: 3,
	bathingDressing: 3,
	cutDownTimePhysical: 5,
	accomplishedLessPhysical: 5,
	limitedInKindPhysical: 5,
	difficultyPerformingPhysical: 5,
	cutDownTimeEmotional: 5,
	accomplishedLessEmotional: 5,
	lessCarefulThanUsual: 5,
	socialActivitiesInterference: 1,
	bodilyPain: 1,
	painInterferenceWithWork: 1,
	feltFullOfLife: 1,
	veryNervous: 5,
	soDownInDumps: 5,
	feltCalmPeaceful: 1,
	lotOfEnergy: 1,
	downheartedDepressed: 5,
	feltWornOut: 5,
	beenHappy: 1,
	feltTired: 5,
	socialActivitiesInterferenceTime: 5,
	getSickEasier: 5,
	asHealthyAsAnybody: 1,
	expectHealthWorse: 5,
	healthExcellent: 1
};

/** Every item answered at its own worst-health raw value. */
const allWorst: Sf36Response = {
	generalHealth: 5,
	healthChangeVsYearAgo: 5,
	vigorousActivities: 1,
	moderateActivities: 1,
	liftingCarryingGroceries: 1,
	climbingSeveralFlights: 1,
	climbingOneFlight: 1,
	bendingKneelingStooping: 1,
	walkingMoreThanMile: 1,
	walkingSeveralHundredYards: 1,
	walkingOneHundredYards: 1,
	bathingDressing: 1,
	cutDownTimePhysical: 1,
	accomplishedLessPhysical: 1,
	limitedInKindPhysical: 1,
	difficultyPerformingPhysical: 1,
	cutDownTimeEmotional: 1,
	accomplishedLessEmotional: 1,
	lessCarefulThanUsual: 1,
	socialActivitiesInterference: 5,
	bodilyPain: 6,
	painInterferenceWithWork: 5,
	feltFullOfLife: 5,
	veryNervous: 1,
	soDownInDumps: 1,
	feltCalmPeaceful: 5,
	lotOfEnergy: 5,
	downheartedDepressed: 1,
	feltWornOut: 1,
	beenHappy: 5,
	feltTired: 1,
	socialActivitiesInterferenceTime: 1,
	getSickEasier: 1,
	asHealthyAsAnybody: 5,
	expectHealthWorse: 1,
	healthExcellent: 5
};

function emptySf36(): Sf36Response {
	return {
		generalHealth: null,
		healthChangeVsYearAgo: null,
		vigorousActivities: null,
		moderateActivities: null,
		liftingCarryingGroceries: null,
		climbingSeveralFlights: null,
		climbingOneFlight: null,
		bendingKneelingStooping: null,
		walkingMoreThanMile: null,
		walkingSeveralHundredYards: null,
		walkingOneHundredYards: null,
		bathingDressing: null,
		cutDownTimePhysical: null,
		accomplishedLessPhysical: null,
		limitedInKindPhysical: null,
		difficultyPerformingPhysical: null,
		cutDownTimeEmotional: null,
		accomplishedLessEmotional: null,
		lessCarefulThanUsual: null,
		socialActivitiesInterference: null,
		bodilyPain: null,
		painInterferenceWithWork: null,
		feltFullOfLife: null,
		veryNervous: null,
		soDownInDumps: null,
		feltCalmPeaceful: null,
		lotOfEnergy: null,
		downheartedDepressed: null,
		feltWornOut: null,
		beenHappy: null,
		feltTired: null,
		socialActivitiesInterferenceTime: null,
		getSickEasier: null,
		asHealthyAsAnybody: null,
		expectHealthWorse: null,
		healthExcellent: null
	};
}

describe('computeSf36', () => {
	it('scores every domain 100 when every item is answered at its best value', () => {
		const result = computeSf36(allBest);
		expect(result.pf).toBe(100);
		expect(result.rp).toBe(100);
		expect(result.bp).toBe(100);
		expect(result.gh).toBe(100);
		expect(result.vt).toBe(100);
		expect(result.sf).toBe(100);
		expect(result.re).toBe(100);
		expect(result.mh).toBe(100);
		expect(result.pcsApprox).toBe(100);
		expect(result.mcsApprox).toBe(100);
	});

	it('scores every domain 0 when every item is answered at its worst value', () => {
		const result = computeSf36(allWorst);
		expect(result.pf).toBe(0);
		expect(result.rp).toBe(0);
		expect(result.bp).toBe(0);
		expect(result.gh).toBe(0);
		expect(result.vt).toBe(0);
		expect(result.sf).toBe(0);
		expect(result.re).toBe(0);
		expect(result.mh).toBe(0);
		expect(result.pcsApprox).toBe(0);
		expect(result.mcsApprox).toBe(0);
	});

	it('returns null for every domain and summary when nothing is answered', () => {
		const result = computeSf36(emptySf36());
		expect(result.pf).toBeNull();
		expect(result.rp).toBeNull();
		expect(result.bp).toBeNull();
		expect(result.gh).toBeNull();
		expect(result.vt).toBeNull();
		expect(result.sf).toBeNull();
		expect(result.re).toBeNull();
		expect(result.mh).toBeNull();
		expect(result.pcsApprox).toBeNull();
		expect(result.mcsApprox).toBeNull();
	});

	it('averages only the answered items within a partially-answered domain (PF)', () => {
		const data = emptySf36();
		// PF has 10 items, all 1-3 highIsBest. Answer 2: one best (3 -> 100),
		// one worst (1 -> 0). Average should be 50.
		data.vigorousActivities = 3;
		data.moderateActivities = 1;
		const result = computeSf36(data);
		expect(result.pf).toBe(50);
		// Other domains remain null (no items answered).
		expect(result.rp).toBeNull();
		expect(result.pcsApprox).toBe(50); // mean of [pf=50] only (rp/bp/gh null)
		expect(result.mcsApprox).toBeNull();
	});

	it('computes bodily pain (1-6 lowIsBest) recoding correctly for a mid-scale value', () => {
		const data = emptySf36();
		// bodilyPain min=1 max=6 lowIsBest: raw=1 -> (6-1)/(6-1)*100 = 100 (best)
		// raw=6 -> (6-6)/5*100 = 0 (worst). Mid raw=3 -> (6-3)/5*100 = 60.
		data.bodilyPain = 3;
		const result = computeSf36(data);
		expect(result.bp).toBe(60);
	});
});
