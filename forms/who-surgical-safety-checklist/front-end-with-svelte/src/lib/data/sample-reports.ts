import type { ChecklistStatus, Urgency, WhoSurgicalSafetyChecklist } from '$lib/checklist/types.js';
import { createEmptyChecklist } from '$lib/checklist/factory.js';
import { computeSafetyFlags } from '$lib/checklist/flags.js';
import { computeStatus } from '$lib/checklist/completion.js';

/** A sample checklist: an id, presentation metadata, and the full data the engine grades. */
export interface SampleChecklist {
	id: string;
	patientName: string;
	surgeonName: string;
	anaesthetistName: string;
	data: WhoSurgicalSafetyChecklist;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	caseDate: string;
	patientName: string;
	siteName: string;
	operatingRoom: string;
	surgeonName: string;
	anaesthetistName: string;
	urgency: Urgency;
	surgicalSpecialty: string;
	status: ChecklistStatus;
	flagCount: number;
}

/** A fully signed-off, clean elective case (status: completed, no flags). */
function completedClean(): WhoSurgicalSafetyChecklist {
	const d = createEmptyChecklist();
	d.siteName = 'St. Thomas’ Hospital';
	d.operatingRoom = 'Theatre 3';
	d.caseDate = '2026-06-10';
	d.plannedProcedure = 'Laparoscopic cholecystectomy';
	d.surgicalSpecialty = 'General surgery';
	d.urgency = 'elective';
	d.laterality = 'na';
	d.isPaediatric = 'no';
	d.signInIdentitySiteProcedureConsent = 'yes';
	d.signInSiteMarked = 'not-applicable';
	d.signInAnaesthesiaCheckComplete = 'yes';
	d.signInPulseOximeterOnPatient = 'yes';
	d.signInKnownAllergy = 'no';
	d.signInDifficultAirwayAspirationRisk = 'no';
	d.signInBloodLossRisk = 'no';
	d.signInCoordinatorName = 'A. Nurse';
	d.signInCoordinatorRole = 'circulating-nurse';
	d.signInCompletedAt = '2026-06-10T09:00:00Z';
	d.timeOutTeamIntroductionsConfirmed = 'yes';
	d.timeOutPatientProcedureIncisionConfirmed = 'yes';
	d.timeOutAntibioticProphylaxisWithin60Min = 'yes';
	d.timeOutNursingSterilityConfirmed = 'yes';
	d.timeOutEssentialImagingDisplayed = 'yes';
	d.timeOutCoordinatorName = 'A. Nurse';
	d.timeOutCoordinatorRole = 'circulating-nurse';
	d.timeOutCompletedAt = '2026-06-10T09:30:00Z';
	d.signOutProcedureNameConfirmed = 'yes';
	d.signOutCountsConfirmed = 'yes';
	d.signOutSpecimensLabelled = 'yes';
	d.signOutCoordinatorName = 'A. Nurse';
	d.signOutCoordinatorRole = 'circulating-nurse';
	d.signOutCompletedAt = '2026-06-10T11:30:00Z';
	d.teamMembers = [
		{ id: '', checklistId: '', clinicianId: '', name: 'Mr. Okafor', role: 'surgeon', introducedDuringTimeOut: 'yes', notes: '' },
		{ id: '', checklistId: '', clinicianId: '', name: 'Dr. Lin', role: 'anaesthetist', introducedDuringTimeOut: 'yes', notes: '' }
	];
	return d;
}

/** Time Out signed off but with several safety flags raised. */
function timeOutWithFlags(): WhoSurgicalSafetyChecklist {
	const d = createEmptyChecklist();
	d.siteName = 'Royal Infirmary';
	d.operatingRoom = 'Theatre 1';
	d.caseDate = '2026-06-12';
	d.plannedProcedure = 'Right total knee replacement';
	d.surgicalSpecialty = 'Orthopaedics';
	d.urgency = 'urgent';
	d.laterality = 'right';
	d.isPaediatric = 'no';
	d.signInIdentitySiteProcedureConsent = 'yes';
	d.signInSiteMarked = 'yes';
	d.signInAnaesthesiaCheckComplete = 'yes';
	d.signInPulseOximeterOnPatient = 'yes';
	d.signInKnownAllergy = 'yes';
	d.signInKnownAllergyDetail = 'Penicillin — anaphylaxis';
	d.signInDifficultAirwayAspirationRisk = 'no';
	d.signInBloodLossRisk = 'yes-two-ivs-and-fluids-planned';
	d.signInCoordinatorName = 'B. Scrub';
	d.signInCoordinatorRole = 'circulating-nurse';
	d.signInCompletedAt = '2026-06-12T13:00:00Z';
	d.timeOutTeamIntroductionsConfirmed = 'yes';
	d.timeOutPatientProcedureIncisionConfirmed = 'yes';
	d.timeOutAntibioticProphylaxisWithin60Min = 'yes';
	d.timeOutSurgeonAnticipatedBloodLossMl = 800;
	d.timeOutNursingSterilityConfirmed = 'yes';
	d.timeOutEssentialImagingDisplayed = 'yes';
	d.timeOutCoordinatorName = 'B. Scrub';
	d.timeOutCoordinatorRole = 'circulating-nurse';
	d.timeOutCompletedAt = '2026-06-12T13:25:00Z';
	return d;
}

/** Sign In only — case still in progress. */
function signInOnly(): WhoSurgicalSafetyChecklist {
	const d = createEmptyChecklist();
	d.siteName = 'City General';
	d.operatingRoom = 'Theatre 2';
	d.caseDate = '2026-06-15';
	d.plannedProcedure = 'Appendicectomy';
	d.surgicalSpecialty = 'General surgery';
	d.urgency = 'emergency';
	d.laterality = 'na';
	d.isPaediatric = 'yes';
	d.signInIdentitySiteProcedureConsent = 'yes';
	d.signInSiteMarked = 'not-applicable';
	d.signInAnaesthesiaCheckComplete = 'yes';
	d.signInPulseOximeterOnPatient = 'yes';
	d.signInKnownAllergy = 'no';
	d.signInDifficultAirwayAspirationRisk = 'no';
	d.signInBloodLossRisk = 'no';
	d.signInCoordinatorName = 'C. Charge';
	d.signInCoordinatorRole = 'circulating-nurse';
	d.signInCompletedAt = '2026-06-15T02:10:00Z';
	return d;
}

/** Abandoned case before Sign Out, with a recorded reason. */
function abandoned(): WhoSurgicalSafetyChecklist {
	const d = createEmptyChecklist();
	d.siteName = 'St. Thomas’ Hospital';
	d.operatingRoom = 'Theatre 4';
	d.caseDate = '2026-06-18';
	d.plannedProcedure = 'Elective hernia repair';
	d.surgicalSpecialty = 'General surgery';
	d.urgency = 'elective';
	d.laterality = 'left';
	d.isPaediatric = 'no';
	d.signInIdentitySiteProcedureConsent = 'yes';
	d.signInSiteMarked = 'yes';
	d.signInAnaesthesiaCheckComplete = 'yes';
	d.signInPulseOximeterOnPatient = 'yes';
	d.signInKnownAllergy = 'no';
	d.signInDifficultAirwayAspirationRisk = 'no';
	d.signInBloodLossRisk = 'no';
	d.signInCoordinatorName = 'A. Nurse';
	d.signInCoordinatorRole = 'circulating-nurse';
	d.signInCompletedAt = '2026-06-18T08:00:00Z';
	d.abandonedReason = 'Patient pyrexial on arrival; case postponed.';
	return d;
}

/** The sample checklists, keyed by stable id (used to seed the wizard). */
export const sampleChecklists: SampleChecklist[] = [
	{ id: 'WHO-2026-0001', patientName: 'Smith, John', surgeonName: 'Okafor', anaesthetistName: 'Lin', data: completedClean() },
	{ id: 'WHO-2026-0002', patientName: 'Patel, Priya', surgeonName: 'Adebayo', anaesthetistName: 'Khan', data: timeOutWithFlags() },
	{ id: 'WHO-2026-0003', patientName: 'Jones, Margaret', surgeonName: 'Reilly', anaesthetistName: 'Novak', data: signInOnly() },
	{ id: 'WHO-2026-0004', patientName: 'Williams, David', surgeonName: 'Okafor', anaesthetistName: 'Lin', data: abandoned() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleChecklistRows: DashboardRow[] = sampleChecklists.map((s) => ({
	id: s.id,
	caseDate: s.data.caseDate,
	patientName: s.patientName,
	siteName: s.data.siteName,
	operatingRoom: s.data.operatingRoom,
	surgeonName: s.surgeonName,
	anaesthetistName: s.anaesthetistName,
	urgency: s.data.urgency,
	surgicalSpecialty: s.data.surgicalSpecialty,
	status: computeStatus(s.data),
	flagCount: computeSafetyFlags(s.data).length
}));
