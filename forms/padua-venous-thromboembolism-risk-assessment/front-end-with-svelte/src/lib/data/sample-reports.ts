import type {
	AssessmentData,
	CareSetting,
	ProphylaxisRecommendation,
	RiskBand
} from '$lib/engine/types';
import { calculatePaduaGrade } from '$lib/engine/padua-grader';
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
	patientIdentifier: string;
	patientName: string;
	assessedDate: string;
	careSetting: CareSetting;
	paduaScore: number;
	riskBand: RiskBand;
	prophylaxis: ProphylaxisRecommendation;
	highRisk: boolean;
	flagCount: number;
}

/** Low risk — a single low-weight factor (score 1). */
function lowScore(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'general-medical',
		admissionReason: 'Community-acquired pneumonia'
	};
	d.identification = { patientIdentifier: 'GM-2041', ageYears: 74, sex: 'female' };
	d.history = { activeCancer: 'no', previousVte: 'no', knownThrombophilia: 'no' };
	d.mobility = { reducedMobility: 'no', recentTraumaOrSurgery: 'no' };
	d.cardiorespiratory = {
		heartOrRespiratoryFailure: 'no',
		acuteMiOrIschaemicStroke: 'no',
		acuteInfectionOrRheumatological: 'no'
	};
	d.metabolic = { bodyMassIndex: 24.5, ongoingHormonalTreatment: 'no' };
	d.bleeding = { activeBleeding: 'no', highBleedingRisk: 'no' };
	d.note.clinicalNote = 'Age >= 70 only; low risk. Encourage early mobilisation.';
	return d;
}

/** Low risk but near the threshold — active cancer only (score 3). */
function borderlineScore(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'acute-medical',
		admissionReason: 'Neutropenic sepsis'
	};
	d.identification = { patientIdentifier: 'AMU-100482', ageYears: 61, sex: 'male' };
	d.history = { activeCancer: 'yes', previousVte: 'no', knownThrombophilia: 'no' };
	d.mobility = { reducedMobility: 'no', recentTraumaOrSurgery: 'no' };
	d.cardiorespiratory = {
		heartOrRespiratoryFailure: 'no',
		acuteMiOrIschaemicStroke: 'no',
		acuteInfectionOrRheumatological: 'no'
	};
	d.metabolic = { bodyMassIndex: 27, ongoingHormonalTreatment: 'no' };
	d.bleeding = { activeBleeding: 'no', highBleedingRisk: 'no' };
	d.note.clinicalNote = 'Score 3; below threshold. Reassess if mobility reduces.';
	return d;
}

/** High risk — pharmacological prophylaxis indicated (score >= 4, no bleeding). */
function highScorePharmacological(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T22:05',
		careSetting: 'acute-medical',
		admissionReason: 'Exacerbation of heart failure'
	};
	d.identification = { patientIdentifier: 'AMU-100517', ageYears: 78, sex: 'female' };
	d.history = { activeCancer: 'no', previousVte: 'yes', knownThrombophilia: 'no' };
	d.mobility = { reducedMobility: 'yes', recentTraumaOrSurgery: 'no' };
	d.cardiorespiratory = {
		heartOrRespiratoryFailure: 'yes',
		acuteMiOrIschaemicStroke: 'no',
		acuteInfectionOrRheumatological: 'no'
	};
	d.metabolic = { bodyMassIndex: 32.1, ongoingHormonalTreatment: 'no' };
	d.bleeding = { activeBleeding: 'no', highBleedingRisk: 'no' };
	d.note.clinicalNote = 'High risk; LMWH prophylaxis commenced.';
	return d;
}

/** High risk with a bleeding contraindication — mechanical prophylaxis (score >= 4). */
function highScoreMechanical(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr S. Doyle',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'admissions-unit',
		admissionReason: 'Metastatic malignancy, reduced mobility'
	};
	d.identification = { patientIdentifier: 'MAU-77-2211', ageYears: 69, sex: 'male' };
	d.history = { activeCancer: 'yes', previousVte: 'yes', knownThrombophilia: 'no' };
	d.mobility = { reducedMobility: 'yes', recentTraumaOrSurgery: 'no' };
	d.cardiorespiratory = {
		heartOrRespiratoryFailure: 'no',
		acuteMiOrIschaemicStroke: 'no',
		acuteInfectionOrRheumatological: 'yes'
	};
	d.metabolic = { bodyMassIndex: 28, ongoingHormonalTreatment: 'no' };
	d.bleeding = { activeBleeding: 'yes', highBleedingRisk: 'yes' };
	d.note.clinicalNote = 'High risk but active bleeding; mechanical prophylaxis and senior review.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PADUA-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: lowScore() },
	{
		id: 'PADUA-2026-0002',
		patientName: 'Novak, Peter',
		assessedDate: '2026-06-12',
		data: borderlineScore()
	},
	{
		id: 'PADUA-2026-0003',
		patientName: 'Ferreira, Ana',
		assessedDate: '2026-06-15',
		data: highScorePharmacological()
	},
	{
		id: 'PADUA-2026-0004',
		patientName: 'Okonkwo, Daniel',
		assessedDate: '2026-06-18',
		data: highScoreMechanical()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculatePaduaGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		paduaScore: g.paduaScore,
		riskBand: g.riskBand,
		prophylaxis: g.prophylaxisRecommendation,
		highRisk: g.riskBand === 'high',
		flagCount: g.flaggedIssues.length
	};
});
