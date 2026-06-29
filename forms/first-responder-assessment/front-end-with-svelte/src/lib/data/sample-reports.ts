import type {
	AssessmentData,
	CompetencyLevel,
	FitnessDecision,
	RiskLevel
} from '$lib/engine/types';
import { calculateResponderGrade } from '$lib/engine/responder-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	responderName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	responderName: string;
	assessedDate: string;
	roleType: string;
	overallCompetency: CompetencyLevel;
	overallFitness: FitnessDecision;
	overallRisk: RiskLevel;
	flagCount: number;
}

/** A fully competent responder: fit for duty, no concerns. */
function fitForDuty(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Amara',
		lastName: 'Okafor',
		dateOfBirth: '1990-03-14',
		sex: 'female',
		weight: 68,
		height: 170,
		bmi: 23.5
	};
	d.roleQualifications = {
		...d.roleQualifications,
		roleType: 'paramedic',
		employerOrganisation: 'North Ambulance Trust',
		stationBase: 'Central',
		yearsOfService: 9,
		registrationBody: 'hcpc',
		highestQualification: 'bachelors',
		drivingLicenceCategory: 'c1',
		blueLightTrained: 'yes'
	};
	d.physicalFitness = {
		...d.physicalFitness,
		cardiovascularFitness: 'competent',
		vo2Max: 45,
		muscularStrength: 'competent',
		manualHandlingCompetency: 'expert',
		patientCarryAbility: 'yes',
		flexibilityMobility: 'competent',
		balanceCoordination: 'competent'
	};
	d.clinicalSkills = {
		...d.clinicalSkills,
		basicLifeSupport: 'expert',
		advancedLifeSupport: 'competent',
		airwayManagement: 'competent',
		drugAdministration: 'competent',
		traumaAssessment: 'competent',
		patientAssessment: 'expert',
		triageCompetency: 'competent'
	};
	d.equipmentVehicle = {
		...d.equipmentVehicle,
		defibrillatorCompetency: 'expert',
		monitorCompetency: 'competent',
		stretcherCompetency: 'competent',
		ambulanceDriving: 'competent',
		emergencyDriving: 'competent',
		vehicleDailyInspection: 'yes',
		equipmentCheckCompetency: 'competent'
	};
	d.communicationSkills = {
		...d.communicationSkills,
		patientCommunication: 'competent',
		handoverCompetency: 'competent',
		documentationCompetency: 'competent',
		safeguardingAwareness: 'competent'
	};
	d.psychologicalReadiness = {
		...d.psychologicalReadiness,
		stressManagement: 'competent',
		resilienceLevel: 'good',
		ptsdScreening: 'yes',
		ptsdScreeningResult: 'negative',
		sleepQuality: 'good',
		burnoutRisk: 'low',
		decisionMakingUnderPressure: 'competent',
		emotionalRegulation: 'competent'
	};
	d.occupationalHealth = {
		...d.occupationalHealth,
		visionTest: 'pass',
		hearingTest: 'pass',
		immunisationStatus: 'up-to-date',
		substanceMisuseScreen: 'negative',
		sicknessAbsenceDays: 3
	};
	d.cpdTraining = {
		...d.cpdTraining,
		cpdHoursLastYear: 40,
		cpdHoursRequired: 30,
		mandatoryTrainingComplete: 'yes'
	};
	return d;
}

/** Fit with restrictions: developing competencies, minor occupational findings. */
function fitWithRestrictions(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Tom',
		lastName: 'Bennett',
		dateOfBirth: '1996-11-02',
		sex: 'male',
		weight: 84,
		height: 182,
		bmi: 25.4
	};
	d.roleQualifications = {
		...d.roleQualifications,
		roleType: 'emt',
		employerOrganisation: 'South Ambulance Trust',
		yearsOfService: 2,
		registrationBody: 'hcpc',
		highestQualification: 'diploma',
		drivingLicenceCategory: 'c1',
		blueLightTrained: 'yes'
	};
	d.physicalFitness = {
		...d.physicalFitness,
		cardiovascularFitness: 'developing',
		vo2Max: 32,
		muscularStrength: 'competent',
		manualHandlingCompetency: 'developing',
		patientCarryAbility: 'yes',
		flexibilityMobility: 'competent',
		balanceCoordination: 'competent'
	};
	d.clinicalSkills = {
		...d.clinicalSkills,
		basicLifeSupport: 'competent',
		advancedLifeSupport: 'developing',
		airwayManagement: 'competent',
		drugAdministration: 'developing',
		traumaAssessment: 'competent',
		patientAssessment: 'competent',
		triageCompetency: 'developing'
	};
	d.equipmentVehicle = {
		...d.equipmentVehicle,
		defibrillatorCompetency: 'competent',
		stretcherCompetency: 'developing',
		ambulanceDriving: 'competent',
		emergencyDriving: 'competent',
		vehicleDailyInspection: 'no',
		equipmentCheckCompetency: 'competent'
	};
	d.communicationSkills = {
		...d.communicationSkills,
		patientCommunication: 'competent',
		handoverCompetency: 'competent',
		documentationCompetency: 'developing',
		safeguardingAwareness: 'competent'
	};
	d.psychologicalReadiness = {
		...d.psychologicalReadiness,
		stressManagement: 'developing',
		resilienceLevel: 'moderate',
		ptsdScreening: 'yes',
		ptsdScreeningResult: 'negative',
		sleepQuality: 'fair',
		burnoutRisk: 'moderate',
		decisionMakingUnderPressure: 'developing',
		emotionalRegulation: 'competent'
	};
	d.occupationalHealth = {
		...d.occupationalHealth,
		visionTest: 'pass',
		hearingTest: 'pass',
		immunisationStatus: 'incomplete',
		substanceMisuseScreen: 'negative',
		musculoskeletalIssues: 'yes',
		musculoskeletalDetails: 'Recurrent lower back strain',
		sicknessAbsenceDays: 12
	};
	d.cpdTraining = {
		...d.cpdTraining,
		cpdHoursLastYear: 18,
		cpdHoursRequired: 30,
		mandatoryTrainingComplete: 'yes'
	};
	return d;
}

/** Temporarily unfit: significant clinical gaps and high burnout risk. */
function temporarilyUnfit(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Grace',
		lastName: 'Whitmore',
		dateOfBirth: '1985-07-21',
		sex: 'female',
		weight: 75,
		height: 165,
		bmi: 27.5
	};
	d.roleQualifications = {
		...d.roleQualifications,
		roleType: 'advanced-paramedic',
		employerOrganisation: 'East Ambulance Trust',
		yearsOfService: 14,
		registrationBody: 'hcpc',
		highestQualification: 'masters',
		drivingLicenceCategory: 'c1',
		blueLightTrained: 'yes'
	};
	d.physicalFitness = {
		...d.physicalFitness,
		cardiovascularFitness: 'developing',
		vo2Max: 28,
		muscularStrength: 'developing',
		manualHandlingCompetency: 'competent',
		patientCarryAbility: 'yes',
		flexibilityMobility: 'developing',
		balanceCoordination: 'competent'
	};
	d.clinicalSkills = {
		...d.clinicalSkills,
		basicLifeSupport: 'competent',
		advancedLifeSupport: 'not-competent',
		airwayManagement: 'developing',
		drugAdministration: 'competent',
		traumaAssessment: 'competent',
		patientAssessment: 'competent',
		triageCompetency: 'not-competent'
	};
	d.equipmentVehicle = {
		...d.equipmentVehicle,
		defibrillatorCompetency: 'competent',
		stretcherCompetency: 'competent',
		ambulanceDriving: 'competent',
		emergencyDriving: 'competent',
		vehicleDailyInspection: 'yes',
		equipmentCheckCompetency: 'competent'
	};
	d.communicationSkills = {
		...d.communicationSkills,
		patientCommunication: 'competent',
		handoverCompetency: 'competent',
		documentationCompetency: 'competent',
		safeguardingAwareness: 'competent'
	};
	d.psychologicalReadiness = {
		...d.psychologicalReadiness,
		stressManagement: 'developing',
		resilienceLevel: 'low',
		ptsdScreening: 'yes',
		ptsdScreeningResult: 'inconclusive',
		criticalIncidentExposure: 'yes',
		criticalIncidentDetails: 'Multi-vehicle collision with paediatric fatality',
		criticalIncidentDebriefed: 'no',
		sleepQuality: 'poor',
		burnoutRisk: 'high',
		decisionMakingUnderPressure: 'developing',
		emotionalRegulation: 'developing'
	};
	d.occupationalHealth = {
		...d.occupationalHealth,
		visionTest: 'pass',
		hearingTest: 'pass',
		immunisationStatus: 'up-to-date',
		substanceMisuseScreen: 'negative',
		sicknessAbsenceDays: 24
	};
	d.cpdTraining = {
		...d.cpdTraining,
		cpdHoursLastYear: 22,
		cpdHoursRequired: 30,
		mandatoryTrainingComplete: 'no'
	};
	return d;
}

/** Permanently unfit: critical clinical and occupational failures. */
function permanentlyUnfit(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = {
		...d.demographics,
		firstName: 'Raymond',
		lastName: 'Clarke',
		dateOfBirth: '1972-02-09',
		sex: 'male',
		weight: 98,
		height: 178,
		bmi: 30.9
	};
	d.roleQualifications = {
		...d.roleQualifications,
		roleType: 'first-aider',
		employerOrganisation: 'Community Response',
		yearsOfService: 20,
		registrationBody: 'other',
		highestQualification: 'certificate',
		drivingLicenceCategory: 'b',
		blueLightTrained: 'no'
	};
	d.physicalFitness = {
		...d.physicalFitness,
		cardiovascularFitness: 'not-competent',
		vo2Max: 22,
		muscularStrength: 'developing',
		manualHandlingCompetency: 'not-competent',
		patientCarryAbility: 'no',
		flexibilityMobility: 'developing',
		balanceCoordination: 'developing'
	};
	d.clinicalSkills = {
		...d.clinicalSkills,
		basicLifeSupport: 'not-competent',
		advancedLifeSupport: 'not-competent',
		airwayManagement: 'not-competent',
		drugAdministration: 'developing',
		traumaAssessment: 'developing',
		patientAssessment: 'not-competent',
		triageCompetency: 'developing'
	};
	d.equipmentVehicle = {
		...d.equipmentVehicle,
		defibrillatorCompetency: 'not-competent',
		stretcherCompetency: 'developing',
		ambulanceDriving: 'developing',
		emergencyDriving: 'not-competent',
		vehicleDailyInspection: 'no',
		equipmentCheckCompetency: 'developing'
	};
	d.communicationSkills = {
		...d.communicationSkills,
		patientCommunication: 'developing',
		handoverCompetency: 'not-competent',
		documentationCompetency: 'developing',
		safeguardingAwareness: 'not-competent'
	};
	d.psychologicalReadiness = {
		...d.psychologicalReadiness,
		stressManagement: 'developing',
		resilienceLevel: 'low',
		ptsdScreening: 'yes',
		ptsdScreeningResult: 'positive',
		criticalIncidentExposure: 'yes',
		criticalIncidentDetails: 'Repeated exposure without support',
		criticalIncidentDebriefed: 'no',
		sleepQuality: 'poor',
		burnoutRisk: 'high',
		decisionMakingUnderPressure: 'not-competent',
		emotionalRegulation: 'developing'
	};
	d.occupationalHealth = {
		...d.occupationalHealth,
		visionTest: 'fail',
		hearingTest: 'refer',
		immunisationStatus: 'incomplete',
		substanceMisuseScreen: 'positive',
		musculoskeletalIssues: 'yes',
		musculoskeletalDetails: 'Chronic shoulder injury, restricted lifting',
		sicknessAbsenceDays: 41
	};
	d.cpdTraining = {
		...d.cpdTraining,
		cpdHoursLastYear: 8,
		cpdHoursRequired: 30,
		mandatoryTrainingComplete: 'no'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'FR-2026-0001', responderName: 'Okafor, Amara', assessedDate: '2026-06-10', data: fitForDuty() },
	{ id: 'FR-2026-0002', responderName: 'Bennett, Tom', assessedDate: '2026-06-12', data: fitWithRestrictions() },
	{ id: 'FR-2026-0003', responderName: 'Whitmore, Grace', assessedDate: '2026-06-15', data: temporarilyUnfit() },
	{ id: 'FR-2026-0004', responderName: 'Clarke, Raymond', assessedDate: '2026-06-18', data: permanentlyUnfit() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateResponderGrade(s.data);
	return {
		id: s.id,
		responderName: s.responderName,
		assessedDate: s.assessedDate,
		roleType: s.data.roleQualifications.roleType,
		overallCompetency: g.overallCompetency,
		overallFitness: g.overallFitness,
		overallRisk: g.overallRisk,
		flagCount: g.additionalFlags.length
	};
});
