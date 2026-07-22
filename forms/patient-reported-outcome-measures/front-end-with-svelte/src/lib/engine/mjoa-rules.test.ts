import { describe, expect, it } from 'vitest';
import { computeMjoa } from './mjoa-rules';
import type { MjoaResponse } from './types';

function emptyMjoa(): MjoaResponse {
	return {
		motorArms: null,
		motorLegs: null,
		sensationArms: null,
		sensationLegs: null,
		sensationTrunk: null,
		bladderFunction: null
	};
}

describe('computeMjoa', () => {
	it('scores 17 / mild when every subscale is at its maximum (no deficit)', () => {
		const data: MjoaResponse = {
			motorArms: 4,
			motorLegs: 4,
			sensationArms: 2,
			sensationLegs: 2,
			sensationTrunk: 2,
			bladderFunction: 3
		};
		const result = computeMjoa(data);
		expect(result.totalScore).toBe(17);
		expect(result.band).toBe('mild');
	});

	it('scores 0 / severe when every subscale is at its minimum (worst)', () => {
		const data: MjoaResponse = {
			motorArms: 0,
			motorLegs: 0,
			sensationArms: 0,
			sensationLegs: 0,
			sensationTrunk: 0,
			bladderFunction: 0
		};
		const result = computeMjoa(data);
		expect(result.totalScore).toBe(0);
		expect(result.band).toBe('severe');
	});

	it('reports the correct band at the 15/14 and 12/11 boundaries', () => {
		// totalScore 15 -> mild (>= 15).
		const at15: MjoaResponse = {
			motorArms: 4,
			motorLegs: 4,
			sensationArms: 2,
			sensationLegs: 2,
			sensationTrunk: 2,
			bladderFunction: 1
		};
		expect(computeMjoa(at15).totalScore).toBe(15);
		expect(computeMjoa(at15).band).toBe('mild');

		// totalScore 14 -> moderate (< 15, >= 12).
		const at14: MjoaResponse = { ...at15, bladderFunction: 0 };
		expect(computeMjoa(at14).totalScore).toBe(14);
		expect(computeMjoa(at14).band).toBe('moderate');

		// totalScore 12 -> moderate (>= 12).
		const at12: MjoaResponse = {
			motorArms: 3,
			motorLegs: 3,
			sensationArms: 2,
			sensationLegs: 2,
			sensationTrunk: 2,
			bladderFunction: 0
		};
		expect(computeMjoa(at12).totalScore).toBe(12);
		expect(computeMjoa(at12).band).toBe('moderate');

		// totalScore 11 -> severe (< 12).
		const at11: MjoaResponse = { ...at12, sensationTrunk: 1 };
		expect(computeMjoa(at11).totalScore).toBe(11);
		expect(computeMjoa(at11).band).toBe('severe');
	});

	it('returns null totalScore and empty band when any subscale is missing', () => {
		const data = emptyMjoa();
		data.motorArms = 4;
		data.motorLegs = 4;
		data.sensationArms = 2;
		data.sensationLegs = 2;
		data.sensationTrunk = 2;
		// bladderFunction left unanswered.
		const result = computeMjoa(data);
		expect(result.totalScore).toBeNull();
		expect(result.band).toBe('');
	});

	it('returns null when nothing at all is answered', () => {
		const result = computeMjoa(emptyMjoa());
		expect(result.totalScore).toBeNull();
		expect(result.band).toBe('');
	});
});
