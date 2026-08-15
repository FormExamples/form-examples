import type { AssessmentData, OETGrade } from '#lib/engine/types.js';
import { gradeAssessment } from '#lib/engine/oet-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample assessment: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	candidateName: string;
	assessedDate: string;
	data: AssessmentData;
}

/** A row in the exam-admin dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	candidateName: string;
	assessedDate: string;
	grade: OETGrade;
	scaledScore: number;
	linguisticTotal: number;
	clinicalTotal: number;
	thresholdMet: boolean;
	flagCount: number;
}

/** An expert candidate (Grade A): full marks across both role-plays. */
function expert(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidate = {
		...d.candidate,
		candidateId: 'CYM-2026-0001',
		candidateName: 'Eleri Prydderch',
		examinerName: 'Dr Catrin Huws',
		testCentre: 'Bangor',
		testDate: '2026-06-08',
		firstLanguage: 'Cymraeg',
		countryOfTraining: 'Wales',
		yearsOfExperience: '11+'
	};
	d.rolePlay1 = {
		...d.rolePlay1,
		scenarioTitle: 'Poen yn y frest mewn dyn 62 oed',
		scenarioSummary: 'Cymryd hanes a thrafod pryderon claf â phoen yn y frest.',
		patientRole: 'Claf â phoen yn y frest',
		setting: 'Meddygfa',
		safetyCriticality: 'high',
		examinerNotes: 'Rhugl a hyderus drwy gydol y sgwrs.'
	};
	d.rolePlay2 = {
		...d.rolePlay2,
		scenarioTitle: 'Esbonio diagnosis diabetes',
		scenarioSummary: 'Esbonio diagnosis newydd a chynllun rheoli yn Gymraeg.',
		patientRole: 'Claf newydd-ddiagnosedig',
		setting: 'Clinig cleifion allanol',
		safetyCriticality: 'standard'
	};
	d.linguisticRolePlay1 = { fluency: 6, grammar: 6, pronunciation: 6, clinicalAppropriateness: 6 };
	d.linguisticRolePlay2 = { fluency: 6, grammar: 6, pronunciation: 6, clinicalAppropriateness: 6 };
	d.clinicalIndicators = {
		relationshipBuilding: 3,
		understandingPatientPerspective: 3,
		providingStructure: 3,
		informationGathering: 3,
		informationGiving: 3,
		examinerNotes: 'Cyfathrebu clinigol rhagorol yn Gymraeg.'
	};
	return d;
}

/** A proficient candidate (Grade B): strong, clinically safe. */
function proficient(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidate = {
		...d.candidate,
		candidateId: 'CYM-2026-0002',
		candidateName: 'Rhys Morgan',
		examinerName: 'Dr Catrin Huws',
		testCentre: 'Caerdydd',
		testDate: '2026-06-10',
		firstLanguage: 'English',
		countryOfTraining: 'Wales',
		yearsOfExperience: '6-10'
	};
	d.rolePlay1 = {
		...d.rolePlay1,
		scenarioTitle: 'Sgwrs am reoli asthma',
		scenarioSummary: 'Trafod symptomau asthma a chydymffurfiad â meddyginiaeth.',
		patientRole: 'Claf ag asthma',
		setting: 'Meddygfa',
		safetyCriticality: 'standard'
	};
	d.rolePlay2 = {
		...d.rolePlay2,
		scenarioTitle: 'Esbonio canlyniadau profion gwaed',
		scenarioSummary: 'Esbonio canlyniadau a chamau nesaf yn Gymraeg.',
		patientRole: 'Claf pryderus',
		setting: 'Ward',
		safetyCriticality: 'standard'
	};
	d.linguisticRolePlay1 = { fluency: 5, grammar: 5, pronunciation: 5, clinicalAppropriateness: 5 };
	d.linguisticRolePlay2 = { fluency: 5, grammar: 4, pronunciation: 5, clinicalAppropriateness: 5 };
	d.clinicalIndicators = {
		relationshipBuilding: 3,
		understandingPatientPerspective: 2,
		providingStructure: 3,
		informationGathering: 2,
		informationGiving: 3,
		examinerNotes: 'Cyfathrebydd cryf; mân lithriadau gramadegol.'
	};
	return d;
}

/** A competent candidate (Grade C): below the typical clinical threshold. */
function competent(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidate = {
		...d.candidate,
		candidateId: 'CYM-2026-0003',
		candidateName: 'Siân Edwards',
		examinerName: 'Dr Gareth Lloyd',
		testCentre: 'Aberystwyth',
		testDate: '2026-06-12',
		firstLanguage: 'English',
		countryOfTraining: 'England',
		yearsOfExperience: '3-5'
	};
	d.rolePlay1 = {
		...d.rolePlay1,
		scenarioTitle: 'Cymryd hanes peswch parhaus',
		scenarioSummary: 'Cymryd hanes claf â pheswch ers tair wythnos.',
		patientRole: 'Claf â pheswch',
		setting: 'Meddygfa',
		safetyCriticality: 'standard'
	};
	d.rolePlay2 = {
		...d.rolePlay2,
		scenarioTitle: 'Esbonio brechiad ffliw',
		scenarioSummary: 'Esbonio buddiannau a sgil-effeithiau brechiad.',
		patientRole: 'Claf oedrannus',
		setting: 'Clinig brechu',
		safetyCriticality: 'low'
	};
	d.linguisticRolePlay1 = { fluency: 3, grammar: 3, pronunciation: 3, clinicalAppropriateness: 3 };
	d.linguisticRolePlay2 = { fluency: 3, grammar: 3, pronunciation: 3, clinicalAppropriateness: 3 };
	d.clinicalIndicators = {
		relationshipBuilding: 2,
		understandingPatientPerspective: 2,
		providingStructure: 2,
		informationGathering: 1,
		informationGiving: 1,
		examinerNotes: 'Cynnal y sgwrs gyda chryn ymdrech.'
	};
	return d;
}

/** A limited candidate (Grade D): significant communication concerns. */
function limited(): AssessmentData {
	const d = createDefaultAssessment();
	d.candidate = {
		...d.candidate,
		candidateId: 'CYM-2026-0004',
		candidateName: 'Tomos Bevan',
		examinerName: 'Dr Gareth Lloyd',
		testCentre: 'Wrecsam',
		testDate: '2026-06-14',
		firstLanguage: 'Polish',
		countryOfTraining: 'Poland',
		yearsOfExperience: '0-2'
	};
	d.rolePlay1 = {
		...d.rolePlay1,
		scenarioTitle: 'Cyfarch a chofrestru claf',
		scenarioSummary: 'Cyfarchiadau sylfaenol a chasglu manylion cyswllt.',
		patientRole: 'Claf newydd',
		setting: 'Derbynfa',
		safetyCriticality: 'high',
		examinerNotes: 'Yr iaith yn torri i lawr yn aml; troi at y Saesneg.'
	};
	d.rolePlay2 = {
		...d.rolePlay2,
		scenarioTitle: 'Esbonio apwyntiad dilynol',
		scenarioSummary: 'Ceisio trefnu apwyntiad dilynol yn Gymraeg.',
		patientRole: 'Claf',
		setting: 'Meddygfa',
		safetyCriticality: 'standard'
	};
	d.linguisticRolePlay1 = { fluency: 2, grammar: 2, pronunciation: 1, clinicalAppropriateness: 2 };
	d.linguisticRolePlay2 = { fluency: 2, grammar: 2, pronunciation: 2, clinicalAppropriateness: 2 };
	d.clinicalIndicators = {
		relationshipBuilding: 1,
		understandingPatientPerspective: 1,
		providingStructure: 1,
		informationGathering: 1,
		informationGiving: 0,
		examinerNotes: 'Angen hyfforddiant Cymraeg sylweddol cyn ymarfer clinigol cyfrwng Cymraeg.'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CYM-2026-0001', candidateName: 'Prydderch, Eleri', assessedDate: '2026-06-08', data: expert() },
	{ id: 'CYM-2026-0002', candidateName: 'Morgan, Rhys', assessedDate: '2026-06-10', data: proficient() },
	{ id: 'CYM-2026-0003', candidateName: 'Edwards, Siân', assessedDate: '2026-06-12', data: competent() },
	{ id: 'CYM-2026-0004', candidateName: 'Bevan, Tomos', assessedDate: '2026-06-14', data: limited() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeAssessment(s.data);
	return {
		id: s.id,
		candidateName: s.candidateName,
		assessedDate: s.assessedDate,
		grade: g.grade,
		scaledScore: g.scaledScore,
		linguisticTotal: g.linguisticTotal,
		clinicalTotal: g.clinicalTotal,
		thresholdMet: g.grade === 'A' || g.grade === 'B',
		flagCount: g.additionalFlags.length
	};
});
