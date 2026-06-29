import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { createDefault } from './defaults';
import type { MriRequest } from './types';

/** A fully-completed, routine, appropriate, cleared MRI request fixture. */
function createAppropriateRequest(): MriRequest {
	const d = createDefault();
	d.clinician.clinicianName = 'Dr Test';
	d.clinician.referralDate = '2026-06-10';
	d.patient.firstName = 'Test';
	d.patient.lastName = 'Patient';
	d.patient.dateOfBirth = '1980-01-01';
	d.patient.nhsNumber = '123 456 7890';
	d.request.bodyRegion = 'brain';
	d.request.primaryIndication = 'epilepsy';
	d.request.clinicalQuestion = 'Exclude structural lesion.';
	d.contrast.contrastRequired = 'none';
	d.safety.mriSafetyStatus = 'cleared';
	d.triage.urgency = 'routine';
	return d;
}

describe('MRI scan request four-axis vetting engine', () => {
	it('accepts an appropriate, cleared, complete routine request', () => {
		const g = calculateGrade(createAppropriateRequest());
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.appropriatenessScore).toBe(8);
		expect(g.mriSafetyBand).toBe('cleared');
		expect(g.contrastRenalFlag).toBe('none');
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.completenessPercent).toBeGreaterThanOrEqual(90);
	});

	it('rejects a request when a pacemaker / ICD makes MRI contraindicated', () => {
		const r = createAppropriateRequest();
		r.safety.pacemakerOrIcd = true;
		const g = calculateGrade(r);
		expect(g.mriSafetyBand).toBe('contraindicated');
		expect(g.recommendation).toBe('reject');
		expect(g.firedRules.some((x) => x.ruleId === 'R-SAFETY-PACEMAKER-ICD')).toBe(true);
	});

	it('marks an aneurysm clip and orbital foreign body as contraindicated', () => {
		const r1 = createAppropriateRequest();
		r1.safety.aneurysmClip = true;
		expect(calculateGrade(r1).mriSafetyBand).toBe('contraindicated');

		const r2 = createAppropriateRequest();
		r2.safety.metallicForeignBodyEye = true;
		expect(calculateGrade(r2).mriSafetyBand).toBe('contraindicated');
	});

	it('escalates a cochlear implant to needs-mri-physics-review → query-referrer', () => {
		const r = createAppropriateRequest();
		r.safety.cochlearImplant = true;
		const g = calculateGrade(r);
		expect(g.mriSafetyBand).toBe('needs-mri-physics-review');
		expect(g.recommendation).toBe('query-referrer');
	});

	it('flags gadolinium with eGFR < 30 as a contrast-renal contraindication → redirect', () => {
		const r = createAppropriateRequest();
		r.contrast.contrastRequired = 'iv-gadolinium';
		r.contrast.egfr = 20;
		const g = calculateGrade(r);
		expect(g.contrastRenalFlag).toBe('contraindicated');
		expect(g.recommendation).toBe('redirect');
		expect(g.flags.some((f) => f.flagId === 'F-GADOLINIUM-RENAL-001')).toBe(true);
	});

	it('treats gadolinium with eGFR 30-60 as caution and missing eGFR as unknown', () => {
		const caution = createAppropriateRequest();
		caution.contrast.contrastRequired = 'iv-gadolinium';
		caution.contrast.egfr = 45;
		expect(calculateGrade(caution).contrastRenalFlag).toBe('caution');

		const unknown = createAppropriateRequest();
		unknown.contrast.contrastRequired = 'iv-gadolinium';
		unknown.contrast.egfr = null;
		expect(calculateGrade(unknown).contrastRenalFlag).toBe('unknown');
	});

	it('auto-escalates triage to emergency for a suspected stroke', () => {
		const r = createAppropriateRequest();
		r.request.primaryIndication = 'suspected-stroke';
		r.request.bodyRegion = 'brain';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('emergency');
		expect(g.firedRules.some((x) => x.ruleId === 'R-TRIAGE-SUSPECTED-STROKE')).toBe(true);
	});

	it('marks a mismatched indication / region as usually-not-appropriate', () => {
		const r = createAppropriateRequest();
		r.request.primaryIndication = 'epilepsy';
		r.request.bodyRegion = 'abdomen';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
	});

	it('reports low completeness and queries the referrer for a blank request', () => {
		const g = calculateGrade(createDefault());
		expect(g.completenessPercent).toBeLessThan(50);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.flags.some((f) => f.flagId === 'F-MISSING-SAFETY-SCREEN-001')).toBe(true);
	});
});
