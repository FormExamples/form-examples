import type { AssessmentData, DiseaseActivity, DiseaseHistory } from '#lib/engine/types.js';
import { calculateDAS28 } from '#lib/engine/das28-grader.js';
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
	diagnosis: DiseaseHistory['primaryDiagnosis'];
	das28Score: number | null;
	diseaseActivity: DiseaseActivity | null;
	allergyFlag: boolean;
	biologicFlag: boolean;
	flagCount: number;
}

/** A remission assessment: well-controlled, minimal joint activity. */
function remission(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Eleanor', lastName: 'Hughes', dateOfBirth: '1962-03-18', sex: 'female', weight: 68, height: 165, bmi: 25.0 };
	d.chiefComplaint = { ...d.chiefComplaint, primaryJointComplaint: 'Hands', onsetDate: '2015-01-01', durationMonths: 132, morningStiffnessDurationMinutes: 10, symmetricInvolvement: 'yes' };
	d.jointAssessment = { tenderJointCount28: 0, swollenJointCount28: 0, painVAS: 8, patientGlobalVAS: 10 };
	d.diseaseHistory = { ...d.diseaseHistory, primaryDiagnosis: 'rheumatoid-arthritis', diagnosisDate: '2015-02-01', diseaseDurationYears: 11, remissionPeriods: 'yes' };
	d.laboratoryResults = { ...d.laboratoryResults, esr: 5, crp: 2, rheumatoidFactor: 'yes', antiCCP: 'yes', haemoglobin: 135, egfr: 90, alt: 22 };
	d.currentMedications = { ...d.currentMedications, dmards: [{ name: 'Methotrexate', dose: '15 mg', frequency: 'weekly' }] };
	d.functionalAssessment = { ...d.functionalAssessment, haqDiScore: 0.25, walkingAbility: 'independent', workDisability: 'no' };
	d.comorbiditiesSocial = { ...d.comorbiditiesSocial, smoking: 'never', exerciseFrequency: 'regular', tuberculosisScreening: 'yes', vaccinationStatusUpToDate: 'yes' };
	return d;
}

/** A low-activity assessment: mild ongoing disease. */
function lowActivity(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Thomas', lastName: 'Bennett', dateOfBirth: '1970-07-09', sex: 'male', weight: 84, height: 180, bmi: 25.9 };
	d.chiefComplaint = { ...d.chiefComplaint, primaryJointComplaint: 'Knees', onsetDate: '2019-05-01', durationMonths: 84, morningStiffnessDurationMinutes: 30, symmetricInvolvement: 'no' };
	d.jointAssessment = { tenderJointCount28: 1, swollenJointCount28: 1, painVAS: 25, patientGlobalVAS: 20 };
	d.diseaseHistory = { ...d.diseaseHistory, primaryDiagnosis: 'psoriatic-arthritis', diagnosisDate: '2019-06-01', diseaseDurationYears: 7, remissionPeriods: 'yes' };
	d.extraArticularFeatures = { ...d.extraArticularFeatures, skinRash: 'yes', skinRashDetails: 'Psoriatic plaques on elbows' };
	d.laboratoryResults = { ...d.laboratoryResults, esr: 12, crp: 6, hlaB27: 'yes', haemoglobin: 142, egfr: 85, alt: 28 };
	d.currentMedications = { ...d.currentMedications, dmards: [{ name: 'Sulfasalazine', dose: '1 g', frequency: 'twice daily' }], nsaids: [{ name: 'Naproxen', dose: '500 mg', frequency: 'as needed' }] };
	d.functionalAssessment = { ...d.functionalAssessment, haqDiScore: 0.625, walkingAbility: 'independent', workDisability: 'no' };
	d.comorbiditiesSocial = { ...d.comorbiditiesSocial, smoking: 'ex', exerciseFrequency: 'occasional', tuberculosisScreening: 'yes', vaccinationStatusUpToDate: 'yes' };
	return d;
}

/** A moderate-activity assessment: active disease, several findings. */
function moderateActivity(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Sharma', dateOfBirth: '1958-11-22', sex: 'female', weight: 72, height: 160, bmi: 28.1 };
	d.chiefComplaint = { ...d.chiefComplaint, primaryJointComplaint: 'Hands and wrists', onsetDate: '2012-03-01', durationMonths: 168, morningStiffnessDurationMinutes: 75, symmetricInvolvement: 'yes' };
	d.jointAssessment = { tenderJointCount28: 6, swollenJointCount28: 4, painVAS: 55, patientGlobalVAS: 50 };
	d.diseaseHistory = { ...d.diseaseHistory, primaryDiagnosis: 'rheumatoid-arthritis', diagnosisDate: '2012-04-01', diseaseDurationYears: 14, previousDMARDs: 'Methotrexate, Leflunomide', remissionPeriods: 'no' };
	d.extraArticularFeatures = { ...d.extraArticularFeatures, rheumatoidNodules: 'yes' };
	d.laboratoryResults = { ...d.laboratoryResults, esr: 28, crp: 18, rheumatoidFactor: 'yes', antiCCP: 'yes', haemoglobin: 118, egfr: 72, alt: 35 };
	d.currentMedications = { ...d.currentMedications, dmards: [{ name: 'Methotrexate', dose: '20 mg', frequency: 'weekly' }], biologics: [{ name: 'Adalimumab', dose: '40 mg', frequency: 'fortnightly' }], steroids: [{ name: 'Prednisolone', dose: '5 mg', frequency: 'daily' }] };
	d.allergies = { ...d.allergies, drugAllergies: [{ allergen: 'Penicillin', reaction: 'Rash', severity: 'mild' }] };
	d.functionalAssessment = { ...d.functionalAssessment, haqDiScore: 1.625, walkingAbility: 'with-aid', workDisability: 'yes', workDisabilityDetails: 'Reduced hours' };
	d.comorbiditiesSocial = { ...d.comorbiditiesSocial, osteoporosis: 'yes', smoking: 'ex', exerciseFrequency: 'occasional', tuberculosisScreening: 'yes', vaccinationStatusUpToDate: 'yes' };
	return d;
}

/** A high-activity assessment: severe disease with extra-articular involvement. */
function highActivity(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Okafor', dateOfBirth: '1949-09-04', sex: 'female', weight: 64, height: 158, bmi: 25.6 };
	d.chiefComplaint = { ...d.chiefComplaint, primaryJointComplaint: 'Multiple joints', onsetDate: '2005-01-01', durationMonths: 252, morningStiffnessDurationMinutes: 120, symmetricInvolvement: 'yes' };
	d.jointAssessment = { tenderJointCount28: 18, swollenJointCount28: 12, painVAS: 85, patientGlobalVAS: 80 };
	d.diseaseHistory = { ...d.diseaseHistory, primaryDiagnosis: 'rheumatoid-arthritis', diagnosisDate: '2005-02-01', diseaseDurationYears: 21, previousDMARDs: 'Methotrexate, Leflunomide, Hydroxychloroquine', previousBiologics: 'Etanercept', remissionPeriods: 'no' };
	d.extraArticularFeatures = { ...d.extraArticularFeatures, rheumatoidNodules: 'yes', interstitialLungDisease: 'yes', ildDetails: 'Mild fibrosis on HRCT', cardiovascularInvolvement: 'yes', cardiovascularDetails: 'Pericardial effusion' };
	d.laboratoryResults = { ...d.laboratoryResults, esr: 60, crp: 42, rheumatoidFactor: 'yes', antiCCP: 'yes', ana: 'yes', haemoglobin: 105, egfr: 52, alt: 48 };
	d.currentMedications = { ...d.currentMedications, dmards: [{ name: 'Methotrexate', dose: '25 mg', frequency: 'weekly' }], biologics: [{ name: 'Rituximab', dose: '1 g', frequency: '6-monthly' }], steroids: [{ name: 'Prednisolone', dose: '10 mg', frequency: 'daily' }] };
	d.allergies = { drugAllergies: [{ allergen: 'Sulfonamides', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }], latexAllergy: 'yes' };
	d.functionalAssessment = { ...d.functionalAssessment, haqDiScore: 2.625, walkingAbility: 'wheelchair', workDisability: 'yes', workDisabilityDetails: 'Permanently disabled' };
	d.comorbiditiesSocial = { ...d.comorbiditiesSocial, cardiovascularRisk: 'yes', osteoporosis: 'yes', recentInfections: 'yes', recentInfectionDetails: 'Chest infection', smoking: 'current', smokingPackYears: 30, exerciseFrequency: 'none', tuberculosisScreening: 'no', vaccinationStatusUpToDate: 'no' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'RA-2026-0001', patientName: 'Hughes, Eleanor', assessedDate: '2026-06-10', data: remission() },
	{ id: 'RA-2026-0002', patientName: 'Bennett, Thomas', assessedDate: '2026-06-12', data: lowActivity() },
	{ id: 'RA-2026-0003', patientName: 'Sharma, Priya', assessedDate: '2026-06-15', data: moderateActivity() },
	{ id: 'RA-2026-0004', patientName: 'Okafor, Margaret', assessedDate: '2026-06-18', data: highActivity() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateDAS28(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		diagnosis: s.data.diseaseHistory.primaryDiagnosis,
		das28Score: g.das28Score,
		diseaseActivity: g.diseaseActivity,
		allergyFlag: s.data.allergies.drugAllergies.length > 0 || s.data.allergies.latexAllergy === 'yes',
		biologicFlag: s.data.currentMedications.biologics.length > 0,
		flagCount: flags.length
	};
});
