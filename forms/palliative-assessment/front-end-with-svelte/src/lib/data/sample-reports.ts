import type { AssessmentData, SeverityBand } from '#lib/engine/types.js';
import { calculatePalliativeGrade } from '#lib/engine/esas-grader.js';
import { ppsBand } from '#lib/engine/utils.js';
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
	esasTotal: number;
	severityBand: SeverityBand;
	ppsScore: number | null;
	ppsBand: 'high' | 'moderate' | 'low' | '';
	severeSymptomCount: number;
	flagCount: number;
}

/** None / minimal symptom burden — stable disease, high performance status. */
function noneBurden(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Dorothy', lastName: 'Lewis', dateOfBirth: '1942-03-08', sex: 'female', nhsOrMrnNumber: '386 219 5740', reporterRole: 'clinician', assessmentDate: '2026-06-10', assessmentSetting: 'Care home' };
	d.primaryDiagnosisPrognosis = { ...d.primaryDiagnosisPrognosis, primaryDiagnosis: 'Vascular dementia, stable', diseaseProgressing: 'no', prognosisHorizon: 'years', surpriseQuestion: 'no' };
	d.esasrSymptoms = { ...d.esasrSymptoms, pain: 0, tiredness: 1, drowsiness: 1, nausea: 0, lackOfAppetite: 1, shortnessOfBreath: 0, depression: 1, anxiety: 0, wellbeing: 0, other: 0 };
	d.performanceStatus = { ...d.performanceStatus, ppsScore: 70, akpsScore: 70, ecogScore: 1, bedBound: 'no', requiresAssistanceWithAdls: 'no' };
	d.goalsOfCareACP = { ...d.goalsOfCareACP, respectFormCompleted: 'yes', adrtCompleted: 'no', lpaHealthAndWelfare: 'yes', dnacprDocumented: 'yes', ceilingOfTreatmentDiscussed: 'yes' };
	d.medicationsSymptomControl = { ...d.medicationsSymptomControl, anticipatoryMedsPrescribed: 'yes', symptomControlOverall: 'good' };
	return d;
}

/** Mild symptom burden — early palliative, well-supported at home. */
function mildBurden(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Robert', lastName: 'Hughes', dateOfBirth: '1950-07-19', sex: 'male', nhsOrMrnNumber: '608 341 2975', reporterRole: 'patient', assessmentDate: '2026-06-12', assessmentSetting: 'Home' };
	d.primaryDiagnosisPrognosis = { ...d.primaryDiagnosisPrognosis, primaryDiagnosis: 'Stable metastatic prostate cancer', diseaseProgressing: 'no', prognosisHorizon: 'years', surpriseQuestion: 'no' };
	d.esasrSymptoms = { ...d.esasrSymptoms, pain: 4, tiredness: 5, drowsiness: 2, nausea: 1, lackOfAppetite: 3, shortnessOfBreath: 2, depression: 3, anxiety: 3, wellbeing: 3, other: 0 };
	d.performanceStatus = { ...d.performanceStatus, ppsScore: 70, akpsScore: 70, ecogScore: 1, bedBound: 'no', requiresAssistanceWithAdls: 'no' };
	d.goalsOfCareACP = { ...d.goalsOfCareACP, preferredPlaceOfCare: 'Home', respectFormCompleted: 'yes', adrtCompleted: 'no', lpaHealthAndWelfare: 'no', dnacprDocumented: 'yes', ceilingOfTreatmentDiscussed: 'yes' };
	d.medicationsSymptomControl = { ...d.medicationsSymptomControl, regularMedications: [{ name: 'Modified-release morphine', dose: '10 mg', route: 'PO', frequency: 'BD', indication: 'Bone pain' }], anticipatoryMedsPrescribed: 'yes', symptomControlOverall: 'good' };
	d.carerFamilySupport = { ...d.carerFamilySupport, primaryCarerName: 'Wife', carerLivesWithPatient: 'yes', carerStrainReported: 'no', carerStrainLevel: 'low' };
	d.multidisciplinaryPlan = { ...d.multidisciplinaryPlan, specialistPalliativeCareInvolved: 'no', communityNursingInvolved: 'yes', reviewInterval: '6 weeks' };
	return d;
}

/** Moderate symptom burden — progressing disease, escalating symptom control. */
function moderateBurden(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Helen', lastName: 'Davies', dateOfBirth: '1955-11-02', sex: 'female', nhsOrMrnNumber: '512 847 9063', reporterRole: 'clinician', assessmentDate: '2026-06-15', assessmentSetting: 'Home' };
	d.primaryDiagnosisPrognosis = { ...d.primaryDiagnosisPrognosis, primaryDiagnosis: 'Stage IV non-small-cell lung cancer', dateOfDiagnosis: '2025-02-01', stageOrSeverity: 'Stage IV', diseaseProgressing: 'yes', prognosisHorizon: 'months', surpriseQuestion: 'yes' };
	d.esasrSymptoms = { ...d.esasrSymptoms, pain: 6, tiredness: 7, drowsiness: 5, nausea: 4, lackOfAppetite: 6, shortnessOfBreath: 8, depression: 4, anxiety: 5, wellbeing: 5, other: 2 };
	d.performanceStatus = { ...d.performanceStatus, ppsScore: 50, akpsScore: 50, ecogScore: 2, bedBound: 'no', requiresAssistanceWithAdls: 'yes' };
	d.goalsOfCareACP = { ...d.goalsOfCareACP, preferredPlaceOfCare: 'Home', preferredPlaceOfDeath: 'Hospice', respectFormCompleted: 'no', adrtCompleted: 'no', lpaHealthAndWelfare: 'no', dnacprDocumented: 'yes', ceilingOfTreatmentDiscussed: 'yes' };
	d.medicationsSymptomControl = { ...d.medicationsSymptomControl, regularMedications: [{ name: 'Oxycodone MR', dose: '20 mg', route: 'PO', frequency: 'BD', indication: 'Pain' }], asNeededMedications: [{ name: 'Oxycodone IR', dose: '5 mg', route: 'PO', frequency: 'PRN', indication: 'Breakthrough pain' }], anticipatoryMedsPrescribed: 'no', symptomControlOverall: 'partial', barriersToControl: 'Dyspnoea poorly controlled' };
	d.carerFamilySupport = { ...d.carerFamilySupport, primaryCarerName: 'Husband', carerLivesWithPatient: 'yes', carerStrainReported: 'yes', carerStrainLevel: 'high' };
	d.multidisciplinaryPlan = { ...d.multidisciplinaryPlan, specialistPalliativeCareInvolved: 'no', communityNursingInvolved: 'yes', reviewInterval: '2 weeks' };
	return d;
}

/** Severe symptom burden — end of life, hospice, urgent review. */
function severeBurden(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'George', lastName: 'Clark', dateOfBirth: '1948-09-26', sex: 'male', nhsOrMrnNumber: '384 615 7230', reporterRole: 'clinician', assessmentDate: '2026-06-18', assessmentSetting: 'Hospice' };
	d.primaryDiagnosisPrognosis = { ...d.primaryDiagnosisPrognosis, primaryDiagnosis: 'Glioblastoma multiforme, post-resection', dateOfDiagnosis: '2025-08-14', stageOrSeverity: 'Progressive', diseaseProgressing: 'yes', prognosisHorizon: 'days', surpriseQuestion: 'yes' };
	d.esasrSymptoms = { ...d.esasrSymptoms, pain: 8, tiredness: 9, drowsiness: 9, nausea: 8, lackOfAppetite: 9, shortnessOfBreath: 7, depression: 8, anxiety: 8, wellbeing: 9, other: 7 };
	d.performanceStatus = { ...d.performanceStatus, ppsScore: 20, akpsScore: 20, ecogScore: 4, bedBound: 'yes', requiresAssistanceWithAdls: 'yes' };
	d.goalsOfCareACP = { ...d.goalsOfCareACP, preferredPlaceOfCare: 'Hospice', preferredPlaceOfDeath: 'Hospice', respectFormCompleted: 'no', adrtCompleted: 'no', lpaHealthAndWelfare: 'no', dnacprDocumented: 'no', ceilingOfTreatmentDiscussed: 'no' };
	d.medicationsSymptomControl = { ...d.medicationsSymptomControl, syringeDriverInUse: 'yes', syringeDriverDetails: 'Morphine + midazolam + levomepromazine', anticipatoryMedsPrescribed: 'yes', symptomControlOverall: 'poor', barriersToControl: 'Rapidly escalating symptoms' };
	d.psychosocialSpiritualConcerns = { ...d.psychosocialSpiritualConcerns, existentialDistress: 'yes', spiritualSupportRequested: 'no', faithOrBelief: 'Church of England', unresolvedConcerns: 'yes' };
	d.carerFamilySupport = { ...d.carerFamilySupport, primaryCarerName: 'Daughter', carerLivesWithPatient: 'no', carerStrainReported: 'yes', carerStrainLevel: 'overwhelmed', bereavementRiskIdentified: 'yes' };
	d.multidisciplinaryPlan = { ...d.multidisciplinaryPlan, specialistPalliativeCareInvolved: 'yes', communityNursingInvolved: 'yes', hospiceReferralMade: 'yes', reviewInterval: 'Daily' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'PA-2026-0001', patientName: 'Lewis, Dorothy', assessedDate: '2026-06-10', data: noneBurden() },
	{ id: 'PA-2026-0002', patientName: 'Hughes, Robert', assessedDate: '2026-06-12', data: mildBurden() },
	{ id: 'PA-2026-0003', patientName: 'Davies, Helen', assessedDate: '2026-06-15', data: moderateBurden() },
	{ id: 'PA-2026-0004', patientName: 'Clark, George', assessedDate: '2026-06-18', data: severeBurden() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculatePalliativeGrade(s.data);
	const pps = s.data.performanceStatus.ppsScore;
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		esasTotal: g.esasTotal,
		severityBand: g.severityBand,
		ppsScore: pps,
		ppsBand: ppsBand(pps),
		severeSymptomCount: g.individualFlags.length,
		flagCount: g.additionalFlags.length
	};
});
