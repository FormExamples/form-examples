import type { AssessmentData, CompletenessLevel } from '$lib/engine/types';
import { calculateIPSGrade } from '$lib/engine/ips-grader';
import { createDefaultAssessment } from '$lib/stores/assessment.svelte';

/** A sample IPS: an identifier and the full data the engine grades. */
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
	completeness: CompletenessLevel;
	mandatory: string;
	optional: string;
	allergyFlag: boolean;
	flagCount: number;
}

/** A complete IPS: all eight mandatory + both optional sections populated. */
function complete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDemographics = {
		...d.patientDemographics,
		givenName: 'Jane',
		familyName: 'Smith',
		dateOfBirth: '1970-03-02',
		sex: 'female',
		nationalIdentifier: 'NHS 943 476 5919',
		addressLine: '12 King Street',
		city: 'Cardiff',
		postalCode: 'CF10 1AB',
		country: 'GB',
		preferredLanguage: 'en-GB',
		contactPhone: '+44 29 2000 0000'
	};
	d.problemList = [
		{ description: 'Type 2 diabetes mellitus', icd10Code: 'E11.9', onsetDate: '2015-04-01', status: 'active' },
		{ description: 'Essential hypertension', icd10Code: 'I10', onsetDate: '2012-09-12', status: 'active' }
	];
	d.medicationSummary = [
		{ name: 'Metformin', atcCode: 'A10BA02', dose: '500 mg', frequency: 'BD', route: 'PO' },
		{ name: 'Ramipril', atcCode: 'C09AA05', dose: '5 mg', frequency: 'OD', route: 'PO' }
	];
	d.allergiesIntolerances = [
		{ substance: 'Penicillin', reaction: 'Urticaria', severity: 'moderate', criticality: 'high' }
	];
	d.immunisations = [
		{ vaccine: 'Influenza', date: '2025-10-04', lotNumber: 'FLU-2025-117' },
		{ vaccine: 'COVID-19 mRNA', date: '2025-11-20', lotNumber: 'CV-9981' }
	];
	d.procedures = [{ description: 'Laparoscopic cholecystectomy', date: '2019-06-18', performer: 'Cardiff Royal Infirmary' }];
	d.resultsInvestigations = [
		{ testName: 'HbA1c', value: '58', unit: 'mmol/mol', interpretation: 'high', date: '2026-05-02' }
	];
	d.medicalDevices = [{ description: 'Insulin pump', udi: '(01)0085412004', implantDate: '2022-01-10' }];
	d.advanceDirectives = { dnrInPlace: 'no', livingWillInPlace: 'no', consentToShareEu: 'yes', directiveNotes: '' };
	d.authoringClinician = {
		clinicianName: 'Dr Aiden Walker',
		clinicianRole: 'General Practitioner',
		organisation: 'Cardiff Central Practice',
		country: 'GB',
		email: 'a.walker@example.nhs.uk',
		phone: '+44 29 2000 1111',
		signoffDate: '2026-05-10',
		authoringStatus: 'final'
	};
	return d;
}

/** A partial IPS: all mandatory sections present but optional sections empty. */
function partial(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDemographics = {
		...d.patientDemographics,
		givenName: 'Priya',
		familyName: 'Patel',
		dateOfBirth: '1959-09-30',
		sex: 'female',
		nationalIdentifier: 'EHIC-IE-7781',
		country: 'IE',
		preferredLanguage: 'en-IE'
	};
	d.problemList = [{ description: 'Asthma', icd10Code: 'J45.909', onsetDate: '1998-01-01', status: 'active' }];
	d.medicationSummary = [{ name: 'Salbutamol inhaler', atcCode: 'R03AC02', dose: '100 mcg', frequency: 'PRN', route: 'INH' }];
	d.allergiesIntolerances = [{ substance: 'Aspirin', reaction: 'Bronchospasm', severity: 'severe', criticality: 'high' }];
	d.immunisations = [{ vaccine: 'Pneumococcal', date: '2024-03-11', lotNumber: '' }];
	d.procedures = [{ description: 'Tonsillectomy', date: '1975-08-01', performer: 'Dublin General' }];
	d.resultsInvestigations = [{ testName: 'Peak flow', value: '420', unit: 'L/min', interpretation: 'normal', date: '2026-04-22' }];
	// medicalDevices + advanceDirectives left empty -> partial
	d.authoringClinician = {
		clinicianName: 'Dr Maria Lopez',
		clinicianRole: 'Respiratory Physician',
		organisation: 'Dublin Care Centre',
		country: 'IE',
		email: 'm.lopez@example.ie',
		phone: '',
		signoffDate: '2026-04-25',
		authoringStatus: 'final'
	};
	return d;
}

/** An incomplete IPS: several mandatory sections missing, draft signoff. */
function incomplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDemographics = {
		...d.patientDemographics,
		givenName: 'Margaret',
		familyName: 'Jones',
		dateOfBirth: '1948-01-22',
		sex: 'female',
		country: 'GB'
	};
	d.problemList = [{ description: 'Atrial fibrillation', icd10Code: 'I48.91', onsetDate: '2020-02-02', status: 'active' }];
	d.medicationSummary = [{ name: 'Apixaban', atcCode: 'B01AF02', dose: '5 mg', frequency: 'BD', route: 'PO' }];
	// allergies, immunisations, procedures, results all empty -> incomplete
	d.advanceDirectives = { dnrInPlace: 'yes', livingWillInPlace: 'yes', consentToShareEu: 'yes', directiveNotes: 'DNR confirmed 2025.' };
	d.authoringClinician = {
		clinicianName: 'Dr Hiroshi Tanaka',
		clinicianRole: 'Cardiologist',
		organisation: 'Bristol Heart Unit',
		country: 'GB',
		email: '',
		phone: '',
		signoffDate: '',
		authoringStatus: 'draft'
	};
	return d;
}

/** A barely-started IPS: consent refused, almost nothing recorded. */
function incompleteNoConsent(): AssessmentData {
	const d = createDefaultAssessment();
	d.patientDemographics = {
		...d.patientDemographics,
		givenName: 'David',
		familyName: 'Williams',
		dateOfBirth: '1955-11-03',
		sex: 'male'
	};
	d.problemList = [{ description: 'Chronic kidney disease stage 3', icd10Code: 'N18.3', onsetDate: '2018-07-07', status: 'active' }];
	d.advanceDirectives = { dnrInPlace: '', livingWillInPlace: '', consentToShareEu: 'no', directiveNotes: '' };
	return d;
}

/** The sample IPS records, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'IPS-2026-0001', patientName: 'Smith, Jane', assessedDate: '2026-05-10', data: complete() },
	{ id: 'IPS-2026-0002', patientName: 'Patel, Priya', assessedDate: '2026-04-25', data: partial() },
	{ id: 'IPS-2026-0003', patientName: 'Jones, Margaret', assessedDate: '2026-04-18', data: incomplete() },
	{ id: 'IPS-2026-0004', patientName: 'Williams, David', assessedDate: '2026-04-12', data: incompleteNoConsent() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateIPSGrade(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		assessedDate: s.assessedDate,
		completeness: g.completenessLevel,
		mandatory: `${g.mandatoryPopulated}/${g.mandatoryTotal}`,
		optional: `${g.optionalPopulated}/${g.optionalTotal}`,
		allergyFlag: s.data.allergiesIntolerances.some((a) => a.substance.trim() !== ''),
		flagCount: g.additionalFlags.length
	};
});
