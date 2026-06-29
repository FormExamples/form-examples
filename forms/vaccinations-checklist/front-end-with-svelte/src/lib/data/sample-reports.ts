import type { AssessmentData, ComplianceStatus, RiskLevel } from '$lib/engine/types';
import { calculateVaccinationGrade } from '$lib/engine/vaccination-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample checklist: an identifier and the full data the engine grades. */
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
	occupationCategory: string;
	complianceStatus: ComplianceStatus;
	riskLevel: RiskLevel;
	childhoodComplete: boolean;
	covidComplete: boolean;
	fluCurrent: boolean;
	flagCount: number;
}

/** Fully immunised, low risk: all routine schedules complete. */
function fullyImmunised(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1988-04-12', sex: 'male', occupation: 'Teacher', occupationCategory: 'education', employer: 'City School' };
	d.vaccinationHistory = { ...d.vaccinationHistory, hasVaccinationRecord: 'yes', recordSource: 'gp-records', previousAdverseReaction: 'no', immunocompromised: 'no', pregnantOrPlanning: 'not-applicable' };
	d.childhoodImmunisations = { ...d.childhoodImmunisations, mmrDose1: 'yes', mmrDose2: 'yes', dtpPrimaryCourse: 'yes', dtpBooster: 'yes', polioPrimaryCourse: 'yes', polioBooster: 'yes' };
	d.covid19Vaccination = { ...d.covid19Vaccination, covidPrimaryCourse: 'yes', covidPrimaryVaccineType: 'pfizer', covidBooster1: 'yes', totalCovidDoses: 3 };
	d.influenzaVaccination = { ...d.influenzaVaccination, fluVaccineCurrentSeason: 'yes', fluVaccineType: 'standard' };
	d.scheduleCompliance = { ...d.scheduleCompliance, occupationalHealthClearance: 'yes', activeExposureIncident: 'no', consentForVaccination: 'yes' };
	return d;
}

/** Partially immunised, moderate risk: some childhood gaps, no current flu. */
function partiallyImmunised(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1972-09-30', sex: 'female', occupation: 'Administrator', occupationCategory: 'other', employer: 'County Council' };
	d.vaccinationHistory = { ...d.vaccinationHistory, hasVaccinationRecord: 'yes', recordSource: 'self-reported', previousAdverseReaction: 'no', immunocompromised: 'no', pregnantOrPlanning: 'no' };
	d.childhoodImmunisations = { ...d.childhoodImmunisations, mmrDose1: 'yes', mmrDose2: 'unknown', dtpPrimaryCourse: 'yes', dtpBooster: 'unknown', polioPrimaryCourse: 'yes', polioBooster: 'yes' };
	d.covid19Vaccination = { ...d.covid19Vaccination, covidPrimaryCourse: 'yes', covidPrimaryVaccineType: 'moderna', covidBooster1: 'no', totalCovidDoses: 2 };
	d.influenzaVaccination = { ...d.influenzaVaccination, fluVaccineCurrentSeason: 'no' };
	d.scheduleCompliance = { ...d.scheduleCompliance, occupationalHealthClearance: 'pending', activeExposureIncident: 'no', consentForVaccination: 'yes' };
	return d;
}

/** Non-compliant, high risk: healthcare worker with key occupational gaps. */
function nonCompliant(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1995-01-22', sex: 'female', occupation: 'Nurse', occupationCategory: 'healthcare', employer: 'General Hospital' };
	d.vaccinationHistory = { ...d.vaccinationHistory, hasVaccinationRecord: 'yes', recordSource: 'occupational-health', previousAdverseReaction: 'no', immunocompromised: 'no', pregnantOrPlanning: 'no' };
	d.childhoodImmunisations = { ...d.childhoodImmunisations, mmrDose1: 'yes', mmrDose2: 'yes', dtpPrimaryCourse: 'yes', dtpBooster: 'yes', polioPrimaryCourse: 'yes', polioBooster: 'yes' };
	d.occupationalVaccines = { ...d.occupationalVaccines, hepatitisBCourse: 'no', hepatitisBAntiBodyLevel: 'not-tested', varicellaVaccine: 'no', varicellaHistory: 'no' };
	d.covid19Vaccination = { ...d.covid19Vaccination, covidPrimaryCourse: 'no' };
	d.influenzaVaccination = { ...d.influenzaVaccination, fluVaccineCurrentSeason: 'no', fluHighRiskGroup: 'no' };
	d.serologyImmunityTesting = { ...d.serologyImmunityTesting, hepBSurfaceAntibody: 'negative', measlesIgG: 'positive' };
	d.scheduleCompliance = { ...d.scheduleCompliance, occupationalHealthClearance: 'no', activeExposureIncident: 'no', consentForVaccination: 'yes' };
	return d;
}

/** Contraindicated / critical: anaphylaxis history with active exposure. */
function contraindicated(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1960-11-03', sex: 'male', occupation: 'Lab technician', occupationCategory: 'laboratory', employer: 'Research Institute' };
	d.vaccinationHistory = { ...d.vaccinationHistory, hasVaccinationRecord: 'yes', recordSource: 'gp-records', previousAdverseReaction: 'yes', adverseReactionVaccine: 'Influenza', adverseReactionSeverity: 'anaphylaxis', immunocompromised: 'yes', immunocompromisedDetails: 'On chemotherapy', pregnantOrPlanning: 'not-applicable' };
	d.childhoodImmunisations = { ...d.childhoodImmunisations, mmrDose1: 'yes', mmrDose2: 'yes', dtpPrimaryCourse: 'yes', dtpBooster: 'yes', polioPrimaryCourse: 'yes', polioBooster: 'yes' };
	d.contraindicationsAllergies = { ...d.contraindicationsAllergies, eggAllergy: 'yes', eggAllergySeverity: 'anaphylaxis', pegPolysorbateAllergy: 'yes', liveVaccineContraindicated: 'yes', liveVaccineContraindicationReason: 'Immunosuppression', onImmunosuppressants: 'yes' };
	d.covid19Vaccination = { ...d.covid19Vaccination, covidPrimaryCourse: 'yes', covidPrimaryVaccineType: 'novavax', covidBooster1: 'no', totalCovidDoses: 2 };
	d.influenzaVaccination = { ...d.influenzaVaccination, fluVaccineCurrentSeason: 'no', fluHighRiskGroup: 'yes', fluHighRiskReason: 'immunosuppressed' };
	d.serologyImmunityTesting = { ...d.serologyImmunityTesting, tbIGRAResult: 'positive', measlesIgG: 'positive' };
	d.scheduleCompliance = { ...d.scheduleCompliance, occupationalHealthClearance: 'pending', activeExposureIncident: 'yes', activeExposureDetails: 'Needlestick injury, source HBV-positive', exposureRiskLevel: 'critical', consentForVaccination: 'no' };
	return d;
}

/** The sample checklists, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'VC-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: fullyImmunised() },
	{ id: 'VC-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: partiallyImmunised() },
	{ id: 'VC-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: nonCompliant() },
	{ id: 'VC-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: contraindicated() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateVaccinationGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		occupationCategory: s.data.demographics.occupationCategory || '—',
		complianceStatus: g.complianceStatus,
		riskLevel: g.overallRisk,
		childhoodComplete: g.childhoodComplete,
		covidComplete: g.covidComplete,
		fluCurrent: g.fluCurrent,
		flagCount: g.additionalFlags.length
	};
});
