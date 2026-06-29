import type { AssessmentData, FlagPriority } from '$lib/engine/types';
import { gradeCfar } from '$lib/engine/cfar-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample encounter: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	recordedDate: string;
	data: AssessmentData;
}

/** Problem-type summary derived from the situation section. */
export type ProblemType = 'medical' | 'trauma' | 'both' | '';

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	recordedDate: string;
	problemType: ProblemType;
	complete: boolean;
	urgentFlags: number;
	totalFlags: number;
	topPriority: FlagPriority | null;
	tourniquet: boolean;
	recordedBy: string;
}

/** Derive the medical/trauma problem-type summary from an encounter. */
function problemTypeOf(d: AssessmentData): ProblemType {
	const { medical, trauma } = d.situation;
	if (medical && trauma) return 'both';
	if (trauma) return 'trauma';
	if (medical) return 'medical';
	return '';
}

/**
 * A benign, fully-complete medical encounter: all CABCDE assessments Normal,
 * all interventions None, no precautions, mandatory fields filled. No flags.
 */
function benignComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		...d.patientIdentification,
		patientName: 'NAKAMURA, Yuki',
		dateOfBirth: '1997-03-14',
		age: 29,
		sex: 'female',
		patientContactInformation: '+44 7700 900111'
	};
	d.referralTransport.referralFacility = {
		name: 'District Hospital',
		focalPoint: 'Triage Nurse',
		phoneNumber: '+44 20 7946 0000'
	};
	d.referralTransport.eventDateTime = '2026-04-16T15:30';
	d.referralTransport.departureDateTime = '2026-04-16T15:50';
	d.situation = { medical: true, trauma: false, pregnant: 'no', whatHappened: 'Felt faint at work, brief lightheadedness, now recovered.' };
	d.background = { pastMedicalAndSurgicalHistory: 'None', currentMedicationsOrAllergies: 'None' };
	d.majorBleeding.assessmentNormal = true;
	d.majorBleeding.interventions.none = true;
	d.airway.assessmentNormal = true;
	d.airway.interventions.none = true;
	d.breathing.assessmentNormal = true;
	d.breathing.interventions.none = true;
	d.circulation.assessmentNormal = true;
	d.circulation.interventions.none = true;
	d.disability.assessmentNormal = true;
	d.disability.interventions.none = true;
	d.exposure.assessmentNormal = true;
	d.exposure.interventions.none = true;
	d.exposure.medicationTakenNone = true;
	d.recommendations.transportPlan = 'Self-transport to clinic for review; no escort required.';
	d.responderDetails = {
		name: 'Davies, Helen',
		signature: 'H. Davies',
		contactInformation: '+44 7700 900222',
		cfarOrganization: 'Community First Aid Network'
	};
	return d;
}

/**
 * A trauma encounter with a correctly-managed major bleed: tourniquet applied
 * with time recorded and prior direct pressure, plus a possible-fracture
 * precaution (medium flag). Complete.
 */
function traumaTourniquet(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		...d.patientIdentification,
		patientName: 'GARCIA, Luis',
		dateOfBirth: '1984-07-02',
		age: 42,
		sex: 'male',
		patientContactInformation: '+44 7700 900333'
	};
	d.referralTransport.referralFacility = { name: 'Regional Trauma Centre', focalPoint: 'ED Registrar', phoneNumber: '+44 20 7946 0123' };
	d.referralTransport.ambulance = { name: 'County Ambulance', focalPoint: 'Crew 12', phoneNumber: '+44 20 7946 0999' };
	d.referralTransport.eventDateTime = '2026-04-17T09:55';
	d.referralTransport.departureDateTime = '2026-04-17T10:15';
	d.situation = { medical: false, trauma: true, pregnant: 'no', whatHappened: 'Motorcycle collision; open wound and arterial bleeding to right thigh.' };
	d.background = { pastMedicalAndSurgicalHistory: 'Nil of note', currentMedicationsOrAllergies: 'No known allergies' };
	d.majorBleeding.assessmentNormal = false;
	d.majorBleeding.assessmentFindings = 'Arterial bleeding to right thigh.';
	d.majorBleeding.interventions = {
		directPressure: true,
		deepWoundPacking: true,
		tourniquet: true,
		tourniquetApplicationTime: '10:02',
		uterineMassage: false,
		none: false
	};
	d.airway.assessmentNormal = true;
	d.airway.interventions.none = true;
	d.breathing.assessmentNormal = true;
	d.breathing.interventions.none = true;
	d.circulation.assessmentNormal = false;
	d.circulation.assessmentFindings = 'Tachycardic, cool peripheries.';
	d.circulation.interventions.leftLateralPosition = false;
	d.circulation.interventions.fractureCare = true;
	d.disability.assessmentNormal = true;
	d.disability.interventions.none = true;
	d.exposure.assessmentNormal = false;
	d.exposure.assessmentFindings = 'Right thigh deformity, suspected femur fracture.';
	d.exposure.interventions.woundCare = true;
	d.exposure.medicationTakenNone = true;
	d.recommendations.transportPlan = 'Blue-light transfer to Regional Trauma Centre.';
	d.recommendations.problemsAnticipated = 'Hypovolaemic shock.';
	d.recommendations.precautions.possibleFracture = true;
	d.responderDetails = {
		name: 'Wilson, Robert',
		signature: 'R. Wilson',
		contactInformation: '+44 7700 900444',
		cfarOrganization: 'County First Responders'
	};
	return d;
}

/**
 * A medical encounter with several high-priority precautions: pregnant,
 * highly-infectious-disease precaution, altered mental status. Complete.
 */
function highPriorityMedical(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		...d.patientIdentification,
		patientName: 'HASSAN, Amira',
		dateOfBirth: '1988-11-20',
		age: 38,
		sex: 'female',
		patientContactInformation: '+44 7700 900555'
	};
	d.referralTransport.referralFacility = { name: 'City General Hospital', focalPoint: 'Maternity Triage', phoneNumber: '+44 20 7946 0222' };
	d.referralTransport.eventDateTime = '2026-04-21T08:40';
	d.referralTransport.departureDateTime = '2026-04-21T09:05';
	d.situation = { medical: true, trauma: false, pregnant: 'yes', whatHappened: 'Febrile illness with confusion at home; 28 weeks pregnant.' };
	d.background = { pastMedicalAndSurgicalHistory: 'Pregnancy, 28 weeks', currentMedicationsOrAllergies: 'Prenatal vitamins' };
	d.majorBleeding.assessmentNormal = true;
	d.majorBleeding.interventions.none = true;
	d.airway.assessmentNormal = true;
	d.airway.interventions.none = true;
	d.breathing.assessmentNormal = true;
	d.breathing.interventions.none = true;
	d.circulation.assessmentNormal = true;
	d.circulation.interventions.none = true;
	d.disability.assessmentNormal = false;
	d.disability.assessmentFindings = 'Drowsy, disoriented to time and place.';
	d.disability.interventions.highTemperatureCare = true;
	d.exposure.assessmentNormal = true;
	d.exposure.interventions.none = true;
	d.exposure.medicationTakenNone = true;
	d.recommendations.transportPlan = 'Urgent transfer to maternity unit; pre-alert receiving team.';
	d.recommendations.precautions.highlyInfectiousDisease = true;
	d.recommendations.precautions.alteredMentalStatus = true;
	d.responderDetails = {
		name: 'Okafor, Chinwe',
		signature: 'C. Okafor',
		contactInformation: '+44 7700 900666',
		cfarOrganization: 'Community First Aid Network'
	};
	return d;
}

/**
 * A critical, incomplete trauma encounter: major bleeding findings with no
 * intervention, abnormal airway with no intervention, tourniquet ticked with
 * no time — multiple urgent flags, and several mandatory fields left blank.
 */
function criticalIncomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientIdentification = {
		...d.patientIdentification,
		patientName: 'WILLIAMS, David',
		dateOfBirth: '1968-05-09',
		age: 58,
		sex: 'male'
	};
	d.referralTransport.eventDateTime = '2026-04-15T07:10';
	d.situation = { medical: false, trauma: true, pregnant: 'no', whatHappened: 'Fall from height; unconscious with heavy bleeding.' };
	d.majorBleeding.assessmentNormal = false;
	d.majorBleeding.assessmentFindings = 'Heavy bleeding from scalp and left arm.';
	d.majorBleeding.interventions.tourniquet = true;
	// tourniquet time intentionally blank; no other bleeding control → urgent flags
	d.airway.assessmentNormal = false;
	d.airway.assessmentFindings = 'Gurgling, partial obstruction.';
	// no airway intervention → urgent flag
	d.disability.assessmentNormal = false;
	d.disability.assessmentFindings = 'Unresponsive, GCS low.';
	d.recommendations.precautions.spinalImmobilization = true;
	d.responderDetails.name = 'Taylor, James';
	return d;
}

/** The sample encounters, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'WHO-2026-0001', patientName: 'Nakamura, Yuki', recordedDate: '2026-04-16', data: benignComplete() },
	{ id: 'WHO-2026-0002', patientName: 'Garcia, Luis', recordedDate: '2026-04-17', data: traumaTourniquet() },
	{ id: 'WHO-2026-0003', patientName: 'Hassan, Amira', recordedDate: '2026-04-21', data: highPriorityMedical() },
	{ id: 'WHO-2026-0004', patientName: 'Williams, David', recordedDate: '2026-04-15', data: criticalIncomplete() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeCfar(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		recordedDate: s.recordedDate,
		problemType: problemTypeOf(s.data),
		complete: g.complete,
		urgentFlags: g.urgentCount,
		totalFlags: g.flags.length,
		topPriority: g.topPriority,
		tourniquet: s.data.majorBleeding.interventions.tourniquet,
		recordedBy: s.data.responderDetails.name
	};
});
