import { describe, it, expect } from 'vitest';
import { gradeFirstAid } from './first-aid-grader';
import { detectAdditionalFlags } from './flagged-issues';
import { fawRules, CRITICAL_RULE_IDS } from './faw-rules';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';
import type { AssessmentData } from './types';

/** A fully-competent trainee: every gradeable item demonstrated to standard. */
function createCompetentTrainee(): AssessmentData {
	const d = createDefaultAssessment();
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'Sam',
		lastName: 'Taylor',
		role: 'workplace-first-aider',
		sessionDate: '2026-06-01',
		examinerName: 'Bennett, Claire'
	};
	d.sceneAssessmentSafety = {
		sceneSafe: 'yes',
		ppeApplied: 'yes',
		hazardsIdentified: 'yes',
		bystandersControlled: 'yes'
	};
	d.primarySurveyDRABC = {
		dangerCheck: 'yes',
		responseCheck: 'yes',
		airwayManagement: 'yes',
		breathingCheck: 'yes',
		circulationAssessment: 'yes',
		recoveryPositionWhenAppropriate: 'yes'
	};
	d.cprAed = {
		effectiveCompressions: 'yes',
		effectiveVentilations: 'yes',
		ratio30to2: 'yes',
		aedPowerOnPromptly: 'yes',
		aedPadPlacement: 'yes',
		aedSafeShockDelivery: 'yes'
	};
	d.chokingManagement = {
		encouragedCoughing: 'yes',
		fiveBackBlows: 'yes',
		fiveAbdominalThrusts: 'yes',
		alternatesUntilDislodged: 'yes',
		unconsciousChokingCpr: 'yes'
	};
	d.bleedingWoundCare = {
		directPressureApplied: 'yes',
		elevatedAndImmobilised: 'yes',
		appliedDressingCorrectly: 'yes',
		tourniquetWhenIndicated: 'yes',
		haemostaticDressingApplied: 'yes',
		treatedForShock: 'yes'
	};
	d.burnsScalds = {
		cooledForTwentyMinutes: 'yes',
		removedJewelleryAndLooseClothing: 'yes',
		coveredWithClingFilmOrSterileDressing: 'yes',
		avoidedCreamsOrIce: 'yes',
		referredAppropriately: 'yes'
	};
	d.fracturesSprainsSpinal = {
		immobilisedInjuredLimb: 'yes',
		appliedRiceForSprains: 'yes',
		suspectedSpinalManualSupport: 'yes',
		performedLogRollWithTeam: 'yes',
		avoidedUnnecessaryMovement: 'yes'
	};
	d.medicalEmergencies = {
		recognisedAnaphylaxis: 'yes',
		administeredEpiPenSafely: 'yes',
		assistedAsthmaInhaler: 'yes',
		managedHypoglycaemia: 'yes',
		managedSeizureSafely: 'yes',
		recognisedStrokeFAST: 'yes',
		recognisedChestPain: 'yes'
	};
	return d;
}

describe('First Aid at Work Grading Engine', () => {
	it('passes a fully-competent trainee with no deficiencies', () => {
		const result = gradeFirstAid(createCompetentTrainee());
		expect(result.outcome).toBe('pass');
		expect(result.criticalFailures).toHaveLength(0);
		expect(result.deficiencies).toHaveLength(0);
		expect(result.passedCount).toBe(result.totalRules);
		expect(result.additionalFlags).toHaveLength(0);
	});

	it('fails on a single critical-skill failure', () => {
		const d = createCompetentTrainee();
		d.cprAed.effectiveCompressions = 'no';
		const result = gradeFirstAid(d);
		expect(result.outcome).toBe('fail');
		expect(result.criticalFailures.some((r) => r.id === 'FAW-CPR-COMPRESSIONS')).toBe(true);
	});

	it('grades one or two non-critical deficiencies as needs-development', () => {
		const d = createCompetentTrainee();
		d.burnsScalds.cooledForTwentyMinutes = 'no';
		d.fracturesSprainsSpinal.appliedRiceForSprains = 'no';
		const result = gradeFirstAid(d);
		expect(result.outcome).toBe('needs-development');
		expect(result.deficiencies).toHaveLength(2);
	});

	it('fails when three or more non-critical deficiencies accrue', () => {
		const d = createCompetentTrainee();
		d.burnsScalds.cooledForTwentyMinutes = 'no';
		d.burnsScalds.referredAppropriately = 'no';
		d.fracturesSprainsSpinal.appliedRiceForSprains = 'no';
		const result = gradeFirstAid(d);
		expect(result.outcome).toBe('fail');
		expect(result.deficiencies.length).toBeGreaterThanOrEqual(3);
	});

	it('does not count na / unanswered items as deficiencies', () => {
		const d = createCompetentTrainee();
		d.burnsScalds.cooledForTwentyMinutes = 'na';
		d.fracturesSprainsSpinal.appliedRiceForSprains = '';
		const result = gradeFirstAid(d);
		expect(result.outcome).toBe('pass');
		expect(result.deficiencies).toHaveLength(0);
	});

	it('fails a blank assessment with nothing assessed', () => {
		const result = gradeFirstAid(createDefaultAssessment());
		expect(result.outcome).toBe('fail');
		expect(result.answeredCount).toBe(0);
	});

	it('has unique rule IDs and a non-empty critical registry', () => {
		const ids = fawRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
		expect(CRITICAL_RULE_IDS.length).toBeGreaterThan(0);
	});
});

describe('First Aid Flagged Issues Detection', () => {
	it('returns no flags for a clean competent pass', () => {
		const d = createCompetentTrainee();
		const result = gradeFirstAid(d);
		const flags = detectAdditionalFlags(d, result);
		expect(flags).toHaveLength(0);
	});

	it('flags each critical-skill failure as high priority', () => {
		const d = createCompetentTrainee();
		d.medicalEmergencies.recognisedAnaphylaxis = 'no';
		const result = gradeFirstAid(d);
		const flags = detectAdditionalFlags(d, result);
		expect(flags.some((f) => f.id === 'FLAG-CRIT-FAW-MED-ANAPHYLAXIS')).toBe(true);
		expect(flags[0].priority).toBe('high');
	});

	it('flags expired prior certification', () => {
		const d = createCompetentTrainee();
		d.traineeDetails.priorCertificationExpiry = '2000-01-01';
		const result = gradeFirstAid(d);
		const flags = detectAdditionalFlags(d, result);
		expect(flags.some((f) => f.id === 'FLAG-CERT-EXPIRED')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createCompetentTrainee();
		d.cprAed.effectiveCompressions = 'no';
		d.recordingReportingHandover.debriefNotes = 'Reviewed scenario timing.';
		const result = gradeFirstAid(d);
		const flags = detectAdditionalFlags(d, result);
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => {
			const order = { high: 0, medium: 1, low: 2 };
			return order[a] - order[b];
		});
		expect(priorities).toEqual(sorted);
	});
});
