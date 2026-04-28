import type { AssessmentData, DomainGrade, FiredRule } from './types';

/**
 * Grade the PREM domain from the NHS Friends and Family Test (FFT) response.
 *
 * FFT maps to the OOCG grade as follows (NHS FFT scale):
 * - extremely_likely  → A (Very Good)
 * - likely            → B (Good)
 * - neither           → C (Neither good nor poor)
 * - unlikely          → D (Poor)
 * - extremely_unlikely → E (Very Poor)
 * - dont_know / ''    → '' (data quality flag — no grade assigned)
 */
export function gradePREM(data: AssessmentData): { grade: DomainGrade; rules: FiredRule[] } {
	const fft = data.premFft.fftResponse;
	const rules: FiredRule[] = [];

	let grade: DomainGrade = '';

	switch (fft) {
		case 'extremely_likely':
			grade = 'A';
			rules.push({
				id: 'PREM-001',
				domain: 'PREM',
				description: 'FFT response: Extremely Likely (Very Good)',
				grade: 'A'
			});
			break;
		case 'likely':
			grade = 'B';
			rules.push({
				id: 'PREM-002',
				domain: 'PREM',
				description: 'FFT response: Likely (Good)',
				grade: 'B'
			});
			break;
		case 'neither':
			grade = 'C';
			rules.push({
				id: 'PREM-003',
				domain: 'PREM',
				description: 'FFT response: Neither good nor poor',
				grade: 'C'
			});
			break;
		case 'unlikely':
			grade = 'D';
			rules.push({
				id: 'PREM-004',
				domain: 'PREM',
				description: 'FFT response: Unlikely (Poor)',
				grade: 'D'
			});
			break;
		case 'extremely_unlikely':
			grade = 'E';
			rules.push({
				id: 'PREM-005',
				domain: 'PREM',
				description: 'FFT response: Extremely Unlikely (Very Poor)',
				grade: 'E'
			});
			break;
		default:
			// dont_know or '' → data-quality issue; no grade
			grade = '';
			break;
	}

	return { grade, rules };
}
