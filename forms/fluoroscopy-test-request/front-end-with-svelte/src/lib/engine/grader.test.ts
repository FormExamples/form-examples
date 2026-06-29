import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flagged-issues';
import { createDefaultRequest } from './defaults';
import type { FluoroscopyRequest } from './types';

/** A fully-completed, appropriate, routine fluoroscopy request fixture. */
function createCompleteRequest(): FluoroscopyRequest {
	return {
		clinician: {
			clinicianName: 'Dr Sarah Owen',
			clinicianRole: 'gp',
			registrationBody: 'GMC',
			registrationNumber: '7012345',
			requesterContact: 'sarah.owen@nhs.net',
			supervisingConsultant: '',
			siteName: 'Headington Medical Practice',
			referralDate: '2026-06-10'
		},
		patient: {
			firstName: 'Margaret',
			lastName: 'Hughes',
			dateOfBirth: '1958-03-14',
			nhsNumber: '485 777 3456',
			bodyMassIndex: 24.5
		},
		request: {
			studyType: 'barium-swallow',
			primaryIndication: 'dysphagia',
			clinicalQuestion: 'Is there a stricture causing the dysphagia?',
			relevantHistory: 'Three-month history of progressive dysphagia to solids.'
		},
		safety: {
			pregnancyStatus: 'not-pregnant',
			contrastAllergy: false,
			aspirationRisk: false,
			diabetes: false,
			irMeRJustification: 'Investigate progressive dysphagia; no recent equivalent imaging.'
		},
		triage: {
			urgency: 'routine',
			requestedByDate: '',
			setting: 'community',
			notes: ''
		}
	};
}

describe('Fluoroscopy request four-axis vetting engine', () => {
	it('grades a complete, appropriate, routine request as accept / routine', () => {
		const g = calculateGrade(createCompleteRequest());
		expect(g.appropriatenessScore).toBe(8);
		expect(g.appropriatenessBand).toBe('usually-appropriate');
		expect(g.safetyBand).toBe('ok');
		expect(g.radiationDoseBand).toBe('low');
		expect(g.completenessPercent).toBe(100);
		expect(g.triageTier).toBe('routine');
		expect(g.recommendation).toBe('accept');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-APPROP-DYSPHAGIA-IDEAL')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-SAFETY-OK')).toBe(true);
	});

	it('contraindicates pregnancy with an ionising study and forces query-referrer', () => {
		const r = createCompleteRequest();
		r.safety.pregnancyStatus = 'pregnant';
		r.request.studyType = 'barium-meal';
		r.request.primaryIndication = 'reflux';
		const g = calculateGrade(r);
		expect(g.safetyBand).toBe('contraindicated');
		expect(g.recommendation).toBe('query-referrer');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-PREGNANCY-IONISING')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-PREGNANCY-001')).toBe(true);
	});

	it('contraindicates barium for suspected perforation and redirects to water-soluble contrast', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'suspected-perforation';
		r.request.studyType = 'barium-swallow';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.safetyBand).toBe('contraindicated');
		expect(g.triageTier).toBe('emergency');
		expect(g.recommendation).toBe('redirect');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-SAFETY-PERFORATION-BARIUM')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-SUSPECTED-PERFORATION')).toBe(true);
		expect(g.flags.some((f) => f.category === 'suspected-perforation-contrast-choice')).toBe(true);
	});

	it('escalates suspected obstruction to urgent triage', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'suspected-obstruction';
		r.request.studyType = 'barium-follow-through';
		const g = calculateGrade(r);
		expect(g.triageTier).toBe('urgent');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-TRIAGE-SUSPECTED-OBSTRUCTION')).toBe(true);
	});

	it('flags a high radiation-dose study', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'constipation';
		r.request.studyType = 'barium-enema';
		const g = calculateGrade(r);
		expect(g.radiationDoseBand).toBe('high');
		expect(g.flags.some((f) => f.flagId === 'F-HIGH-RADIATION-DOSE-001')).toBe(true);
	});

	it('marks a clearly mismatched study as usually-not-appropriate', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = 'infertility-tubal-patency';
		r.request.studyType = 'barium-enema';
		const g = calculateGrade(r);
		expect(g.appropriatenessBand).toBe('usually-not-appropriate');
		expect(g.recommendation).toBe('query-referrer');
		expect(
			g.firedRules.some((rule) => rule.ruleId === 'R-APPROP-INFERTILITY-TUBAL-PATENCY-MISMATCH')
		).toBe(true);
	});

	it('treats an empty request as low-completeness query-referrer', () => {
		const g = calculateGrade(createDefaultRequest());
		expect(g.completenessPercent).toBe(0);
		expect(g.recommendation).toBe('query-referrer');
		expect(g.flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(g.flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createCompleteRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Fluoroscopy request flag detection', () => {
	it('flags missing indication and missing clinical question', () => {
		const r = createCompleteRequest();
		r.request.primaryIndication = '';
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		expect(flags.some((f) => f.category === 'missing-indication')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-clinical-question')).toBe(true);
	});

	it('raises the contrast-allergy flag', () => {
		const r = createCompleteRequest();
		r.safety.contrastAllergy = true;
		const flags = detectFlags(r);
		expect(flags.some((f) => f.flagId === 'F-CONTRAST-ALLERGY-001')).toBe(true);
	});

	it('sorts flags high → medium → low', () => {
		const r = createCompleteRequest();
		r.safety.pregnancyStatus = 'pregnant';
		r.safety.aspirationRisk = true;
		r.request.clinicalQuestion = '';
		const flags = detectFlags(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete, safe, appropriate request', () => {
		const flags = detectFlags(createCompleteRequest(), { radiationDoseBand: 'low' });
		expect(flags).toHaveLength(0);
	});
});
