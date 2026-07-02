import { describe, it, expect } from 'vitest';
import { calculateGcsGrade } from './gcs-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { eyeOptions, verbalOptions, motorOptions } from './gcs-rules';
import type { AssessmentData } from './types';

/**
 * A blank assessment (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: { assessorName: '', assessorRole: '', assessedAt: '', setting: '', reason: '' },
		confounders: { intubated: '', sedated: '', paralysed: '' },
		eye: { eyeResponse: '', eyeNotTestableReason: '' },
		verbal: { verbalResponse: '', verbalNotTestableReason: '' },
		motor: { motorResponse: '', motorNotTestableReason: '' },
		pupils: {
			leftPupilReactivity: '',
			rightPupilReactivity: '',
			leftPupilSizeMm: null,
			rightPupilSizeMm: null
		},
		trend: { previousTotal: null, previousMotorScore: null, previousAssessedAt: '' },
		note: { clinicalNote: '' }
	};
}

/** A fully-testable patient scoring E4 V5 M6 = 15 (mild), both pupils reactive. */
function createMildPatient(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr A. Khan',
		assessorRole: 'doctor',
		assessedAt: '2026-06-24T09:30',
		setting: 'ed',
		reason: 'Head injury observation'
	};
	d.eye.eyeResponse = 'spontaneous';
	d.verbal.verbalResponse = 'orientated';
	d.motor.motorResponse = 'obeys-commands';
	d.pupils.leftPupilReactivity = 'reactive';
	d.pupils.rightPupilReactivity = 'reactive';
	return d;
}

describe('GCS grading engine', () => {
	it('scores a fully-testable mild patient E4 V5 M6 = 15', () => {
		const r = calculateGcsGrade(createMildPatient());
		expect(r.eyeScore).toBe(4);
		expect(r.verbalScore).toBe(5);
		expect(r.motorScore).toBe(6);
		expect(r.totalScore).toBe(15);
		expect(r.severityBand).toBe('mild');
		expect(r.breakdown).toBe('E4 V5 M6');
		expect(r.totalDisplay).toBe('15');
	});

	it('resolves descriptor tables to the correct scores', () => {
		expect(eyeOptions.find((o) => o.value === 'to-sound')?.score).toBe(3);
		expect(verbalOptions.find((o) => o.value === 'confused')?.score).toBe(4);
		expect(motorOptions.find((o) => o.value === 'localising')?.score).toBe(5);
		expect(eyeOptions.find((o) => o.value === 'NT')?.score).toBe(null);
	});

	it('bands a moderate total (9-12)', () => {
		const d = createMildPatient();
		d.eye.eyeResponse = 'to-sound'; // 3
		d.verbal.verbalResponse = 'confused'; // 4
		d.motor.motorResponse = 'normal-flexion'; // 4
		const r = calculateGcsGrade(d);
		expect(r.totalScore).toBe(11);
		expect(r.severityBand).toBe('moderate');
	});

	it('bands a severe total (3-8) and raises the airway-risk flag', () => {
		const d = createMildPatient();
		d.eye.eyeResponse = 'to-pressure'; // 2
		d.verbal.verbalResponse = 'sounds'; // 2
		d.motor.motorResponse = 'extension'; // 2
		const r = calculateGcsGrade(d);
		expect(r.totalScore).toBe(6);
		expect(r.severityBand).toBe('severe');
		expect(r.flaggedIssues.some((f) => f.id === 'F-AIRWAY-RISK-001')).toBe(true);
	});

	it('leaves the total null when any component is NT', () => {
		const d = createMildPatient();
		d.verbal.verbalResponse = 'NT';
		const r = calculateGcsGrade(d);
		expect(r.totalScore).toBe(null);
		expect(r.severityBand).toBe('');
		expect(r.breakdown).toBe('E4 V-NT M6');
		expect(r.flaggedIssues.some((f) => f.id === 'F-UNTESTABLE-COMPONENT-001')).toBe(true);
	});

	it('uses the "9T" convention for an intubated verbal-NT patient', () => {
		const d = createMildPatient();
		d.eye.eyeResponse = 'to-sound'; // 3
		d.motor.motorResponse = 'localising'; // 5 → 3+5 = 8
		d.verbal.verbalResponse = 'NT';
		d.confounders.intubated = 'yes';
		const r = calculateGcsGrade(d);
		expect(r.totalScore).toBe(null);
		expect(r.totalDisplay).toBe('8T');
	});

	it('computes the pupil reactivity score and GCS-Pupils', () => {
		const d = createMildPatient(); // total 15, both reactive → PRS 0
		expect(calculateGcsGrade(d).pupilReactivityScore).toBe(0);
		expect(calculateGcsGrade(d).gcsP).toBe(15);

		d.pupils.leftPupilReactivity = 'unreactive';
		const r = calculateGcsGrade(d);
		expect(r.pupilReactivityScore).toBe(1);
		expect(r.gcsP).toBe(14);
	});

	it('a blank assessment yields null outputs', () => {
		const r = calculateGcsGrade(createDefaultAssessment());
		expect(r.totalScore).toBe(null);
		expect(r.severityBand).toBe('');
		expect(r.gcsP).toBe(null);
	});

	it('all fired rule IDs are unique for a scored patient', () => {
		const ids = calculateGcsGrade(createMildPatient()).firedRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('GCS flagged-issue detection', () => {
	const grade = (d: AssessmentData) => {
		const r = calculateGcsGrade(d);
		return {
			totalScore: r.totalScore,
			motorScore: r.motorScore,
			eyeScore: r.eyeScore,
			verbalScore: r.verbalScore,
			pupilReactivityScore: r.pupilReactivityScore
		};
	};

	it('raises no red flags for a complete mild patient', () => {
		const d = createMildPatient();
		expect(detectFlaggedIssues(d, grade(d))).toHaveLength(0);
	});

	it('raises deteriorating GCS when the total falls by >= 2', () => {
		const d = createMildPatient();
		d.eye.eyeResponse = 'to-sound'; // 3
		d.verbal.verbalResponse = 'confused'; // 4
		d.motor.motorResponse = 'localising'; // 5 → 12
		d.trend.previousTotal = 15;
		expect(detectFlaggedIssues(d, grade(d)).some((f) => f.id === 'F-DETERIORATING-001')).toBe(true);
	});

	it('raises unequal/unreactive pupils when a pupil is fixed', () => {
		const d = createMildPatient();
		d.pupils.rightPupilReactivity = 'unreactive';
		expect(detectFlaggedIssues(d, grade(d)).some((f) => f.id === 'F-UNEQUAL-PUPILS-001')).toBe(
			true
		);
	});

	it('raises falling-motor with a stable total', () => {
		const d = createMildPatient(); // motor 6, total 15
		d.motor.motorResponse = 'localising'; // 5 → total 14 (fall of 1, not >=2)
		d.trend.previousMotorScore = 6;
		d.trend.previousTotal = 15;
		const flags = detectFlaggedIssues(d, grade(d));
		expect(flags.some((f) => f.id === 'F-FALLING-MOTOR-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createMildPatient();
		d.eye.eyeResponse = 'to-pressure'; // 2
		d.verbal.verbalResponse = 'sounds'; // 2
		d.motor.motorResponse = 'localising'; // 5 → 9 (moderate, no coma)
		d.motor.motorResponse = 'extension'; // 2 → 6 (coma, high)
		d.trend.previousMotorScore = 6; // motor fell → medium
		const flags = detectFlaggedIssues(d, grade(d));
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
