import { describe, it, expect } from 'vitest';
import { gradeBLS } from './bls-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { blsRules } from './bls-rules';
import type { AssessmentData } from './types';

/** A blank assessment literal (mirrors the store's createDefaultAssessment). */
function createBlank(): AssessmentData {
	return {
		traineeDetails: {
			firstName: '',
			lastName: '',
			traineeId: '',
			role: '',
			priorCertificationExpiry: '',
			sessionDate: '',
			examinerName: ''
		},
		sceneSafety: { sceneSafe: '', ppeApplied: '', hazardsIdentified: '', bystandersControlled: '' },
		responsivenessBreathing: {
			tappedAndShouted: '',
			checkedBreathing: '',
			checkedPulseSimultaneously: '',
			timeWithinTenSeconds: ''
		},
		activateEmergencyResponse: {
			calledEmergencyNumber: '',
			statedLocationAndCondition: '',
			designatedAedRetriever: '',
			usedSpeakerphone: ''
		},
		chestCompressions: {
			compressionRate: null,
			compressionDepth: null,
			correctHandPosition: '',
			fullChestRecoil: '',
			minimisedInterruptions: '',
			compressionsAtCorrectRate: '',
			compressionsAtCorrectDepth: ''
		},
		airwayRescueBreaths: {
			headTiltChinLift: '',
			effectiveSeal: '',
			visibleChestRise: '',
			oneSecondPerBreath: '',
			ratio30to2: '',
			avoidedExcessiveVentilation: ''
		},
		aedShockDelivery: {
			poweredOnPromptly: '',
			correctPadPlacement: '',
			clearedDuringAnalysis: '',
			deliveredShockSafely: '',
			resumedCompressionsImmediately: '',
			timeToFirstShockSeconds: null
		},
		teamDynamicsHandoff: {
			clearCommunication: '',
			closedLoopOrders: '',
			appropriateHandoff: '',
			debriefParticipated: '',
			examinerNotes: '',
			traineeFeedback: ''
		}
	};
}

/** A fully-competent trainee: every checklist item demonstrated. */
function createCompetentTrainee(): AssessmentData {
	const d = createBlank();
	d.traineeDetails = {
		firstName: 'Alex',
		lastName: 'Rivera',
		traineeId: 'T-001',
		role: 'nurse',
		priorCertificationExpiry: '',
		sessionDate: '2026-06-20',
		examinerName: 'Dr Lee'
	};
	d.sceneSafety = { sceneSafe: 'yes', ppeApplied: 'yes', hazardsIdentified: 'yes', bystandersControlled: 'yes' };
	d.responsivenessBreathing = {
		tappedAndShouted: 'yes',
		checkedBreathing: 'yes',
		checkedPulseSimultaneously: 'yes',
		timeWithinTenSeconds: 'yes'
	};
	d.activateEmergencyResponse = {
		calledEmergencyNumber: 'yes',
		statedLocationAndCondition: 'yes',
		designatedAedRetriever: 'yes',
		usedSpeakerphone: 'yes'
	};
	d.chestCompressions = {
		compressionRate: 110,
		compressionDepth: 5.5,
		correctHandPosition: 'yes',
		fullChestRecoil: 'yes',
		minimisedInterruptions: 'yes',
		compressionsAtCorrectRate: 'yes',
		compressionsAtCorrectDepth: 'yes'
	};
	d.airwayRescueBreaths = {
		headTiltChinLift: 'yes',
		effectiveSeal: 'yes',
		visibleChestRise: 'yes',
		oneSecondPerBreath: 'yes',
		ratio30to2: 'yes',
		avoidedExcessiveVentilation: 'yes'
	};
	d.aedShockDelivery = {
		poweredOnPromptly: 'yes',
		correctPadPlacement: 'yes',
		clearedDuringAnalysis: 'yes',
		deliveredShockSafely: 'yes',
		resumedCompressionsImmediately: 'yes',
		timeToFirstShockSeconds: 45
	};
	d.teamDynamicsHandoff = {
		clearCommunication: 'yes',
		closedLoopOrders: 'yes',
		appropriateHandoff: 'yes',
		debriefParticipated: 'yes',
		examinerNotes: '',
		traineeFeedback: ''
	};
	return d;
}

describe('BLS Skills Verification grader', () => {
	it('passes a fully-competent trainee', () => {
		const result = gradeBLS(createCompetentTrainee());
		expect(result.outcome).toBe('pass');
		expect(result.criticalFailures).toHaveLength(0);
		expect(result.nonCriticalDeficiencies).toHaveLength(0);
		expect(result.answeredCount).toBe(blsRules.length);
	});

	it('fails when any critical action is not demonstrated', () => {
		const d = createCompetentTrainee();
		d.airwayRescueBreaths.visibleChestRise = 'no';
		const result = gradeBLS(d);
		expect(result.outcome).toBe('fail');
		expect(result.criticalFailures.some((r) => r.id === 'BLS-AB-CHEST-RISE')).toBe(true);
	});

	it('passes with up to two non-critical deficiencies', () => {
		const d = createCompetentTrainee();
		d.sceneSafety.ppeApplied = 'no';
		d.activateEmergencyResponse.usedSpeakerphone = 'no';
		const result = gradeBLS(d);
		expect(result.outcome).toBe('pass');
		expect(result.nonCriticalDeficiencies).toHaveLength(2);
	});

	it('fails with more than two non-critical deficiencies', () => {
		const d = createCompetentTrainee();
		d.sceneSafety.ppeApplied = 'no';
		d.activateEmergencyResponse.usedSpeakerphone = 'no';
		d.teamDynamicsHandoff.closedLoopOrders = 'no';
		const result = gradeBLS(d);
		expect(result.outcome).toBe('fail');
		expect(result.nonCriticalDeficiencies.length).toBeGreaterThan(2);
	});

	it('derives the critical rate rule from the numeric measurement', () => {
		const d = createCompetentTrainee();
		d.chestCompressions.compressionsAtCorrectRate = '';
		d.chestCompressions.compressionRate = 70; // below AHA range
		const result = gradeBLS(d);
		expect(result.outcome).toBe('fail');
		expect(result.criticalFailures.some((r) => r.id === 'BLS-CC-RATE')).toBe(true);
	});

	it('fails an empty assessment (nothing recorded yet)', () => {
		const result = gradeBLS(createBlank());
		expect(result.outcome).toBe('fail');
		expect(result.answeredCount).toBe(0);
	});

	it('has unique rule IDs', () => {
		const ids = blsRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('BLS flagged-issue detection', () => {
	it('returns no flags for a clean pass', () => {
		const flags = detectAdditionalFlags(createCompetentTrainee(), {
			criticalFailures: [],
			nonCriticalDeficiencies: []
		});
		expect(flags).toHaveLength(0);
	});

	it('flags an out-of-range compression rate', () => {
		const d = createCompetentTrainee();
		d.chestCompressions.compressionRate = 150;
		const flags = detectAdditionalFlags(d, { criticalFailures: [], nonCriticalDeficiencies: [] });
		expect(flags.some((f) => f.id === 'FLAG-CC-RATE-RANGE')).toBe(true);
	});

	it('flags expired prior certification as high priority', () => {
		const d = createCompetentTrainee();
		d.traineeDetails.priorCertificationExpiry = '2020-01-01';
		const flags = detectAdditionalFlags(d, { criticalFailures: [], nonCriticalDeficiencies: [] });
		expect(flags.some((f) => f.id === 'FLAG-CERT-EXPIRED' && f.priority === 'high')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createCompetentTrainee();
		d.traineeDetails.priorCertificationExpiry = '2020-01-01';
		d.aedShockDelivery.timeToFirstShockSeconds = 120;
		const flags = detectAdditionalFlags(d, { criticalFailures: [], nonCriticalDeficiencies: [] });
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		expect(priorities).toEqual([...priorities].sort((a, b) => order[a] - order[b]));
	});
});
