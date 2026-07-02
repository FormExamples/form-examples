import { describe, it, expect } from 'vitest';
import { calculateGrade } from './anaesthetic-record-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { mandatoryRules } from './anaesthetic-record-rules';
import type { AssessmentData } from './types';

/**
 * A blank record (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		identification: {
			patientIdentifier: '',
			patientName: '',
			dateOfBirth: '',
			sex: '',
			weightKg: null,
			heightCm: null,
			theatre: '',
			operationDate: '',
			anaesthetistName: '',
			assistantName: '',
			surgeonName: '',
			plannedProcedure: '',
			urgency: '',
			anaestheticTechnique: ''
		},
		preInduction: {
			machineChecked: '',
			whoSignIn: '',
			whoTimeOut: '',
			consentConfirmed: '',
			fastingConfirmed: '',
			ivAccess: '',
			allergyBandChecked: '',
			documentedAllergies: ''
		},
		asaAirway: {
			asaStatus: '',
			asaEmergencyModifier: '',
			mallampatiClass: null,
			mouthOpeningCm: null,
			thyromentalDistanceCm: null,
			dentition: '',
			anticipatedDifficultAirway: '',
			priorDifficultIntubation: ''
		},
		drugs: [],
		airway: {
			airwayTechnique: '',
			deviceSize: '',
			tubeDepthCm: null,
			cuffed: '',
			cormackLehaneGrade: null,
			intubationAttempts: null,
			capnographyConfirmed: ''
		},
		monitoring: { monitoringModalities: [] },
		observations: [],
		fluids: {
			crystalloidMl: null,
			colloidMl: null,
			bloodProductsMl: null,
			estimatedBloodLossMl: null,
			urineOutputMl: null,
			cellSalvageMl: null
		},
		regional: {
			regionalTechnique: '',
			regionalLevel: '',
			regionalDrug: '',
			regionalDoseMg: null,
			blockHeight: '',
			regionalComplications: ''
		},
		events: [],
		handover: {
			recoveryDestination: '',
			handoverAirwayStatus: '',
			analgesiaPlan: '',
			antiemeticPlan: '',
			oxygenPlan: '',
			outstandingTasks: '',
			handoverAt: '',
			receivingPractitioner: ''
		},
		signoff: { anaesthetistSignature: '', signedAt: '' }
	};
}

/** A fully-documented record that satisfies every mandatory rule (Complete). */
function createCompleteRecord(): AssessmentData {
	const d = createDefaultAssessment();
	d.identification.patientIdentifier = 'NHS-100';
	d.identification.anaesthetistName = 'Dr A. Rahman';
	d.identification.anaestheticTechnique = 'general';
	d.identification.weightKg = 78;
	d.preInduction.whoSignIn = 'yes';
	d.preInduction.whoTimeOut = 'yes';
	d.preInduction.consentConfirmed = 'yes';
	d.asaAirway.asaStatus = 'II';
	d.airway.airwayTechnique = 'tracheal-tube';
	d.airway.cormackLehaneGrade = 1;
	d.airway.intubationAttempts = 1;
	d.monitoring.monitoringModalities = ['ecg', 'nibp', 'spo2'];
	d.observations = [
		{
			observedAt: '2026-06-22T08:45',
			systolicBloodPressure: 118,
			diastolicBloodPressure: 72,
			heartRate: 68,
			spo2: 99,
			endTidalCo2: 4.8,
			temperature: 36.5,
			agentPercent: 2,
			freshGasFlowL: 1
		}
	];
	d.fluids.estimatedBloodLossMl = 50;
	d.handover.recoveryDestination = 'recovery';
	d.signoff.anaesthetistSignature = 'A. Rahman';
	return d;
}

describe('anaesthetic-record completeness grader', () => {
	it('grades a fully-documented record as Complete at 100%', () => {
		const r = calculateGrade(createCompleteRecord());
		expect(r.status).toBe('complete');
		expect(r.completenessPercent).toBe(100);
		expect(r.criticalMissing).toBe(0);
		expect(r.noncriticalMissing).toBe(0);
	});

	it('grades a blank record as Incomplete at 0%', () => {
		const r = calculateGrade(createDefaultAssessment());
		expect(r.status).toBe('incomplete');
		expect(r.completenessPercent).toBe(0);
		expect(r.criticalMissing).toBeGreaterThan(0);
	});

	it('drops to Partial when only a non-critical item is missing', () => {
		const d = createCompleteRecord();
		d.identification.weightKg = null; // one non-critical missing
		const r = calculateGrade(d);
		expect(r.status).toBe('partial');
		expect(r.criticalMissing).toBe(0);
		expect(r.noncriticalMissing).toBe(1);
	});

	it('is Incomplete when any critical item is missing even if all non-critical present', () => {
		const d = createCompleteRecord();
		d.signoff.anaesthetistSignature = ''; // one critical missing
		const r = calculateGrade(d);
		expect(r.status).toBe('incomplete');
		expect(r.criticalMissing).toBe(1);
	});

	it('requires at least one timed observation for a complete record', () => {
		const d = createCompleteRecord();
		d.observations = [];
		const r = calculateGrade(d);
		expect(r.status).toBe('incomplete');
		expect(r.firedRules.find((x) => x.id === 'M-TIMED-OBSERVATION')?.satisfied).toBe(false);
	});

	it('WHO checklist rule needs both Sign In and Time Out', () => {
		const d = createCompleteRecord();
		d.preInduction.whoTimeOut = '';
		const r = calculateGrade(d);
		expect(r.firedRules.find((x) => x.id === 'M-WHO-CHECKLIST')?.satisfied).toBe(false);
		expect(r.status).toBe('incomplete');
	});

	it('completenessPercent is the proportion of mandatory rules satisfied', () => {
		const d = createCompleteRecord();
		d.identification.weightKg = null; // 11 of 12 satisfied
		const r = calculateGrade(d);
		expect(r.completenessPercent).toBe(Math.round((100 * 11) / 12));
	});

	it('all mandatory rule IDs are unique', () => {
		const ids = mandatoryRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('anaesthetic-record flagged-issue detection', () => {
	it('raises no flags for a complete, clean record', () => {
		const d = createCompleteRecord();
		const flags = detectFlaggedIssues(d, 0);
		expect(flags).toHaveLength(0);
	});

	it('raises the WHO-checklist flag when Sign In or Time Out is not done', () => {
		const d = createCompleteRecord();
		d.preInduction.whoTimeOut = 'no';
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-WHO-CHECKLIST-001')).toBe(true);
	});

	it('raises the unlogged-consent flag when consent is not confirmed', () => {
		const d = createCompleteRecord();
		d.preInduction.consentConfirmed = '';
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-UNLOGGED-CONSENT-001')).toBe(true);
	});

	it('raises the difficult-airway flag on anticipated difficulty', () => {
		const d = createCompleteRecord();
		d.asaAirway.anticipatedDifficultAirway = 'yes';
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-DIFFICULT-AIRWAY-001')).toBe(true);
	});

	it('raises the difficult-airway flag on Cormack-Lehane grade >= 3', () => {
		const d = createCompleteRecord();
		d.airway.cormackLehaneGrade = 3;
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-DIFFICULT-AIRWAY-001')).toBe(true);
	});

	it('raises the allergy-conflict flag when a drug matches a documented allergy', () => {
		const d = createCompleteRecord();
		d.preInduction.documentedAllergies = 'Penicillin, morphine';
		d.drugs = [
			{
				drugName: 'Morphine',
				dose: 10,
				doseUnit: 'mg',
				route: 'iv',
				category: 'analgesia',
				administeredAt: ''
			}
		];
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-ALLERGY-CONFLICT-001')).toBe(true);
	});

	it('raises the anaphylaxis flag when an anaphylaxis event is logged', () => {
		const d = createCompleteRecord();
		d.events = [{ eventType: 'anaphylaxis', occurredAt: '', management: 'Adrenaline' }];
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-ANAPHYLAXIS-001')).toBe(true);
	});

	it('raises the physiological-derangement flag when an observation breaches a limit', () => {
		const d = createCompleteRecord();
		d.observations[0].spo2 = 88;
		const flags = detectFlaggedIssues(d, 0);
		expect(flags.some((f) => f.id === 'F-PHYSIOLOGICAL-DERANGEMENT-001')).toBe(true);
	});

	it('raises the incomplete flag when non-critical items are missing', () => {
		const d = createCompleteRecord();
		const flags = detectFlaggedIssues(d, 2);
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createCompleteRecord();
		d.preInduction.whoTimeOut = 'no'; // high
		d.observations[0].spo2 = 85; // medium
		const flags = detectFlaggedIssues(d, 1); // low
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
