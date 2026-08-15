import type { AssessmentData, Outcome, VenueType } from '#lib/engine/types.js';
import { gradeLifeguard } from '#lib/engine/lifeguard-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	candidateName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the training-coordinator dashboard, derived by running the engine. */
export interface DashboardRow {
	id: string;
	candidateName: string;
	assessedDate: string;
	venueType: VenueType;
	outcome: Outcome;
	criticalCount: number;
	deficiencyCount: number;
	answeredCount: number;
	totalRules: number;
	flagCount: number;
}

/** A fully-competent candidate: every rule marked 'yes'. */
function competentBase(): AssessmentData {
	const d = createDefaultAssessment();
	d.physicalFitnessSwim = {
		swim50mTimeSeconds: 47,
		swim50mWithinTime: 'yes',
		surfaceDiveDepthMetres: 2.0,
		sustainedSurfaceDive: 'yes',
		swim200mTimeSeconds: 295,
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
		compressionRate: 112,
		compressionDepth: 5.5,
		effectiveCompressions: 'yes',
		effectiveVentilations: 'yes',
		timeToFirstShockSeconds: 55,
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

/** Pass: a fully competent candidate. */
function passCandidate(): AssessmentData {
	const d = competentBase();
	d.candidateDetails = {
		...d.candidateDetails,
		firstName: 'Alex',
		lastName: 'Rivera',
		candidateId: 'RLSS-10231',
		dateOfBirth: '2002-03-14',
		venueType: 'pool',
		venueName: 'Riverside Leisure Centre',
		assessmentType: 'initial',
		sessionDate: '2026-06-10',
		examinerName: 'J. Okafor',
		examinerLicenceNumber: 'EX-4471'
	};
	d.overallResultSignoff = {
		...d.overallResultSignoff,
		examinerOutcome: 'pass',
		strengths: 'Excellent scanning discipline and confident unconscious-casualty rescue.',
		candidateAcknowledged: 'yes'
	};
	return d;
}

/** Needs Development: two non-critical deficiencies, no critical breach. */
function needsDevelopmentCandidate(): AssessmentData {
	const d = competentBase();
	d.candidateDetails = {
		...d.candidateDetails,
		firstName: 'Priya',
		lastName: 'Sharma',
		candidateId: 'RLSS-10188',
		dateOfBirth: '2000-11-02',
		venueType: 'leisure',
		venueName: 'Northgate Pools',
		assessmentType: 'requalification',
		priorCertificationExpiry: '2026-08-01',
		sessionDate: '2026-06-12',
		examinerName: 'J. Okafor',
		examinerLicenceNumber: 'EX-4471'
	};
	d.firstAidOxygen.oxygenTherapyAdministration = 'no';
	d.firstAidOxygen.usesPocketMaskOrBVM = 'no';
	d.overallResultSignoff = {
		...d.overallResultSignoff,
		examinerOutcome: 'needs-development',
		developmentAreas: 'Oxygen therapy flow rate and BVM seal technique need retraining.',
		candidateAcknowledged: 'yes'
	};
	return d;
}

/** Fail: critical competency breach (ineffective compressions) + expired cert. */
function failCriticalCandidate(): AssessmentData {
	const d = competentBase();
	d.candidateDetails = {
		...d.candidateDetails,
		firstName: 'Marcus',
		lastName: 'Bell',
		candidateId: 'RLSS-09977',
		dateOfBirth: '1998-07-21',
		venueType: 'beach',
		venueName: 'Sandbay Lifeguard Unit',
		assessmentType: 'requalification',
		priorCertificationExpiry: '2025-12-31',
		sessionDate: '2026-06-15',
		examinerName: 'L. Adeyemi',
		examinerLicenceNumber: 'EX-3290'
	};
	d.cprAed.compressionDepth = 3.5;
	d.cprAed.effectiveCompressions = 'no';
	d.spinalInjuryManagement.headSplintHold = 'no';
	d.overallResultSignoff = {
		...d.overallResultSignoff,
		examinerOutcome: 'fail',
		developmentAreas: 'Compression depth and spinal head-splint hold require full reassessment.',
		examinerNotes: 'Recommend remediation block before re-presenting.',
		candidateAcknowledged: 'yes'
	};
	return d;
}

/** Fail: slow 50 m swim (critical numeric breach) and shallow surface dive. */
function failSwimCandidate(): AssessmentData {
	const d = competentBase();
	d.candidateDetails = {
		...d.candidateDetails,
		firstName: 'Hana',
		lastName: 'Kowalski',
		candidateId: 'RLSS-10410',
		dateOfBirth: '2004-01-09',
		venueType: 'water-park',
		venueName: 'Splashworld',
		assessmentType: 'initial',
		sessionDate: '2026-06-18',
		examinerName: 'L. Adeyemi',
		examinerLicenceNumber: 'EX-3290'
	};
	d.physicalFitnessSwim.swim50mWithinTime = '';
	d.physicalFitnessSwim.swim50mTimeSeconds = 74;
	d.physicalFitnessSwim.surfaceDiveDepthMetres = 1.0;
	d.physicalFitnessSwim.sustainedSurfaceDive = 'no';
	d.overallResultSignoff = {
		...d.overallResultSignoff,
		examinerOutcome: 'fail',
		developmentAreas: 'Swim conditioning required to meet the 50 m timed standard.',
		candidateFeedback: 'Will start a structured swim programme before re-presenting.',
		candidateAcknowledged: 'yes'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'LG-2026-0001', candidateName: 'Rivera, Alex', assessedDate: '2026-06-10', data: passCandidate() },
	{ id: 'LG-2026-0002', candidateName: 'Sharma, Priya', assessedDate: '2026-06-12', data: needsDevelopmentCandidate() },
	{ id: 'LG-2026-0003', candidateName: 'Bell, Marcus', assessedDate: '2026-06-15', data: failCriticalCandidate() },
	{ id: 'LG-2026-0004', candidateName: 'Kowalski, Hana', assessedDate: '2026-06-18', data: failSwimCandidate() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeLifeguard(s.data);
	return {
		id: s.id,
		candidateName: s.candidateName,
		assessedDate: s.assessedDate,
		venueType: s.data.candidateDetails.venueType,
		outcome: g.outcome,
		criticalCount: g.criticalFailures.length,
		deficiencyCount: g.deficiencies.length,
		answeredCount: g.answeredCount,
		totalRules: g.totalRules,
		flagCount: g.additionalFlags.length
	};
});
