import { describe, it, expect } from 'vitest';
import { classifyAaa, calculateGrowth, roundOne, bandForCategory } from './aaa-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { classificationRules } from './aaa-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			technicianName: '',
			technicianRole: '',
			clinicSite: '',
			scannedAt: '',
			deviceIdentifier: ''
		},
		identification: {
			patientIdentifier: '',
			age: null,
			sex: '',
			eligibilityRoute: '',
			scanType: ''
		},
		consent: { consentGiven: '', leafletProvided: '', consentNote: '' },
		measurement: {
			aortaVisualised: '',
			maxAorticDiameterCm: null,
			priorMaxDiameterCm: null,
			priorScanDate: ''
		},
		observations: { symptomatic: '', incidentalFindings: '' },
		result: { resultNote: '' }
	};
}

/** A complete, adequately-visualised scan with the given diameter. */
function scanWithDiameter(diameterCm: number): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		technicianName: 'S. Patel',
		technicianRole: 'screening-technician',
		clinicSite: 'Community clinic',
		scannedAt: '2026-06-20T09:30',
		deviceIdentifier: 'US-01'
	};
	d.identification = {
		patientIdentifier: 'AAA-1001',
		age: 65,
		sex: 'male',
		eligibilityRoute: 'routine-year-of-65',
		scanType: 'first-scan'
	};
	d.consent = { consentGiven: 'yes', leafletProvided: 'yes', consentNote: '' };
	d.measurement.aortaVisualised = 'yes';
	d.measurement.maxAorticDiameterCm = diameterCm;
	d.observations.symptomatic = 'no';
	return d;
}

describe('AAA diameter classification', () => {
	it('classifies below 3.0 cm as normal → discharge', () => {
		const r = classifyAaa(scanWithDiameter(2.5));
		expect(r.category).toBe('normal');
		expect(r.surveillanceBand).toBe('discharge');
	});

	it('treats the 3.0 cm boundary as small (lower-bound inclusive)', () => {
		expect(classifyAaa(scanWithDiameter(2.9)).category).toBe('normal');
		const r30 = classifyAaa(scanWithDiameter(3.0));
		expect(r30.category).toBe('small');
		expect(r30.surveillanceBand).toBe('annual');
	});

	it('treats the 4.5 cm boundary as medium (lower-bound inclusive)', () => {
		expect(classifyAaa(scanWithDiameter(4.4)).category).toBe('small');
		const r45 = classifyAaa(scanWithDiameter(4.5));
		expect(r45.category).toBe('medium');
		expect(r45.surveillanceBand).toBe('three-monthly');
	});

	it('treats the 5.5 cm boundary as large (lower-bound inclusive)', () => {
		expect(classifyAaa(scanWithDiameter(5.4)).category).toBe('medium');
		const r55 = classifyAaa(scanWithDiameter(5.5));
		expect(r55.category).toBe('large');
		expect(r55.surveillanceBand).toBe('refer-vascular');
	});

	it('classifies a large aneurysm well above threshold', () => {
		const r = classifyAaa(scanWithDiameter(6.2));
		expect(r.category).toBe('large');
		expect(r.maxAorticDiameterCm).toBe(6.2);
	});

	it('returns non-visualised when the aorta was not visualised', () => {
		const d = scanWithDiameter(4.0);
		d.measurement.aortaVisualised = 'no';
		const r = classifyAaa(d);
		expect(r.category).toBe('non-visualised');
		expect(r.surveillanceBand).toBe('rescan');
		expect(r.maxAorticDiameterCm).toBeNull();
	});

	it('returns non-visualised when the diameter is missing', () => {
		const d = scanWithDiameter(4.0);
		d.measurement.maxAorticDiameterCm = null;
		const r = classifyAaa(d);
		expect(r.category).toBe('non-visualised');
	});

	it('computes growth since the prior scan', () => {
		const d = scanWithDiameter(4.6);
		d.measurement.priorMaxDiameterCm = 4.0;
		expect(calculateGrowth(d)).toBe(0.6);
		expect(classifyAaa(d).growthCm).toBe(0.6);
	});

	it('returns null growth when the prior diameter is absent', () => {
		expect(calculateGrowth(scanWithDiameter(4.6))).toBeNull();
	});

	it('rounds diameter to one decimal place', () => {
		expect(roundOne(4.55)).toBe(4.6);
		expect(roundOne(null)).toBeNull();
	});

	it('maps every category to a surveillance band', () => {
		expect(bandForCategory('normal').surveillanceBand).toBe('discharge');
		expect(bandForCategory('small').surveillanceBand).toBe('annual');
		expect(bandForCategory('medium').surveillanceBand).toBe('three-monthly');
		expect(bandForCategory('large').surveillanceBand).toBe('refer-vascular');
		expect(bandForCategory('non-visualised').surveillanceBand).toBe('rescan');
	});

	it('all classification rule IDs are unique', () => {
		const ids = classificationRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('AAA flagged-issue detection', () => {
	it('raises no red flags for a complete normal scan', () => {
		const r = classifyAaa(scanWithDiameter(2.4));
		expect(r.flaggedIssues).toHaveLength(0);
	});

	it('raises the vascular-referral flag for a large aneurysm', () => {
		const r = classifyAaa(scanWithDiameter(5.8));
		expect(r.flaggedIssues.some((f) => f.id === 'F-VASCULAR-REFERRAL-001')).toBe(true);
	});

	it('raises symptomatic-aneurysm only when an aneurysm is present and symptomatic', () => {
		const symptomatic = scanWithDiameter(4.0);
		symptomatic.observations.symptomatic = 'yes';
		const flags = detectFlaggedIssues(symptomatic, { category: 'small', growthCm: null });
		expect(flags.some((f) => f.id === 'F-SYMPTOMATIC-ANEURYSM-001')).toBe(true);

		const normalSymptomatic = scanWithDiameter(2.4);
		normalSymptomatic.observations.symptomatic = 'yes';
		const flags2 = detectFlaggedIssues(normalSymptomatic, { category: 'normal', growthCm: null });
		expect(flags2.some((f) => f.id === 'F-SYMPTOMATIC-ANEURYSM-001')).toBe(false);
	});

	it('raises rapid-growth at or above 1.0 cm', () => {
		const d = scanWithDiameter(4.6);
		d.measurement.priorMaxDiameterCm = 3.5;
		const r = classifyAaa(d);
		expect(r.growthCm).toBe(1.1);
		expect(r.flaggedIssues.some((f) => f.id === 'F-RAPID-GROWTH-001')).toBe(true);
	});

	it('raises the non-visualised flag when the aorta was not measured', () => {
		const d = scanWithDiameter(4.0);
		d.measurement.aortaVisualised = 'no';
		const r = classifyAaa(d);
		expect(r.flaggedIssues.some((f) => f.id === 'F-NON-VISUALISED-001')).toBe(true);
	});

	it('raises the incomplete-assessment flag when consent is missing', () => {
		const d = scanWithDiameter(2.4);
		d.consent.consentGiven = '';
		const flags = detectFlaggedIssues(d, { category: 'normal', growthCm: null });
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ASSESSMENT-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = scanWithDiameter(5.9);
		d.observations.symptomatic = 'yes';
		d.consent.consentGiven = '';
		const r = classifyAaa(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flaggedIssues.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
