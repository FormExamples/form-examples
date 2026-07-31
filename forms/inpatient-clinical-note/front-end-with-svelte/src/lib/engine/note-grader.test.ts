import { describe, expect, it } from 'vitest';
import { deriveNews2, effectiveNews2 } from './news2';
import { assess } from './note-grader';
import { requiredComponentKeys } from './note-rules';
import { emptyAssessment, type AssessmentData, type Observations } from './types';

/**
 * Covers the two engines against the worked examples and boundaries in
 * `spec/index.md` §4 and §5 and `doc/acuity-rules.md`.
 */

/** A set of all-normal observations: NEWS2 derives to 0. */
function normalObs(): Partial<Observations> {
	return {
		respiratoryRate: 16,
		oxygenSaturation: 97,
		spo2Scale: 'scale-1',
		oxygenDelivery: 'air',
		systolicBloodPressure: 128,
		pulseRate: 78,
		acvpu: 'alert',
		temperatureCelsius: 36.8
	};
}

/** A note filled just enough to be gradeable, with the given overrides applied. */
function noteWith(patch: (d: AssessmentData) => void): AssessmentData {
	const d = emptyAssessment();
	patch(d);
	return d;
}

describe('NEWS2 derivation', () => {
	it('derives 0 from an all-normal observation set', () => {
		const d = noteWith((x) => Object.assign(x.observations, normalObs()));
		expect(deriveNews2(d.observations).total).toBe(0);
	});

	it('returns null when the observation set is incomplete', () => {
		const d = noteWith((x) => {
			Object.assign(x.observations, normalObs());
			x.observations.temperatureCelsius = null;
		});
		const r = deriveNews2(d.observations);
		expect(r.complete).toBe(false);
		expect(r.total).toBeNull();
	});

	it('scores each parameter at its RCP boundary', () => {
		// RR 25 -> 3, SpO2 91 -> 3, oxygen -> 2, SBP 90 -> 3, pulse 131 -> 3,
		// unresponsive -> 3, temp 35.0 -> 3. Total 20, the schema maximum.
		const d = noteWith((x) =>
			Object.assign(x.observations, {
				respiratoryRate: 25,
				oxygenSaturation: 91,
				spo2Scale: 'scale-1',
				oxygenDelivery: 'nasal-cannula',
				systolicBloodPressure: 90,
				pulseRate: 131,
				acvpu: 'unresponsive',
				temperatureCelsius: 35.0
			})
		);
		expect(deriveNews2(d.observations).total).toBe(20);
	});

	it('scores scale 2 differently from scale 1 above the target range', () => {
		// SpO2 95 on oxygen: scale 1 scores 1, scale 2 scores 2.
		const base = { ...normalObs(), oxygenSaturation: 95, oxygenDelivery: 'nasal-cannula' };
		const s1 = noteWith((x) => Object.assign(x.observations, base, { spo2Scale: 'scale-1' }));
		const s2 = noteWith((x) => Object.assign(x.observations, base, { spo2Scale: 'scale-2' }));
		const a = deriveNews2(s1.observations).subScores.oxygenSaturation;
		const b = deriveNews2(s2.observations).subScores.oxygenSaturation;
		expect(a).toBe(1);
		expect(b).toBe(2);
	});

	it('prefers an entered total over a derived one, and reports both', () => {
		const d = noteWith((x) => {
			Object.assign(x.observations, normalObs());
			x.observations.news2Total = 6;
		});
		const r = effectiveNews2(d.observations);
		expect(r.entered).toBe(6);
		expect(r.derived).toBe(0);
		expect(r.effective).toBe(6);
	});
});

describe('required-component set by note type', () => {
	it('requires 9 base components for a progress note', () => {
		expect(requiredComponentKeys('progress')).toHaveLength(9);
	});

	it('adds examination and investigations for an admission clerking', () => {
		const keys = requiredComponentKeys('admission-clerking');
		expect(keys).toHaveLength(11);
		expect(keys).toContain('examination');
		expect(keys).toContain('investigations');
	});

	it('adds communication for a transfer note', () => {
		const keys = requiredComponentKeys('transfer');
		expect(keys).toHaveLength(10);
		expect(keys).toContain('communication');
	});

	it('falls back to the base set for an unknown note type', () => {
		expect(requiredComponentKeys('not-a-real-type')).toHaveLength(9);
	});
});

describe('acuity engine — worked examples from doc/acuity-rules.md', () => {
	it('all-normal observations give Stable', () => {
		const d = noteWith((x) => Object.assign(x.observations, normalObs()));
		expect(assess(d).acuityBand).toBe('stable');
	});

	it('a single parameter scoring 3 gives Watch even at a low aggregate', () => {
		// RR 26 scores 3; aggregate is only 3.
		const d = noteWith((x) =>
			Object.assign(x.observations, { ...normalObs(), respiratoryRate: 26 })
		);
		expect(deriveNews2(d.observations).total).toBe(3);
		expect(assess(d).acuityBand).toBe('watch');
	});

	it('NEWS2 5 with a positive sepsis screen gives Escalate', () => {
		const d = noteWith((x) => {
			x.observations.news2Total = 5;
			x.assessment.sepsisScreen = 'positive';
		});
		expect(assess(d).acuityBand).toBe('escalate');
	});

	it('a critical-care referral outranks a modest NEWS2 (max-band)', () => {
		const d = noteWith((x) => {
			x.observations.news2Total = 6;
			x.assessment.criticalCareReferral = 'yes';
		});
		expect(assess(d).acuityBand).toBe('critical');
	});

	it('NEWS2 9 or above is Critical', () => {
		const d = noteWith((x) => (x.observations.news2Total = 9));
		expect(assess(d).acuityBand).toBe('critical');
	});

	it('fires no NEWS2 rule at all when no observations are recorded', () => {
		const d = emptyAssessment();
		const acuityRules = assess(d).firedRules.filter((r) => r.engine === 'acuity');
		expect(acuityRules).toHaveLength(0);
		expect(assess(d).acuityBand).toBe('stable');
	});

	it('an unactioned abnormal result raises the band to Escalate', () => {
		const d = noteWith((x) => {
			Object.assign(x.observations, normalObs());
			x.investigations.rows.push({
				testName: 'Potassium',
				category: 'biochemistry',
				requestedDate: '',
				resultDate: '',
				resultSummary: '6.8 mmol/L',
				abnormal: 'yes',
				actioned: 'no',
				actionTaken: ''
			});
		});
		expect(assess(d).acuityBand).toBe('escalate');
	});
});

describe('acuity override', () => {
	it('is ignored without a reason', () => {
		const d = noteWith((x) => (x.signOff.authorOverrideAcuity = 'critical'));
		const r = assess(d);
		expect(r.acuityOverridden).toBe(false);
		expect(r.acuityBand).toBe('stable');
	});

	it('applies with a reason, and retains the computed band', () => {
		const d = noteWith((x) => {
			x.signOff.authorOverrideAcuity = 'critical';
			x.signOff.authorOverrideReason = 'Clinical concern despite normal observations.';
		});
		const r = assess(d);
		expect(r.acuityOverridden).toBe(true);
		expect(r.acuityBand).toBe('critical');
		expect(r.computedAcuityBand).toBe('stable');
	});
});

describe('completeness engine', () => {
	it('grades an empty note Incomplete at 0%', () => {
		const r = assess(emptyAssessment());
		expect(r.status).toBe('incomplete');
		expect(r.completenessPercent).toBe(0);
	});

	it('treats an explicit negative as documented', () => {
		const d = noteWith((x) => (x.interval.noIntervalEvents = 'yes'));
		const documented = assess(d).documentedComponents;
		expect(documented).toContain('interval-history');
	});

	it('grades a fully documented progress note Complete at 100%', () => {
		const d = noteWith((x) => {
			x.header.noteType = 'progress';
			x.header.noteAt = '2026-07-31T09:00';
			x.header.authorName = 'Dr A. Okafor';
			x.header.authorGrade = 'ST4';
			x.interval.noIntervalEvents = 'yes';
			Object.assign(x.observations, normalObs());
			x.problems.rows.push({
				problem: 'Community-acquired pneumonia',
				category: 'presenting',
				status: 'resolving',
				priority: 'medium',
				onsetDate: '',
				progressCommentary: 'CRP falling.'
			});
			x.medications.noMedicationChanges = 'yes';
			x.risks.vteStatus = 'done';
			x.assessment.clinicalImpression = 'Resolving pneumonia.';
			x.planning.plan = 'Continue antibiotics.';
			x.planning.escalationStatus = 'for-full-escalation';
			x.planning.ceilingOfCare = 'full-active-treatment';
		});
		const r = assess(d);
		expect(r.totalRequired).toBe(9);
		expect(r.documentedRequired).toBe(9);
		expect(r.status).toBe('complete');
		expect(r.completenessPercent).toBe(100);
	});

	it('downgrades the same content to Partial when the note type demands more', () => {
		// The identical note, typed as an admission clerking, now requires the
		// examination and investigations components too.
		const d = noteWith((x) => {
			x.header.noteType = 'admission-clerking';
			x.header.noteAt = '2026-07-31T09:00';
			x.header.authorName = 'Dr A. Okafor';
			x.header.authorGrade = 'ST4';
			x.interval.noIntervalEvents = 'yes';
			Object.assign(x.observations, normalObs());
			x.problems.rows.push({
				problem: 'Community-acquired pneumonia',
				category: 'presenting',
				status: 'active',
				priority: 'medium',
				onsetDate: '',
				progressCommentary: ''
			});
			x.medications.noMedicationChanges = 'yes';
			x.risks.vteStatus = 'done';
			x.assessment.clinicalImpression = 'Pneumonia.';
			x.planning.plan = 'Antibiotics.';
			x.planning.escalationStatus = 'for-full-escalation';
			x.planning.ceilingOfCare = 'full-active-treatment';
		});
		const r = assess(d);
		expect(r.totalRequired).toBe(11);
		expect(r.documentedRequired).toBe(9);
		expect(r.status).toBe('partial');
	});

	it('forces Incomplete when the impression is missing, however much else is filled', () => {
		const d = noteWith((x) => {
			x.header.noteType = 'progress';
			x.header.noteAt = '2026-07-31T09:00';
			x.header.authorName = 'Dr A. Okafor';
			x.header.authorGrade = 'ST4';
			x.interval.noIntervalEvents = 'yes';
			Object.assign(x.observations, normalObs());
			x.problems.rows.push({
				problem: 'Pneumonia',
				category: 'presenting',
				status: 'active',
				priority: 'medium',
				onsetDate: '',
				progressCommentary: ''
			});
			x.medications.noMedicationChanges = 'yes';
			x.risks.vteStatus = 'done';
			x.planning.plan = 'Antibiotics.';
			x.planning.escalationStatus = 'for-full-escalation';
			x.planning.ceilingOfCare = 'full-active-treatment';
			// clinicalImpression deliberately left blank
		});
		expect(assess(d).status).toBe('incomplete');
	});
});

describe('safety flags', () => {
	it('flags an escalate band with no escalation action', () => {
		const d = noteWith((x) => (x.observations.news2Total = 8));
		const categories = assess(d).flags.map((f) => f.category);
		expect(categories).toContain('deteriorating-news2-no-escalation');
	});

	it('does not flag when an escalation action is recorded', () => {
		const d = noteWith((x) => {
			x.observations.news2Total = 8;
			x.planning.escalationAction = 'Discussed with the medical registrar at 14:20.';
		});
		const categories = assess(d).flags.map((f) => f.category);
		expect(categories).not.toContain('deteriorating-news2-no-escalation');
	});

	it('flags a VTE assessment that was not done', () => {
		const d = noteWith((x) => (x.risks.vteStatus = 'not-done'));
		expect(assess(d).flags.map((f) => f.category)).toContain('vte-not-assessed');
	});

	it('flags prescribing without an allergy check', () => {
		const d = noteWith((x) =>
			x.medications.rows.push({
				drugName: 'Co-amoxiclav',
				action: 'started',
				dose: '1.2 g',
				route: 'intravenous',
				frequency: 'three times a day',
				indication: 'Pneumonia',
				isAntimicrobial: 'yes',
				reviewDate: '',
				notes: ''
			})
		);
		expect(assess(d).flags.map((f) => f.category)).toContain('allergy-not-checked');
	});

	it('flags a long stay with no estimated discharge date', () => {
		const d = noteWith((x) => {
			x.admission.admissionAt = '2026-07-01T09:00';
			x.header.noteAt = '2026-07-31T09:00';
		});
		expect(assess(d).flags.map((f) => f.category)).toContain('long-stay-no-discharge-plan');
	});

	it('does not flag a positive sepsis screen once an antimicrobial is started', () => {
		const d = noteWith((x) => {
			x.assessment.sepsisScreen = 'positive';
			x.medications.rows.push({
				drugName: 'Piperacillin-tazobactam',
				action: 'started',
				dose: '4.5 g',
				route: 'intravenous',
				frequency: 'three times a day',
				indication: 'Sepsis',
				isAntimicrobial: 'yes',
				reviewDate: '2026-08-02',
				notes: ''
			});
		});
		expect(assess(d).flags.map((f) => f.category)).not.toContain(
			'sepsis-screen-positive-no-action'
		);
	});
});
