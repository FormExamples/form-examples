import { describe, it, expect } from 'vitest';
import { calculateWardRoundGrade } from './ward-round-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { componentPresence, requiredComponents } from './ward-round-rules';
import type { AssessmentData } from './types';

/**
 * A blank note (mirrors the store's `createDefaultAssessment`). Defined locally
 * so the engine tests never import the store, which pulls in the SvelteKit-only
 * `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		header: { clinicianName: '', clinicianGrade: '', reviewedAt: '', ward: '' },
		identification: { patientIdentifier: '', admissionDate: '', primaryDiagnosis: '' },
		overnight: { overnightEvents: '', noOvernightEvents: '' },
		problems: { problemList: '' },
		examination: {
			examinationSummary: '',
			news2Total: null,
			news2SingleParamThree: '',
			observationTrend: ''
		},
		investigations: {
			investigationsReviewed: '',
			noInvestigationsOutstanding: '',
			abnormalResultFlagged: '',
			abnormalResultActioned: ''
		},
		vte: { vteStatus: '', vteProphylaxisInPlace: '' },
		medication: { medicationChanges: '', noMedicationChanges: '' },
		plan: { planAndJobs: '' },
		escalation: {
			escalationStatus: '',
			seniorReviewPresent: '',
			estimatedDischargeDate: '',
			dischargeNotEstimable: ''
		},
		summary: { clinicalNote: '' }
	};
}

/** A fully-documented note: all eight required components documented. */
function createComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.header = {
		clinicianName: 'Dr A. Okafor',
		clinicianGrade: 'specialty-registrar',
		reviewedAt: '2026-06-22T09:20',
		ward: 'Ward 12B, AMU'
	};
	d.problems.problemList = '1. CAP — improving. 2. AKI stage 1 — resolving.';
	d.examination.examinationSummary = 'Chest clear, comfortable at rest.';
	d.examination.news2Total = 2;
	d.investigations.investigationsReviewed = 'CRP 84 (down from 120), U&Es normal.';
	d.vte.vteStatus = 'assessed';
	d.medication.medicationChanges = 'Switched IV to oral antibiotics.';
	d.plan.planAndJobs = 'Continue oral antibiotics. Repeat U&Es tomorrow. Physio review.';
	d.escalation.escalationStatus = 'for-full-escalation';
	return d;
}

describe('Ward round note component presence', () => {
	it('requires name, grade, and time for the header', () => {
		const d = createDefaultAssessment();
		d.header.clinicianName = 'Dr A. Okafor';
		d.header.clinicianGrade = 'consultant';
		expect(componentPresence(d).header).toBe(false);
		d.header.reviewedAt = '2026-06-22T09:20';
		expect(componentPresence(d).header).toBe(true);
	});

	it('requires an examination summary AND a NEWS2 total for examination', () => {
		const d = createDefaultAssessment();
		d.examination.examinationSummary = 'Chest clear.';
		expect(componentPresence(d).examination).toBe(false);
		d.examination.news2Total = 0;
		expect(componentPresence(d).examination).toBe(true);
	});

	it('counts an explicit negative as documented (medication "no changes")', () => {
		const d = createDefaultAssessment();
		expect(componentPresence(d).medication).toBe(false);
		d.medication.noMedicationChanges = 'yes';
		expect(componentPresence(d).medication).toBe(true);
	});

	it('counts "none outstanding" as documenting investigations', () => {
		const d = createDefaultAssessment();
		expect(componentPresence(d).investigations).toBe(false);
		d.investigations.noInvestigationsOutstanding = 'yes';
		expect(componentPresence(d).investigations).toBe(true);
	});

	it('does not count "not-recorded" escalation as documented', () => {
		const d = createDefaultAssessment();
		d.escalation.escalationStatus = 'not-recorded';
		expect(componentPresence(d).escalation).toBe(false);
		d.escalation.escalationStatus = 'dnacpr';
		expect(componentPresence(d).escalation).toBe(true);
	});
});

describe('Ward round note completeness grading', () => {
	it('grades an empty note incomplete with 0%', () => {
		const r = calculateWardRoundGrade(createDefaultAssessment());
		expect(r.status).toBe('incomplete');
		expect(r.completenessPercent).toBe(0);
		expect(r.documentedRequired).toBe(0);
	});

	it('grades a fully-documented note complete with 100%', () => {
		const r = calculateWardRoundGrade(createComplete());
		expect(r.status).toBe('complete');
		expect(r.completenessPercent).toBe(100);
		expect(r.componentStatuses.filter((s) => s.required).every((s) => s.present)).toBe(true);
	});

	it('grades a note partial when header and plan present and >= 4 required documented', () => {
		const d = createComplete();
		// Drop two required components (VTE, escalation) → 6 of 8 documented.
		d.vte.vteStatus = '';
		d.escalation.escalationStatus = '';
		const r = calculateWardRoundGrade(d);
		expect(r.presence.header).toBe(true);
		expect(r.presence.plan).toBe(true);
		expect(r.documentedRequired).toBe(6);
		expect(r.status).toBe('partial');
	});

	it('grades a note incomplete when the plan is missing', () => {
		const d = createComplete();
		d.plan.planAndJobs = '';
		const r = calculateWardRoundGrade(d);
		expect(r.status).toBe('incomplete');
		expect(r.flags.some((f) => f.id === 'F-NO-PLAN-JOBS-001')).toBe(true);
	});

	it('grades a note incomplete when fewer than four required documented', () => {
		const d = createComplete();
		d.problems.problemList = '';
		d.examination.examinationSummary = '';
		d.investigations.investigationsReviewed = '';
		d.vte.vteStatus = '';
		d.medication.medicationChanges = '';
		// header, plan, escalation documented = 3 (< 4) → incomplete.
		const r = calculateWardRoundGrade(d);
		expect(r.documentedRequired).toBe(3);
		expect(r.status).toBe('incomplete');
	});
});

describe('Ward round note flagged-issue detection', () => {
	it('raises deteriorating-news2 when NEWS2 >= 5 and no escalation action', () => {
		const d = createDefaultAssessment();
		d.examination.news2Total = 7;
		const flags = detectFlaggedIssues(d, { documentedRequired: 0, totalRequired: 8 });
		expect(flags.some((f) => f.id === 'F-DETERIORATING-NEWS2-001')).toBe(true);
	});

	it('clears deteriorating-news2 once a plan is documented', () => {
		const d = createDefaultAssessment();
		d.examination.news2Total = 7;
		d.plan.planAndJobs = 'Escalate to registrar; sepsis six commenced.';
		const flags = detectFlaggedIssues(d, { documentedRequired: 1, totalRequired: 8 });
		expect(flags.some((f) => f.id === 'F-DETERIORATING-NEWS2-001')).toBe(false);
	});

	it('raises vte-not-done when the VTE assessment is not done', () => {
		const d = createComplete();
		d.vte.vteStatus = 'not-done';
		const r = calculateWardRoundGrade(d);
		expect(r.flags.some((f) => f.id === 'F-VTE-NOT-DONE-001')).toBe(true);
	});

	it('raises abnormal-results-not-actioned when flagged but not actioned', () => {
		const d = createComplete();
		d.investigations.abnormalResultFlagged = 'yes';
		d.investigations.abnormalResultActioned = 'no';
		const r = calculateWardRoundGrade(d);
		expect(r.flags.some((f) => f.id === 'F-ABNORMAL-RESULTS-001')).toBe(true);
	});

	it('raises no-senior-review for a ceiling-of-care decision with no senior named', () => {
		const d = createComplete();
		d.escalation.escalationStatus = 'dnacpr';
		d.escalation.seniorReviewPresent = 'no';
		const r = calculateWardRoundGrade(d);
		expect(r.flags.some((f) => f.id === 'F-NO-SENIOR-REVIEW-001')).toBe(true);
	});

	it('raises incomplete-entry whenever a required component is absent', () => {
		const r = calculateWardRoundGrade(createDefaultAssessment());
		expect(r.flags.some((f) => f.id === 'F-INCOMPLETE-ENTRY-001')).toBe(true);
	});

	it('raises no safety flags for a fully-documented note', () => {
		const r = calculateWardRoundGrade(createComplete());
		expect(r.flags).toHaveLength(0);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.vte.vteStatus = 'not-done'; // high
		d.investigations.abnormalResultFlagged = 'yes'; // medium
		const r = calculateWardRoundGrade(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = r.flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('all required-component IDs are unique', () => {
		const ids = requiredComponents(createComplete()).map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
