import type { AssessmentData } from '$lib/engine/types';
import { gradeConsent } from '$lib/engine/grade';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample consent record: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	patientName: string;
	scheduledDate: string;
	data: AssessmentData;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	scheduledDate: string;
	procedureName: string;
	status: 'Complete' | 'Incomplete';
	completenessPercent: number;
	consent: 'given' | 'refused' | 'pending';
	flagCount: number;
}

/** A fully completed, consented form: every required section filled and signed. */
function completeConsented(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		firstName: 'John',
		lastName: 'Smith',
		dob: '1968-04-12',
		sex: 'male',
		nhsNumber: '485 777 3456',
		address: '12 Oak Lane, Cardiff',
		phone: '029 2018 1234',
		emergencyContact: 'Mary Smith',
		emergencyContactPhone: '07700 900123'
	};
	d.procedureDetails = {
		procedureName: 'Laparoscopic cholecystectomy',
		procedureDescription: 'Keyhole removal of the gallbladder',
		treatingClinician: 'Mr A Patel',
		department: 'General Surgery',
		scheduledDate: '2026-07-10',
		estimatedDuration: '90 minutes',
		admissionRequired: 'yes'
	};
	d.risksBenefits = {
		commonRisks: 'Bruising, shoulder-tip pain, nausea',
		seriousRisks: 'Bleeding, infection, bile-duct injury',
		expectedBenefits: 'Resolution of biliary colic',
		successRate: '95%',
		recoveryPeriod: '1–2 weeks'
	};
	d.alternativeTreatments = {
		alternativeOptions: 'Conservative management with low-fat diet',
		noTreatmentConsequences: 'Recurrent biliary colic and risk of cholecystitis',
		patientPreference: 'Prefers surgery'
	};
	d.anesthesiaInformation = {
		anesthesiaType: 'general',
		anesthesiaRisks: 'Sore throat, nausea, rare allergic reaction',
		previousAnesthesiaProblems: 'no',
		previousAnesthesiaDetails: '',
		fastingInstructions: 'Nil by mouth from midnight'
	};
	d.questionsUnderstanding = {
		questionsAsked: 'Asked about recovery time',
		understandsProcedure: 'yes',
		understandsRisks: 'yes',
		understandsAlternatives: 'yes',
		understandsRecovery: 'yes',
		additionalConcerns: ''
	};
	d.patientRights = {
		rightToWithdraw: 'yes',
		rightToSecondOpinion: 'yes',
		informedVoluntarily: 'yes',
		noGuaranteeAcknowledged: 'yes'
	};
	d.signatureConsent = {
		patientConsent: 'yes',
		signatureDate: '2026-07-08',
		witnessName: 'Nurse J Evans',
		witnessRole: 'Staff nurse',
		witnessSignatureDate: '2026-07-08',
		clinicianName: 'Mr A Patel',
		clinicianRole: 'Consultant surgeon',
		clinicianSignatureDate: '2026-07-08',
		interpreterUsed: 'no',
		interpreterName: ''
	};
	return d;
}

/** A nearly-complete form with high-risk and understanding flags. */
function highRiskWithFlags(): AssessmentData {
	const d = completeConsented();
	d.patientInformation = {
		...d.patientInformation,
		firstName: 'Priya',
		lastName: 'Patel',
		dob: '1959-09-30',
		sex: 'female',
		nhsNumber: '943 476 5919'
	};
	d.procedureDetails = {
		...d.procedureDetails,
		procedureName: 'Spinal decompression',
		treatingClinician: 'Ms K Owen',
		department: 'Neurosurgery',
		scheduledDate: '2026-07-15'
	};
	d.risksBenefits = {
		...d.risksBenefits,
		seriousRisks: 'Permanent paralysis, nerve damage, death'
	};
	d.anesthesiaInformation = {
		...d.anesthesiaInformation,
		previousAnesthesiaProblems: 'yes',
		previousAnesthesiaDetails: 'Post-operative nausea and prolonged recovery'
	};
	d.questionsUnderstanding = {
		...d.questionsUnderstanding,
		understandsRisks: 'no',
		additionalConcerns: 'Worried about mobility after surgery'
	};
	return d;
}

/** An incomplete form: several required sections still blank, consent pending. */
function incompletePending(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientInformation = {
		...d.patientInformation,
		firstName: 'Margaret',
		lastName: 'Jones',
		dob: '1948-01-22',
		sex: 'female',
		nhsNumber: '611 234 0987',
		address: '4 Elm Court, Swansea',
		phone: '01792 555 010',
		emergencyContact: 'Robert Jones',
		emergencyContactPhone: '07700 900456'
	};
	d.procedureDetails = {
		...d.procedureDetails,
		procedureName: 'Total knee replacement',
		procedureDescription: 'Replacement of the knee joint with a prosthesis',
		treatingClinician: 'Mr D Lloyd',
		department: 'Orthopaedics',
		scheduledDate: '2026-08-01',
		admissionRequired: 'yes'
	};
	// Risks, alternatives, anesthesia, understanding, rights and signatures left blank.
	return d;
}

/** A complete form where the patient has declined consent. */
function refusedConsent(): AssessmentData {
	const d = completeConsented();
	d.patientInformation = {
		...d.patientInformation,
		firstName: 'David',
		lastName: 'Williams',
		dob: '1955-11-03',
		sex: 'male',
		nhsNumber: '707 112 8841'
	};
	d.procedureDetails = {
		...d.procedureDetails,
		procedureName: 'Coronary artery bypass graft',
		treatingClinician: 'Mr S Hughes',
		department: 'Cardiothoracic Surgery',
		scheduledDate: '2026-07-22'
	};
	d.patientRights = {
		...d.patientRights,
		rightToSecondOpinion: 'no'
	};
	d.signatureConsent = {
		...d.signatureConsent,
		patientConsent: 'no'
	};
	return d;
}

/** The sample consent records, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CT-2026-0001', patientName: 'Smith, John', scheduledDate: '2026-07-10', data: completeConsented() },
	{ id: 'CT-2026-0002', patientName: 'Patel, Priya', scheduledDate: '2026-07-15', data: highRiskWithFlags() },
	{ id: 'CT-2026-0003', patientName: 'Jones, Margaret', scheduledDate: '2026-08-01', data: incompletePending() },
	{ id: 'CT-2026-0004', patientName: 'Williams, David', scheduledDate: '2026-07-22', data: refusedConsent() }
];

/** Map the stored consent answer onto a dashboard-friendly label. */
function consentDecision(value: string): DashboardRow['consent'] {
	if (value === 'yes') return 'given';
	if (value === 'no') return 'refused';
	return 'pending';
}

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = gradeConsent(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		scheduledDate: s.scheduledDate,
		procedureName: s.data.procedureDetails.procedureName || '—',
		status: g.status,
		completenessPercent: g.completenessPercent,
		consent: consentDecision(s.data.signatureConsent.patientConsent),
		flagCount: g.additionalFlags.length
	};
});
