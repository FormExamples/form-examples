import type { AssessmentData, CareLocation, MortalityBand } from '#lib/engine/types.js';
import { calculateSofaGrade } from '#lib/engine/sofa-grader.js';
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
	careLocation: CareLocation;
	totalSofa: number;
	deltaSofa: number | null;
	mortalityBand: MortalityBand;
	sepsis3: boolean;
	flagCount: number;
}

/** Total 2 — low mortality band, mild single-system dysfunction, no infection. */
function lowBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr A. Khan',
		assessorRole: 'intensivist',
		assessorRegistrationNumber: 'GMC 7001234',
		assessedAt: '2026-06-10T08:15',
		careLocation: 'hdu',
		hoursSinceAdmission: 12
	};
	d.baseline = {
		patientIdentifier: 'HDU-2041',
		ageYears: 54,
		sex: 'female',
		admissionDiagnosis: 'Post-operative monitoring, elective bowel resection',
		suspectedInfection: 'no',
		baselineSofaTotal: 1
	};
	d.respiration = { pao2: null, fio2: null, pao2Fio2Ratio: 360, respiratorySupport: 'none' }; // 1
	d.coagulation.platelets = 140; // 1
	d.liver.bilirubin = 12; // 0
	d.cardiovascular = { map: 78, vasopressor: 'none', vasopressorDose: null }; // 0
	d.cns = { glasgowComaScale: 15, sedated: 'no' }; // 0
	d.renal = { creatinine: 90, urineOutput: 1600 }; // 0
	d.note.clinicalNote = 'Stable post-operative course; routine HDU monitoring.';
	return d;
}

/** Total 8 — moderate mortality band, suspected chest sepsis, rising from baseline. */
function moderateBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr L. Osei',
		assessorRole: 'critical-care-physician',
		assessorRegistrationNumber: 'GMC 7205512',
		assessedAt: '2026-06-12T14:40',
		careLocation: 'icu',
		hoursSinceAdmission: 20
	};
	d.baseline = {
		patientIdentifier: 'ICU-100482',
		ageYears: 67,
		sex: 'male',
		admissionDiagnosis: 'Community-acquired pneumonia',
		suspectedInfection: 'yes',
		baselineSofaTotal: 4
	};
	d.respiration = { pao2: 90, fio2: 0.4, pao2Fio2Ratio: null, respiratorySupport: 'cpap' }; // 225 → 2
	d.coagulation.platelets = 90; // 2
	d.liver.bilirubin = 40; // 2
	d.cardiovascular = { map: 65, vasopressor: 'none', vasopressorDose: null }; // 1
	d.cns = { glasgowComaScale: 14, sedated: 'no' }; // 1
	d.renal = { creatinine: 90, urineOutput: 1200 }; // 0
	d.note.clinicalNote = 'Rising oxygen requirement; sepsis six commenced.';
	return d;
}

/** Total 11 — high mortality band, septic shock on noradrenaline, marked rise. */
function highBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr R. Mehta',
		assessorRole: 'intensivist',
		assessorRegistrationNumber: 'GMC 7311908',
		assessedAt: '2026-06-15T22:05',
		careLocation: 'icu',
		hoursSinceAdmission: 30
	};
	d.baseline = {
		patientIdentifier: 'ICU-100517',
		ageYears: 72,
		sex: 'female',
		admissionDiagnosis: 'Faecal peritonitis, post-laparotomy',
		suspectedInfection: 'yes',
		baselineSofaTotal: 6
	};
	d.respiration = { pao2: 80, fio2: 0.5, pao2Fio2Ratio: null, respiratorySupport: 'ventilated' }; // 160 → 3
	d.coagulation.platelets = 95; // 2
	d.liver.bilirubin = 30; // 1
	d.cardiovascular = { map: 62, vasopressor: 'noradrenaline', vasopressorDose: 0.08 }; // 3
	d.cns = { glasgowComaScale: 13, sedated: 'yes' }; // 1
	d.renal = { creatinine: 180, urineOutput: 700 }; // 2 (creatinine) vs 0 (urine)
	d.note.clinicalNote = 'Septic shock; vasopressor and lung-protective ventilation in progress.';
	return d;
}

/** Total 18 — extreme mortality band, multi-organ failure, high-dose vasopressor. */
function extremeBand(): AssessmentData {
	const d = createDefaultAssessment();
	d.context = {
		assessorName: 'Dr S. Doyle',
		assessorRole: 'intensivist',
		assessorRegistrationNumber: 'GMC 7422031',
		assessedAt: '2026-06-18T03:20',
		careLocation: 'icu',
		hoursSinceAdmission: 44
	};
	d.baseline = {
		patientIdentifier: 'ICU-100603',
		ageYears: 61,
		sex: 'male',
		admissionDiagnosis: 'Necrotising soft-tissue infection, septic shock',
		suspectedInfection: 'yes',
		baselineSofaTotal: 9
	};
	d.respiration = { pao2: 70, fio2: 0.8, pao2Fio2Ratio: null, respiratorySupport: 'ventilated' }; // 88 → 4
	d.coagulation.platelets = 40; // 3
	d.liver.bilirubin = 150; // 3
	d.cardiovascular = { map: 55, vasopressor: 'noradrenaline', vasopressorDose: 0.3 }; // 4
	d.cns = { glasgowComaScale: 8, sedated: 'yes' }; // 3
	d.renal = { creatinine: 260, urineOutput: 150 }; // 4 (urine dominates)
	d.note.clinicalNote =
		'Refractory multi-organ failure; treatment-escalation plan discussed with family.';
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'SO-2026-0001', patientName: 'Adeyemi, Grace', assessedDate: '2026-06-10', data: lowBand() },
	{ id: 'SO-2026-0002', patientName: 'Novak, Peter', assessedDate: '2026-06-12', data: moderateBand() },
	{ id: 'SO-2026-0003', patientName: 'Ferreira, Ana', assessedDate: '2026-06-15', data: highBand() },
	{ id: 'SO-2026-0004', patientName: 'Okonkwo, Daniel', assessedDate: '2026-06-18', data: extremeBand() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateSofaGrade(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.baseline.patientIdentifier,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		careLocation: s.data.context.careLocation,
		totalSofa: g.totalSofa,
		deltaSofa: g.deltaSofa,
		mortalityBand: g.mortalityBand,
		sepsis3: g.sepsis3,
		flagCount: g.flaggedIssues.length
	};
});
