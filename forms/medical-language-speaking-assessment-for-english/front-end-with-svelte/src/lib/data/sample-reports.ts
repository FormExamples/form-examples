import type { AssessmentData, OetGrade, Outcome, Profession } from '$lib/engine/types';
import { calculateOetGrade } from '$lib/engine/oet-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	candidateName: string;
	testDate: string;
	data: AssessmentData;
}

/** A row in the assessment-lead dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	candidateName: string;
	testDate: string;
	profession: Profession;
	grade: OetGrade;
	score: number;
	outcome: Outcome;
	flagCount: number;
}

/** A Grade A candidate: strong across all linguistic and clinical criteria. */
function gradeA(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidateDetails = {
		candidateNumber: 'OET-90021',
		firstName: 'Ana',
		lastName: 'Ferreira',
		dateOfTest: '2026-05-04',
		profession: 'medicine',
		firstLanguage: 'Portuguese',
		testVenue: 'London test centre',
		assessorName: 'Dr H. Okafor'
	};
	d.rolePlay1 = { setting: 'GP surgery', patientRole: 'Anxious parent of a febrile child', candidateTask: 'Take a focused history', notes: 'Excellent rapport; clear, empathetic questioning.', completed: 'yes' };
	d.rolePlay2 = { setting: 'Outpatient clinic', patientRole: 'Newly diagnosed diabetic', candidateTask: 'Explain diagnosis and management', notes: 'Structured explanation, checked understanding throughout.', completed: 'yes' };
	d.linguisticCriteria = { intelligibility: 6, fluency: 6, appropriatenessOfLanguage: 5, resourcesOfGrammarAndExpression: 6 };
	d.clinicalCommunication = { relationshipBuilding: 3, understandingPatientPerspective: 3, providingStructure: 3, informationGathering: 3, informationGiving: 3, examinerComments: 'Outstanding patient-centred consultation.' };
	return d;
}

/** A Grade B candidate: good professional proficiency, a pass. */
function gradeB(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidateDetails = {
		candidateNumber: 'OET-90034',
		firstName: 'Wei',
		lastName: 'Zhang',
		dateOfTest: '2026-05-06',
		profession: 'medicine',
		firstLanguage: 'Mandarin',
		testVenue: 'Manchester test centre',
		assessorName: 'Dr H. Okafor'
	};
	d.rolePlay1 = { setting: 'Hospital ward', patientRole: 'Post-operative patient in pain', candidateTask: 'Assess pain and reassure', notes: 'Good history; occasional hesitation.', completed: 'yes' };
	d.rolePlay2 = { setting: 'Emergency department', patientRole: 'Patient with chest pain', candidateTask: 'Explain investigations', notes: 'Clear plan, minor lapses in register.', completed: 'yes' };
	d.linguisticCriteria = { intelligibility: 5, fluency: 4, appropriatenessOfLanguage: 5, resourcesOfGrammarAndExpression: 4 };
	d.clinicalCommunication = { relationshipBuilding: 3, understandingPatientPerspective: 2, providingStructure: 3, informationGathering: 3, informationGiving: 2, examinerComments: 'Solid, safe consultation.' };
	return d;
}

/** A Grade C candidate: functional proficiency, below the registration threshold. */
function gradeC(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidateDetails = {
		candidateNumber: 'OET-90048',
		firstName: 'Olu',
		lastName: 'Adeyemi',
		dateOfTest: '2026-05-08',
		profession: 'nursing',
		firstLanguage: 'Yoruba',
		testVenue: 'Birmingham test centre',
		assessorName: 'Dr S. Marsh'
	};
	d.rolePlay1 = { setting: 'Community clinic', patientRole: 'Elderly patient with cough', candidateTask: 'Take a history', notes: 'Frequent grammatical slips; rapport adequate.', completed: 'yes' };
	d.rolePlay2 = { setting: 'GP surgery', patientRole: 'Patient starting new medication', candidateTask: 'Explain dosing', notes: 'Explanation incomplete; understanding not checked.', completed: 'yes' };
	d.linguisticCriteria = { intelligibility: 4, fluency: 3, appropriatenessOfLanguage: 3, resourcesOfGrammarAndExpression: 3 };
	d.clinicalCommunication = { relationshipBuilding: 2, understandingPatientPerspective: 2, providingStructure: 2, informationGathering: 2, informationGiving: 1, examinerComments: 'Functional but needs further practice in information-giving.' };
	return d;
}

/** A Grade D/E candidate: below the functional threshold, role-play 2 incomplete. */
function gradeBelow(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidateDetails = {
		candidateNumber: 'OET-90052',
		firstName: 'Rana',
		lastName: 'Haddad',
		dateOfTest: '2026-05-10',
		profession: 'medicine',
		firstLanguage: 'Arabic',
		testVenue: 'Leeds test centre',
		assessorName: 'Dr S. Marsh'
	};
	d.rolePlay1 = { setting: 'GP surgery', patientRole: 'Patient with headache', candidateTask: 'Take a history', notes: 'Pronunciation impeded understanding several times.', completed: 'yes' };
	d.rolePlay2 = { setting: 'Outpatient clinic', patientRole: 'Patient awaiting results', candidateTask: 'Explain next steps', notes: 'Role-play could not be completed in time.', completed: 'no' };
	d.linguisticCriteria = { intelligibility: 2, fluency: 2, appropriatenessOfLanguage: 2, resourcesOfGrammarAndExpression: 2 };
	d.clinicalCommunication = { relationshipBuilding: 1, understandingPatientPerspective: 0, providingStructure: 1, informationGathering: 1, informationGiving: 0, examinerComments: 'Below functional threshold; significant communication gaps.' };
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'EN-2026-0001', candidateName: 'Ferreira, Ana', testDate: '2026-05-04', data: gradeA() },
	{ id: 'EN-2026-0002', candidateName: 'Zhang, Wei', testDate: '2026-05-06', data: gradeB() },
	{ id: 'EN-2026-0003', candidateName: 'Adeyemi, Olu', testDate: '2026-05-08', data: gradeC() },
	{ id: 'EN-2026-0004', candidateName: 'Haddad, Rana', testDate: '2026-05-10', data: gradeBelow() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateOetGrade(s.data);
	return {
		id: s.id,
		candidateName: s.candidateName,
		testDate: s.testDate,
		profession: s.data.candidateDetails.profession,
		grade: g.grade,
		score: g.score,
		outcome: g.outcome,
		flagCount: g.additionalFlags.length
	};
});
