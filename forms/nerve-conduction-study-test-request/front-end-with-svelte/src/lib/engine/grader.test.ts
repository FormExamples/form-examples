import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { NerveConductionStudyRequest } from './types';

/** A fully-completed, routine appropriate carpal-tunnel request fixture. */
function createCarpalTunnelRequest(): NerveConductionStudyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr H Iqbal';
	r.clinician.clinicianRole = 'neurologist';
	r.clinician.referralDate = '2026-05-04';
	r.patient.firstName = 'Amara';
	r.patient.lastName = 'Okafor';
	r.patient.dateOfBirth = '1972-02-11';
	r.patient.nhsNumber = '401 234 5678';
	r.study.studyType = 'nerve-conduction';
	r.study.region = 'upper-limb';
	r.study.laterality = 'right';
	r.request.primaryIndication = 'carpal-tunnel';
	r.request.clinicalQuestion = 'Confirm median neuropathy at the wrist and grade severity.';
	r.symptoms.symptomNumbness = true;
	r.symptoms.symptomTingling = true;
	r.symptoms.symptomDuration = '3-to-12-months';
	r.triage.urgency = 'routine';
	r.triage.setting = 'outpatient';
	return r;
}

/** A suspected MND request: nerve-conduction + EMG, generalised. */
function createMndRequest(): NerveConductionStudyRequest {
	const r = createCarpalTunnelRequest();
	r.patient.firstName = 'Sofia';
	r.patient.lastName = 'Bianchi';
	r.study.studyType = 'nerve-conduction-and-emg';
	r.study.region = 'generalised';
	r.request.primaryIndication = 'suspected-motor-neurone-disease';
	r.request.clinicalQuestion = 'Assess for diffuse denervation suggestive of MND.';
	r.symptoms.symptomWeakness = true;
	r.symptoms.symptomDuration = '6-weeks-to-3-months';
	return r;
}

/** A radiculopathy needle-EMG request in an anticoagulated patient. */
function createAnticoagEmgRequest(): NerveConductionStudyRequest {
	const r = createCarpalTunnelRequest();
	r.patient.firstName = 'Petra';
	r.patient.lastName = 'Novak';
	r.study.studyType = 'emg';
	r.study.region = 'lower-limb';
	r.request.primaryIndication = 'radiculopathy';
	r.request.clinicalQuestion = 'Localise the root level of the suspected L5 radiculopathy.';
	r.safety.takingAnticoagulant = true;
	return r;
}

describe('Nerve conduction study four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine carpal-tunnel request as accept / routine', () => {
		const g = calculateGrade(createCarpalTunnelRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.proceduralRiskBand).toBe('low');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-CARPAL-TUNNEL-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates suspected motor neurone disease to urgent regardless of requested urgency', () => {
		const g = calculateGrade(createMndRequest());
		expect(g.triageTier).toBe('urgent');
		expect(g.targetTimeframe).toBe('Within 1-2 weeks');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-SUSPECTED-MND')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-mnd-urgent')).toBe(true);
	});

	it('raises procedural risk to high for needle EMG in an anticoagulated patient', () => {
		const g = calculateGrade(createAnticoagEmgRequest());
		expect(g.proceduralRiskBand).toBe('high');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-RISK-NEEDLE-ANTICOAG')).toBe(true);
		expect(g.flags.some((f) => f.category === 'anticoag-emg-bleeding-risk')).toBe(true);
	});

	it('escalates rapidly progressive weakness (<6 weeks) to urgent', () => {
		const r = createCarpalTunnelRequest();
		r.symptoms.symptomWeakness = true;
		r.symptoms.symptomDuration = 'less-than-6-weeks';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-RAPID-WEAKNESS')).toBe(true);
	});

	it('marks a clearly mismatched study/indication as usually-not-appropriate → query-referrer', () => {
		const r = createCarpalTunnelRequest();
		r.request.primaryIndication = 'suspected-myasthenia';
		r.study.studyType = 'emg';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-SUSPECTED-MYASTHENIA-MISMATCH')).toBe(true);
	});

	it('flags a pacemaker / ICD as a stimulation caution and moderate risk', () => {
		const r = createCarpalTunnelRequest();
		r.safety.pacemakerOrIcd = true;
		const g = calculateGrade(r);
		expect(g.proceduralRiskBand).toBe('moderate');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-RISK-CARDIAC-DEVICE')).toBe(true);
		expect(g.flags.some((f) => f.category === 'pacemaker-stimulation-caution')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createCarpalTunnelRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 18 total weight missing → 12/18 ≈ 67%.
		expect(g.completenessPercent).toBe(67);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createAnticoagEmgRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Nerve conduction study flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createCarpalTunnelRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createMndRequest();
		r.safety.pacemakerOrIcd = true;
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const flags = detectFlags(createCarpalTunnelRequest());
		expect(flags).toHaveLength(0);
	});
});
