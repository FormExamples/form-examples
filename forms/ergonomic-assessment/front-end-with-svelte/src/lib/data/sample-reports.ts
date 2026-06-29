import type { AssessmentData } from '$lib/engine/types';
import { gradeAssessment } from '$lib/engine/reba-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	workerName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the assessor dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	workerName: string;
	assessedDate: string;
	jobTitle: string;
	rebaScore: number;
	riskLevel: string;
	painSeverity: number | null;
	rsiFlag: boolean;
	flagCount: number;
}

/** A negligible-risk assessment: a well set up workstation, no symptoms. */
function negligibleRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1990-05-15', sex: 'female', occupation: 'Office worker', employer: 'Acme Corp', jobTitle: 'Software Developer', yearsInRole: 5 };
	d.workstationSetup = { ...d.workstationSetup, deskHeight: 'correct', chairType: 'adjustable', chairAdjustability: 'yes', monitorPosition: 'correct', monitorDistance: '40-70cm', monitorHeight: 'at-eye-level', keyboardPlacement: 'correct', mousePlacement: 'beside-keyboard', lighting: 'adequate', temperature: 'comfortable' };
	d.postureAssessment = { ...d.postureAssessment, sittingPosture: 'upright', standingPosture: 'not-applicable', neckAngle: 'neutral', trunkAngle: 'neutral', shoulderPosition: 'neutral', wristDeviation: 'neutral' };
	d.repetitiveTasks = { ...d.repetitiveTasks, taskDescription: 'Typing', frequency: 'occasionally', durationPerSession: 'less-than-1hr', forceRequired: 'none', vibrationExposure: 'no' };
	d.manualHandling = { ...d.manualHandling, liftingFrequency: 'none', pushPullForces: 'none' };
	d.currentSymptoms = { ...d.currentSymptoms, impactOnWork: 'none' };
	d.psychosocialFactors = { ...d.psychosocialFactors, jobSatisfaction: 'satisfied', workload: 'manageable', stressLevel: 'low', breaksTaken: 'regular', autonomy: 'high', employerSupport: 'good' };
	return d;
}

/** A low-risk assessment: minor posture issues. */
function lowRisk(): AssessmentData {
	const d = negligibleRisk();
	d.demographics = { ...d.demographics, firstName: 'Tom', lastName: 'Baker', dateOfBirth: '1985-02-20', sex: 'male', occupation: 'Accountant', jobTitle: 'Finance Analyst', yearsInRole: 8 };
	d.postureAssessment = { ...d.postureAssessment, neckAngle: 'flexed-0-20', trunkAngle: 'flexed-0-20' };
	d.workstationSetup = { ...d.workstationSetup, monitorHeight: 'below-eye-level' };
	return d;
}

/** A medium-risk assessment: multiple posture and workstation issues. */
function mediumRisk(): AssessmentData {
	const d = negligibleRisk();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1979-09-30', sex: 'female', occupation: 'Warehouse picker', jobTitle: 'Logistics Operative', yearsInRole: 3 };
	d.postureAssessment = { ...d.postureAssessment, neckAngle: 'flexed-20-plus', trunkAngle: 'flexed-20-60', wristDeviation: 'flexed', sittingPosture: 'slouched' };
	d.workstationSetup = { ...d.workstationSetup, deskHeight: 'too-low', chairAdjustability: 'no', monitorHeight: 'below-eye-level', keyboardPlacement: 'too-high', lighting: 'glare-present' };
	d.repetitiveTasks = { ...d.repetitiveTasks, frequency: 'frequently', durationPerSession: '2-4hrs', forceRequired: 'moderate', vibrationExposure: 'yes' };
	d.currentSymptoms = { ...d.currentSymptoms, painLocations: ['neck', 'lower-back'], painSeverity: 4, duration: '1-3-months', impactOnWork: 'mild' };
	d.psychosocialFactors = { ...d.psychosocialFactors, breaksTaken: 'rarely', stressLevel: 'moderate' };
	return d;
}

/** A high / very-high-risk assessment: extreme posture, heavy handling, severe symptoms. */
function highRisk(): AssessmentData {
	const d = negligibleRisk();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1968-11-03', sex: 'male', occupation: 'Construction labourer', jobTitle: 'Site Operative', yearsInRole: 15 };
	d.postureAssessment = { ...d.postureAssessment, neckAngle: 'twisted', trunkAngle: 'flexed-60-plus', shoulderPosition: 'flexed', wristDeviation: 'ulnar-deviated', sittingPosture: 'slouched', standingPosture: 'asymmetric' };
	d.repetitiveTasks = { ...d.repetitiveTasks, frequency: 'constantly', durationPerSession: 'more-than-4hrs', forceRequired: 'heavy', vibrationExposure: 'yes' };
	d.manualHandling = { ...d.manualHandling, liftingFrequency: 'constant', loadWeightKg: 28, pushPullForces: 'heavy', teamLifting: 'no', mechanicalAidsAvailable: 'no' };
	d.currentSymptoms = { ...d.currentSymptoms, painLocations: ['neck', 'lower-back', 'right-shoulder', 'right-wrist-hand'], painSeverity: 9, duration: 'more-than-6-months', impactOnWork: 'unable-to-work' };
	d.medicalHistory = { ...d.medicalHistory, musculoskeletalConditions: ['osteoarthritis', 'disc-herniation'], rsiCarpalTunnel: 'yes', backProblems: 'yes', chronicPain: 'yes' };
	d.psychosocialFactors = { ...d.psychosocialFactors, breaksTaken: 'none', stressLevel: 'very-high', employerSupport: 'poor', workload: 'excessive' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EA-2026-0001', workerName: 'Smith, Jane', assessedDate: '2026-06-10', data: negligibleRisk() },
	{ id: 'EA-2026-0002', workerName: 'Baker, Tom', assessedDate: '2026-06-12', data: lowRisk() },
	{ id: 'EA-2026-0003', workerName: 'Patel, Priya', assessedDate: '2026-06-15', data: mediumRisk() },
	{ id: 'EA-2026-0004', workerName: 'Williams, David', assessedDate: '2026-06-18', data: highRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		workerName: s.workerName,
		assessedDate: s.assessedDate,
		jobTitle: s.data.demographics.jobTitle,
		rebaScore: g.rebaScore,
		riskLevel: g.riskLevel,
		painSeverity: s.data.currentSymptoms.painSeverity,
		rsiFlag: s.data.medicalHistory.rsiCarpalTunnel === 'yes',
		flagCount: g.additionalFlags.length
	};
});
