import type { AssessmentData, DASHScore } from '$lib/engine/types';
import { calculateDASH } from '$lib/engine/dash-grader';
import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
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
	affectedJoint: string;
	dashScore: number | null;
	disabilityLevel: string;
	surgicalCandidate: boolean;
	flagCount: number;
}

/** Set every DASH questionnaire item to the same response value. */
function fillDash(d: AssessmentData, value: DASHScore) {
	const q = d.dashQuestionnaire;
	(Object.keys(q) as (keyof typeof q)[]).forEach((k) => (q[k] = value));
}

/** A low-disability assessment: minimal symptoms, no red flags. */
function noDisability(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-04-12', sex: 'male', occupation: 'Office worker', dominantHand: 'right' };
	d.chiefComplaint = { ...d.chiefComplaint, primaryConcern: 'Mild shoulder discomfort', affectedJoint: 'Shoulder', side: 'right', duration: '3 weeks', onsetType: 'gradual', aggravatingFactors: ['overhead-activity'] };
	d.painAssessment = { ...d.painAssessment, currentPainLevel: 2, worstPain: 4, bestPain: 0, painCharacter: 'aching', painFrequency: 'activity-related', nightPain: 'no', painWithWeightBearing: 'no' };
	fillDash(d, 1);
	d.dashQuestionnaire.q1 = 2;
	d.dashQuestionnaire.q5 = 2;
	d.surgicalHistory = { ...d.surgicalHistory, previousOrthopedicSurgery: 'no', anesthesiaComplications: 'no', willingToConsiderSurgery: 'no' };
	return d;
}

/** A moderate-disability assessment: consistent moderate difficulty. */
function moderate(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1972-09-30', sex: 'female', occupation: 'Teacher', dominantHand: 'right' };
	d.chiefComplaint = { ...d.chiefComplaint, primaryConcern: 'Persistent elbow pain limiting daily tasks', affectedJoint: 'Elbow', side: 'left', duration: '4 months', onsetType: 'overuse', aggravatingFactors: ['lifting', 'gripping'] };
	d.painAssessment = { ...d.painAssessment, currentPainLevel: 5, worstPain: 7, bestPain: 3, painCharacter: 'aching', painFrequency: 'intermittent', nightPain: 'no', painWithWeightBearing: 'no' };
	fillDash(d, 3);
	d.functionalLimitations = { ...d.functionalLimitations, difficultyWithADLs: ['dressing', 'cooking'], mobilityAids: [], workRestrictions: 'No heavy lifting' };
	d.currentTreatment = { ...d.currentTreatment, physicalTherapy: 'yes', physicalTherapyDetails: '6 weeks of PT', medications: [{ name: 'Ibuprofen', dose: '400 mg', frequency: 'TDS' }], allergies: [] };
	d.surgicalHistory = { ...d.surgicalHistory, previousOrthopedicSurgery: 'no', anesthesiaComplications: 'no', willingToConsiderSurgery: 'no' };
	return d;
}

/** A severe-disability assessment: traumatic onset, night pain, red flags. */
function severe(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1958-01-22', sex: 'female', occupation: 'Retired', dominantHand: 'right' };
	d.chiefComplaint = { ...d.chiefComplaint, primaryConcern: 'Severe shoulder pain after a fall', affectedJoint: 'Shoulder', side: 'right', duration: '6 weeks', onsetType: 'traumatic', aggravatingFactors: ['movement', 'lifting'] };
	d.painAssessment = { ...d.painAssessment, currentPainLevel: 7, worstPain: 9, bestPain: 5, painCharacter: 'sharp', painFrequency: 'constant', nightPain: 'yes', painWithWeightBearing: 'yes' };
	fillDash(d, 4);
	d.dashQuestionnaire.q26 = 4;
	d.dashQuestionnaire.q29 = 4;
	d.functionalLimitations = { ...d.functionalLimitations, difficultyWithADLs: ['dressing', 'bathing', 'cooking', 'driving'], mobilityAids: ['sling'], workRestrictions: 'Unable to work' };
	d.imagingHistory = { ...d.imagingHistory, xRay: { performed: 'no', date: '', findings: '' } };
	d.currentTreatment = { ...d.currentTreatment, physicalTherapy: 'yes', physicalTherapyDetails: 'Limited tolerance', injections: 'yes', injectionDetails: 'Corticosteroid', medications: [{ name: 'Codeine', dose: '30 mg', frequency: 'QDS' }], allergies: [{ allergen: 'Penicillin', reaction: 'Rash', severity: 'mild' }] };
	d.surgicalHistory = { ...d.surgicalHistory, previousOrthopedicSurgery: 'yes', surgeries: [{ procedure: 'Rotator cuff repair', date: '2015-03-01', outcome: 'Good' }], anesthesiaComplications: 'no', willingToConsiderSurgery: 'yes' };
	return d;
}

/** A very-severe assessment: maximal disability with multiple high-priority flags. */
function verySevere(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { ...d.demographics, firstName: 'David', lastName: 'Williams', dateOfBirth: '1949-11-03', sex: 'male', occupation: 'Retired', dominantHand: 'right' };
	d.chiefComplaint = { ...d.chiefComplaint, primaryConcern: 'Disabling bilateral shoulder pain', affectedJoint: 'Shoulder', side: 'bilateral', duration: '8 months', onsetType: 'traumatic', aggravatingFactors: ['movement', 'swelling', 'redness'] };
	d.painAssessment = { ...d.painAssessment, currentPainLevel: 9, worstPain: 10, bestPain: 7, painCharacter: 'throbbing', painFrequency: 'constant', nightPain: 'yes', painWithWeightBearing: 'yes' };
	fillDash(d, 5);
	d.functionalLimitations = { ...d.functionalLimitations, difficultyWithADLs: ['dressing', 'bathing', 'cooking', 'driving', 'grooming'], mobilityAids: ['sling'], workRestrictions: 'Unable to work', sportRestrictions: 'All sport stopped' };
	d.imagingHistory = { ...d.imagingHistory, xRay: { performed: 'no', date: '', findings: '' } };
	d.currentTreatment = { ...d.currentTreatment, physicalTherapy: 'yes', physicalTherapyDetails: 'Failed', injections: 'yes', injectionDetails: 'Multiple corticosteroid injections', braceOrSplint: 'yes', braceDetails: 'Bilateral slings', medications: [{ name: 'Morphine', dose: '10 mg', frequency: 'PRN' }], allergies: [{ allergen: 'Latex', reaction: 'Anaphylaxis', severity: 'anaphylaxis' }] };
	d.surgicalHistory = { ...d.surgicalHistory, previousOrthopedicSurgery: 'yes', surgeries: [{ procedure: 'Left shoulder arthroscopy', date: '2018-07-01', outcome: 'Partial relief' }], anesthesiaComplications: 'yes', anesthesiaDetails: 'Malignant hyperthermia', willingToConsiderSurgery: 'yes' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'OA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: noDisability() },
	{ id: 'OA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderate() },
	{ id: 'OA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: severe() },
	{ id: 'OA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: verySevere() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateDASH(s.data);
	const flags = detectAdditionalFlags(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		affectedJoint: `${s.data.chiefComplaint.affectedJoint}${s.data.chiefComplaint.side === 'bilateral' ? ' (bilateral)' : ''}`,
		dashScore: g.dashScore,
		disabilityLevel: g.dashCategoryLabel,
		surgicalCandidate: s.data.surgicalHistory.willingToConsiderSurgery === 'yes',
		flagCount: flags.length
	};
});
