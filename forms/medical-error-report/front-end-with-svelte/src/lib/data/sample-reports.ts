import type { AssessmentData, WHOSeverity, RiskLevel, ErrorType } from '#lib/engine/types.js';
import { calculateErrorGrade } from '#lib/engine/error-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample report: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	incidentRef: string;
	reportedDate: string;
	data: AssessmentData;
}

/** A row in the patient-safety dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	incidentRef: string;
	reportedDate: string;
	errorType: ErrorType;
	whoSeverity: WHOSeverity;
	riskLevel: RiskLevel;
	harmFlag: boolean;
	dutyOfCandourFlag: boolean;
	flagCount: number;
}

/** A near-miss medication error: caught before reaching the patient. */
function nearMiss(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, reporterFirstName: 'Anita', reporterLastName: 'Shah', reporterRole: 'pharmacist', facilityName: 'St Mary General', facilityWard: 'Pharmacy', reportDate: '2026-06-10', anonymousReport: 'no' };
	d.incidentDetails = { ...d.incidentDetails, incidentDate: '2026-06-09', locationType: 'pharmacy', incidentSummary: 'Wrong dose noticed during dispensing check and corrected.', staffingLevel: 'adequate' };
	d.errorClassification = { ...d.errorClassification, errorType: 'medication', medicationErrorStage: 'dispensing', whoSeverity: 'near-miss', nccMerpCategory: 'B', preventability: 'probably-preventable', recurrenceLikelihood: 'unlikely' };
	d.patientOutcome = { ...d.patientOutcome, harmReachedPatient: 'no', harmLevel: 'none' };
	return d;
}

/** A moderate diagnostic error: temporary harm, intervention required. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, reporterFirstName: 'Tom', reporterLastName: 'Reed', reporterRole: 'doctor', facilityName: 'St Mary General', facilityWard: 'ED', reportDate: '2026-06-12', anonymousReport: 'no' };
	d.incidentDetails = { ...d.incidentDetails, incidentDate: '2026-06-11', locationType: 'emergency-department', incidentSummary: 'Delayed diagnosis led to short additional treatment.', shiftType: 'night', staffingLevel: 'understaffed' };
	d.patientInvolvement = { ...d.patientInvolvement, patientInvolved: 'yes', patientLastName: 'Doyle', patientSex: 'female', dutyOfCandourApplies: 'yes', dutyOfCandourCompleted: 'yes' };
	d.errorClassification = { ...d.errorClassification, errorType: 'diagnostic', whoSeverity: 'moderate', nccMerpCategory: 'E', preventability: 'probably-preventable', recurrenceLikelihood: 'likely' };
	d.contributingFactors = { ...d.contributingFactors, communicationFailure: 'yes', communicationFailureDetails: 'Handover gap', handoverFailure: 'yes', workloadPressure: 'yes' };
	d.patientOutcome = { ...d.patientOutcome, harmReachedPatient: 'yes', harmLevel: 'moderate', additionalTreatmentRequired: 'yes' };
	return d;
}

/** A high-severity surgical error: permanent harm. */
function high(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, reporterFirstName: 'Grace', reporterLastName: 'Owusu', reporterRole: 'nurse', facilityName: 'St Mary General', facilityWard: 'Theatre 3', reportDate: '2026-06-15', anonymousReport: 'no' };
	d.incidentDetails = { ...d.incidentDetails, incidentDate: '2026-06-14', locationType: 'operating-theatre', incidentSummary: 'Retained item required return to theatre.', staffingLevel: 'adequate' };
	d.patientInvolvement = { ...d.patientInvolvement, patientInvolved: 'yes', patientLastName: 'Khan', patientSex: 'male', dutyOfCandourApplies: 'yes', dutyOfCandourCompleted: 'no' };
	d.errorClassification = { ...d.errorClassification, errorType: 'surgical', whoSeverity: 'severe', nccMerpCategory: 'G', preventability: 'clearly-preventable', recurrenceLikelihood: 'unlikely' };
	d.contributingFactors = { ...d.contributingFactors, policyNotFollowed: 'yes', policyDetails: 'Count protocol not followed' };
	d.patientOutcome = { ...d.patientOutcome, harmReachedPatient: 'yes', harmLevel: 'severe', additionalTreatmentRequired: 'yes', extendedHospitalStay: 'yes', extraDays: 6, permanentDisability: 'yes', disabilityDetails: 'Reduced mobility' };
	d.rootCauseAnalysis = { ...d.rootCauseAnalysis, rcaConducted: 'pending', similarIncidents: 'yes', similarIncidentsDetails: 'One prior count discrepancy' };
	return d;
}

/** A critical transfusion error: patient death. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, reporterFirstName: 'Mark', reporterLastName: 'Ellis', reporterRole: 'doctor', facilityName: 'St Mary General', facilityWard: 'ICU', reportDate: '2026-06-18', anonymousReport: 'no' };
	d.incidentDetails = { ...d.incidentDetails, incidentDate: '2026-06-17', locationType: 'inpatient-ward', incidentSummary: 'ABO-incompatible transfusion administered.', shiftType: 'night', staffingLevel: 'understaffed' };
	d.patientInvolvement = { ...d.patientInvolvement, patientInvolved: 'yes', patientLastName: 'Barnes', patientSex: 'male', dutyOfCandourApplies: 'yes', dutyOfCandourCompleted: 'no' };
	d.errorClassification = { ...d.errorClassification, errorType: 'transfusion', whoSeverity: 'critical', nccMerpCategory: 'I', preventability: 'clearly-preventable', recurrenceLikelihood: 'very-likely' };
	d.contributingFactors = { ...d.contributingFactors, communicationFailure: 'yes', handoverFailure: 'yes', policyNotFollowed: 'yes', staffFatigue: 'yes' };
	d.patientOutcome = { ...d.patientOutcome, harmReachedPatient: 'yes', harmLevel: 'death', patientDied: 'yes', deathDate: '2026-06-17' };
	d.rootCauseAnalysis = { ...d.rootCauseAnalysis, rcaConducted: 'pending', similarIncidents: 'no' };
	d.reportingFollowup = { ...d.reportingFollowup, reportedToCoroner: 'yes', safeguardingReferral: 'yes', finalStatus: 'under-review' };
	return d;
}

/** The sample reports, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'MER-2026-0001', incidentRef: 'Dispensing near miss', reportedDate: '2026-06-10', data: nearMiss() },
	{ id: 'MER-2026-0002', incidentRef: 'Delayed diagnosis', reportedDate: '2026-06-12', data: moderate() },
	{ id: 'MER-2026-0003', incidentRef: 'Retained surgical item', reportedDate: '2026-06-15', data: high() },
	{ id: 'MER-2026-0004', incidentRef: 'Incompatible transfusion', reportedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateErrorGrade(s.data);
	return {
		id: s.id,
		incidentRef: s.incidentRef,
		reportedDate: s.reportedDate,
		errorType: s.data.errorClassification.errorType,
		whoSeverity: g.whoSeverity,
		riskLevel: g.overallRisk,
		harmFlag: s.data.patientOutcome.harmReachedPatient === 'yes',
		dutyOfCandourFlag:
			s.data.patientInvolvement.dutyOfCandourApplies === 'yes' &&
			s.data.patientInvolvement.dutyOfCandourCompleted === 'no',
		flagCount: g.additionalFlags.length
	};
});
