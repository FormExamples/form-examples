import type { AssessmentData, FitnessStatement, RestrictionPriority } from '$lib/engine/types';
import { calculateReturnToWork } from '$lib/engine/rtw-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample record: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	fitnessStatement: FitnessStatement;
	restrictionPriority: RestrictionPriority;
	phasedReturnFlag: boolean;
	daysAbsent: number | null;
	flagCount: number;
}

/** Fully recovered: fit for work, no restrictions, routine priority. */
function fitRecord(): AssessmentData {
	const d = createDefaultAssessment();
	d.clinician = { ...d.clinician, name: 'Dr A Patel', role: 'gp', registrationNumber: 'GMC1234567', site: 'Riverside Surgery', signature: 'A Patel', date: '2026-06-10' };
	d.patient = { ...d.patient, nhsNumber: '485 777 3456', firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-03-14', sex: 'male', employerName: 'Acme Ltd' };
	d.job = { ...d.job, jobTitle: 'Accountant', roleDescription: 'Office-based finance role', contractedHours: 37.5, shiftPattern: 'Days', safetyCritical: 'no', dvlaNotifiableRole: 'no', industrySector: 'Finance' };
	d.absence = { ...d.absence, firstDayOfAbsence: '2026-05-29', totalDaysAbsent: 10, previousSelfCertification: 'yes' };
	d.diagnosis = { ...d.diagnosis, primaryDiagnosis: 'Acute gastroenteritis', mechanism: 'illness', workplaceCause: 'no' };
	d.treatment = { ...d.treatment, lastConsultationDate: '2026-06-09', recoveryTrajectory: 'improving' };
	d.functional = { ...d.functional, mobility: 'full', manualHandling: 'full', cognition: 'full', mood: 'full', sleep: 'full', pain: 0, drivingCapacity: 'yes', adlIndependence: 'yes' };
	d.fitness = { ...d.fitness, outcome: 'fit', clinicianConfidence: 'high', validFrom: '2026-06-10', validTo: '2026-06-10', reassessmentRequired: 'no' };
	d.phasedReturn = { ...d.phasedReturn, applicable: 'no' };
	d.followUp = { ...d.followUp, reviewClinic: 'none', ohReferralMade: 'no', dvlaNotificationRequired: 'no', employerOhNotified: 'no' };
	return d;
}

/** May be fit with a phased return — standard priority. */
function phasedRecord(): AssessmentData {
	const d = createDefaultAssessment();
	d.clinician = { ...d.clinician, name: 'Dr S Okafor', role: 'oh-physician', registrationNumber: 'GMC7654321', site: 'City OH Clinic', signature: 'S Okafor', date: '2026-06-12' };
	d.patient = { ...d.patient, nhsNumber: '532 118 9043', firstName: 'Priya', lastName: 'Desai', dateOfBirth: '1978-09-30', sex: 'female', employerName: 'Northgate Logistics' };
	d.job = { ...d.job, jobTitle: 'Warehouse supervisor', roleDescription: 'Supervises picking team', contractedHours: 40, shiftPattern: 'Rotating', safetyCritical: 'no', dvlaNotifiableRole: 'no', industrySector: 'Logistics' };
	d.absence = { ...d.absence, firstDayOfAbsence: '2026-05-01', totalDaysAbsent: 35, priorMed3Ref: 'MED3-2026-0421', previousSelfCertification: 'yes' };
	d.diagnosis = { ...d.diagnosis, primaryDiagnosis: 'Lower back strain', mechanism: 'injury', workplaceCause: 'no' };
	d.treatment = { ...d.treatment, ongoingTherapy: 'Physiotherapy weekly', lastConsultationDate: '2026-06-11', recoveryTrajectory: 'improving' };
	d.functional = { ...d.functional, mobility: 'mild', manualHandling: 'moderate', cognition: 'full', mood: 'mild', sleep: 'mild', pain: 4, drivingCapacity: 'yes', standingTolerance: 'mild', sittingTolerance: 'full', adlIndependence: 'yes' };
	d.fitness = { ...d.fitness, outcome: 'may-be-fit', clinicianConfidence: 'high', validFrom: '2026-06-12', validWeeks: 4, reassessmentRequired: 'yes' };
	d.phasedReturn = { ...d.phasedReturn, applicable: 'yes', startHoursPerWeek: 20, targetFullHoursDate: '2026-07-15', daysPerWeek: 3, supportContact: 'Line manager' };
	d.adjustments = { ...d.adjustments, alteredHours: true };
	d.followUp = { ...d.followUp, reviewClinic: 'oh', reviewDate: '2026-07-10', ohReferralMade: 'yes', dvlaNotificationRequired: 'no', employerOhNotified: 'yes' };
	return d;
}

/** May be fit but with several moderate restrictions — restricted priority. */
function restrictedRecord(): AssessmentData {
	const d = createDefaultAssessment();
	d.clinician = { ...d.clinician, name: 'Dr M Lewis', role: 'hospital-consultant', registrationNumber: 'GMC2468013', site: 'St Mary Hospital', signature: 'M Lewis', date: '2026-06-15' };
	d.patient = { ...d.patient, nhsNumber: '617 233 8890', firstName: 'David', lastName: 'Hughes', dateOfBirth: '1969-01-22', sex: 'male', employerName: 'BuildWell Construction' };
	d.job = { ...d.job, jobTitle: 'Site labourer', roleDescription: 'General construction duties', contractedHours: 45, shiftPattern: 'Days', safetyCritical: 'no', dvlaNotifiableRole: 'no', industrySector: 'Construction' };
	d.absence = { ...d.absence, firstDayOfAbsence: '2026-04-10', totalDaysAbsent: 60, priorMed3Ref: 'MED3-2026-0301', previousSelfCertification: 'no' };
	d.diagnosis = { ...d.diagnosis, primaryDiagnosis: 'Post-operative knee recovery', mechanism: 'surgery', workplaceCause: 'no' };
	d.treatment = { ...d.treatment, currentMedications: 'Paracetamol PRN', ongoingTherapy: 'Physiotherapy', lastConsultationDate: '2026-06-14', recoveryTrajectory: 'stable' };
	d.functional = { ...d.functional, mobility: 'moderate', manualHandling: 'severe', cognition: 'full', mood: 'mild', sleep: 'moderate', pain: 5, drivingCapacity: 'no', standingTolerance: 'moderate', sittingTolerance: 'mild', adlIndependence: 'yes' };
	d.fitness = { ...d.fitness, outcome: 'may-be-fit', clinicianConfidence: 'medium', validFrom: '2026-06-15', validWeeks: 6, reassessmentRequired: 'yes' };
	d.phasedReturn = { ...d.phasedReturn, applicable: 'yes', startHoursPerWeek: 24, targetFullHoursDate: '2026-08-01', daysPerWeek: 4, supportContact: 'Site OH adviser' };
	d.adjustments = { ...d.adjustments, noHeavyLifting: true, liftingKgLimit: 5, noDriving: true, sedentaryOnly: true, workstationReviewRequired: 'yes', additionalAdjustments: 'Ground-floor duties only' };
	d.followUp = { ...d.followUp, reviewClinic: 'oh', reviewDate: '2026-07-20', ohReferralMade: 'yes', dvlaNotificationRequired: 'no', employerOhNotified: 'yes' };
	return d;
}

/** Not fit, safety-critical role, high-risk adjustment — high-risk priority and flags. */
function notFitRecord(): AssessmentData {
	const d = createDefaultAssessment();
	d.clinician = { ...d.clinician, name: 'Dr R Nair', role: 'oh-physician', registrationNumber: 'GMC1357924', site: 'Rail Health Services', signature: 'R Nair', date: '2026-06-18' };
	d.patient = { ...d.patient, nhsNumber: '701 884 2215', firstName: 'Sarah', lastName: 'Bennett', dateOfBirth: '1990-11-03', sex: 'female', employerName: 'National Rail Ops' };
	d.job = { ...d.job, jobTitle: 'Signalling technician', roleDescription: 'Safety-critical track-side maintenance', contractedHours: 38, shiftPattern: 'Nights', safetyCritical: 'yes', dvlaNotifiableRole: 'yes', industrySector: 'Rail' };
	d.absence = { ...d.absence, firstDayOfAbsence: '2026-04-25', totalDaysAbsent: 54, previousSelfCertification: 'no' };
	d.diagnosis = { ...d.diagnosis, primaryDiagnosis: 'Severe depressive episode', mechanism: 'mental-health', workplaceCause: 'yes', riddorReference: '' };
	d.treatment = { ...d.treatment, currentMedications: 'Sertraline 100mg', ongoingTherapy: 'CBT', lastConsultationDate: '2026-06-17', recoveryTrajectory: 'uncertain' };
	d.functional = { ...d.functional, mobility: 'full', manualHandling: 'full', cognition: 'moderate', mood: 'severe', sleep: 'severe', pain: 1, drivingCapacity: 'no', standingTolerance: 'full', sittingTolerance: 'full', adlIndependence: 'yes' };
	d.fitness = { ...d.fitness, outcome: 'not-fit', clinicianConfidence: 'low', validFrom: '2026-06-18', validWeeks: 8, reassessmentRequired: 'yes' };
	d.phasedReturn = { ...d.phasedReturn, applicable: 'no' };
	d.adjustments = { ...d.adjustments, noLoneWorking: true, noWorkingAtHeight: true, workstationReviewRequired: 'no' };
	d.followUp = { ...d.followUp, reviewClinic: 'specialist', reviewDate: '', ohReferralMade: 'no', dvlaNotificationRequired: 'yes', employerOhNotified: 'no' };
	return d;
}

/** The sample records, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'RTW-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: fitRecord() },
	{ id: 'RTW-2026-0002', patientName: 'Desai, Priya', assessedDate: '2026-06-12', data: phasedRecord() },
	{ id: 'RTW-2026-0003', patientName: 'Hughes, David', assessedDate: '2026-06-15', data: restrictedRecord() },
	{ id: 'RTW-2026-0004', patientName: 'Bennett, Sarah', assessedDate: '2026-06-18', data: notFitRecord() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateReturnToWork(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		fitnessStatement: g.fitnessStatement,
		restrictionPriority: g.restrictionPriority,
		phasedReturnFlag: s.data.phasedReturn.applicable === 'yes',
		daysAbsent: s.data.absence.totalDaysAbsent,
		flagCount: g.additionalFlags.length
	};
});
