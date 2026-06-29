import { describe, it, expect } from 'vitest';
import { calculateResponderGrade } from './responder-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';
import type { AssessmentData } from './types';

/** A baseline competent responder with no firing rules. */
function competentResponder(): AssessmentData {
	const d = createDefaultAssessment();
	d.physicalFitness.cardiovascularFitness = 'competent';
	d.physicalFitness.muscularStrength = 'competent';
	d.physicalFitness.manualHandlingCompetency = 'competent';
	d.physicalFitness.flexibilityMobility = 'competent';
	d.physicalFitness.balanceCoordination = 'competent';
	d.physicalFitness.patientCarryAbility = 'yes';
	d.clinicalSkills.basicLifeSupport = 'competent';
	d.clinicalSkills.advancedLifeSupport = 'competent';
	d.clinicalSkills.airwayManagement = 'competent';
	d.clinicalSkills.patientAssessment = 'competent';
	d.clinicalSkills.traumaAssessment = 'competent';
	d.clinicalSkills.triageCompetency = 'competent';
	d.clinicalSkills.drugAdministration = 'competent';
	d.equipmentVehicle.defibrillatorCompetency = 'competent';
	d.equipmentVehicle.monitorCompetency = 'competent';
	d.equipmentVehicle.stretcherCompetency = 'competent';
	d.equipmentVehicle.ambulanceDriving = 'competent';
	d.equipmentVehicle.emergencyDriving = 'competent';
	d.equipmentVehicle.equipmentCheckCompetency = 'competent';
	d.equipmentVehicle.vehicleDailyInspection = 'yes';
	d.communicationSkills.patientCommunication = 'competent';
	d.communicationSkills.handoverCompetency = 'competent';
	d.communicationSkills.documentationCompetency = 'competent';
	d.communicationSkills.safeguardingAwareness = 'competent';
	d.psychologicalReadiness.stressManagement = 'competent';
	d.psychologicalReadiness.decisionMakingUnderPressure = 'competent';
	d.psychologicalReadiness.emotionalRegulation = 'competent';
	d.occupationalHealth.visionTest = 'pass';
	d.occupationalHealth.hearingTest = 'pass';
	d.occupationalHealth.substanceMisuseScreen = 'negative';
	d.cpdTraining.mandatoryTrainingComplete = 'yes';
	return d;
}

describe('calculateResponderGrade', () => {
	it('grades a fully competent responder as fit for duty with low risk', () => {
		const result = calculateResponderGrade(competentResponder());
		expect(result.firedRules).toHaveLength(0);
		expect(result.overallCompetency).toBe('competent');
		expect(result.overallFitness).toBe('fit-for-duty');
		expect(result.overallRisk).toBe('low');
	});

	it('fires a grade-4 rule and flags BLS not competent', () => {
		const d = competentResponder();
		d.clinicalSkills.basicLifeSupport = 'not-competent';
		const result = calculateResponderGrade(d);
		expect(result.firedRules.some((r) => r.id === 'CS-001')).toBe(true);
		expect(result.overallFitness).toBe('permanently-unfit');
		expect(result.overallRisk).toBe('critical');
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-BLS-001')).toBe(true);
	});

	it('derives fit-with-restrictions for a developing competency', () => {
		const d = competentResponder();
		d.physicalFitness.cardiovascularFitness = 'developing';
		const result = calculateResponderGrade(d);
		expect(result.firedRules.some((r) => r.id === 'PF-002')).toBe(true);
		expect(result.overallFitness).toBe('fit-with-restrictions');
		expect(result.overallRisk).toBe('moderate');
	});

	it('honours an assessor-supplied overall fitness decision', () => {
		const d = competentResponder();
		d.fitnessDecision.overallFitness = 'temporarily-unfit';
		const result = calculateResponderGrade(d);
		expect(result.overallFitness).toBe('temporarily-unfit');
	});

	it('flags a positive substance misuse screen', () => {
		const d = competentResponder();
		d.occupationalHealth.substanceMisuseScreen = 'positive';
		const result = calculateResponderGrade(d);
		expect(result.firedRules.some((r) => r.id === 'OH-003')).toBe(true);
		expect(result.additionalFlags.some((f) => f.id === 'FLAG-SUBSTANCE-001')).toBe(true);
	});
});
