import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { scoreSpecimenQuality } from './specimen-rules';
import { createDefaultRequest } from './defaults';
import type { HistopathologyRequest } from './types';

/** A fully-completed, routine, appropriate inflammatory-disease request. */
function createRoutineRequest(): HistopathologyRequest {
	const r = createDefaultRequest();
	r.clinician.clinicianName = 'Dr Sarah Owen';
	r.clinician.clinicianRole = 'gastroenterologist';
	r.clinician.referralDate = '2026-06-10';
	r.patient.firstName = 'Margaret';
	r.patient.lastName = 'Hughes';
	r.patient.dateOfBirth = '1958-03-14';
	r.patient.nhsNumber = '485 777 3456';
	r.specimen.specimenType = 'endoscopic-biopsy';
	r.specimen.specimenSite = 'Sigmoid colon';
	r.specimen.numberOfSpecimens = 4;
	r.specimen.fixative = 'formalin';
	r.specimen.specimenLabelled = true;
	r.indication.primaryIndication = 'inflammatory-disease';
	r.indication.clinicalQuestion = 'Is there active colitis?';
	r.indication.clinicalDetails = 'Three-month history of bloody diarrhoea.';
	r.urgency.urgency = 'routine';
	return r;
}

describe('Histopathology request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.specimenQualityBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-INFLAMMATORY-DISEASE-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SPECIMEN-OK')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-URGENCY-REQUESTED')).toBe(true);
	});

	it('auto-escalates an intra-operative frozen section to two-week-wait + immediate', () => {
		const r = createRoutineRequest();
		r.specimen.specimenType = 'frozen-section';
		r.specimen.fixative = 'fresh';
		r.urgency.urgentFrozenSection = true;
		r.indication.primaryIndication = 'margin-assessment';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.immediate).toBe(true);
		expect(g.targetTimeframe).toBe('Immediate (intra-operative)');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-URGENCY-FROZEN-SECTION')).toBe(true);
		expect(g.flags.some((f) => f.category === 'frozen-section-urgent')).toBe(true);
		// Fresh specimen inside a frozen-section pathway is not a reject risk.
		expect(g.specimenQualityBand).not.toBe('reject-risk');
	});

	it('auto-escalates a suspected-malignancy request to two-week-wait with a 2WW flag', () => {
		const r = createRoutineRequest();
		r.specimen.specimenType = 'skin-lesion';
		r.indication.primaryIndication = 'suspected-malignancy';
		r.urgency.twoWeekWait = true;
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('two-week-wait');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-URGENCY-TWO-WEEK-WAIT')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-cancer-2ww')).toBe(true);
	});

	it('marks a fresh specimen outside a frozen-section pathway as reject-risk → query-referrer', () => {
		const r = createRoutineRequest();
		r.specimen.fixative = 'fresh';
		const g = calculateGrade(r);
		expect(g.specimenQualityBand).toBe('reject-risk');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SPECIMEN-FRESH-NOT-FROZEN')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-SPECIMEN-FIXATION-ISSUE-001')).toBe(true);
	});

	it('scores a mismatched indication × specimen pairing as usually-not-appropriate', () => {
		const r = createRoutineRequest();
		r.indication.primaryIndication = 'transplant-monitoring';
		r.specimen.specimenType = 'resection';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.appropriatenessScore).toBe(2);
		expect(g.recommendation).toBe('query-referrer');
		expect(
			g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-TRANSPLANT-MONITORING-MISMATCH')
		).toBe(true);
	});

	it('computes weighted partial completeness when high-weight fields are missing', () => {
		const r = createRoutineRequest();
		r.indication.primaryIndication = '';
		r.indication.clinicalQuestion = '';
		const g = calculateGrade(r);
		// indication (3) + clinical question (3) of 18 total weight missing → 12/18 ≈ 67%.
		expect(g.completenessPercent).toBe(67);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-INDICATION')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CLINICAL-QUESTION')).toBe(true);
	});

	it('flags an unlabelled specimen container as a mislabel risk', () => {
		const r = createRoutineRequest();
		r.specimen.specimenLabelled = false;
		const { band, firedRules } = scoreSpecimenQuality(r);
		expect(band).toBe('caution');
		expect(firedRules.some((rule) => rule.ruleId === 'R-SPECIMEN-NOT-LABELLED')).toBe(true);
		const flags = detectFlags(r, { specimenQualityBand: band });
		expect(flags.some((f) => f.flagId === 'F-MISLABEL-RISK-001')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const r = createRoutineRequest();
		r.specimen.fixative = 'fresh';
		const g = calculateGrade(r);
		const ids = g.firedRules.map((rule) => rule.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Histopathology request flag detection', () => {
	it('flags a missing indication and missing clinical details', () => {
		const r = createDefaultRequest();
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.flagId === 'F-MISSING-CLINICAL-DETAILS-001')).toBe(true);
	});

	it('returns no flags for a complete routine appropriate request', () => {
		const r = createRoutineRequest();
		const { band } = scoreSpecimenQuality(r);
		const flags = detectFlags(r, { specimenQualityBand: band });
		expect(flags).toHaveLength(0);
	});
});
