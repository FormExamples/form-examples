// Boundary tests for the Cataract Diagnostic Evaluation scoring engine.
//
// The LOCS III severity-band thresholds (3.0 / 5.0) and the surgical-
// candidacy acuity thresholds (LogMAR 0.30 / 0.48) are exactly the places a
// grading tool goes wrong, so each boundary is asserted on both sides. The
// same cases run against the HTML front-end's JavaScript engine, so the two
// implementations cannot silently diverge.

import { describe, expect, it } from 'vitest';
import { createDefaultEvaluation } from './defaults';
import { calculateCataractEvaluation } from './grader';
import type { CataractDiagnosticEvaluation } from './types';

function blank(): CataractDiagnosticEvaluation {
	return createDefaultEvaluation();
}

function withSlitLamp(right: Partial<Record<'no' | 'nc' | 'c' | 'p', number>>): CataractDiagnosticEvaluation {
	const d = blank();
	if (right.no !== undefined) d.slitLamp.locsIiiNoRight = right.no;
	if (right.nc !== undefined) d.slitLamp.locsIiiNcRight = right.nc;
	if (right.c !== undefined) d.slitLamp.locsIiiCRight = right.c;
	if (right.p !== undefined) d.slitLamp.locsIiiPRight = right.p;
	return d;
}

describe('empty evaluation', () => {
	it('grades nothing and raises nothing', () => {
		const r = calculateCataractEvaluation(blank());
		expect(r.locsIIISeverityRight).toBe('');
		expect(r.locsIIISeverityLeft).toBe('');
		expect(r.computedSurgicalCandidacy).toBe('not-indicated');
		expect(r.finalSurgicalCandidacy).toBe('not-indicated');
		expect(r.functionalImpactScore).toBeNull();
		expect(r.flags).toHaveLength(0);
	});
});

describe('LOCS III severity band — nuclear opalescence subscore', () => {
	it.each([
		[0.1, 'mild'],
		[1.0, 'mild'],
		[2.9, 'mild'], // just below the moderate boundary
		[3.0, 'moderate'], // inclusive lower bound of moderate
		[4.9, 'moderate'], // just below the severe boundary
		[5.0, 'severe'], // inclusive lower bound of severe
		[6.9, 'severe']
	])('NO %s grades %s', (no, expected) => {
		const r = calculateCataractEvaluation(withSlitLamp({ no }));
		expect(r.locsIIISeverityRight).toBe(expected);
	});
});

describe('LOCS III severity band — cortical subscore (5.9 ceiling)', () => {
	it.each([
		[2.9, 'mild'],
		[3.0, 'moderate'],
		[4.9, 'moderate'],
		[5.0, 'severe'],
		[5.9, 'severe']
	])('C %s grades %s', (c, expected) => {
		const r = calculateCataractEvaluation(withSlitLamp({ c }));
		expect(r.locsIIISeverityRight).toBe(expected);
	});
});

describe('LOCS III severity band — worst subscore wins', () => {
	it('a single severe subscore overrides three mild subscores', () => {
		const r = calculateCataractEvaluation(withSlitLamp({ no: 1.0, nc: 1.0, c: 1.0, p: 5.0 }));
		expect(r.locsIIISeverityRight).toBe('severe');
	});
	it('a single moderate subscore overrides three mild subscores', () => {
		const r = calculateCataractEvaluation(withSlitLamp({ no: 1.0, nc: 1.0, c: 3.5, p: 1.0 }));
		expect(r.locsIIISeverityRight).toBe('moderate');
	});
});

describe('LOCS III severity band — left eye graded independently', () => {
	it('grades each eye from its own subscores', () => {
		const d = blank();
		d.slitLamp.locsIiiNoRight = 1.0;
		d.slitLamp.locsIiiNoLeft = 5.5;
		const r = calculateCataractEvaluation(d);
		expect(r.locsIIISeverityRight).toBe('mild');
		expect(r.locsIIISeverityLeft).toBe('severe');
	});
});

describe('surgical candidacy — not-indicated', () => {
	it('mild severity both eyes with 6/12-or-better acuity both eyes stays not-indicated', () => {
		const d = blank();
		d.slitLamp.locsIiiNoRight = 1.0;
		d.slitLamp.locsIiiNoLeft = 1.0;
		d.acuity.bestCorrectedVaLogmarRight = 0.3; // exactly 6/12
		d.acuity.bestCorrectedVaLogmarLeft = 0.0;
		const r = calculateCataractEvaluation(d);
		expect(r.computedSurgicalCandidacy).toBe('not-indicated');
	});
});

describe('surgical candidacy — acuity worse than 6/12 boundary', () => {
	it.each([
		[0.3, 'not-indicated'], // 6/12 exactly: not worse than 6/12
		[0.31, 'consider'] // just worse than 6/12
	])('best-corrected LogMAR %s yields %s', (logmar, expected) => {
		const d = blank();
		d.acuity.bestCorrectedVaLogmarRight = logmar;
		d.acuity.bestCorrectedVaLogmarLeft = 0.0;
		const r = calculateCataractEvaluation(d);
		expect(r.computedSurgicalCandidacy).toBe(expected);
	});
});

describe('surgical candidacy — acuity worse than 6/18 boundary', () => {
	it.each([
		[0.47, 'consider'], // just short of the 6/18 threshold, only "consider"
		[0.48, 'indicated'] // inclusive lower bound of indicated
	])('best-corrected LogMAR %s yields %s', (logmar, expected) => {
		const d = blank();
		d.acuity.bestCorrectedVaLogmarRight = logmar;
		d.acuity.bestCorrectedVaLogmarLeft = 0.0;
		const r = calculateCataractEvaluation(d);
		expect(r.computedSurgicalCandidacy).toBe(expected);
	});
});

describe('surgical candidacy — LOCS III severity drives the recommendation', () => {
	it('moderate severity yields consider', () => {
		const r = calculateCataractEvaluation(withSlitLamp({ no: 3.5 }));
		expect(r.computedSurgicalCandidacy).toBe('consider');
	});
	it('severe severity yields indicated', () => {
		const r = calculateCataractEvaluation(withSlitLamp({ no: 5.5 }));
		expect(r.computedSurgicalCandidacy).toBe('indicated');
	});
});

describe('surgical candidacy — severe glare impact independently indicates surgery', () => {
	it('a mild LOCS III grade with severe glare impact still yields indicated', () => {
		const d = withSlitLamp({ no: 1.0 });
		d.glare.glareFunctionalImpact = 'severe';
		const r = calculateCataractEvaluation(d);
		expect(r.computedSurgicalCandidacy).toBe('indicated');
	});
});

describe('safety flags — competing pathology suspected', () => {
	it('fires when glaucoma is suspected and overrides candidacy to urgent-referral', () => {
		const d = blank();
		d.differential.glaucomaSuspected = 'yes';
		const r = calculateCataractEvaluation(d);
		expect(r.flags.map((f) => f.category)).toContain('competing-pathology-suspected');
		expect(r.computedSurgicalCandidacy).toBe('urgent-referral');
	});
});

describe('safety flags — raised intraocular pressure', () => {
	it.each([
		[21, false],
		[21.1, true]
	])('IOP %s mmHg fires=%s', (iop, shouldFire) => {
		const d = blank();
		d.tonometry.intraocularPressureRightMmhg = iop;
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'raised-iop')).toBe(shouldFire);
	});
});

describe('safety flags — view obscured, fundus not assessed', () => {
	it('fires when the cataract obscures the view and no dilated exam was performed', () => {
		const d = blank();
		d.fundus.viewObscuredByCataractRight = 'yes';
		d.fundus.dilatedFundusExamPerformed = 'no';
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'view-obscured-fundus-not-assessed')).toBe(true);
	});
	it('does not fire when the dilated exam was performed', () => {
		const d = blank();
		d.fundus.viewObscuredByCataractRight = 'yes';
		d.fundus.dilatedFundusExamPerformed = 'yes';
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'view-obscured-fundus-not-assessed')).toBe(false);
	});
});

describe('safety flags — rapid progression', () => {
	it('fires with less than 3 months duration and a severe grade', () => {
		const d = withSlitLamp({ no: 5.5 });
		d.symptoms.symptomDurationMonths = 2;
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'rapid-progression')).toBe(true);
	});
	it('does not fire at exactly 3 months', () => {
		const d = withSlitLamp({ no: 5.5 });
		d.symptoms.symptomDurationMonths = 3;
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'rapid-progression')).toBe(false);
	});
});

describe('safety flags — biometry incomplete for surgical planning', () => {
	it('fires when a surgical referral is recommended without biometry', () => {
		const d = blank();
		d.management.managementRecommendation = 'surgical-referral-routine';
		d.biometry.biometryPerformed = 'no';
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'biometry-incomplete-for-surgical-planning')).toBe(true);
	});
	it('does not fire once biometry is performed', () => {
		const d = blank();
		d.management.managementRecommendation = 'surgical-referral-urgent';
		d.biometry.biometryPerformed = 'yes';
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'biometry-incomplete-for-surgical-planning')).toBe(false);
	});
});

describe('safety flags — paediatric', () => {
	it('fires for a patient under 16 and overrides candidacy to urgent-referral', () => {
		const d = blank();
		d.clinician.assessmentDate = '2026-01-01';
		d.patient.birthDate = '2015-06-01'; // 10 years old at assessment
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'paediatric')).toBe(true);
		expect(r.computedSurgicalCandidacy).toBe('urgent-referral');
	});
	it('does not fire at exactly 16', () => {
		const d = blank();
		d.clinician.assessmentDate = '2026-01-01';
		d.patient.birthDate = '2010-01-01'; // exactly 16 years old
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'paediatric')).toBe(false);
	});
});

describe('functional impact score', () => {
	it('sums the three 0-4 sub-scores', () => {
		const d = blank();
		d.functional.functionalDifficultyReading = 3;
		d.functional.functionalDifficultyDriving = 4;
		d.functional.functionalDifficultyDailyActivities = 2;
		const r = calculateCataractEvaluation(d);
		expect(r.functionalImpactScore).toBe(9);
	});
	it('is null when nothing is answered', () => {
		const r = calculateCataractEvaluation(blank());
		expect(r.functionalImpactScore).toBeNull();
	});
});

describe('clinician override', () => {
	it('the override changes the final recommendation and records a reason', () => {
		const d = withSlitLamp({ no: 5.5 }); // computed: indicated
		d.summary.overrideSurgicalCandidacy = 'consider';
		d.summary.overrideReason = 'Patient prefers to defer surgery for now.';
		const r = calculateCataractEvaluation(d);
		expect(r.computedSurgicalCandidacy).toBe('indicated');
		expect(r.finalSurgicalCandidacy).toBe('consider');
		expect(r.overrideReason).toBe('Patient prefers to defer surgery for now.');
	});
	it('safety flags are never suppressed by the override', () => {
		const d = blank();
		d.differential.glaucomaSuspected = 'yes';
		d.summary.overrideSurgicalCandidacy = 'not-indicated';
		d.summary.overrideReason = 'Attempted override.';
		const r = calculateCataractEvaluation(d);
		expect(r.flags.some((f) => f.category === 'competing-pathology-suspected')).toBe(true);
		expect(r.finalSurgicalCandidacy).toBe('not-indicated');
	});
	it('no override reason is recorded when the final value matches the computed value', () => {
		const d = withSlitLamp({ no: 5.5 });
		d.summary.overrideSurgicalCandidacy = 'indicated';
		d.summary.overrideReason = 'Should be ignored.';
		const r = calculateCataractEvaluation(d);
		expect(r.overrideReason).toBe('');
	});
});
