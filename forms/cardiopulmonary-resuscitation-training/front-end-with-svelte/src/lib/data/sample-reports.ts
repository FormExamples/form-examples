import type { AssessmentData, Outcome, TriState } from '$lib/engine/types';
import { gradeBLS } from '$lib/engine/bls-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	traineeName: string;
	sessionDate: string;
	data: AssessmentData;
}

/** A row in the coordinator dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	traineeName: string;
	role: string;
	sessionDate: string;
	outcome: Outcome;
	criticalFailures: number;
	deficiencies: number;
	flagCount: number;
}

/** Mark every checklist item with the same tri-state value. */
function allItems(value: TriState): AssessmentData {
	const d = createDefaultAssessment();
	d.sceneSafety = { sceneSafe: value, ppeApplied: value, hazardsIdentified: value, bystandersControlled: value };
	d.responsivenessBreathing = {
		tappedAndShouted: value,
		checkedBreathing: value,
		checkedPulseSimultaneously: value,
		timeWithinTenSeconds: value
	};
	d.activateEmergencyResponse = {
		calledEmergencyNumber: value,
		statedLocationAndCondition: value,
		designatedAedRetriever: value,
		usedSpeakerphone: value
	};
	d.chestCompressions = {
		compressionRate: 110,
		compressionDepth: 5.5,
		correctHandPosition: value,
		fullChestRecoil: value,
		minimisedInterruptions: value,
		compressionsAtCorrectRate: value,
		compressionsAtCorrectDepth: value
	};
	d.airwayRescueBreaths = {
		headTiltChinLift: value,
		effectiveSeal: value,
		visibleChestRise: value,
		oneSecondPerBreath: value,
		ratio30to2: value,
		avoidedExcessiveVentilation: value
	};
	d.aedShockDelivery = {
		poweredOnPromptly: value,
		correctPadPlacement: value,
		clearedDuringAnalysis: value,
		deliveredShockSafely: value,
		resumedCompressionsImmediately: value,
		timeToFirstShockSeconds: 50
	};
	d.teamDynamicsHandoff = {
		clearCommunication: value,
		closedLoopOrders: value,
		appropriateHandoff: value,
		debriefParticipated: value,
		examinerNotes: '',
		traineeFeedback: ''
	};
	return d;
}

/** A clean pass: every required skill demonstrated. */
function cleanPass(): AssessmentData {
	const d = allItems('yes');
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'Aisha',
		lastName: 'Khan',
		traineeId: 'BLS-1042',
		role: 'nurse',
		sessionDate: '2026-06-10',
		examinerName: 'Dr Owens'
	};
	return d;
}

/** A pass with two non-critical deficiencies — still within tolerance. */
function passWithDeficiencies(): AssessmentData {
	const d = allItems('yes');
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'Tom',
		lastName: 'Becker',
		traineeId: 'BLS-1077',
		role: 'first-responder',
		sessionDate: '2026-06-12',
		examinerName: 'Dr Owens'
	};
	d.sceneSafety.ppeApplied = 'no';
	d.activateEmergencyResponse.usedSpeakerphone = 'no';
	d.teamDynamicsHandoff.examinerNotes = 'Solid CPR; reminded to don gloves and use speakerphone.';
	return d;
}

/** A fail driven by a critical-action failure (no visible chest rise). */
function failCritical(): AssessmentData {
	const d = allItems('yes');
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'Maria',
		lastName: 'Santos',
		traineeId: 'BLS-1090',
		role: 'paramedic',
		priorCertificationExpiry: '2025-01-01',
		sessionDate: '2026-06-15',
		examinerName: 'Dr Patel'
	};
	d.airwayRescueBreaths.visibleChestRise = 'no';
	d.chestCompressions.compressionDepth = 3.5;
	d.chestCompressions.compressionsAtCorrectDepth = 'no';
	d.aedShockDelivery.timeToFirstShockSeconds = 120;
	return d;
}

/** A fail driven by more than two non-critical deficiencies. */
function failMultiDeficiency(): AssessmentData {
	const d = allItems('yes');
	d.traineeDetails = {
		...d.traineeDetails,
		firstName: 'James',
		lastName: 'Doyle',
		traineeId: 'BLS-1105',
		role: 'other',
		sessionDate: '2026-06-18',
		examinerName: 'Dr Patel'
	};
	d.sceneSafety.hazardsIdentified = 'no';
	d.chestCompressions.fullChestRecoil = 'no';
	d.airwayRescueBreaths.ratio30to2 = 'no';
	d.teamDynamicsHandoff.closedLoopOrders = 'no';
	d.teamDynamicsHandoff.traineeFeedback = 'Felt rushed during compressions; wants another practice run.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'BLS-2026-0001', traineeName: 'Khan, Aisha', sessionDate: '2026-06-10', data: cleanPass() },
	{ id: 'BLS-2026-0002', traineeName: 'Becker, Tom', sessionDate: '2026-06-12', data: passWithDeficiencies() },
	{ id: 'BLS-2026-0003', traineeName: 'Santos, Maria', sessionDate: '2026-06-15', data: failCritical() },
	{ id: 'BLS-2026-0004', traineeName: 'Doyle, James', sessionDate: '2026-06-18', data: failMultiDeficiency() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeBLS(s.data);
	return {
		id: s.id,
		traineeName: s.traineeName,
		role: s.data.traineeDetails.role,
		sessionDate: s.sessionDate,
		outcome: g.outcome,
		criticalFailures: g.criticalFailures.length,
		deficiencies: g.nonCriticalDeficiencies.length,
		flagCount: g.additionalFlags.length
	};
});
