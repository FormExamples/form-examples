import { describe, it, expect } from 'vitest';
import { calculateSoapGrade } from './soap-note-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { requiredComponents, sectionPresence } from './soap-note-rules';
import type { AssessmentData } from './types';

/**
 * A blank note (mirrors the store's `createDefaultAssessment`). Defined locally
 * so the engine tests never import the store, which pulls in the SvelteKit-only
 * `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			encounteredAt: '',
			careSetting: '',
			encounterType: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		subjective: {
			presentingComplaint: '',
			historyOfPresentingComplaint: '',
			patientReportedSymptoms: '',
			relevantHistory: '',
			redFlagSymptoms: ''
		},
		objective: {
			examinationFindings: '',
			vitalSigns: '',
			abnormalVitalsPresent: '',
			investigationResults: ''
		},
		assessment: {
			primaryDiagnosis: '',
			problemList: '',
			differential: '',
			clinicalImpression: ''
		},
		plan: {
			investigationsPlan: '',
			treatmentPlan: '',
			referrals: '',
			followUp: '',
			safetyNetting: '',
			managedAtHome: ''
		},
		summary: { clinicalNote: '' }
	};
}

/** A fully-documented note: all four sections present, follow-up recorded. */
function createComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.subjective.presentingComplaint = 'Central chest pain for 2 hours.';
	d.subjective.historyOfPresentingComplaint = 'Sudden onset, radiates to left arm, eased with rest.';
	d.objective.examinationFindings = 'Chest clear, no focal signs.';
	d.assessment.primaryDiagnosis = 'Likely acute coronary syndrome.';
	d.plan.treatmentPlan = 'Aspirin 300 mg, GTN, urgent ECG.';
	d.plan.followUp = 'Admit under cardiology for observation.';
	return d;
}

describe('SOAP note section presence', () => {
	it('requires both complaint and history for Subjective', () => {
		const d = createDefaultAssessment();
		d.subjective.presentingComplaint = 'Cough';
		expect(sectionPresence(d).subjectivePresent).toBe(false);
		d.subjective.historyOfPresentingComplaint = 'Three days, productive.';
		expect(sectionPresence(d).subjectivePresent).toBe(true);
	});

	it('satisfies Objective with any one finding', () => {
		const d = createDefaultAssessment();
		d.objective.vitalSigns = 'HR 96, BP 148/92';
		expect(sectionPresence(d).objectivePresent).toBe(true);
	});
});

describe('SOAP note completeness grading', () => {
	it('grades an empty note incomplete with 0% (Assessment and Plan absent)', () => {
		const r = calculateSoapGrade(createDefaultAssessment());
		expect(r.status).toBe('incomplete');
		expect(r.completenessPercent).toBe(0);
		expect(r.presence.assessmentPresent).toBe(false);
		expect(r.presence.planPresent).toBe(false);
	});

	it('grades a fully-documented note complete with 100%', () => {
		const r = calculateSoapGrade(createComplete());
		expect(r.status).toBe('complete');
		expect(r.completenessPercent).toBe(100);
		expect(r.sectionStatuses.every((s) => s.present)).toBe(true);
	});

	it('grades a note incomplete when the Assessment is missing', () => {
		const d = createComplete();
		d.assessment.primaryDiagnosis = '';
		const r = calculateSoapGrade(d);
		expect(r.status).toBe('incomplete');
		expect(r.flags.some((f) => f.id === 'F-MISSING-ASSESSMENT-001')).toBe(true);
	});

	it('grades a note incomplete when the Plan is missing', () => {
		const d = createComplete();
		d.plan.treatmentPlan = '';
		d.plan.followUp = '';
		const r = calculateSoapGrade(d);
		expect(r.status).toBe('incomplete');
		expect(r.flags.some((f) => f.id === 'F-MISSING-PLAN-001')).toBe(true);
	});

	it('grades a note partial when both critical sections present but a component is missing', () => {
		const d = createComplete();
		// Remove the follow-up so the conditional follow-up component is unmet,
		// but keep another plan item so Plan is still present.
		d.plan.followUp = '';
		const r = calculateSoapGrade(d);
		expect(r.presence.assessmentPresent).toBe(true);
		expect(r.presence.planPresent).toBe(true);
		expect(r.completenessPercent).toBeLessThan(100);
		expect(r.status).toBe('partial');
	});

	it('adds a conditional safety-netting component when red flags are present', () => {
		const d = createComplete();
		d.subjective.redFlagSymptoms = 'yes';
		const withNetting = requiredComponents(d);
		expect(withNetting.some((c) => c.id === 'R-SAFETY-NETTING-01')).toBe(true);
	});
});

describe('SOAP note flagged-issue detection', () => {
	it('raises red-flag-no-plan when red flags recorded but Plan empty', () => {
		const d = createDefaultAssessment();
		d.subjective.redFlagSymptoms = 'yes';
		const g = calculateSoapGrade(d);
		expect(g.flags.some((f) => f.id === 'F-RED-FLAG-NO-PLAN-001')).toBe(true);
	});

	it('raises no-safety-netting when required but absent', () => {
		const d = createComplete();
		d.plan.managedAtHome = 'yes';
		const g = calculateSoapGrade(d);
		expect(g.flags.some((f) => f.id === 'F-NO-SAFETY-NETTING-001')).toBe(true);
		// And clears once safety-netting is recorded.
		d.plan.safetyNetting = 'Return if pain worsens or breathlessness develops.';
		const g2 = calculateSoapGrade(d);
		expect(g2.flags.some((f) => f.id === 'F-NO-SAFETY-NETTING-001')).toBe(false);
	});

	it('raises abnormal-vitals-unaddressed when vitals flagged but no Assessment or Plan', () => {
		const d = createDefaultAssessment();
		d.objective.abnormalVitalsPresent = 'yes';
		const flags = detectFlaggedIssues(d, {
			presence: sectionPresence(d),
			completenessPercent: 0
		});
		expect(flags.some((f) => f.id === 'F-ABNORMAL-VITALS-UNADDRESSED-001')).toBe(true);
	});

	it('raises incomplete-documentation whenever below 100%', () => {
		const d = createDefaultAssessment();
		const g = calculateSoapGrade(d);
		expect(g.flags.some((f) => f.id === 'F-INCOMPLETE-DOCUMENTATION-001')).toBe(true);
	});

	it('raises no safety flags for a fully-documented note', () => {
		const g = calculateSoapGrade(createComplete());
		expect(g.flags).toHaveLength(0);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.subjective.redFlagSymptoms = 'yes'; // high (no plan) + medium (no netting)
		const g = calculateSoapGrade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = g.flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('all required-component IDs are unique for a red-flag encounter with a plan', () => {
		const d = createComplete();
		d.subjective.redFlagSymptoms = 'yes';
		const ids = requiredComponents(d).map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
