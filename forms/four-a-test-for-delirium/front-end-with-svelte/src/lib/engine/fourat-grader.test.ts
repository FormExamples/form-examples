import { describe, it, expect } from 'vitest';
import { calculateFourATGrade } from './fourat-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { fouratRules } from './fourat-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		identification: {
			patientIdentifier: '',
			patientName: '',
			dateOfBirth: null,
			assessmentDate: null,
			assessmentTime: null,
			setting: '',
			assessorName: '',
			assessorRole: ''
		},
		item1: { alertness: '' },
		item2: { amt4: '' },
		item3: { attentionMonths: '' },
		item4: { acuteChange: '', acuteChangeSource: '' },
		note: { clinicalNotes: '' }
	};
}

/** A fully-answered, all-negative (score 0) assessment. */
function createNegativePatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification = {
		patientIdentifier: 'MRN-1001',
		patientName: 'Test, Pat',
		dateOfBirth: '1948-03-02',
		assessmentDate: '2026-06-20',
		assessmentTime: '09:30',
		setting: 'acute',
		assessorName: 'Dr A. Khan',
		assessorRole: 'Registrar'
	};
	d.item1.alertness = 'normal';
	d.item2.amt4 = 'noMistakes';
	d.item3.attentionMonths = 'sevenOrMore';
	d.item4.acuteChange = 'no';
	d.item4.acuteChangeSource = 'collateral';
	return d;
}

describe('4AT grading engine', () => {
	it('scores 0 for a fully-negative patient (delirium unlikely)', () => {
		const r = calculateFourATGrade(createNegativePatient());
		expect(r.totalScore).toBe(0);
		expect(r.item1Score).toBe(0);
		expect(r.item2Score).toBe(0);
		expect(r.item3Score).toBe(0);
		expect(r.item4Score).toBe(0);
		expect(r.interpretationBand).toBe('unlikely');
	});

	it('mild transient sleepiness scores item 1 as 0', () => {
		const d = createNegativePatient();
		d.item1.alertness = 'mildTransient';
		expect(calculateFourATGrade(d).item1Score).toBe(0);
	});

	it('abnormal alertness scores item 1 as 4', () => {
		const d = createNegativePatient();
		d.item1.alertness = 'abnormal';
		const r = calculateFourATGrade(d);
		expect(r.item1Score).toBe(4);
		expect(r.totalScore).toBe(4);
		expect(r.interpretationBand).toBe('possibleDelirium');
	});

	it('AMT4 mistake bands score 1 and 2', () => {
		const d1 = createNegativePatient();
		d1.item2.amt4 = 'oneMistake';
		expect(calculateFourATGrade(d1).item2Score).toBe(1);

		const d2 = createNegativePatient();
		d2.item2.amt4 = 'twoOrMoreOrUntestable';
		expect(calculateFourATGrade(d2).item2Score).toBe(2);
	});

	it('attention bands score 1 and 2', () => {
		const d1 = createNegativePatient();
		d1.item3.attentionMonths = 'startsButUnderSevenOrRefuses';
		expect(calculateFourATGrade(d1).item3Score).toBe(1);

		const d2 = createNegativePatient();
		d2.item3.attentionMonths = 'untestable';
		expect(calculateFourATGrade(d2).item3Score).toBe(2);
	});

	it('acute change present scores item 4 as 4', () => {
		const d = createNegativePatient();
		d.item4.acuteChange = 'yes';
		d.item4.acuteChangeSource = 'collateral';
		expect(calculateFourATGrade(d).item4Score).toBe(4);
	});

	it('bands: 1-3 is possible cognitive impairment', () => {
		const d = createNegativePatient();
		d.item2.amt4 = 'oneMistake'; // 1
		d.item3.attentionMonths = 'startsButUnderSevenOrRefuses'; // 1
		const r = calculateFourATGrade(d);
		expect(r.totalScore).toBe(2);
		expect(r.interpretationBand).toBe('possibleCognitiveImpairment');
	});

	it('reaches the maximum total of 12', () => {
		const d = createNegativePatient();
		d.item1.alertness = 'abnormal'; // 4
		d.item2.amt4 = 'twoOrMoreOrUntestable'; // 2
		d.item3.attentionMonths = 'untestable'; // 2
		d.item4.acuteChange = 'yes'; // 4
		const r = calculateFourATGrade(d);
		expect(r.totalScore).toBe(12);
		expect(r.interpretationBand).toBe('possibleDelirium');
	});

	it('an unanswered assessment contributes 0 points and is unlikely', () => {
		const r = calculateFourATGrade(createDefaultAssessment());
		expect(r.totalScore).toBe(0);
		expect(r.interpretationBand).toBe('unlikely');
	});

	it('all rule IDs are unique', () => {
		const ids = fouratRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('4AT flagged-issue detection', () => {
	it('raises no red flags for a complete negative patient', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the possible-delirium flag when total >= 4', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 8);
		expect(flags.some((f) => f.id === 'F-POSSIBLE-DELIRIUM-001')).toBe(true);
	});

	it('raises abnormal-alertness and acute-change flags', () => {
		const d = createNegativePatient();
		d.item1.alertness = 'abnormal';
		d.item4.acuteChange = 'yes';
		const flags = detectFlaggedIssues(d, 8);
		expect(flags.some((f) => f.id === 'F-ABNORMAL-ALERTNESS-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-ACUTE-CHANGE-PRESENT-001')).toBe(true);
	});

	it('raises the possible-cognitive-impairment flag when total is 1-3', () => {
		const flags = detectFlaggedIssues(createNegativePatient(), 2);
		expect(flags.some((f) => f.id === 'F-POSSIBLE-COGNITIVE-IMPAIRMENT-001')).toBe(true);
	});

	it('raises the incomplete-acute-change flag when item 4 is unreliable and total is 0', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-ACUTE-CHANGE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createNegativePatient();
		d.item1.alertness = 'abnormal'; // high
		const flags = detectFlaggedIssues(d, 2); // also medium (cognitive impairment)
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
