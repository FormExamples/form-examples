import { describe, it, expect } from 'vitest';
import { calculateNEWS2 } from './news2-calculator';
import { detectFlaggedIssues } from './flagged-issues';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';
import type { VitalSigns } from './types';

function vitals(overrides: Partial<VitalSigns>): VitalSigns {
	return {
		heartRate: null,
		systolicBP: null,
		diastolicBP: null,
		respiratoryRate: null,
		oxygenSaturation: null,
		supplementalOxygen: '',
		oxygenFlowRate: null,
		temperature: null,
		bloodGlucose: null,
		consciousnessLevel: '',
		pupilLeftSize: null,
		pupilLeftReactive: '',
		pupilRightSize: null,
		pupilRightReactive: '',
		capillaryRefillTime: null,
		weight: null,
		...overrides
	};
}

describe('calculateNEWS2', () => {
	it('scores all-normal vitals as 0 with a low clinical response', () => {
		const r = calculateNEWS2(
			vitals({
				heartRate: 72,
				systolicBP: 128,
				respiratoryRate: 16,
				oxygenSaturation: 98,
				supplementalOxygen: 'no',
				temperature: 36.8,
				consciousnessLevel: 'alert'
			})
		);
		expect(r.totalScore).toBe(0);
		expect(r.clinicalResponse).toBe('low');
		expect(r.hasAnySingleScore3).toBe(false);
	});

	it('flags a single-parameter score of 3 as low-medium', () => {
		const r = calculateNEWS2(
			vitals({
				heartRate: 72,
				systolicBP: 128,
				respiratoryRate: 7, // RR <= 8 => score 3
				oxygenSaturation: 98,
				supplementalOxygen: 'no',
				temperature: 36.8,
				consciousnessLevel: 'alert'
			})
		);
		expect(r.hasAnySingleScore3).toBe(true);
		expect(r.clinicalResponse).toBe('low-medium');
	});

	it('aggregates several deranged parameters into a medium response', () => {
		const r = calculateNEWS2(
			vitals({
				heartRate: 116, // 2
				systolicBP: 104, // 2
				respiratoryRate: 23, // 2
				oxygenSaturation: 94, // 1
				supplementalOxygen: 'no',
				temperature: 38.3, // 1
				consciousnessLevel: 'verbal' // 3
			})
		);
		expect(r.totalScore).toBeGreaterThanOrEqual(5);
		expect(r.clinicalResponse).toBe('high');
	});

	it('produces a high response for critically deranged vitals', () => {
		const r = calculateNEWS2(
			vitals({
				heartRate: 134, // 3
				systolicBP: 86, // 3
				respiratoryRate: 28, // 3
				oxygenSaturation: 90, // 3
				supplementalOxygen: 'yes', // 2
				temperature: 35.4, // 1
				consciousnessLevel: 'pain' // 3
			})
		);
		expect(r.totalScore).toBeGreaterThanOrEqual(7);
		expect(r.clinicalResponse).toBe('high');
	});
});

describe('detectFlaggedIssues', () => {
	it('flags low GCS, anaphylaxis allergy, and safeguarding', () => {
		const data = createDefaultAssessment();
		data.primarySurvey.disability.gcsTotal = 8;
		data.medicalHistory.allergies = [{ allergen: 'Latex', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }];
		data.safeguardingConsent.safeguardingConcern = 'yes';
		const news2 = calculateNEWS2(data.vitalSigns);
		const flags = detectFlaggedIssues(data, news2);
		const ids = flags.map((f) => f.id);
		expect(ids).toContain('gcs-low');
		expect(ids).toContain('anaphylaxis-history');
		expect(ids).toContain('safeguarding');
	});

	it('returns no flags for an unremarkable card', () => {
		const data = createDefaultAssessment();
		const news2 = calculateNEWS2(data.vitalSigns);
		expect(detectFlaggedIssues(data, news2)).toHaveLength(0);
	});
});
