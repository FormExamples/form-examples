import { describe, it, expect } from 'vitest';
import { gradeLifeguard } from './lifeguard-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { lifeguardRules } from './rules';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';
import type { AssessmentData } from './types';

/** A fully-competent candidate: every rule marked 'yes'. */
function createCompetentCandidate(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidateDetails.firstName = 'Alex';
	d.candidateDetails.lastName = 'Rivera';
	d.candidateDetails.sessionDate = '2026-06-20';
	d.physicalFitnessSwim = {
		swim50mTimeSeconds: 48,
		swim50mWithinTime: 'yes',
		surfaceDiveDepthMetres: 2.0,
		sustainedSurfaceDive: 'yes',
		swim200mTimeSeconds: 300,
		swim200mMixedStrokes: 'yes',
		treadWaterTwoMinutes: 'yes',
		towCasualty50m: 'yes'
	};
	d.supervisionScanningZoning = {
		understandsZoneOfResponsibility: 'yes',
		effectiveScanningPattern: 'yes',
		tenTwentyScanRule: 'yes',
		recognisesDistressedSwimmer: 'yes',
		appropriateRotation: 'yes',
		usesWhistleAndSignals: 'yes'
	};
	d.rescueConscious = {
		recognitionAndAlert: 'yes',
		entryWithoutLossOfSight: 'yes',
		approachWithFloatingAid: 'yes',
		reassuresCasualty: 'yes',
		towToSafety: 'yes',
		extricationFromWater: 'yes'
	};
	d.rescueUnconscious = {
		recognitionAndAlert: 'yes',
		safeEntryAndApproach: 'yes',
		airwayManagementInWater: 'yes',
		effectiveTowToSafety: 'yes',
		safeExtrication: 'yes',
		handoverHandsignal: 'yes'
	};
	d.spinalInjuryManagement = {
		recognisesMechanism: 'yes',
		headSplintHold: 'yes',
		maintainsInlineStabilisation: 'yes',
		carefulRollIfNeeded: 'yes',
		useOfSpineboard: 'yes',
		secureCasualtyToBoard: 'yes'
	};
	d.cprAed = {
		compressionRate: 110,
		compressionDepth: 5.5,
		effectiveCompressions: 'yes',
		effectiveVentilations: 'yes',
		timeToFirstShockSeconds: 60,
		aedDeliveredPromptly: 'yes',
		safeShockNoUnsafeContact: 'yes',
		continuousQualityCpr: 'yes'
	};
	d.firstAidOxygen = {
		bleedingControl: 'yes',
		burnsManagement: 'yes',
		fractureImmobilisation: 'yes',
		recoveryPositionUse: 'yes',
		oxygenTherapyAdministration: 'yes',
		usesPocketMaskOrBVM: 'yes'
	};
	d.legalRegulatoryIncident = {
		dutyOfCareUnderstood: 'yes',
		pswpKnowledge: 'yes',
		eapInvocation: 'yes',
		incidentReportCompleted: 'yes',
		riddorAwareness: 'yes',
		safeguardingChildrenAdults: 'yes'
	};
	return d;
}

describe('Lifeguard Grading Engine', () => {
	it('returns Pass for a fully competent candidate', () => {
		const result = gradeLifeguard(createCompetentCandidate());
		expect(result.outcome).toBe('pass');
		expect(result.criticalFailures).toHaveLength(0);
		expect(result.deficiencies).toHaveLength(0);
		expect(result.answeredCount).toBe(result.totalRules);
	});

	it('returns Fail when a critical competency is not demonstrated', () => {
		const d = createCompetentCandidate();
		d.cprAed.effectiveCompressions = 'no';
		const result = gradeLifeguard(d);
		expect(result.outcome).toBe('fail');
		expect(result.criticalFailures.some((r) => r.id === 'LIFE-CPR-COMPRESSIONS')).toBe(true);
	});

	it('fails on a critical numeric breach (50 m swim too slow) without an explicit flag', () => {
		const d = createCompetentCandidate();
		d.physicalFitnessSwim.swim50mWithinTime = '';
		d.physicalFitnessSwim.swim50mTimeSeconds = 75;
		const result = gradeLifeguard(d);
		expect(result.outcome).toBe('fail');
		expect(result.criticalFailures.some((r) => r.id === 'LIFE-PF-50M-TIME')).toBe(true);
	});

	it('returns Needs Development for non-critical deficiencies only', () => {
		const d = createCompetentCandidate();
		d.firstAidOxygen.burnsManagement = 'no';
		const result = gradeLifeguard(d);
		expect(result.outcome).toBe('needs-development');
		expect(result.criticalFailures).toHaveLength(0);
		expect(result.deficiencies.some((r) => r.id === 'LIFE-FA-BURNS')).toBe(true);
	});

	it('returns Fail when nothing has been assessed', () => {
		const result = gradeLifeguard(createDefaultAssessment());
		expect(result.outcome).toBe('fail');
		expect(result.answeredCount).toBe(0);
	});

	it('treats "na" answers as not counted', () => {
		const d = createCompetentCandidate();
		d.firstAidOxygen.burnsManagement = 'na';
		const result = gradeLifeguard(d);
		expect(result.outcome).toBe('pass');
		expect(result.answeredCount).toBe(result.totalRules - 1);
	});

	it('has unique rule ids', () => {
		const ids = lifeguardRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Lifeguard Flagged Issues Detection', () => {
	it('returns no flags for a clean competent candidate', () => {
		const d = createCompetentCandidate();
		const result = gradeLifeguard(d);
		const flags = detectAdditionalFlags(d, {
			criticalFailures: result.criticalFailures,
			deficiencies: result.deficiencies
		});
		expect(flags).toHaveLength(0);
	});

	it('flags an expired prior certification', () => {
		const d = createCompetentCandidate();
		d.candidateDetails.priorCertificationExpiry = '2020-01-01';
		const flags = detectAdditionalFlags(d, { criticalFailures: [], deficiencies: [] });
		expect(flags.some((f) => f.id === 'FLAG-CERT-EXPIRED')).toBe(true);
	});

	it('flags critical competency failures via the grader', () => {
		const d = createCompetentCandidate();
		d.spinalInjuryManagement.headSplintHold = 'no';
		const result = gradeLifeguard(d);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-CRIT-LIFE-SP-HEADSPLINT')).toBe(true);
	});

	it('flags a slow 50 m swim time', () => {
		const d = createCompetentCandidate();
		d.physicalFitnessSwim.swim50mWithinTime = '';
		d.physicalFitnessSwim.swim50mTimeSeconds = 72;
		const result = gradeLifeguard(d);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-SWIM-50M-SLOW')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createCompetentCandidate();
		d.candidateDetails.priorCertificationExpiry = '2020-01-01';
		d.overallResultSignoff.examinerNotes = 'Strong candidate overall.';
		const flags = detectAdditionalFlags(d, { criticalFailures: [], deficiencies: [] });
		const order = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
