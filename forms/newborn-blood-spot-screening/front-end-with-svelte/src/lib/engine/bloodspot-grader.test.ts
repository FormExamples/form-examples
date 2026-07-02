import { describe, it, expect } from 'vitest';
import { gradeBloodspot } from './bloodspot-grader';
import { detectFlaggedIssues } from './flagged-issues';
import {
	CONDITIONS,
	deriveSampleQuality,
	normaliseConditionResults
} from './bloodspot-rules';
import type { BloodspotScreening } from './types';

/**
 * A blank screening record (mirrors the store's `createDefaultAssessment`).
 * Defined locally so the engine tests never import the store, which pulls in
 * the SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): BloodspotScreening {
	return {
		sampleTaker: { sampleTakerName: '', sampleTakerRole: '', careSetting: '', recordDate: '' },
		babyId: {
			nhsNumber: '',
			babyName: '',
			dateOfBirth: '',
			timeOfBirth: '',
			sex: '',
			gestationWeeks: null
		},
		eligibility: { previouslyScreened: '', consentGiven: '', declineReason: '' },
		sampleEvent: {
			sampleDate: '',
			sampleTime: '',
			ageAtSampleDays: null,
			samplingSite: '',
			sampleNotes: ''
		},
		sampleQuality: { sampleAdequacy: '', spotQualityIssue: '', isRepeat: '', repeatReason: '' },
		conditions: {
			scdResult: '',
			cfResult: '',
			chtResult: '',
			pkuResult: '',
			mcaddResult: '',
			msudResult: '',
			ivaResult: '',
			ga1Result: '',
			hcuResult: ''
		},
		summary: { clinicalContext: '' }
	};
}

/** All nine conditions not-suspected, with an adequate day-5 sample. */
function createAllNotSuspected(): BloodspotScreening {
	const d = createDefaultAssessment();
	d.babyId.dateOfBirth = '2026-06-01';
	d.sampleEvent.sampleDate = '2026-06-06'; // day 5
	d.sampleQuality.sampleAdequacy = 'adequate';
	d.sampleQuality.spotQualityIssue = 'none';
	d.conditions = {
		scdResult: 'not-suspected',
		cfResult: 'not-suspected',
		chtResult: 'not-suspected',
		pkuResult: 'not-suspected',
		mcaddResult: 'not-suspected',
		msudResult: 'not-suspected',
		ivaResult: 'not-suspected',
		ga1Result: 'not-suspected',
		hcuResult: 'not-suspected'
	};
	return d;
}

/** Set the sample age in days from a fixed birth date. */
function withSampleAgeDays(d: BloodspotScreening, days: number): BloodspotScreening {
	d.babyId.dateOfBirth = '2026-06-01';
	const birth = new Date('2026-06-01');
	const sample = new Date(birth.getTime() + days * 24 * 60 * 60 * 1000);
	d.sampleEvent.sampleDate = sample.toISOString().slice(0, 10);
	return d;
}

describe('bloodspot classification engine', () => {
	it('classifies nine not-suspected conditions as all-not-suspected / routine', () => {
		const r = gradeBloodspot(createAllNotSuspected());
		expect(r.overallOutcome).toBe('all-not-suspected');
		expect(r.referralStatus).toBe('routine');
		expect(r.referrals).toEqual([]);
		expect(r.conditionResults).toHaveLength(9);
		expect(r.ageAtSampleDays).toBe(5);
	});

	it('classifies a blank record as incomplete', () => {
		const r = gradeBloodspot(createDefaultAssessment());
		expect(r.overallOutcome).toBe('incomplete');
		expect(r.referralStatus).toBe('routine');
		expect(r.ageAtSampleDays).toBeNull();
	});

	it('treats an SCD carrier as valid and still all-not-suspected', () => {
		const d = createAllNotSuspected();
		d.conditions.scdResult = 'carrier';
		const r = gradeBloodspot(d);
		expect(r.overallOutcome).toBe('all-not-suspected');
		expect(r.conditionResults[0].invalidCarrier).toBe(false);
	});

	// ─── Overall outcome precedence ─────────────────────────────────────
	it('gives suspected the highest precedence (referral-required)', () => {
		const d = createAllNotSuspected();
		d.conditions.cfResult = 'suspected'; // suspected
		d.conditions.chtResult = 'repeat-required'; // repeat
		d.conditions.pkuResult = 'pending'; // pending
		d.conditions.mcaddResult = 'declined'; // declined
		const r = gradeBloodspot(d);
		expect(r.overallOutcome).toBe('referral-required');
		expect(r.referralStatus).toBe('urgent');
		expect(r.referrals.map((x) => x.code)).toEqual(['cf']);
	});

	it('prefers repeat-required over incomplete and declined', () => {
		const d = createAllNotSuspected();
		d.conditions.chtResult = 'repeat-required';
		d.conditions.pkuResult = 'pending';
		d.conditions.mcaddResult = 'declined';
		const r = gradeBloodspot(d);
		expect(r.overallOutcome).toBe('repeat-required');
		expect(r.referralStatus).toBe('repeat');
	});

	it('prefers incomplete (pending) over declined-only', () => {
		const d = createAllNotSuspected();
		d.conditions.pkuResult = 'pending';
		d.conditions.mcaddResult = 'declined';
		const r = gradeBloodspot(d);
		expect(r.overallOutcome).toBe('incomplete');
	});

	it('classifies declined-only-outstanding when the rest are not-suspected', () => {
		const d = createAllNotSuspected();
		d.conditions.mcaddResult = 'declined';
		const r = gradeBloodspot(d);
		expect(r.overallOutcome).toBe('declined-only-outstanding');
		expect(r.referralStatus).toBe('routine');
	});

	it('treats an unanswered result as outstanding (incomplete)', () => {
		const d = createAllNotSuspected();
		d.conditions.hcuResult = '';
		const r = gradeBloodspot(d);
		expect(r.overallOutcome).toBe('incomplete');
	});

	it('treats a carrier on a non-SCD condition as invalid and outstanding', () => {
		const d = createAllNotSuspected();
		d.conditions.cfResult = 'carrier';
		const r = gradeBloodspot(d);
		const cf = r.conditionResults.find((c) => c.code === 'cf');
		expect(cf?.invalidCarrier).toBe(true);
		expect(cf?.effectiveResult).toBe('pending');
		expect(r.overallOutcome).toBe('incomplete');
		expect(r.flaggedIssues.some((f) => f.id === 'FLAG-INVALID-001')).toBe(true);
	});

	it('emits one urgent referral per suspected condition', () => {
		const d = createAllNotSuspected();
		d.conditions.scdResult = 'suspected';
		d.conditions.pkuResult = 'suspected';
		const r = gradeBloodspot(d);
		expect(r.referrals).toHaveLength(2);
		expect(r.referrals.every((x) => x.urgency === 'urgent')).toBe(true);
	});

	// ─── Sample-quality / timing window (day 5–8) ───────────────────────
	it('marks day 4 as out of window', () => {
		const q = deriveSampleQuality(withSampleAgeDays(createAllNotSuspected(), 4), 4);
		expect(q.withinWindow).toBe(false);
	});

	it('marks day 5 as within window', () => {
		const q = deriveSampleQuality(withSampleAgeDays(createAllNotSuspected(), 5), 5);
		expect(q.withinWindow).toBe(true);
	});

	it('marks day 8 as within window', () => {
		const q = deriveSampleQuality(withSampleAgeDays(createAllNotSuspected(), 8), 8);
		expect(q.withinWindow).toBe(true);
	});

	it('marks day 9 as out of window', () => {
		const q = deriveSampleQuality(withSampleAgeDays(createAllNotSuspected(), 9), 9);
		expect(q.withinWindow).toBe(false);
	});

	it('flags an out-of-window sample (day 9)', () => {
		const d = withSampleAgeDays(createAllNotSuspected(), 9);
		const r = gradeBloodspot(d);
		expect(r.flaggedIssues.some((f) => f.id === 'FLAG-WINDOW-001')).toBe(true);
	});

	it('detects an avoidable repeat from a technical reason', () => {
		const d = createAllNotSuspected();
		d.sampleQuality.isRepeat = 'yes';
		d.sampleQuality.repeatReason = 'technical';
		const q = deriveSampleQuality(d, 5);
		expect(q.avoidableRepeat).toBe(true);
	});

	it('does not mark a borderline-result repeat as avoidable', () => {
		const d = createAllNotSuspected();
		d.sampleQuality.isRepeat = 'yes';
		d.sampleQuality.repeatReason = 'borderline-result';
		const q = deriveSampleQuality(d, 5);
		expect(q.avoidableRepeat).toBe(false);
	});

	it('all condition metadata codes are unique', () => {
		const codes = CONDITIONS.map((c) => c.code);
		expect(new Set(codes).size).toBe(codes.length);
	});
});

describe('bloodspot flagged-issue detection', () => {
	function flagsFor(d: BloodspotScreening) {
		const conditionResults = normaliseConditionResults(d);
		const sampleQuality = deriveSampleQuality(d, gradeBloodspot(d).ageAtSampleDays);
		return detectFlaggedIssues(d, {
			conditionResults,
			sampleQuality,
			ageAtSampleDays: gradeBloodspot(d).ageAtSampleDays
		});
	}

	it('raises the urgent-referral flag for a suspected condition', () => {
		const d = createAllNotSuspected();
		d.conditions.cfResult = 'suspected';
		expect(flagsFor(d).some((f) => f.id === 'FLAG-REFERRAL-001')).toBe(true);
	});

	it('raises the inadequate-sample flag', () => {
		const d = createAllNotSuspected();
		d.sampleQuality.sampleAdequacy = 'inadequate';
		expect(flagsFor(d).some((f) => f.id === 'FLAG-SAMPLE-001')).toBe(true);
	});

	it('raises the inadequate-sample flag for a spot-quality issue', () => {
		const d = createAllNotSuspected();
		d.sampleQuality.spotQualityIssue = 'contaminated';
		expect(flagsFor(d).some((f) => f.id === 'FLAG-SAMPLE-001')).toBe(true);
	});

	it('raises the carrier flag for an SCD carrier', () => {
		const d = createAllNotSuspected();
		d.conditions.scdResult = 'carrier';
		expect(flagsFor(d).some((f) => f.id === 'FLAG-CARRIER-001')).toBe(true);
	});

	it('raises the declined flag', () => {
		const d = createAllNotSuspected();
		d.conditions.mcaddResult = 'declined';
		expect(flagsFor(d).some((f) => f.id === 'FLAG-DECLINED-001')).toBe(true);
	});

	it('sorts flags by priority (high before low)', () => {
		const d = createAllNotSuspected();
		d.conditions.cfResult = 'suspected'; // high
		d.conditions.scdResult = 'carrier'; // low
		const flags = flagsFor(d);
		const order: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
