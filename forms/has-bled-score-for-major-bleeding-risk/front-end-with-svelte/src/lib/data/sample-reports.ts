import type { AssessmentData, AnticoagulationStatus, CareSetting, RiskBand } from '#lib/engine/types.js';
import { calculateHasBledGrade } from '#lib/engine/hasbled-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

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
	anticoagulationStatus: AnticoagulationStatus;
	hasBledScore: number;
	riskBand: RiskBand;
	highBleedingRiskFlag: boolean;
	flagCount: number;
}

/** Score 0 — no criteria positive; low risk. */
function score0(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'cardiology',
		anticoagulationStatus: 'considering',
		chaDsVascScore: 2
	};
	d.identification = { patientIdentifier: 'AF-100482', ageYears: 58, sex: 'female' };
	d.hypertension.hypertensionUncontrolled = 'no';
	d.organFunction.abnormalRenalFunction = 'no';
	d.organFunction.abnormalLiverFunction = 'no';
	d.stroke.strokeHistory = 'no';
	d.bleeding.bleedingHistory = 'no';
	d.labileInr.labileInr = 'no';
	d.drugsAlcohol.antiplateletOrNsaid = 'no';
	d.drugsAlcohol.alcoholUnitsPerWeek = 3;
	d.note.clinicalNote = 'Low bleeding risk; proceed with anticoagulation per stroke risk.';
	return d;
}

/** Score 2 — two criteria positive (elderly + hypertension); moderate risk. */
function score2(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse P. Reyes',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'general-practice',
		anticoagulationStatus: 'on',
		chaDsVascScore: 4
	};
	d.identification = { patientIdentifier: 'GP-573110', ageYears: 72, sex: 'male' };
	d.hypertension.hypertensionUncontrolled = 'yes';
	d.organFunction.abnormalRenalFunction = 'no';
	d.organFunction.abnormalLiverFunction = 'no';
	d.stroke.strokeHistory = 'no';
	d.bleeding.bleedingHistory = 'no';
	d.labileInr.labileInr = 'no';
	d.drugsAlcohol.antiplateletOrNsaid = 'no';
	d.drugsAlcohol.alcoholUnitsPerWeek = 5;
	d.note.clinicalNote = 'Modifiable: uncontrolled BP — optimise and re-score.';
	return d;
}

/** Score 4 — high risk (elderly, hypertension, labile INR, alcohol). */
function score4(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Pharmacist L. Osei',
		clinicianRole: 'pharmacist',
		assessedAt: '2026-06-15T11:05',
		careSetting: 'anticoagulation-clinic',
		anticoagulationStatus: 'on',
		chaDsVascScore: 5
	};
	d.identification = { patientIdentifier: 'AC-100517', ageYears: 78, sex: 'female' };
	d.hypertension.hypertensionUncontrolled = 'yes';
	d.organFunction.abnormalRenalFunction = 'no';
	d.organFunction.abnormalLiverFunction = 'no';
	d.stroke.strokeHistory = 'no';
	d.bleeding.bleedingHistory = 'no';
	d.labileInr.labileInr = 'yes';
	d.drugsAlcohol.antiplateletOrNsaid = 'no';
	d.drugsAlcohol.alcoholUnitsPerWeek = 14;
	d.note.clinicalNote =
		'High risk with several modifiable factors; review INR control and alcohol intake.';
	return d;
}

/** Score 7 — high risk; many criteria positive. */
function score7(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr S. Doyle',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-18T03:20',
		careSetting: 'acute-medical',
		anticoagulationStatus: 'on',
		chaDsVascScore: 6
	};
	d.identification = { patientIdentifier: 'AM-880204', ageYears: 81, sex: 'male' };
	d.hypertension.hypertensionUncontrolled = 'yes';
	d.organFunction.abnormalRenalFunction = 'yes';
	d.organFunction.abnormalLiverFunction = 'no';
	d.stroke.strokeHistory = 'yes';
	d.bleeding.bleedingHistory = 'yes';
	d.labileInr.labileInr = 'yes';
	d.drugsAlcohol.antiplateletOrNsaid = 'yes';
	d.drugsAlcohol.alcoholUnitsPerWeek = 4;
	d.note.clinicalNote = 'Very high bleeding risk; multidisciplinary review of anticoagulation plan.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'HB-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-10', data: score0() },
	{ id: 'HB-2026-0002', patientName: 'Mackenzie, Ian', assessedDate: '2026-06-12', data: score2() },
	{ id: 'HB-2026-0003', patientName: 'Nowak, Zofia', assessedDate: '2026-06-15', data: score4() },
	{ id: 'HB-2026-0004', patientName: 'Ahmed, Bilal', assessedDate: '2026-06-18', data: score7() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateHasBledGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		anticoagulationStatus: s.data.context.anticoagulationStatus,
		hasBledScore: g.hasBledScore,
		riskBand: g.riskBand,
		highBleedingRiskFlag: g.hasBledScore >= 3,
		flagCount: g.flaggedIssues.length
	};
});
