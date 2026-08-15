import type { CasualtyCardData, MTSCategory, NEWS2ClinicalResponse } from '#lib/engine/types.js';
import { calculateNEWS2 } from '#lib/engine/news2-calculator.js';
import { detectFlaggedIssues } from '#lib/engine/flagged-issues.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample casualty card: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	assessedDate: string;
	data: CasualtyCardData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	assessedDate: string;
	news2Score: number;
	news2Response: NEWS2ClinicalResponse;
	mtsCategory: MTSCategory;
	chiefComplaint: string;
	allergyFlag: boolean;
	flagCount: number;
}

/** A low-risk attendance: minor injury, stable vitals, NEWS2 0. */
function lowRisk(): CasualtyCardData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', sex: 'male', nhsNumber: '943 476 5919' };
	d.arrivalTriage = { ...d.arrivalTriage, attendanceDate: '2026-06-10', arrivalMode: 'walk-in', referralSource: 'self', mtsCategory: '4-standard' };
	d.presentingComplaint = { ...d.presentingComplaint, chiefComplaint: 'Laceration to right forearm' };
	d.vitalSigns = { ...d.vitalSigns, heartRate: 72, systolicBP: 128, diastolicBP: 78, respiratoryRate: 16, oxygenSaturation: 98, supplementalOxygen: 'no', temperature: 36.8, consciousnessLevel: 'alert' };
	d.disposition = { ...d.disposition, disposition: 'discharged', dischargeDiagnosis: 'Simple laceration' };
	return d;
}

/** A low-medium attendance: single deranged parameter (RR), NEWS2 driven by a single 3. */
function lowMedium(): CasualtyCardData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Helen', lastName: 'Davies', dateOfBirth: '1972-02-18', sex: 'female', nhsNumber: '294 708 5316' };
	d.arrivalTriage = { ...d.arrivalTriage, attendanceDate: '2026-06-12', arrivalMode: 'ambulance', referralSource: '999', mtsCategory: '3-urgent' };
	d.presentingComplaint = { ...d.presentingComplaint, chiefComplaint: 'Abdominal pain with vomiting' };
	d.vitalSigns = { ...d.vitalSigns, heartRate: 88, systolicBP: 118, diastolicBP: 74, respiratoryRate: 26, oxygenSaturation: 96, supplementalOxygen: 'no', temperature: 37.4, consciousnessLevel: 'alert' };
	d.medicalHistory = { ...d.medicalHistory, allergies: [{ allergen: 'Penicillin', reaction: 'Rash', severity: 'mild' }] };
	return d;
}

/** A medium attendance: several deranged parameters, NEWS2 5-6, urgent review. */
function mediumRisk(): CasualtyCardData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Robert', lastName: 'Wilson', dateOfBirth: '1949-09-30', sex: 'male', nhsNumber: '608 341 2975' };
	d.arrivalTriage = { ...d.arrivalTriage, attendanceDate: '2026-06-15', arrivalMode: 'ambulance', referralSource: 'nhs111', mtsCategory: '2-very-urgent' };
	d.presentingComplaint = { ...d.presentingComplaint, chiefComplaint: 'Acute confusion in elderly patient' };
	d.vitalSigns = { ...d.vitalSigns, heartRate: 116, systolicBP: 104, diastolicBP: 68, respiratoryRate: 23, oxygenSaturation: 94, supplementalOxygen: 'no', temperature: 38.3, consciousnessLevel: 'verbal' };
	d.medicalHistory = { ...d.medicalHistory, medications: [{ name: 'Apixaban 5 mg', dose: '5 mg', frequency: 'BD' }] };
	return d;
}

/** A high attendance: critically deranged vitals, NEWS2 >= 7, major trauma. */
function highRisk(): CasualtyCardData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'George', lastName: 'Clark', dateOfBirth: '1955-11-03', sex: 'male', nhsNumber: '386 219 5740' };
	d.arrivalTriage = { ...d.arrivalTriage, attendanceDate: '2026-06-18', arrivalMode: 'helicopter', referralSource: '999', mtsCategory: '1-immediate' };
	d.presentingComplaint = { ...d.presentingComplaint, chiefComplaint: 'Major trauma — RTC pedestrian vs car' };
	d.vitalSigns = { ...d.vitalSigns, heartRate: 134, systolicBP: 86, diastolicBP: 54, respiratoryRate: 28, oxygenSaturation: 90, supplementalOxygen: 'yes', oxygenFlowRate: 15, temperature: 35.4, consciousnessLevel: 'pain', pupilLeftReactive: 'no', pupilRightReactive: 'yes' };
	d.primarySurvey = {
		...d.primarySurvey,
		airway: { ...d.primarySurvey.airway, status: 'compromised', cSpineImmobilised: 'yes' },
		circulation: { ...d.primarySurvey.circulation, haemorrhage: 'Open left femoral wound, active bleeding' },
		disability: { ...d.primarySurvey.disability, gcsEye: 2, gcsVerbal: 2, gcsMotor: 4, gcsTotal: 8 }
	};
	d.medicalHistory = { ...d.medicalHistory, allergies: [{ allergen: 'Latex', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }] };
	d.safeguardingConsent = { ...d.safeguardingConsent, safeguardingConcern: 'yes', safeguardingType: 'Vulnerable adult' };
	return d;
}

/** The sample casualty cards, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CC-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'CC-2026-0002', patientName: 'Davies, Helen', assessedDate: '2026-06-12', data: lowMedium() },
	{ id: 'CC-2026-0003', patientName: 'Wilson, Robert', assessedDate: '2026-06-15', data: mediumRisk() },
	{ id: 'CC-2026-0004', patientName: 'Clark, George', assessedDate: '2026-06-18', data: highRisk() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const news2 = calculateNEWS2(s.data.vitalSigns);
	const flags = detectFlaggedIssues(s.data, news2);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		news2Score: news2.totalScore,
		news2Response: news2.clinicalResponse,
		mtsCategory: s.data.arrivalTriage.mtsCategory,
		chiefComplaint: s.data.presentingComplaint.chiefComplaint,
		allergyFlag: s.data.medicalHistory.allergies.length > 0,
		flagCount: flags.length
	};
});
