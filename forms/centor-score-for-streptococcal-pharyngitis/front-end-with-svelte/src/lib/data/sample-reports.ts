import type { AssessmentData, CareSetting, RiskBand } from '$lib/engine/types';
import { calculateCentorGrade } from '$lib/engine/centor-grader';
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
	centorScore: number;
	mcIsaacScore: number;
	riskBand: RiskBand;
	redFlag: boolean;
	flagCount: number;
}

/** Low band — fully-negative adult aged >= 45 (Centor 0, McIsaac -1). */
function lowBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr A. Osei',
		clinicianRole: 'gp',
		assessedAt: '2026-06-24T10:15',
		careSetting: 'general-practice'
	};
	d.identification = { patientIdentifier: 'GP-100482', ageYears: 58, sex: 'female' };
	d.exudate.tonsillarExudate = 'no';
	d.nodes.tenderAnteriorCervicalNodes = 'no';
	d.fever.feverOver38 = 'no';
	d.fever.measuredTemperatureCelsius = 37.2;
	d.cough.absenceOfCough = 'no';
	d.note.clinicalNote = 'Viral-sounding sore throat with cough; self-care advised.';
	return d;
}

/** Moderate band — adult with two criteria positive (Centor 2, McIsaac 2). */
function moderateBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'ANP Z. Nowak',
		clinicianRole: 'nurse-practitioner',
		assessedAt: '2026-06-26T14:40',
		careSetting: 'urgent-care'
	};
	d.identification = { patientIdentifier: 'UC-100517', ageYears: 34, sex: 'female' };
	d.exudate.tonsillarExudate = 'yes';
	d.nodes.tenderAnteriorCervicalNodes = 'yes';
	d.fever.feverOver38 = 'no';
	d.cough.absenceOfCough = 'no';
	d.note.clinicalNote = 'Exudate and tender nodes; consider RADT before antibiotics.';
	return d;
}

/** High band — child with four criteria positive (Centor 4, McIsaac 5). */
function highBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr B. Ahmed',
		clinicianRole: 'gp',
		assessedAt: '2026-06-26T09:05',
		careSetting: 'general-practice'
	};
	d.identification = { patientIdentifier: 'GP-880204', ageYears: 9, sex: 'male' };
	d.exudate.tonsillarExudate = 'yes';
	d.nodes.tenderAnteriorCervicalNodes = 'yes';
	d.fever.feverOver38 = 'yes';
	d.fever.measuredTemperatureCelsius = 38.7;
	d.cough.absenceOfCough = 'yes';
	d.note.clinicalNote = 'All four criteria positive; discussed antibiotics and safety-netting.';
	return d;
}

/** High band with airway red flag — adult (Centor 4, McIsaac 4) plus quinsy features. */
function highRedFlag(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		clinicianName: 'Dr R. Fletcher',
		clinicianRole: 'other',
		assessedAt: '2026-06-27T22:20',
		careSetting: 'emergency-department'
	};
	d.identification = { patientIdentifier: 'ED-573642', ageYears: 27, sex: 'female' };
	d.exudate.tonsillarExudate = 'yes';
	d.nodes.tenderAnteriorCervicalNodes = 'yes';
	d.fever.feverOver38 = 'yes';
	d.fever.measuredTemperatureCelsius = 39.1;
	d.cough.absenceOfCough = 'yes';
	d.redFlags.trismus = 'yes';
	d.redFlags.muffledVoice = 'yes';
	d.redFlags.unilateralNeckSwelling = 'yes';
	d.note.clinicalNote = 'Quinsy features present; urgent ENT review requested irrespective of score.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CS-2026-0001', patientName: 'Osei, Grace', assessedDate: '2026-06-24', data: lowBand() },
	{ id: 'CS-2026-0002', patientName: 'Nowak, Zofia', assessedDate: '2026-06-26', data: moderateBand() },
	{ id: 'CS-2026-0003', patientName: 'Ahmed, Bilal', assessedDate: '2026-06-26', data: highBand() },
	{ id: 'CS-2026-0004', patientName: 'Fletcher, Rosemary', assessedDate: '2026-06-27', data: highRedFlag() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateCentorGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.identification.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careSetting: s.data.context.careSetting,
		centorScore: g.centorScore,
		mcIsaacScore: g.mcIsaacScore,
		riskBand: g.riskBand,
		redFlag: g.flaggedIssues.some((f) => f.id === 'F-AIRWAY-QUINSY-001'),
		flagCount: g.flaggedIssues.length
	};
});
