import { describe, it, expect } from 'vitest';
import { gradeBhutani } from './bhutani-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { gestationBand, percentileTracks, thresholds } from './bhutani-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { clinicianName: '', clinicianRole: '', assessedAt: '', careSetting: '' },
		identification: { infantIdentifier: '', sex: '', bornAt: '', gestationalAgeWeeks: null },
		measurement: { ageHours: null, totalSerumBilirubinUmolL: null, measurementMethod: '' },
		riskFactors: {
			pretermUnder38: '',
			previousSiblingJaundice: '',
			exclusiveBreastfeeding: '',
			bruising: '',
			bloodGroupIncompatibility: '',
			earlyOnsetUnder24h: ''
		},
		note: { clinicalNote: '' }
	};
}

/** A term infant assessed at 24 h; TSB filled in by each test. */
function createTermInfant(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'paediatrician',
		assessedAt: '2026-06-20T09:30',
		careSetting: 'postnatal-ward'
	};
	d.identification = {
		infantIdentifier: 'NN-1001',
		sex: 'male',
		bornAt: '2026-06-19T09:30',
		gestationalAgeWeeks: 40
	};
	d.measurement.ageHours = 24;
	d.measurement.measurementMethod = 'serum';
	return d;
}

// At 24 h the interpolated Bhutani tracks are p40=101, p75=135, p95=169 µmol/L.
const TRACKS_24 = percentileTracks(24);

describe('bhutani percentile tracks', () => {
	it('interpolates the anchored tracks at 24 h', () => {
		expect(TRACKS_24).toEqual({ p40: 101, p75: 135, p95: 169 });
	});
});

describe('bhutani zone lookup (boundaries at 24 h)', () => {
	it('classifies below p40 as low', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 100; // < 101
		const r = gradeBhutani(d);
		expect(r.riskZone).toBe('low');
		expect(r.percentileBand).toBe('<40');
	});

	it('classifies exactly p40 as low-intermediate', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 101; // == p40
		const r = gradeBhutani(d);
		expect(r.riskZone).toBe('low-intermediate');
		expect(r.percentileBand).toBe('40-75');
	});

	it('classifies exactly p75 as high-intermediate', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 135; // == p75
		const r = gradeBhutani(d);
		expect(r.riskZone).toBe('high-intermediate');
		expect(r.percentileBand).toBe('75-95');
	});

	it('classifies exactly p95 as high', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 169; // == p95
		const r = gradeBhutani(d);
		expect(r.riskZone).toBe('high');
		expect(r.percentileBand).toBe('>=95');
	});

	it('classifies just below p95 as high-intermediate', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 168; // < 169
		expect(gradeBhutani(d).riskZone).toBe('high-intermediate');
	});
});

describe('bhutani treatment-threshold comparison', () => {
	it('flags at or above the phototherapy line but below exchange', () => {
		// Term at 24 h: phototherapy = 200, exchange = 250 µmol/L.
		const t = thresholds('term', 24);
		expect(t).toEqual({ phototherapy: 200, exchange: 250 });

		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 200; // == phototherapy, < exchange
		const r = gradeBhutani(d);
		expect(r.abovePhototherapy).toBe(true);
		expect(r.aboveExchange).toBe(false);
	});

	it('flags at or above the exchange line', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 250; // == exchange
		const r = gradeBhutani(d);
		expect(r.abovePhototherapy).toBe(true);
		expect(r.aboveExchange).toBe(true);
	});

	it('stays below both thresholds for a modest TSB', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 150;
		const r = gradeBhutani(d);
		expect(r.abovePhototherapy).toBe(false);
		expect(r.aboveExchange).toBe(false);
	});
});

describe('bhutani gestation-curve selection', () => {
	it('maps weeks to the correct threshold band', () => {
		expect(gestationBand(40)).toBe('term');
		expect(gestationBand(38)).toBe('term');
		expect(gestationBand(37)).toBe('37');
		expect(gestationBand(36)).toBe('36');
		expect(gestationBand(35)).toBe('35');
		expect(gestationBand(34)).toBe('under35');
		expect(gestationBand(null)).toBe('term');
	});

	it('uses a lower phototherapy threshold for lower gestation at the same age', () => {
		const d = createTermInfant();
		d.identification.gestationalAgeWeeks = 34;
		d.measurement.totalSerumBilirubinUmolL = 150;
		const r = gradeBhutani(d);
		expect(r.gestationBand).toBe('under35');
		// under35 phototherapy at 24 h = 135 < 150, so TSB is above the lower line.
		expect(r.phototherapyThreshold).toBe(135);
		expect(r.abovePhototherapy).toBe(true);
	});
});

describe('bhutani edge cases', () => {
	it('leaves the zone unassigned and flags incomplete data when inputs are missing', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = null;
		const r = gradeBhutani(d);
		expect(r.riskZone).toBeNull();
		expect(r.percentileBand).toBeNull();
		expect(r.flaggedIssues.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('clamps out-of-range age and raises the out-of-range flag', () => {
		const d = createTermInfant();
		d.measurement.ageHours = 240; // > 168 h
		d.measurement.totalSerumBilirubinUmolL = 300;
		const r = gradeBhutani(d);
		expect(r.outOfRange).toBe(true);
		// Clamped to 168 h the tracks are p40=205, p75=265, p95=339, so 300 is
		// high-intermediate (>= p75 265, < p95 339).
		expect(r.riskZone).toBe('high-intermediate');
		expect(r.flaggedIssues.some((f) => f.id === 'F-OUT-OF-RANGE-AGE-001')).toBe(true);
	});
});

describe('bhutani flagged-issue detection', () => {
	it('raises the exchange emergency flag above the exchange line', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 300; // >= exchange 250 and >= p95 169
		const r = gradeBhutani(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-ABOVE-EXCHANGE-001')).toBe(true);
		// The phototherapy flag is suppressed when the exchange flag fires.
		expect(r.flaggedIssues.some((f) => f.id === 'F-ABOVE-PHOTOTHERAPY-001')).toBe(false);
	});

	it('raises the early-jaundice flag when onset is before 24 h', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 120;
		d.riskFactors.earlyOnsetUnder24h = 'yes';
		const r = gradeBhutani(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-EARLY-JAUNDICE-001')).toBe(true);
	});

	it('collects fired risk factors and raises the risk-factors flag', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 120;
		d.riskFactors.bruising = 'yes';
		d.riskFactors.exclusiveBreastfeeding = 'yes';
		const r = gradeBhutani(d);
		expect(r.firedRiskFactors).toHaveLength(2);
		expect(r.flaggedIssues.some((f) => f.id === 'F-RISK-FACTORS-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 300;
		d.riskFactors.bruising = 'yes';
		const r = gradeBhutani(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('raises no red flags for a low-zone infant below both thresholds', () => {
		const d = createTermInfant();
		d.measurement.totalSerumBilirubinUmolL = 90; // < p40 101; < phototherapy 200
		const flags = detectFlaggedIssues(d, gradeBhutani(d));
		expect(flags).toHaveLength(0);
	});
});
