import { describe, it, expect } from 'vitest';
import { calculateParkland, roundOne, computeHoursSinceInjury } from './parkland-grader';
import { detectFlaggedIssues } from './flagged-issues';
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
		weight: { weightKg: null },
		burn: { tbsaPercent: null, tbsaMethod: '' },
		injury: { injuryAt: '', injuryTimeKnown: '' },
		features: { inhalationSuspected: '', circumferentialOrDeep: '', mechanism: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-answered adult resuscitation case, assessed within the first 8 h. */
function createResuscitationPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-20T11:00',
		careSetting: 'emergency-department'
	};
	d.identification = { patientIdentifier: 'ED-1001', ageBand: 'adult', sex: 'male' };
	d.weight.weightKg = 70;
	d.burn.tbsaPercent = 30;
	d.burn.tbsaMethod = 'rule-of-nines';
	// Injured two hours before assessment.
	d.injury = { injuryAt: '2026-06-20T09:00', injuryTimeKnown: 'known' };
	d.features = { inhalationSuspected: 'no', circumferentialOrDeep: 'no', mechanism: 'thermal' };
	return d;
}

describe('parkland-formula engine', () => {
	it('computes 70kg × 30% → 8400 mL total, 4200 mL per phase', () => {
		const d = createResuscitationPatient();
		const r = calculateParkland(d);
		// 4 × 70 × 30 = 8400
		expect(r.total24hVolumeMl).toBe(8400);
		expect(r.first8hVolumeMl).toBe(4200);
		expect(r.next16hVolumeMl).toBe(4200);
	});

	it('preserves the exact 8h/16h split as two equal halves of the total', () => {
		const r = calculateParkland(createResuscitationPatient());
		expect(r.first8hVolumeMl! + r.next16hVolumeMl!).toBe(r.total24hVolumeMl!);
		expect(r.first8hVolumeMl).toBe(r.next16hVolumeMl);
	});

	it('offsets the first-phase rate by hours already elapsed since injury', () => {
		// 2 h elapsed → 6 h of the first-8-h window remain → 4200 / 6 = 700 mL/h.
		const r = calculateParkland(createResuscitationPatient());
		expect(r.hoursSinceInjury).toBe(2);
		expect(r.remainingFirst8hHours).toBe(6);
		expect(r.first8hRateMlPerHour).toBe(700);
		// Second phase is always over a fixed 16 h → 4200 / 16 = 262.5 mL/h.
		expect(r.next16hRateMlPerHour).toBe(262.5);
		expect(r.status).toBe('planned');
	});

	it('returns a null first-phase rate when the injury is more than 8 h old (overdue)', () => {
		const d = createResuscitationPatient();
		// Injured 10 h before assessment → first-8-h window has passed.
		d.injury.injuryAt = '2026-06-20T01:00';
		const r = calculateParkland(d);
		expect(r.hoursSinceInjury).toBe(10);
		expect(r.remainingFirst8hHours).toBe(0);
		expect(r.first8hRateMlPerHour).toBeNull();
		// The 24 h total and phase volumes are unchanged.
		expect(r.total24hVolumeMl).toBe(8400);
		expect(r.next16hRateMlPerHour).toBe(262.5);
		expect(r.status).toBe('overdue');
		expect(r.flaggedIssues.some((f) => f.id === 'F-RESUSCITATION-OVERDUE-001')).toBe(true);
	});

	it('derives the 0.5-1.0 mL/kg/h urine-output target from weight', () => {
		const r = calculateParkland(createResuscitationPatient());
		expect(r.targetUrineOutputLowMlPerHour).toBe(35);
		expect(r.targetUrineOutputHighMlPerHour).toBe(70);
	});

	it('returns null volumes and an incomplete status when weight or %TBSA is missing', () => {
		const d = createResuscitationPatient();
		d.weight.weightKg = null;
		const r = calculateParkland(d);
		expect(r.total24hVolumeMl).toBeNull();
		expect(r.first8hVolumeMl).toBeNull();
		expect(r.first8hRateMlPerHour).toBeNull();
		expect(r.status).toBe('incomplete');
	});

	it('defaults remainingFirst8hHours to 8 when no injury time is set', () => {
		const d = createResuscitationPatient();
		d.injury.injuryAt = '';
		const r = calculateParkland(d);
		expect(r.hoursSinceInjury).toBeNull();
		expect(r.remainingFirst8hHours).toBe(8);
		// 4200 / 8 = 525 mL/h.
		expect(r.first8hRateMlPerHour).toBe(525);
	});

	it('rounds to one decimal place and clamps elapsed time to non-negative', () => {
		expect(roundOne(262.55)).toBe(262.6);
		expect(roundOne(null)).toBeNull();
		// Assessment before injury clamps to 0.
		expect(computeHoursSinceInjury('2026-06-20T09:00', '2026-06-20T08:00')).toBe(0);
		expect(computeHoursSinceInjury('', '2026-06-20T08:00')).toBeNull();
	});
});

describe('parkland flagged-issue detection', () => {
	it('raises the incomplete-assessment flag when an input is missing', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, { total24hVolumeMl: null, hoursSinceInjury: null });
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-DATA-001')).toBe(true);
	});

	it('raises the adult major-burn referral flag at or above 15% TBSA', () => {
		const d = createResuscitationPatient(); // 30% adult
		const flags = detectFlaggedIssues(d, { total24hVolumeMl: 8400, hoursSinceInjury: 2 });
		expect(flags.some((f) => f.id === 'F-MAJOR-BURN-REFERRAL-001')).toBe(true);
	});

	it('uses the lower 10% child threshold for the referral flag', () => {
		const d = createResuscitationPatient();
		d.identification.ageBand = 'child';
		d.burn.tbsaPercent = 12; // below adult 15, at/above child 10
		const flags = detectFlaggedIssues(d, { total24hVolumeMl: 4800, hoursSinceInjury: 1 });
		expect(flags.some((f) => f.id === 'F-MAJOR-BURN-REFERRAL-001')).toBe(true);
	});

	it('raises inhalation, escharotomy and special-mechanism flags from features', () => {
		const d = createResuscitationPatient();
		d.features = { inhalationSuspected: 'yes', circumferentialOrDeep: 'yes', mechanism: 'electrical' };
		const flags = detectFlaggedIssues(d, { total24hVolumeMl: 8400, hoursSinceInjury: 2 });
		expect(flags.some((f) => f.id === 'F-INHALATION-AIRWAY-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-ESCHAROTOMY-RISK-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-SPECIAL-MECHANISM-001')).toBe(true);
	});

	it('always raises the titrate-to-urine-output flag when a plan is produced', () => {
		const flags = detectFlaggedIssues(createResuscitationPatient(), {
			total24hVolumeMl: 8400,
			hoursSinceInjury: 2
		});
		expect(flags.some((f) => f.id === 'F-TITRATE-URINE-OUTPUT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createResuscitationPatient();
		d.features.inhalationSuspected = 'yes';
		const flags = detectFlaggedIssues(d, { total24hVolumeMl: 8400, hoursSinceInjury: 10 });
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
