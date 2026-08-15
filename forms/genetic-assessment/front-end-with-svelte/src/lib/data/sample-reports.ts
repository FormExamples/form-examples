import type { AssessmentData, RiskLevel } from '#lib/engine/types.js';
import { calculateGrade } from '#lib/engine/risk-grader.js';
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
	riskScore: number;
	riskLevel: RiskLevel;
	urgency: string;
	consanguinityFlag: boolean;
	cancerFlag: boolean;
	flagCount: number;
}

/** A low-risk assessment: routine carrier screening, no notable history. */
function lowRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'John', lastName: 'Smith', dateOfBirth: '1985-04-12', sex: 'male' };
	d.referralInformation = {
		referralReason: 'Routine carrier screening',
		referringClinician: 'Dr. Wilson',
		urgency: 'routine'
	};
	d.ethnicBackground = { ...d.ethnicBackground, ethnicity: 'European' };
	return d;
}

/** A moderate-risk assessment: developmental history and family cancer. */
function moderateRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Priya', lastName: 'Patel', dateOfBirth: '1979-09-30', sex: 'female' };
	d.referralInformation = {
		referralReason: 'Recurrent miscarriages',
		referringClinician: 'Dr. Ahmed',
		urgency: 'routine'
	};
	d.personalMedicalHistory = {
		...d.personalMedicalHistory,
		developmentalDelay: 'yes',
		developmentalDelayDetails: 'Mild speech delay in childhood'
	};
	d.reproductiveGenetics = { ...d.reproductiveGenetics, recurrentMiscarriages: 'yes' };
	d.familyPedigree.mother.cancers = 'Breast cancer';
	d.ethnicBackground = { ...d.ethnicBackground, ethnicity: 'South Asian' };
	return d;
}

/** A high-risk assessment: known pathogenic variant and family cancer cluster. */
function highRisk(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'Margaret', lastName: 'Jones', dateOfBirth: '1968-01-22', sex: 'female' };
	d.referralInformation = {
		referralReason: 'BRCA family history',
		referringClinician: 'Dr. Patel',
		urgency: 'urgent'
	};
	d.personalMedicalHistory = {
		...d.personalMedicalHistory,
		knownGeneticCondition: 'yes',
		knownGeneticConditionDetails: 'BRCA1 pathogenic variant'
	};
	d.cancerHistory = {
		personalCancerHistory: 'yes',
		cancerType: 'Breast cancer',
		ageAtDiagnosis: 42,
		multiplePrimaryCancers: 'no'
	};
	d.familyPedigree.mother.cancers = 'Breast cancer';
	d.familyPedigree.maternalGrandmother.cancers = 'Ovarian cancer';
	d.ethnicBackground = { ...d.ethnicBackground, ethnicity: 'Ashkenazi Jewish', ashkenaziJewish: 'yes' };
	return d;
}

/** A high-risk assessment: Huntington family history, emergency referral. */
function critical(): AssessmentData {
	const d = createDefaultAssessment();
	d.demographics = { firstName: 'David', lastName: 'Williams', dateOfBirth: '1972-11-03', sex: 'male' };
	d.referralInformation = {
		referralReason: 'Huntington disease family history',
		referringClinician: 'Dr. Okafor',
		urgency: 'emergency'
	};
	d.personalMedicalHistory = {
		...d.personalMedicalHistory,
		chromosomalCondition: 'yes',
		chromosomalConditionDetails: 'Balanced translocation'
	};
	d.neurogenetics = { ...d.neurogenetics, huntington: 'yes' };
	d.cardiovascularGenetics = { ...d.cardiovascularGenetics, suddenCardiacDeath: 'yes' };
	d.reproductiveGenetics = {
		...d.reproductiveGenetics,
		previousAffectedChild: 'yes',
		previousAffectedChildDetails: 'Cystic fibrosis',
		consanguinity: 'yes'
	};
	d.ethnicBackground = {
		ethnicity: 'Middle Eastern',
		ashkenaziJewish: 'no',
		consanguinity: 'yes',
		consanguinityDetails: 'First cousins'
	};
	return d;
}

/** The sample assessments, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'GA-2026-0001', patientName: 'Smith, John', assessedDate: '2026-06-10', data: lowRisk() },
	{ id: 'GA-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-06-12', data: moderateRisk() },
	{ id: 'GA-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-06-15', data: highRisk() },
	{ id: 'GA-2026-0004', patientName: 'Williams, David', assessedDate: '2026-06-18', data: critical() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateGrade(s.data);
	const familyMembers = [
		s.data.familyPedigree.maternalGrandmother,
		s.data.familyPedigree.maternalGrandfather,
		s.data.familyPedigree.paternalGrandmother,
		s.data.familyPedigree.paternalGrandfather,
		s.data.familyPedigree.mother,
		s.data.familyPedigree.father
	];
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		riskScore: g.riskScore,
		riskLevel: g.riskLevel,
		urgency: s.data.referralInformation.urgency,
		consanguinityFlag:
			s.data.reproductiveGenetics.consanguinity === 'yes' ||
			s.data.ethnicBackground.consanguinity === 'yes',
		cancerFlag:
			s.data.cancerHistory.personalCancerHistory === 'yes' ||
			familyMembers.some((m) => m.cancers.trim() !== ''),
		flagCount: g.additionalFlags.length
	};
});
