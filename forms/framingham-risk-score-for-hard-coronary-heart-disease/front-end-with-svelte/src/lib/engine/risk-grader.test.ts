import { describe, it, expect } from 'vitest';
import { calculateRisk } from './risk-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';
import type { AssessmentData } from './types';

function withDemographics(over: Partial<AssessmentData['demographics']>): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, ...over };
	return d;
}

describe('calculateRisk', () => {
	it('returns draft when age and sex are missing', () => {
		const d = createDefaultAssessment();
		const r = calculateRisk(d);
		expect(r.riskCategory).toBe('draft');
		expect(r.tenYearRiskPercent).toBe(0);
	});

	it('produces a low category for a favourable middle-aged non-smoker', () => {
		const d = withDemographics({ age: 49, sex: 'male' });
		d.smokingHistory.smokingStatus = 'never';
		d.bloodPressure = { ...d.bloodPressure, systolicBp: 118, onBpTreatment: 'no' };
		d.cholesterol = { ...d.cholesterol, totalCholesterol: 180, hdlCholesterol: 60, cholesterolUnit: 'mgDl' };
		const r = calculateRisk(d);
		expect(r.tenYearRiskPercent).toBeLessThan(10);
		expect(r.riskCategory).toBe('low');
	});

	it('produces a high category for an older smoker with severe risk factors', () => {
		const d = withDemographics({ age: 75, sex: 'male' });
		d.smokingHistory.smokingStatus = 'current';
		d.bloodPressure = { ...d.bloodPressure, systolicBp: 184, onBpTreatment: 'no' };
		d.cholesterol = { ...d.cholesterol, totalCholesterol: 312, hdlCholesterol: 30, cholesterolUnit: 'mgDl' };
		const r = calculateRisk(d);
		expect(r.tenYearRiskPercent).toBeGreaterThanOrEqual(20);
		expect(r.riskCategory).toBe('high');
	});

	it('treated blood pressure increases the risk versus untreated', () => {
		const base = withDemographics({ age: 60, sex: 'female' });
		base.smokingHistory.smokingStatus = 'never';
		base.cholesterol = { ...base.cholesterol, totalCholesterol: 240, hdlCholesterol: 45, cholesterolUnit: 'mgDl' };

		const untreated = structuredClone(base);
		untreated.bloodPressure = { ...untreated.bloodPressure, systolicBp: 150, onBpTreatment: 'no' };

		const treated = structuredClone(base);
		treated.bloodPressure = { ...treated.bloodPressure, systolicBp: 150, onBpTreatment: 'yes' };

		expect(calculateRisk(treated).tenYearRiskPercent).toBeGreaterThan(
			calculateRisk(untreated).tenYearRiskPercent
		);
	});

	it('converts mmol/L cholesterol before scoring', () => {
		const mg = withDemographics({ age: 55, sex: 'male' });
		mg.cholesterol = { ...mg.cholesterol, totalCholesterol: 232, hdlCholesterol: 38.67, cholesterolUnit: 'mgDl' };

		const mmol = withDemographics({ age: 55, sex: 'male' });
		mmol.cholesterol = { ...mmol.cholesterol, totalCholesterol: 6, hdlCholesterol: 1, cholesterolUnit: 'mmolL' };

		expect(calculateRisk(mmol).tenYearRiskPercent).toBeCloseTo(
			calculateRisk(mg).tenYearRiskPercent,
			0
		);
	});
});

describe('detectAdditionalFlags', () => {
	it('flags diabetes as an eligibility issue', () => {
		const d = withDemographics({ age: 60, sex: 'male' });
		d.medicalHistory.hasDiabetes = 'yes';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-ELIG-003')).toBe(true);
	});

	it('flags a current smoker', () => {
		const d = withDemographics({ age: 60, sex: 'female' });
		d.smokingHistory.smokingStatus = 'current';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-SMOKE-001')).toBe(true);
	});
});
