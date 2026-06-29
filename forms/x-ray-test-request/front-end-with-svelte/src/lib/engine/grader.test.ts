import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { XRayRequest } from './types';

/** A fully-completed, routine, appropriate chest X-ray request. */
function createRoutineRequest(): XRayRequest {
	const d = createDefaultRequest();
	d.clinician.clinicianName = 'Dr H Iqbal';
	d.clinician.clinicianRole = 'gp';
	d.clinician.referralDate = '2026-05-04';
	d.patient.firstName = 'Amara';
	d.patient.lastName = 'Okafor';
	d.patient.dateOfBirth = '1980-02-11';
	d.patient.nhsNumber = '401 234 5678';
	d.request.bodyRegion = 'chest';
	d.request.laterality = 'not-applicable';
	d.request.primaryIndication = 'chest-infection';
	d.detail.clinicalQuestion = 'Exclude consolidation in a patient with productive cough and fever.';
	d.safety.pregnancyStatus = 'not-applicable';
	d.safety.irMeRJustification = 'Clinical benefit of confirming pneumonia outweighs the low chest-dose detriment.';
	d.triage.urgency = 'routine';
	return d;
}

/** An emergency request: suspected pneumothorax. */
function createPneumothoraxRequest(): XRayRequest {
	const d = createRoutineRequest();
	d.request.primaryIndication = 'suspected-pneumothorax';
	d.triage.urgency = 'urgent';
	return d;
}

/** A pregnant pelvis trauma request — contraindicated. */
function createPregnantPelvisRequest(): XRayRequest {
	const d = createRoutineRequest();
	d.request.bodyRegion = 'pelvis';
	d.request.primaryIndication = 'trauma-fracture';
	d.safety.pregnancyStatus = 'pregnant';
	d.practical.setting = 'emergency';
	d.triage.urgency = 'urgent';
	return d;
}

describe('X-ray request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine chest request as accept / routine / safe', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.radiationSafetyBand).toBe('safe');
		expect(g.radiationDoseBand).toBe('low');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-CHEST-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-OK')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-REQUESTED')).toBe(true);
	});

	it('auto-escalates suspected pneumothorax to emergency triage', () => {
		const g = calculateGrade(createPneumothoraxRequest());
		expect(g.triageTier).toBe('emergency');
		expect(g.targetTimeframe).toBe('Same day / immediate');
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-PNEUMOTHORAX')).toBe(true);
	});

	it('forces contraindicated + reject for a pregnant moderate-dose exposure', () => {
		const g = calculateGrade(createPregnantPelvisRequest());
		expect(g.radiationSafetyBand).toBe('contraindicated');
		expect(g.recommendation).toBe('reject');
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-PREGNANT')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-TRIAGE-TRAUMA')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-PREGNANCY-001')).toBe(true);
	});

	it('treats a missing IR(ME)R justification as caution → query-referrer', () => {
		const d = createRoutineRequest();
		d.safety.irMeRJustification = '';
		const g = calculateGrade(d);
		expect(g.radiationSafetyBand).toBe('caution');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-UNJUSTIFIED')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-UNJUSTIFIED-EXPOSURE-001')).toBe(true);
	});

	it('marks a clear region/indication mismatch as usually-not-appropriate', () => {
		const d = createRoutineRequest();
		d.request.bodyRegion = 'chest';
		d.request.primaryIndication = 'joint-pain';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.appropriatenessScore).toBe(2);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-CHEST-MISMATCH')).toBe(true);
	});

	it('scores a plausible pairing as may-be-appropriate and flags a high dose', () => {
		const d = createRoutineRequest();
		d.request.bodyRegion = 'spine-lumbar';
		d.request.primaryIndication = 'joint-pain';
		const g = calculateGrade(d);
		expect(g.appropriatenessBand).toBe('may-be-appropriate');
		expect(g.radiationDoseBand).toBe('high');
		expect(g.flags.some((f) => f.flagId === 'F-HIGH-DOSE-001')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-SPINE-LUMBAR-PLAUSIBLE')).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const d = createRoutineRequest();
		d.request.primaryIndication = '';
		d.detail.clinicalQuestion = '';
		const g = calculateGrade(d);
		// indication (3) + clinical question (3) of 19 total weight missing → 13/19 ≈ 68%.
		expect(g.completenessPercent).toBe(68);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createPregnantPelvisRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('X-ray request flag detection', () => {
	it('raises a wrong-laterality flag for a lateralised region with no laterality', () => {
		const d = createRoutineRequest();
		d.request.bodyRegion = 'knee';
		d.request.laterality = 'not-applicable';
		d.request.primaryIndication = 'joint-pain';
		const flags = detectFlags(d);
		expect(flags.some((f) => f.flagId === 'F-WRONG-LATERALITY-RISK-001')).toBe(true);
	});

	it('flags a possible pregnancy at medium priority', () => {
		const d = createRoutineRequest();
		d.safety.pregnancyStatus = 'possible';
		const flags = detectFlags(d);
		expect(flags.some((f) => f.flagId === 'F-PREGNANCY-002')).toBe(true);
	});

	it('flags a repeat recent exposure', () => {
		const d = createRoutineRequest();
		d.safety.recentSimilarXray = true;
		const flags = detectFlags(d);
		expect(flags.some((f) => f.flagId === 'F-REPEAT-RECENT-IMAGING-001')).toBe(true);
	});

	it('returns no flags for a complete, justified, routine chest request', () => {
		const flags = detectFlags(createRoutineRequest(), { doseBand: 'low' });
		expect(flags).toHaveLength(0);
	});
});
