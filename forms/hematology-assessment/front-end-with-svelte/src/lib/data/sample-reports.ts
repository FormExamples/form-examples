import type { AssessmentData, AbnormalityLevel } from '$lib/engine/types';
import { gradeAssessment } from '$lib/engine/hematology-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
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
	specimenType: string;
	abnormalityLevel: AbnormalityLevel;
	abnormalityScore: number;
	flagCount: number;
	transfusionFlag: boolean;
	anticoagFlag: boolean;
}

/** A normal panel: all complete-blood-count and iron values within range. */
function normal(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, patientName: 'Smith, John', dateOfBirth: '1972-04-12', medicalRecordNumber: 'MRN-100231', referringPhysician: 'Dr Allen', clinicalIndication: 'Routine review', specimenType: 'edtaBlood' };
	d.bloodCountAnalysis = { ...d.bloodCountAnalysis, hemoglobin: 14.2, hematocrit: 44, redBloodCellCount: 4.9, whiteBloodCellCount: 7.1, plateletCount: 252, meanCorpuscularVolume: 90, meanCorpuscularHemoglobin: 30, redCellDistributionWidth: 13.2 };
	d.coagulationStudies = { ...d.coagulationStudies, prothrombinTime: 12.4, inr: 1.0, activatedPartialThromboplastinTime: 30, fibrinogen: 320, dDimer: 0.3 };
	d.ironStudies = { ...d.ironStudies, serumIron: 110, totalIronBindingCapacity: 310, transferrinSaturation: 32, serumFerritin: 140, reticulocyteCount: 1.4 };
	return d;
}

/** A mild abnormality: borderline anaemia, otherwise unremarkable. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, patientName: 'Patel, Priya', dateOfBirth: '1985-09-30', medicalRecordNumber: 'MRN-100874', referringPhysician: 'Dr Brown', clinicalIndication: 'Fatigue', specimenType: 'edtaBlood' };
	d.bloodCountAnalysis = { ...d.bloodCountAnalysis, hemoglobin: 11.2, hematocrit: 35, redBloodCellCount: 4.1, whiteBloodCellCount: 6.8, plateletCount: 240, meanCorpuscularVolume: 78, meanCorpuscularHemoglobin: 26, redCellDistributionWidth: 15.0 };
	d.coagulationStudies = { ...d.coagulationStudies, prothrombinTime: 12.8, inr: 1.1, activatedPartialThromboplastinTime: 31, fibrinogen: 300, dDimer: 0.4 };
	d.ironStudies = { ...d.ironStudies, serumIron: 70, transferrinSaturation: 22, serumFerritin: 24, reticulocyteCount: 1.8 };
	d.peripheralBloodFilm = { ...d.peripheralBloodFilm, abnormalCellMorphology: 'microcytosis' };
	return d;
}

/** A moderate abnormality: iron-deficiency anaemia with low platelets. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, patientName: 'Jones, Margaret', dateOfBirth: '1958-01-22', medicalRecordNumber: 'MRN-101552', referringPhysician: 'Dr Carter', clinicalIndication: 'Anaemia workup', specimenType: 'edtaBlood' };
	d.bloodCountAnalysis = { ...d.bloodCountAnalysis, hemoglobin: 8.5, hematocrit: 27, redBloodCellCount: 3.2, whiteBloodCellCount: 3.0, plateletCount: 90, meanCorpuscularVolume: 76, meanCorpuscularHemoglobin: 24, redCellDistributionWidth: 17.5 };
	d.coagulationStudies = { ...d.coagulationStudies, prothrombinTime: 13.0, inr: 1.2, activatedPartialThromboplastinTime: 33, fibrinogen: 280, dDimer: 0.6 };
	d.ironStudies = { ...d.ironStudies, serumIron: 30, transferrinSaturation: 12, serumFerritin: 8, reticulocyteCount: 2.6 };
	d.treatmentMedications = { ...d.treatmentMedications, ironTherapy: 'Ferrous sulfate 200 mg' };
	d.transfusionHistory = { ...d.transfusionHistory, previousTransfusions: 'yes', transfusionReactions: 'mild febrile reaction', bloodGroupType: 'O+' };
	d.clinicalReview = { ...d.clinicalReview, diagnosis: 'Iron deficiency anaemia', urgencyLevel: 2 };
	return d;
}

/** A critical panel: pancytopenia with coagulopathy and DIC picture. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = { ...d.patientInformation, patientName: 'Williams, David', dateOfBirth: '1949-11-03', medicalRecordNumber: 'MRN-102003', referringPhysician: 'Dr Davies', clinicalIndication: 'Acute presentation', specimenType: 'boneMarrow' };
	d.bloodCountAnalysis = { ...d.bloodCountAnalysis, hemoglobin: 5.2, hematocrit: 18, redBloodCellCount: 2.1, whiteBloodCellCount: 0.8, plateletCount: 12, meanCorpuscularVolume: 105, meanCorpuscularHemoglobin: 34, redCellDistributionWidth: 19.0 };
	d.coagulationStudies = { ...d.coagulationStudies, prothrombinTime: 22, inr: 5.2, activatedPartialThromboplastinTime: 68, fibrinogen: 80, dDimer: 6.4 };
	d.ironStudies = { ...d.ironStudies, serumIron: 200, transferrinSaturation: 85, serumFerritin: 1200, reticulocyteCount: 0.2 };
	d.peripheralBloodFilm = { ...d.peripheralBloodFilm, abnormalCellMorphology: 'blasts present' };
	d.boneMarrowAssessment = { ...d.boneMarrowAssessment, cellularity: 90, aspirateFindings: 'Hypercellular with blasts' };
	d.treatmentMedications = { ...d.treatmentMedications, anticoagulantTherapy: 'Therapeutic enoxaparin', chemotherapyRegimen: 'Induction pending' };
	d.transfusionHistory = { ...d.transfusionHistory, previousTransfusions: 'yes', transfusionReactions: 'urticarial reaction', bloodGroupType: 'A-' };
	d.clinicalReview = { ...d.clinicalReview, diagnosis: 'Acute leukaemia, suspected DIC', urgencyLevel: 5 };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'HA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: normal() },
	{ id: 'HA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: mild() },
	{ id: 'HA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: moderate() },
	{ id: 'HA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		specimenType: s.data.patientInformation.specimenType,
		abnormalityLevel: g.abnormalityLevel,
		abnormalityScore: g.abnormalityScore,
		flagCount: g.additionalFlags.length,
		transfusionFlag:
			s.data.transfusionHistory.transfusionReactions !== '' &&
			s.data.transfusionHistory.transfusionReactions !== 'none' &&
			s.data.transfusionHistory.transfusionReactions !== 'no',
		anticoagFlag: s.data.treatmentMedications.anticoagulantTherapy.trim() !== ''
	};
});
