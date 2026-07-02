import type { DeathCertificate, ValidityClass } from '$lib/engine/types';
import { validateCertificate } from '$lib/engine/mccd-grader';
import { createDefaultCertificate } from '$lib/stores/assessment.svelte';

/** A sample certificate: an identifier and the full data the engine grades. */
export interface SampleCertificate {
	id: string;
	deceasedName: string;
	certifyingDoctorName: string;
	certifiedDate: string;
	data: DeathCertificate;
}

/** A row in the clinician dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	patientIdentifier: string;
	deceasedName: string;
	certifyingDoctorName: string;
	validityClass: ValidityClass;
	underlyingCause: string;
	flagCount: number;
	certifiedDate: string;
}

/** Valid — complete Part I sequence, scrutinised, no referral criterion. */
function validCertificate(): DeathCertificate {
	const d = createDefaultCertificate();
	d.certification = {
		certifyingDoctorName: 'Dr R. Okafor',
		certifyingDoctorGrade: 'consultant',
		gmcReference: '7654321',
		placeOfCertification: 'St. Mary’s Hospital',
		certificationDate: '2026-06-20',
		attendedDeceased: 'yes',
		lastSeenAliveDate: '2026-06-18'
	};
	d.deceased = {
		deceasedName: 'Ellis, Margaret',
		sex: 'female',
		dateOfBirth: '1943-02-11',
		ageYears: 83,
		patientIdentifier: '943 476 5919'
	};
	d.death = {
		dateOfDeath: '2026-06-19',
		timeOfDeath: '04:20',
		placeOfDeath: 'Ward 7, St. Mary’s Hospital',
		seenAfterDeathBy: 'certifier'
	};
	d.partI = {
		causeIaCondition: 'Bronchopneumonia',
		causeIaInterval: '3 days',
		causeIbCondition: 'Chronic obstructive pulmonary disease',
		causeIbInterval: '12 years',
		causeIcCondition: '',
		causeIcInterval: ''
	};
	d.partII = {
		partIiConditions: 'Type 2 diabetes mellitus',
		partIiInterval: '20 years'
	};
	d.referral = {
		referredToCoroner: 'no',
		coronerReason: 'none',
		medicalExaminerStatus: 'scrutinised',
		certifierNote: 'Death expected; palliative care in place.'
	};
	return d;
}

/** Incomplete — the only cause given is a bare "mode of death"; not yet scrutinised. */
function incompleteCertificate(): DeathCertificate {
	const d = createDefaultCertificate();
	d.certification = {
		certifyingDoctorName: 'Dr F. Ahmed',
		certifyingDoctorGrade: 'registrar',
		gmcReference: '5551234',
		placeOfCertification: 'General Infirmary',
		certificationDate: '2026-06-22',
		attendedDeceased: 'yes',
		lastSeenAliveDate: '2026-06-21'
	};
	d.deceased = {
		deceasedName: 'Nowak, Piotr',
		sex: 'male',
		dateOfBirth: '1951-09-30',
		ageYears: 74,
		patientIdentifier: '611 209 3344'
	};
	d.death = {
		dateOfDeath: '2026-06-22',
		timeOfDeath: '18:45',
		placeOfDeath: 'Coronary care unit',
		seenAfterDeathBy: 'certifier'
	};
	d.partI = {
		causeIaCondition: 'Cardiac arrest',
		causeIaInterval: 'minutes',
		causeIbCondition: '',
		causeIbInterval: '',
		causeIcCondition: '',
		causeIcInterval: ''
	};
	d.partII = {
		partIiConditions: '',
		partIiInterval: ''
	};
	d.referral = {
		referredToCoroner: 'no',
		coronerReason: 'none',
		medicalExaminerStatus: 'pending',
		certifierNote: 'Awaiting statement of the underlying disease.'
	};
	return d;
}

/** Refer to coroner — an unnatural death; referral takes precedence. */
function coronerCertificate(): DeathCertificate {
	const d = createDefaultCertificate();
	d.certification = {
		certifyingDoctorName: 'Dr P. Nowak',
		certifyingDoctorGrade: 'consultant',
		gmcReference: '9998887',
		placeOfCertification: 'Emergency department',
		certificationDate: '2026-06-26',
		attendedDeceased: 'no',
		lastSeenAliveDate: null
	};
	d.deceased = {
		deceasedName: 'Okafor, Chidi',
		sex: 'male',
		dateOfBirth: '1989-04-02',
		ageYears: 37,
		patientIdentifier: '778 334 1090'
	};
	d.death = {
		dateOfDeath: '2026-06-26',
		timeOfDeath: '02:15',
		placeOfDeath: 'Emergency department',
		seenAfterDeathBy: 'another-practitioner'
	};
	d.partI = {
		causeIaCondition: 'Multiple traumatic injuries',
		causeIaInterval: 'immediate',
		causeIbCondition: 'Road traffic collision',
		causeIbInterval: 'immediate',
		causeIcCondition: '',
		causeIcInterval: ''
	};
	d.partII = {
		partIiConditions: '',
		partIiInterval: ''
	};
	d.referral = {
		referredToCoroner: 'yes',
		coronerReason: 'unnatural',
		medicalExaminerStatus: 'not-required',
		certifierNote: 'Referred to the coroner; MCCD not to be issued pending investigation.'
	};
	return d;
}

/** Refer to coroner — industrial disease, but otherwise a complete sequence. */
function coronerIndustrialCertificate(): DeathCertificate {
	const d = createDefaultCertificate();
	d.certification = {
		certifyingDoctorName: 'Dr S. Patel',
		certifyingDoctorGrade: 'gp',
		gmcReference: '3332221',
		placeOfCertification: 'The Grange Surgery',
		certificationDate: '2026-06-27',
		attendedDeceased: 'yes',
		lastSeenAliveDate: '2026-06-25'
	};
	d.deceased = {
		deceasedName: 'Fletcher, Rosemary',
		sex: 'female',
		dateOfBirth: '1948-12-14',
		ageYears: 77,
		patientIdentifier: '120 998 4471'
	};
	d.death = {
		dateOfDeath: '2026-06-27',
		timeOfDeath: '09:10',
		placeOfDeath: 'Home',
		seenAfterDeathBy: 'certifier'
	};
	d.partI = {
		causeIaCondition: 'Malignant mesothelioma',
		causeIaInterval: '14 months',
		causeIbCondition: 'Occupational asbestos exposure',
		causeIbInterval: '40 years',
		causeIcCondition: '',
		causeIcInterval: ''
	};
	d.partII = {
		partIiConditions: 'Chronic ischaemic heart disease',
		partIiInterval: '9 years'
	};
	d.referral = {
		referredToCoroner: 'no',
		coronerReason: 'industrial-disease',
		medicalExaminerStatus: 'discussed',
		certifierNote: 'Industrial disease — reportable to the coroner.'
	};
	return d;
}

/** The sample certificates, keyed by stable id (used to seed the wizard). */
export const sampleCertificates: SampleCertificate[] = [
	{
		id: 'MCCD-2026-0001',
		deceasedName: 'Ellis, Margaret',
		certifyingDoctorName: 'Dr R. Okafor',
		certifiedDate: '2026-06-20',
		data: validCertificate()
	},
	{
		id: 'MCCD-2026-0002',
		deceasedName: 'Nowak, Piotr',
		certifyingDoctorName: 'Dr F. Ahmed',
		certifiedDate: '2026-06-22',
		data: incompleteCertificate()
	},
	{
		id: 'MCCD-2026-0003',
		deceasedName: 'Okafor, Chidi',
		certifyingDoctorName: 'Dr P. Nowak',
		certifiedDate: '2026-06-26',
		data: coronerCertificate()
	},
	{
		id: 'MCCD-2026-0004',
		deceasedName: 'Fletcher, Rosemary',
		certifyingDoctorName: 'Dr S. Patel',
		certifiedDate: '2026-06-27',
		data: coronerIndustrialCertificate()
	}
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleCertificateRows: DashboardRow[] = sampleCertificates.map((s) => {
	const r = validateCertificate(s.data);
	return {
		id: s.id,
		patientIdentifier: s.data.deceased.patientIdentifier,
		deceasedName: s.deceasedName,
		certifyingDoctorName: s.certifyingDoctorName,
		validityClass: r.validityClass,
		underlyingCause: r.underlyingCause,
		flagCount: r.flaggedIssues.length,
		certifiedDate: s.certifiedDate
	};
});
