import { describe, it, expect } from 'vitest';
import { calculateHistoryAndPhysicalGrade } from './history-and-physical-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { componentRules, flatten } from './history-and-physical-rules';
import type { AssessmentData } from './types';

/**
 * A blank clerking record (mirrors the store's `createDefaultAssessment`).
 * Defined locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		encounter: {
			clinicianName: '',
			clinicianRole: '',
			registrationNumber: '',
			clerkedAt: '',
			careSetting: '',
			admissionSource: ''
		},
		identification: { patientIdentifier: '', ageBand: '', sex: '' },
		history: {
			presentingComplaint: '',
			historyOfPresentingComplaint: '',
			pastMedicalSurgicalHistory: '',
			drugHistory: '',
			allergyStatus: '',
			allergyDetail: '',
			familyHistory: '',
			socialHistory: '',
			systemsReview: ''
		},
		vitals: {
			temperature: null,
			heartRate: null,
			respiratoryRate: null,
			systolicBloodPressure: null,
			oxygenSaturation: null,
			consciousnessLevel: ''
		},
		examination: {
			examCardiovascular: '',
			examRespiratory: '',
			examAbdominal: '',
			examNeurological: '',
			examOther: '',
			investigations: ''
		},
		assessment: {
			impression: '',
			redFlagFindings: '',
			managementPlan: '',
			clinicalNote: ''
		}
	};
}

/** A record with all ten required components satisfied and no blocking flag. */
function createFullyDocumented(): AssessmentData {
	const d = createDefaultAssessment();
	d.history.presentingComplaint = 'Central chest pain for 2 hours';
	d.history.historyOfPresentingComplaint = 'Sudden onset, radiating to left arm, relieved by GTN.';
	d.history.pastMedicalSurgicalHistory = 'Hypertension; appendicectomy 2005.';
	d.history.drugHistory = 'Amlodipine 5mg OD.';
	d.history.allergyStatus = 'none-known';
	d.history.socialHistory = 'Ex-smoker, lives with spouse, independent ADLs.';
	d.history.systemsReview = 'No neurological or GI symptoms; otherwise unremarkable.';
	d.vitals.heartRate = 78;
	d.vitals.consciousnessLevel = 'alert';
	d.examination.examCardiovascular = 'HS I+II+0, no murmurs.';
	d.examination.examRespiratory = 'Chest clear, good air entry.';
	d.examination.examAbdominal = 'Soft, non-tender.';
	d.examination.examNeurological = 'Grossly intact.';
	d.assessment.impression = 'Likely acute coronary syndrome.';
	d.assessment.managementPlan = 'Serial troponins, aspirin, cardiology referral.';
	return d;
}

describe('H&P completeness grading', () => {
	it('grades an empty record incomplete with 0% and no components', () => {
		const r = calculateHistoryAndPhysicalGrade(createDefaultAssessment());
		expect(r.status).toBe('incomplete');
		expect(r.completenessPercent).toBe(0);
		expect(r.satisfiedComponents).toHaveLength(0);
		expect(r.blocking).toBe(true); // allergies undocumented + no impression/plan
	});

	it('grades a fully-documented record complete with 100%', () => {
		const r = calculateHistoryAndPhysicalGrade(createFullyDocumented());
		expect(r.status).toBe('complete');
		expect(r.completenessPercent).toBe(100);
		expect(r.componentStatuses.every((c) => c.satisfied)).toBe(true);
		expect(r.blocking).toBe(false);
	});

	it('grades a partial record when the core narrative is present but a component is missing', () => {
		const d = createFullyDocumented();
		d.history.systemsReview = ''; // 9 of 10 components, core narrative still intact
		const r = calculateHistoryAndPhysicalGrade(d);
		expect(r.status).toBe('partial');
		expect(r.completenessPercent).toBe(90);
	});

	it('is incomplete when the core narrative is missing even without a blocking flag', () => {
		const d = createFullyDocumented();
		d.history.presentingComplaint = ''; // breaks the core narrative
		const r = calculateHistoryAndPhysicalGrade(d);
		expect(r.status).toBe('incomplete');
		expect(r.blocking).toBe(false);
	});
});

describe('H&P blocking flags force incomplete', () => {
	it('the undocumented-allergies flag is blocking and forces incomplete', () => {
		const d = createFullyDocumented();
		d.history.allergyStatus = 'not-documented';
		const r = calculateHistoryAndPhysicalGrade(d);
		expect(r.status).toBe('incomplete');
		expect(r.blocking).toBe(true);
		const flag = r.flags.find((f) => f.id === 'F-ALLERGIES-NOT-DOCUMENTED-001');
		expect(flag?.blocking).toBe(true);
		expect(flag?.priority).toBe('high');
	});

	it('the no-impression-or-plan flag is blocking and forces incomplete', () => {
		const d = createFullyDocumented();
		d.assessment.impression = '';
		d.assessment.managementPlan = '';
		const r = calculateHistoryAndPhysicalGrade(d);
		expect(r.status).toBe('incomplete');
		expect(r.blocking).toBe(true);
		const flag = r.flags.find((f) => f.id === 'F-NO-IMPRESSION-OR-PLAN-001');
		expect(flag?.blocking).toBe(true);
	});
});

describe('H&P flagged-issue detection', () => {
	it('raises the abnormal-vitals flag for an out-of-range observation', () => {
		const d = createFullyDocumented();
		d.vitals.heartRate = 140; // above normal 51-90
		const flags = detectFlaggedIssues(flatten(d));
		expect(flags.some((f) => f.id === 'F-ABNORMAL-VITALS-001')).toBe(true);
	});

	it('raises abnormal-vitals when consciousness is not alert', () => {
		const d = createFullyDocumented();
		d.vitals.consciousnessLevel = 'voice';
		const flags = detectFlaggedIssues(flatten(d));
		expect(flags.some((f) => f.id === 'F-ABNORMAL-VITALS-001')).toBe(true);
	});

	it('raises the red-flag-without-plan flag', () => {
		const d = createFullyDocumented();
		d.assessment.redFlagFindings = 'New focal neurology.';
		d.assessment.managementPlan = '';
		d.assessment.impression = 'Query stroke.';
		const flags = detectFlaggedIssues(flatten(d));
		expect(flags.some((f) => f.id === 'F-RED-FLAG-NO-PLAN-001')).toBe(true);
	});

	it('raises the incomplete-systems-exam flag when a core system is blank', () => {
		const d = createFullyDocumented();
		d.examination.examNeurological = '';
		const flags = detectFlaggedIssues(flatten(d));
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-SYSTEMS-EXAM-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const flags = detectFlaggedIssues(flatten(createDefaultAssessment()));
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('raises no flags for a fully-documented normal clerking', () => {
		const flags = detectFlaggedIssues(flatten(createFullyDocumented()));
		expect(flags).toHaveLength(0);
	});

	it('all component-rule IDs are unique', () => {
		const ids = componentRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
