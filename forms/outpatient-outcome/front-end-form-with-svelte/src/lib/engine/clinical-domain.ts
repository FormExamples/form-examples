import type { AssessmentData, DomainGrade, FiredRule } from './types';

/**
 * Grade the Clinical domain from the clinician-rated outcome classification.
 *
 * A = Resolved
 * B = Improved
 * C = Unchanged
 * D = Worsened
 * E = Died
 * '' = No classification entered
 */
export function gradeClinical(data: AssessmentData): { grade: DomainGrade; rules: FiredRule[] } {
	const cls = data.clinicalOutcome.outcomeClassification;
	const rules: FiredRule[] = [];

	let grade: DomainGrade = '';

	switch (cls) {
		case 'resolved':
			grade = 'A';
			rules.push({
				id: 'CLIN-001',
				domain: 'Clinical',
				description: 'Outcome classified as Resolved',
				grade: 'A'
			});
			break;
		case 'improved':
			grade = 'B';
			rules.push({
				id: 'CLIN-002',
				domain: 'Clinical',
				description: 'Outcome classified as Improved',
				grade: 'B'
			});
			break;
		case 'unchanged':
			grade = 'C';
			rules.push({
				id: 'CLIN-003',
				domain: 'Clinical',
				description: 'Outcome classified as Unchanged',
				grade: 'C'
			});
			break;
		case 'worsened':
			grade = 'D';
			rules.push({
				id: 'CLIN-004',
				domain: 'Clinical',
				description: 'Outcome classified as Worsened',
				grade: 'D'
			});
			break;
		case 'died':
			grade = 'E';
			rules.push({
				id: 'CLIN-005',
				domain: 'Clinical',
				description: 'Outcome classified as Died',
				grade: 'E'
			});
			break;
		default:
			// No classification — insufficient data
			grade = '';
			break;
	}

	return { grade, rules };
}
