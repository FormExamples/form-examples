import { describe, it, expect } from 'vitest';
import { gradeSundowner, sumCMAI, sumNPI } from './sundowner-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { createDefaultAssessment } from './defaults';
import type { AssessmentData } from './types';

/** Set every CMAI item to the same 1..7 score. */
function setAllCMAI(data: AssessmentData, score: number) {
	for (const id of Object.keys(data.behaviouralSymptoms.cmai)) {
		data.behaviouralSymptoms.cmai[id] = score;
	}
}

describe('Sundowner CMAI / NPI scoring', () => {
	it('blank assessment scores at the floor and classifies mild', () => {
		const data = createDefaultAssessment();
		const cmai = sumCMAI(data);
		expect(cmai.total).toBe(29); // 29 items × 1 (unanswered treated as "Never")
		expect(cmai.answered).toBe(0);
		const result = gradeSundowner(data);
		expect(result.cmaiScore).toBe(29);
		expect(result.npiScore).toBe(0);
		expect(result.severity).toBe('mild');
	});

	it('all items rated 2 → moderate band', () => {
		const data = createDefaultAssessment();
		setAllCMAI(data, 2); // 29 × 2 = 58
		const result = gradeSundowner(data);
		expect(result.cmaiScore).toBe(58);
		expect(result.cmaiAnsweredCount).toBe(29);
		expect(result.severity).toBe('moderate');
	});

	it('all items rated 3 → severe band', () => {
		const data = createDefaultAssessment();
		setAllCMAI(data, 3); // 29 × 3 = 87
		expect(gradeSundowner(data).severity).toBe('severe');
	});

	it('all items rated 5 → critical band', () => {
		const data = createDefaultAssessment();
		setAllCMAI(data, 5); // 29 × 5 = 145
		expect(gradeSundowner(data).severity).toBe('critical');
	});

	it('sums NPI domains as frequency × severity', () => {
		const data = createDefaultAssessment();
		data.behaviouralSymptoms.npi.sleep = { frequency: 4, severity: 3 }; // 12
		data.behaviouralSymptoms.npi.agitationAggression = { frequency: 3, severity: 2 }; // 6
		const npi = sumNPI(data);
		expect(npi.total).toBe(18);
		expect(npi.answered).toBe(2);
		expect(gradeSundowner(data).npiScore).toBe(18);
	});
});

describe('Sundowner flagged-issue detection', () => {
	it('returns no flags for a blank assessment', () => {
		expect(detectAdditionalFlags(createDefaultAssessment())).toHaveLength(0);
	});

	it('flags aggressive behaviour (CMAI item rated ≥ 4)', () => {
		const data = createDefaultAssessment();
		data.behaviouralSymptoms.cmai.cmai07 = 5; // hitting
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-AGGRESSION-001')).toBe(true);
	});

	it('flags prior delirium history as high priority', () => {
		const data = createDefaultAssessment();
		data.cognitiveStatus.priorDeliriumHistory = 'yes';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-DELIRIUM-001' && f.priority === 'high')).toBe(true);
	});

	it('flags severe carer strain', () => {
		const data = createDefaultAssessment();
		data.carerImpact.carerStrainLevel = 'severe';
		expect(detectAdditionalFlags(data).some((f) => f.id === 'FLAG-CARER-001')).toBe(true);
	});

	it('flags environmental contributors at low priority', () => {
		const data = createDefaultAssessment();
		data.environmentalAssessment.adequateDaylight = 'no';
		const flags = detectAdditionalFlags(data);
		expect(flags.some((f) => f.id === 'FLAG-ENV-001' && f.priority === 'low')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const data = createDefaultAssessment();
		data.cognitiveStatus.priorDeliriumHistory = 'yes'; // high
		data.triggerIdentification.infection = 'yes'; // medium
		data.environmentalAssessment.excessiveNoise = 'yes'; // low
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = detectAdditionalFlags(data).map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('produces unique flag ids', () => {
		const data = createDefaultAssessment();
		data.cognitiveStatus.priorDeliriumHistory = 'yes';
		data.behaviouralSymptoms.cmai.cmai07 = 5;
		data.medicationReview.antipsychoticUse = 'yes';
		const ids = detectAdditionalFlags(data).map((f) => f.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
