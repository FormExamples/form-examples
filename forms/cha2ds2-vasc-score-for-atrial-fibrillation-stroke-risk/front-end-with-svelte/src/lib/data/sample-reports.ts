import type { AssessmentData, CareSetting, RiskBand } from '$lib/engine/types';
import { calculateCha2ds2VascGrade } from '$lib/engine/cha2ds2vasc-grader';
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
	cha2ds2VascScore: number;
	riskBand: RiskBand;
	anticoagulationFlag: boolean;
	flagCount: number;
}

/** Score 0 — male, under 65, no risk factors → low risk. */
function score0Male(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Khan',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-10T08:15',
		careSetting: 'primary-care',
		atrialFibrillationType: 'paroxysmal'
	};
	d.identification = { patientIdentifier: 'AF-2041', ageYears: 58, sex: 'male' };
	d.cardiac = { congestiveHeartFailure: 'no', hypertension: 'no', vascularDisease: 'no' };
	d.metabolic = { diabetes: 'no', priorStrokeTiaThromboembolism: 'no' };
	d.note.clinicalNote = 'No antithrombotic therapy indicated; annual review.';
	return d;
}

/** Score 1 — female sex category only → low risk (the sex-threshold edge case). */
function score1FemaleSexOnly(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Pharmacist P. Reyes',
		clinicianRole: 'pharmacist',
		assessedAt: '2026-06-12T14:40',
		careSetting: 'anticoagulation-clinic',
		atrialFibrillationType: 'persistent'
	};
	d.identification = { patientIdentifier: 'AF-100482', ageYears: 52, sex: 'female' };
	d.cardiac = { congestiveHeartFailure: 'no', hypertension: 'no', vascularDisease: 'no' };
	d.metabolic = { diabetes: 'no', priorStrokeTiaThromboembolism: 'no' };
	d.note.clinicalNote = 'Female sex point only — managed as low risk, no anticoagulation.';
	return d;
}

/** Score 1 — male with hypertension → intermediate risk (male total-1 edge case). */
function score1MaleIntermediate(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr L. Osei',
		clinicianRole: 'doctor',
		assessedAt: '2026-06-15T11:05',
		careSetting: 'cardiology',
		atrialFibrillationType: 'paroxysmal'
	};
	d.identification = { patientIdentifier: 'AF-100517', ageYears: 60, sex: 'male' };
	d.cardiac = { congestiveHeartFailure: 'no', hypertension: 'yes', vascularDisease: 'no' };
	d.metabolic = { diabetes: 'no', priorStrokeTiaThromboembolism: 'no' };
	d.note.clinicalNote = 'Single risk factor; consider anticoagulation after shared decision-making.';
	return d;
}

/** High score — elderly female with multiple comorbidities → high risk. */
function scoreHighFemale(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Nurse S. Doyle',
		clinicianRole: 'nurse',
		assessedAt: '2026-06-18T09:20',
		careSetting: 'cardiology',
		atrialFibrillationType: 'permanent'
	};
	d.identification = { patientIdentifier: 'AF-77-2211', ageYears: 81, sex: 'female' };
	d.cardiac = { congestiveHeartFailure: 'yes', hypertension: 'yes', vascularDisease: 'no' };
	d.metabolic = { diabetes: 'yes', priorStrokeTiaThromboembolism: 'yes' };
	d.note.clinicalNote =
		'High risk — DOAC recommended; HAS-BLED reviewed, no contraindication documented.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'AF-2026-0001', patientName: 'Adeyemi, Femi', assessedDate: '2026-06-10', data: score0Male() },
	{
		id: 'AF-2026-0002',
		patientName: 'Novak, Petra',
		assessedDate: '2026-06-12',
		data: score1FemaleSexOnly()
	},
	{
		id: 'AF-2026-0003',
		patientName: 'Ferreira, Luis',
		assessedDate: '2026-06-15',
		data: score1MaleIntermediate()
	},
	{
		id: 'AF-2026-0004',
		patientName: 'Okonkwo, Grace',
		assessedDate: '2026-06-18',
		data: scoreHighFemale()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCha2ds2VascGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		cha2ds2VascScore: g.cha2ds2VascScore,
		riskBand: g.riskBand,
		anticoagulationFlag: g.anticoagulationRecommendation === 'recommended',
		flagCount: g.flaggedIssues.length
	};
});
