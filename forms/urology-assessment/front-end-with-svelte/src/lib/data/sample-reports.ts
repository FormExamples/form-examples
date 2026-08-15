import type { AssessmentData } from '#lib/engine/types.js';
import { calculateIPSS } from '#lib/engine/ipss-grader.js';
import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
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
	patientName: string;
	assessedDate: string;
	ipssScore: number;
	ipssCategory: string;
	qolScore: number | null;
	psa: number | null;
	urgency: string;
	hematuriaFlag: boolean;
	flagCount: number;
}

/** A mild assessment: minimal symptoms, normal labs. */
function mild(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1968-04-12', sex: 'male' };
	d.chiefComplaint = { primaryConcern: 'Routine prostate check', duration: '3 months', urgency: 'routine' };
	d.ipssQuestionnaire = { q1: 1, q2: 1, q3: 0, q4: 0, q5: 1, q6: 0, q7: 1 };
	d.qualityOfLife = { qolScore: 1, qolImpact: 'Mostly content with current urinary function.' };
	d.urinarySymptoms = { ...d.urinarySymptoms, frequency: 'no', urgency: 'no', nocturia: 'yes', hesitancy: 'no', stream: 'normal', straining: 'no', hematuria: 'no', dysuria: 'no', incontinence: 'none' };
	d.renalFunction = { ...d.renalFunction, creatinine: 88, eGFR: 86, psa: 1.2, psaDate: '2026-05-20', urinalysis: 'Normal' };
	d.sexualHealth = { erectileDysfunction: 'no', libidoChanges: 'no', ejaculatoryProblems: 'no' };
	d.familyHistory = { prostateCancer: 'no', bladderCancer: 'no', kidneyDisease: 'no', otherDetails: '' };
	return d;
}

/** A moderate assessment: several LUTS, mildly raised PSA. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Raj', lastName: 'Patel', dateOfBirth: '1959-09-30', sex: 'male' };
	d.chiefComplaint = { primaryConcern: 'Increasing urinary frequency and weak stream', duration: '8 months', urgency: 'urgent' };
	d.ipssQuestionnaire = { q1: 3, q2: 2, q3: 2, q4: 1, q5: 3, q6: 1, q7: 2 };
	d.qualityOfLife = { qolScore: 3, qolImpact: 'Symptoms interfere with daily activities and sleep.' };
	d.urinarySymptoms = { ...d.urinarySymptoms, frequency: 'yes', urgency: 'yes', nocturia: 'yes', hesitancy: 'yes', stream: 'weak', straining: 'no', hematuria: 'no', dysuria: 'no', incontinence: 'urge' };
	d.renalFunction = { ...d.renalFunction, creatinine: 102, eGFR: 72, psa: 3.8, psaDate: '2026-05-28', urinalysis: 'Trace leucocytes' };
	d.sexualHealth = { erectileDysfunction: 'yes', libidoChanges: 'no', ejaculatoryProblems: 'no' };
	d.currentMedications = { ...d.currentMedications, alphaBlockers: [{ name: 'Tamsulosin', dose: '0.4 mg', frequency: 'daily' }] };
	d.familyHistory = { prostateCancer: 'no', bladderCancer: 'no', kidneyDisease: 'no', otherDetails: '' };
	return d;
}

/** A severe assessment: high IPSS, family history of prostate cancer. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'William', lastName: 'Jones', dateOfBirth: '1948-01-22', sex: 'male' };
	d.chiefComplaint = { primaryConcern: 'Severe obstructive urinary symptoms and straining', duration: '14 months', urgency: 'urgent' };
	d.ipssQuestionnaire = { q1: 4, q2: 4, q3: 3, q4: 3, q5: 4, q6: 3, q7: 3 };
	d.qualityOfLife = { qolScore: 5, qolImpact: 'Severe impact; considers symptoms unacceptable.' };
	d.urinarySymptoms = { ...d.urinarySymptoms, frequency: 'yes', urgency: 'yes', nocturia: 'yes', hesitancy: 'yes', stream: 'weak', straining: 'yes', hematuria: 'no', dysuria: 'no', incontinence: 'overflow' };
	d.renalFunction = { ...d.renalFunction, creatinine: 118, eGFR: 58, psa: 6.5, psaDate: '2026-06-02', urinalysis: 'Normal' };
	d.sexualHealth = { erectileDysfunction: 'yes', libidoChanges: 'yes', ejaculatoryProblems: 'yes' };
	d.currentMedications = { ...d.currentMedications, alphaBlockers: [{ name: 'Doxazosin', dose: '4 mg', frequency: 'daily' }], fiveAlphaReductaseInhibitors: [{ name: 'Finasteride', dose: '5 mg', frequency: 'daily' }] };
	d.familyHistory = { prostateCancer: 'yes', bladderCancer: 'no', kidneyDisease: 'no', otherDetails: 'Father diagnosed at 70' };
	return d;
}

/** A severe assessment with hematuria — urgent red-flag investigation. */
function severeHematuria(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1952-11-03', sex: 'male' };
	d.chiefComplaint = { primaryConcern: 'Visible blood in urine with severe LUTS', duration: '2 weeks', urgency: 'emergency' };
	d.ipssQuestionnaire = { q1: 5, q2: 5, q3: 4, q4: 4, q5: 5, q6: 3, q7: 4 };
	d.qualityOfLife = { qolScore: 6, qolImpact: 'Distressed; symptoms are intolerable.' };
	d.urinarySymptoms = { ...d.urinarySymptoms, frequency: 'yes', urgency: 'yes', nocturia: 'yes', hesitancy: 'yes', stream: 'weak', straining: 'yes', hematuria: 'yes', dysuria: 'yes', incontinence: 'mixed' };
	d.renalFunction = { ...d.renalFunction, creatinine: 145, eGFR: 48, psa: 11.4, psaDate: '2026-06-10', urinalysis: 'Frank haematuria' };
	d.sexualHealth = { erectileDysfunction: 'yes', libidoChanges: 'yes', ejaculatoryProblems: 'yes' };
	d.medicalHistory = { ...d.medicalHistory, diabetes: 'yes', hypertension: 'yes', neurologicConditions: 'no' };
	d.currentMedications = { ...d.currentMedications, anticholinergics: [{ name: 'Oxybutynin', dose: '5 mg', frequency: 'twice daily' }] };
	d.familyHistory = { prostateCancer: 'yes', bladderCancer: 'yes', kidneyDisease: 'no', otherDetails: 'Brother — bladder cancer' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'UA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: mild() },
	{ id: 'UA-2026-0002', patientName: 'Patel, Raj', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'UA-2026-0003', patientName: 'Jones, William', assessedDate: '2026-06-15', data: severe() },
	{ id: 'UA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: severeHematuria() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const { ipssScore, ipssCategoryLabel } = calculateIPSS(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		ipssScore,
		ipssCategory: ipssCategoryLabel,
		qolScore: s.data.qualityOfLife.qolScore,
		psa: s.data.renalFunction.psa,
		urgency: s.data.chiefComplaint.urgency,
		hematuriaFlag: s.data.urinarySymptoms.hematuria === 'yes',
		flagCount: flags.length
	};
});
