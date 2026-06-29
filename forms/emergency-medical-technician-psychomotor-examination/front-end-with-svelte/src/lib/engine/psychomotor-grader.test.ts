import { describe, it, expect } from 'vitest';
import { gradePsychomotor } from './psychomotor-grader';
import { psychomotorRules, CRITICAL_RULE_IDS } from './rules';
import type { AssessmentData, TriState } from './types';

// A blank examination, mirroring the store's createDefaultAssessment(). Built
// locally so the test never imports the runes-based store (vitest cannot
// compile `$state`).
function createDefaultAssessment(): AssessmentData {
	return {
		candidateExaminerScenario: {
			candidateFirstName: '',
			candidateLastName: '',
			candidateId: '',
			attempt: '',
			examinerName: '',
			sessionDate: '',
			stationLocation: '',
			scenarioSummary: '',
			chiefComplaintGiven: ''
		},
		sceneSizeUp: {
			ppePrecautions: '',
			sceneSafe: '',
			mechanismOrNature: '',
			numberOfPatients: '',
			additionalResources: '',
			considersCspine: ''
		},
		primarySurvey: {
			generalImpression: '',
			mentalStatus: '',
			airway: '',
			breathing: '',
			oxygenTherapy: '',
			circulation: '',
			transportPriority: ''
		},
		historySecondaryAssessment: {
			chiefComplaint: '',
			historyOnsetOpqrst: '',
			sampleSignsSymptoms: '',
			sampleAllergies: '',
			sampleMedications: '',
			samplePastHistory: '',
			sampleLastIntake: '',
			sampleEvents: '',
			focusedExam: '',
			baselineVitalsBp: '',
			baselineVitalsPulse: '',
			baselineVitalsRespirations: '',
			fieldImpression: '',
			interventions: ''
		},
		reassessment: {
			repeatsMentalStatus: '',
			repeatsAirway: '',
			repeatsBreathing: '',
			repeatsCirculation: '',
			repeatsVitals: '',
			repeatsFocusedExam: '',
			evaluatesInterventions: '',
			transportInterventions: '',
			fifteenMinuteCall: ''
		},
		criticalCriteriaReview: {
			dangerousIntervention: '',
			spinalProtection: '',
			examinerNotes: '',
			debriefNotes: ''
		}
	};
}

/** A candidate who performed every checklist item correctly. */
function perfectCandidate(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidateExaminerScenario.candidateFirstName = 'Yusuf';
	d.candidateExaminerScenario.candidateLastName = 'Ahmed';
	d.candidateExaminerScenario.attempt = 'first-attempt';
	const yes = (obj: object) => {
		const rec = obj as Record<string, unknown>;
		for (const k of Object.keys(rec)) {
			if (rec[k] === '') rec[k] = 'yes' as TriState;
		}
	};
	yes(d.sceneSizeUp);
	yes(d.primarySurvey);
	yes(d.historySecondaryAssessment);
	yes(d.reassessment);
	// Critical-criteria review: positively phrased, so 'yes' = good.
	d.criticalCriteriaReview.dangerousIntervention = 'yes';
	d.criticalCriteriaReview.spinalProtection = 'yes';
	return d;
}

describe('EMT Psychomotor Grading Engine', () => {
	it('passes a candidate who performed every item correctly', () => {
		const result = gradePsychomotor(perfectCandidate());
		expect(result.outcome).toBe('pass');
		expect(result.criticalFailures).toHaveLength(0);
		expect(result.points).toBe(result.maxPoints);
		expect(result.percent).toBe(100);
	});

	it('fails on any single critical-criterion deficiency regardless of points', () => {
		const d = perfectCandidate();
		d.sceneSizeUp.ppePrecautions = 'no'; // critical
		const result = gradePsychomotor(d);
		expect(result.outcome).toBe('fail');
		expect(result.criticalFailures.some((r) => r.id === 'EMT-SS-PPE')).toBe(true);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-CRIT-EMT-SS-PPE')).toBe(true);
	});

	it('fails when the point total is below the 80% threshold (no critical fail)', () => {
		const d = perfectCandidate();
		// Knock out several non-critical items so percent drops below 80%.
		d.historySecondaryAssessment.sampleSignsSymptoms = 'no';
		d.historySecondaryAssessment.sampleAllergies = 'no';
		d.historySecondaryAssessment.sampleMedications = 'no';
		d.historySecondaryAssessment.samplePastHistory = 'no';
		d.historySecondaryAssessment.sampleLastIntake = 'no';
		d.historySecondaryAssessment.sampleEvents = 'no';
		d.historySecondaryAssessment.focusedExam = 'no';
		d.historySecondaryAssessment.baselineVitalsBp = 'no';
		d.reassessment.repeatsMentalStatus = 'no';
		d.reassessment.repeatsAirway = 'no';
		d.reassessment.repeatsBreathing = 'no';
		const result = gradePsychomotor(d);
		expect(result.criticalFailures).toHaveLength(0);
		expect(result.percent).toBeLessThan(80);
		expect(result.outcome).toBe('fail');
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-BELOW-THRESHOLD')).toBe(true);
	});

	it("excludes 'na' and unanswered items from the denominator", () => {
		const d = perfectCandidate();
		d.sceneSizeUp.additionalResources = 'na';
		const result = gradePsychomotor(d);
		// 'na' removed one possible point but the candidate still scored 100%.
		expect(result.percent).toBe(100);
		expect(result.outcome).toBe('pass');
	});

	it('returns a Fail when nothing has been assessed yet', () => {
		const result = gradePsychomotor(createDefaultAssessment());
		expect(result.answeredCount).toBe(0);
		expect(result.outcome).toBe('fail');
	});

	it('has unique rule ids', () => {
		const ids = psychomotorRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('marks every CRITICAL_RULE_IDS entry as a critical rule', () => {
		for (const id of CRITICAL_RULE_IDS) {
			const rule = psychomotorRules.find((r) => r.id === id);
			expect(rule, `rule ${id} should exist`).toBeTruthy();
			expect(rule?.critical).toBe(true);
		}
	});

	it('sorts flags by priority (high first)', () => {
		const d = perfectCandidate();
		d.sceneSizeUp.ppePrecautions = 'no';
		d.criticalCriteriaReview.examinerNotes = 'Coach on PPE.';
		const flags = gradePsychomotor(d).additionalFlags;
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
