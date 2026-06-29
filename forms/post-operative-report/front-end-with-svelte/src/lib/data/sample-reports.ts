import type { AssessmentData, ClavienDindoGradeKey, DispositionLocation } from '$lib/engine/types';
import { calculateClavienDindo } from '$lib/engine/clavien-dindo-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample report: an identifier and the full data the engine grades. */
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
	procedureName: string;
	surgeryDate: string;
	overallGrade: ClavienDindoGradeKey;
	complicationCount: number;
	disposition: DispositionLocation;
	flagCount: number;
}

/** Grade 0 — uncomplicated elective day-case laparoscopic appendicectomy. */
function uncomplicated(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = { ...d.patientDetails, firstName: 'John', lastName: 'Smith', dateOfBirth: '1990-04-12', mrn: 'MRN-1001', sex: 'male', weight: 78, height: 178, asaGrade: 'I', allergies: 'NKDA' };
	d.procedureDetails = { ...d.procedureDetails, procedureName: 'Laparoscopic appendicectomy', procedureCode: 'H011', indication: 'Acute appendicitis', priority: 'urgent', surgicalApproach: 'Laparoscopic', laterality: 'N/A', dateOfSurgery: '2026-06-10', startTime: '09:00', endTime: '09:55', operatingRoom: 'Theatre 3' };
	d.surgicalTeam = { ...d.surgicalTeam, primarySurgeon: 'Mr J. Okafor', primarySurgeonGrade: 'Consultant', primaryAnaesthetist: 'Dr K. Chan', primaryAnaesthetistGrade: 'Consultant' };
	d.intraoperativeFindings = { ...d.intraoperativeFindings, findings: 'Inflamed appendix, no perforation', procedurePerformed: 'Laparoscopic appendicectomy', conversionToOpen: 'no' };
	d.anaesthesiaSummary = { ...d.anaesthesiaSummary, anaesthesiaType: 'general', airwayManagement: 'ETT 7.5', difficultIntubation: 'no' };
	d.bloodLossFluidBalance = { ...d.bloodLossFluidBalance, estimatedBloodLossMl: 30, crystalloidsMl: 1000, urineOutputMl: 250 };
	d.specimensImplants = { ...d.specimensImplants, specimens: [{ description: 'Appendix', site: 'RIF', disposition: 'Histology in formalin' }], prosthesisUsed: 'no' };
	d.immediatePostopStatus = { ...d.immediatePostopStatus, consciousLevel: 'awake', systolicBp: 122, diastolicBp: 78, heartRate: 76, respiratoryRate: 14, oxygenSaturation: 99, temperature: 36.6, painScore: 2, disposition: 'recovery' };
	d.complicationsAssessment = { ...d.complicationsAssessment, complicationsOccurred: 'no' };
	d.postopPlanInstructions = { ...d.postopPlanInstructions, thromboprophylaxis: 'LMWH 40 mg SC daily, TED stockings', analgesiaPlan: 'Paracetamol + ibuprofen PRN', dietPlan: 'Free fluids, light diet', mobilisationPlan: 'Mobilise as able', followUpPlan: 'GP wound check; no routine clinic' };
	return d;
}

/** Grade II — wound infection requiring IV antibiotics and a transfusion. */
function gradeII(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = { ...d.patientDetails, firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1959-09-30', mrn: 'MRN-1002', sex: 'female', weight: 82, height: 162, asaGrade: 'III', allergies: 'Penicillin — rash' };
	d.procedureDetails = { ...d.procedureDetails, procedureName: 'Open right hemicolectomy', procedureCode: 'H071', indication: 'Caecal adenocarcinoma', priority: 'elective', surgicalApproach: 'Open', laterality: 'Right', dateOfSurgery: '2026-06-12', startTime: '08:30', endTime: '11:10', operatingRoom: 'Theatre 1' };
	d.surgicalTeam = { ...d.surgicalTeam, primarySurgeon: 'Miss A. Rahman', primarySurgeonGrade: 'Consultant', primaryAnaesthetist: 'Dr L. Webb', primaryAnaesthetistGrade: 'Consultant' };
	d.intraoperativeFindings = { ...d.intraoperativeFindings, findings: 'Caecal mass, no peritoneal disease', procedurePerformed: 'Right hemicolectomy with primary anastomosis', conversionToOpen: 'no' };
	d.anaesthesiaSummary = { ...d.anaesthesiaSummary, anaesthesiaType: 'general', airwayManagement: 'ETT 7.0', difficultIntubation: 'no' };
	d.bloodLossFluidBalance = { ...d.bloodLossFluidBalance, estimatedBloodLossMl: 650, crystalloidsMl: 2000, bloodProductsMl: 280, bloodProductDetails: '1 unit PRBC', urineOutputMl: 400 };
	d.specimensImplants = { ...d.specimensImplants, specimens: [{ description: 'Right colon', site: 'Right colon', disposition: 'Histology' }], prosthesisUsed: 'no' };
	d.immediatePostopStatus = { ...d.immediatePostopStatus, consciousLevel: 'drowsy', systolicBp: 118, diastolicBp: 72, heartRate: 92, respiratoryRate: 16, oxygenSaturation: 96, temperature: 37.1, painScore: 4, disposition: 'ward' };
	d.complicationsAssessment = {
		...d.complicationsAssessment,
		complicationsOccurred: 'yes',
		complications: [
			{ description: 'Surgical site infection', grade: 'grade-ii', interventionRequired: 'IV co-amoxiclav', timing: 'POD 4' },
			{ description: 'Post-operative anaemia', grade: 'grade-ii', interventionRequired: '1 unit PRBC transfusion', timing: 'POD 1' }
		],
		narrative: 'Superficial SSI managed with IV antibiotics; transfused for symptomatic anaemia.'
	};
	d.postopPlanInstructions = { ...d.postopPlanInstructions, antibioticPlan: 'IV co-amoxiclav 5 days', thromboprophylaxis: 'LMWH 40 mg SC daily', analgesiaPlan: 'Epidural then oral', dietPlan: 'Graded enteral', mobilisationPlan: 'Day 1 mobilisation', woundCareInstructions: 'Daily review, swab if discharge', followUpPlan: 'Colorectal MDT and clinic 2 weeks' };
	return d;
}

/** Grade IIIb — return to theatre under GA for post-operative haemorrhage. */
function gradeIIIb(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = { ...d.patientDetails, firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1948-01-22', mrn: 'MRN-1003', sex: 'female', weight: 70, height: 160, asaGrade: 'III', allergies: 'NKDA' };
	d.procedureDetails = { ...d.procedureDetails, procedureName: 'Total hip replacement', procedureCode: 'W371', indication: 'Osteoarthritis', priority: 'elective', surgicalApproach: 'Open', laterality: 'Left', dateOfSurgery: '2026-06-15', startTime: '13:00', endTime: '14:40', operatingRoom: 'Theatre 5' };
	d.surgicalTeam = { ...d.surgicalTeam, primarySurgeon: 'Mr D. Olsen', primarySurgeonGrade: 'Consultant', primaryAnaesthetist: 'Dr P. Singh', primaryAnaesthetistGrade: 'Consultant' };
	d.intraoperativeFindings = { ...d.intraoperativeFindings, findings: 'Degenerate hip joint', procedurePerformed: 'Cemented total hip arthroplasty', conversionToOpen: 'no' };
	d.anaesthesiaSummary = { ...d.anaesthesiaSummary, anaesthesiaType: 'spinal', airwayManagement: 'Spinal + sedation', difficultIntubation: 'no' };
	d.bloodLossFluidBalance = { ...d.bloodLossFluidBalance, estimatedBloodLossMl: 1600, crystalloidsMl: 2500, bloodProductsMl: 560, bloodProductDetails: '2 units PRBC', urineOutputMl: 300 };
	d.specimensImplants = { ...d.specimensImplants, implants: [{ description: 'Cemented hip prosthesis', manufacturer: 'Stryker', lotNumber: 'LOT-44821', site: 'Left hip' }], prosthesisUsed: 'yes', drainsPlaced: 'Wound drain ×1' };
	d.immediatePostopStatus = { ...d.immediatePostopStatus, consciousLevel: 'awake', systolicBp: 104, diastolicBp: 64, heartRate: 104, respiratoryRate: 18, oxygenSaturation: 95, temperature: 36.2, painScore: 5, disposition: 'hdu' };
	d.complicationsAssessment = {
		...d.complicationsAssessment,
		complicationsOccurred: 'yes',
		complications: [
			{ description: 'Post-operative haemorrhage', grade: 'grade-iiib', interventionRequired: 'Return to theatre under GA for washout and haemostasis', timing: 'POD 0' },
			{ description: 'Acute blood-loss anaemia', grade: 'grade-ii', interventionRequired: '2 units PRBC', timing: 'POD 0' }
		],
		narrative: 'Significant intra-operative blood loss; returned to theatre for evacuation of haematoma.'
	};
	d.postopPlanInstructions = { ...d.postopPlanInstructions, thromboprophylaxis: 'Mechanical only until bleeding settled, then LMWH', analgesiaPlan: 'PCA morphine', dietPlan: 'Normal', mobilisationPlan: 'Physio-led, partial weight bearing', followUpPlan: 'Orthopaedic clinic 6 weeks, Hb recheck' };
	return d;
}

/** Grade V — fatal multi-organ failure after emergency surgery. */
function gradeV(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDetails = { ...d.patientDetails, firstName: 'David', lastName: 'Williams', dateOfBirth: '1945-11-03', mrn: 'MRN-1004', sex: 'male', weight: 95, height: 180, asaGrade: 'V', allergies: 'NKDA' };
	d.procedureDetails = { ...d.procedureDetails, procedureName: 'Emergency laparotomy for ischaemic bowel', procedureCode: 'G581', indication: 'Acute mesenteric ischaemia', priority: 'emergency', surgicalApproach: 'Open', laterality: 'N/A', dateOfSurgery: '2026-06-18', startTime: '02:10', endTime: '05:30', operatingRoom: 'Emergency theatre' };
	d.surgicalTeam = { ...d.surgicalTeam, primarySurgeon: 'Mr R. Costa', primarySurgeonGrade: 'Consultant', primaryAnaesthetist: 'Dr H. Ito', primaryAnaesthetistGrade: 'Consultant' };
	d.intraoperativeFindings = { ...d.intraoperativeFindings, findings: 'Extensive small-bowel infarction', procedurePerformed: 'Resection of necrotic bowel, laparostomy', conversionToOpen: 'no' };
	d.anaesthesiaSummary = { ...d.anaesthesiaSummary, anaesthesiaType: 'general', airwayManagement: 'ETT 8.0', difficultIntubation: 'no', anaesthesiaNotes: 'Profound vasoplegia, high vasopressor requirement.' };
	d.bloodLossFluidBalance = { ...d.bloodLossFluidBalance, estimatedBloodLossMl: 2500, crystalloidsMl: 4000, bloodProductsMl: 1400, bloodProductDetails: '4 units PRBC, 2 FFP', urineOutputMl: 60 };
	d.immediatePostopStatus = { ...d.immediatePostopStatus, consciousLevel: 'intubated', systolicBp: 82, diastolicBp: 48, heartRate: 128, respiratoryRate: 22, oxygenSaturation: 89, temperature: 35.4, painScore: null, disposition: 'icu' };
	d.complicationsAssessment = {
		...d.complicationsAssessment,
		complicationsOccurred: 'yes',
		complications: [
			{ description: 'Multi-organ dysfunction', grade: 'grade-ivb', interventionRequired: 'ICU, vasopressors, CVVH', timing: 'POD 0' },
			{ description: 'Death', grade: 'grade-v', interventionRequired: 'N/A', timing: 'POD 2' }
		],
		narrative: 'Despite maximal ICU support the patient developed refractory multi-organ failure and died on POD 2.'
	};
	d.postopPlanInstructions = { ...d.postopPlanInstructions, alertsAndEscalation: 'ICU consultant-led care; family present.' };
	return d;
}

/** The sample reports, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'POR-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: uncomplicated() },
	{ id: 'POR-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: gradeII() },
	{ id: 'POR-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: gradeIIIb() },
	{ id: 'POR-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: gradeV() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateClavienDindo(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		procedureName: s.data.procedureDetails.procedureName,
		surgeryDate: s.data.procedureDetails.dateOfSurgery,
		overallGrade: g.overallGrade,
		complicationCount: g.complicationCount,
		disposition: s.data.immediatePostopStatus.disposition,
		flagCount: g.additionalFlags.length
	};
});
