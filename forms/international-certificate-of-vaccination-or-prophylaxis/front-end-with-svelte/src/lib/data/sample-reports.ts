import type { Certificate } from '$lib/engine/types';
import { validateCertificate } from '$lib/engine/validation-rules';
import { createDefaultCertificate } from '$lib/stores/certificate.svelte';
import { overallValidityStatus, type ValidityStatus } from '$lib/engine/utils';

/** A sample certificate: an identifier plus the full data the engine validates. */
export interface SampleCertificate {
	id: string;
	vaccineeName: string;
	issuedDate: string;
	data: Certificate;
}

/** A row in the registry dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	vaccineeName: string;
	centre: string;
	issuingCountry: string;
	primaryDisease: string;
	entriesCount: number;
	vaccinationDate: string;
	validityStatus: ValidityStatus;
	errorCount: number;
	warningCount: number;
}

/** Add `days` calendar days to an ISO date string. */
function addDays(date: string, days: number): string {
	const d = new Date(`${date}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}

/** A clean, valid yellow-fever certificate (lifetime validity, fully signed and stamped). */
function validYellowFever(): Certificate {
	const c = createDefaultCertificate();
	c.center = { name: 'St Pancras Travel Clinic', whoDesignationReference: 'GBR-YF-014', countryAsIso31661Alpha3: 'GBR', uniformStampImageDataUrl: 'data:image/png;base64,stamp' };
	c.clinician = { name: 'Dr A. Lovelace', professionalStatus: 'MD', registrationBody: 'GMC', registrationNumber: '7654321', signatureImageDataUrl: 'data:image/png;base64,sig' };
	c.patient = { ...c.patient, surname: 'Lovelace', givenNames: 'Ada', birthDate: '1990-12-10', sex: 'female', nationalityAsIso31661Alpha3: 'GBR', travelDocumentKind: 'passport', travelDocumentNumber: 'GBR123456', consentedToDataSharing: 'yes' };
	c.destinationCountriesAsIso31661Alpha3 = 'KEN TZA';
	c.plannedArrivalDate = '2026-03-01';
	c.purposeOfTravel = 'tourism';
	c.entries = [
		{
			...c.entries[0],
			disease: 'yellow-fever',
			vaccineOrProphylaxisName: 'Stamaril',
			manufacturer: 'Sanofi',
			batchNumber: 'YF-K2391',
			route: 'subcutaneous',
			anatomicalSite: 'left-deltoid',
			doseAmountValue: 0.5,
			doseAmountUnit: 'mL',
			vaccinationDate: '2026-02-12',
			vaccinationTime: '11:24',
			administeringClinicianSignatureDataUrl: 'data:image/png;base64,sig',
			administeringClinicianProfessionalStatus: 'RN',
			validityStartsOn: addDays('2026-02-12', 10),
			validityEndsOn: '',
			validityIsLifetime: 'yes',
			centreStampImageDataUrl: 'data:image/png;base64,stamp',
			centreStampApplied: 'yes'
		}
	];
	return c;
}

/** A valid polio certificate with an explicit one-year validity end date. */
function validPolio(): Certificate {
	const c = createDefaultCertificate();
	c.center = { name: 'Bamako Travel Clinic', whoDesignationReference: 'MLI-PV-002', countryAsIso31661Alpha3: 'MLI', uniformStampImageDataUrl: 'data:image/png;base64,stamp' };
	c.clinician = { name: 'Dr I. Diallo', professionalStatus: 'MD', registrationBody: 'CNOM', registrationNumber: 'ML-4188', signatureImageDataUrl: 'data:image/png;base64,sig' };
	c.patient = { ...c.patient, surname: 'Diallo', givenNames: 'Idrissa', birthDate: '1985-06-02', sex: 'male', nationalityAsIso31661Alpha3: 'MLI', travelDocumentKind: 'passport', travelDocumentNumber: 'MLI778812', consentedToDataSharing: 'yes' };
	c.destinationCountriesAsIso31661Alpha3 = 'FRA';
	c.plannedArrivalDate = '2026-03-15';
	c.purposeOfTravel = 'business';
	c.entries = [
		{
			...c.entries[0],
			disease: 'polio',
			vaccineOrProphylaxisName: 'IPV',
			manufacturer: 'GSK',
			batchNumber: 'PV-D4188',
			route: 'intramuscular',
			anatomicalSite: 'right-deltoid',
			doseAmountValue: 0.5,
			doseAmountUnit: 'mL',
			vaccinationDate: '2026-02-19',
			vaccinationTime: '08:00',
			administeringClinicianSignatureDataUrl: 'data:image/png;base64,sig',
			administeringClinicianProfessionalStatus: 'RN',
			validityStartsOn: '2026-02-19',
			validityEndsOn: '2027-02-19',
			validityIsLifetime: 'no',
			centreStampImageDataUrl: 'data:image/png;base64,stamp',
			centreStampApplied: 'yes'
		}
	];
	return c;
}

/** An invalid certificate: missing manufacturer/batch, missing clinician signature and stamp. */
function invalidIncomplete(): Certificate {
	const c = createDefaultCertificate();
	c.center = { name: 'Stockholm Vaccination Centre', whoDesignationReference: '', countryAsIso31661Alpha3: 'SWE', uniformStampImageDataUrl: '' };
	c.clinician = { name: 'Dr S. Lindqvist', professionalStatus: 'MD', registrationBody: '', registrationNumber: '', signatureImageDataUrl: '' };
	c.patient = { ...c.patient, surname: 'Lindqvist', givenNames: 'Sara', birthDate: '1995-09-09', sex: 'female', nationalityAsIso31661Alpha3: 'SWE', travelDocumentKind: 'passport', travelDocumentNumber: 'SWE551020' };
	c.destinationCountriesAsIso31661Alpha3 = 'BRA';
	c.purposeOfTravel = 'tourism';
	c.entries = [
		{
			...c.entries[0],
			disease: 'yellow-fever',
			vaccineOrProphylaxisName: 'Stamaril',
			manufacturer: '',
			batchNumber: '',
			route: 'subcutaneous',
			anatomicalSite: 'left-deltoid',
			vaccinationDate: '2026-05-09',
			validityStartsOn: addDays('2026-05-09', 10),
			validityIsLifetime: 'yes',
			centreStampImageDataUrl: '',
			centreStampApplied: ''
		}
	];
	return c;
}

/** A valid two-entry certificate (COVID-19 + yellow fever) with a declared pregnancy warning. */
function validWithWarning(): Certificate {
	const c = createDefaultCertificate();
	c.center = { name: 'Osaka International Clinic', whoDesignationReference: 'JPN-YF-031', countryAsIso31661Alpha3: 'JPN', uniformStampImageDataUrl: 'data:image/png;base64,stamp' };
	c.clinician = { name: 'Dr Y. Sato', professionalStatus: 'MD', registrationBody: 'JMA', registrationNumber: 'JP-2202', signatureImageDataUrl: 'data:image/png;base64,sig' };
	c.patient = { ...c.patient, surname: 'Sato', givenNames: 'Yuki', birthDate: '1992-04-18', sex: 'female', nationalityAsIso31661Alpha3: 'JPN', travelDocumentKind: 'passport', travelDocumentNumber: 'JPN220211', consentedToDataSharing: 'yes' };
	c.destinationCountriesAsIso31661Alpha3 = 'KEN';
	c.plannedArrivalDate = '2026-04-10';
	c.purposeOfTravel = 'humanitarian';
	c.declaredPregnancy = 'yes';
	c.entries = [
		{
			...c.entries[0],
			disease: 'covid-19',
			vaccineOrProphylaxisName: 'Comirnaty',
			manufacturer: 'Pfizer-BioNTech',
			batchNumber: 'CO-PFI-2202',
			route: 'intramuscular',
			anatomicalSite: 'left-deltoid',
			doseAmountValue: 0.3,
			doseAmountUnit: 'mL',
			vaccinationDate: '2026-03-12',
			administeringClinicianSignatureDataUrl: 'data:image/png;base64,sig',
			administeringClinicianProfessionalStatus: 'RN',
			validityStartsOn: '2026-03-12',
			validityEndsOn: '2027-03-12',
			validityIsLifetime: 'no',
			centreStampImageDataUrl: 'data:image/png;base64,stamp',
			centreStampApplied: 'yes'
		}
	];
	return c;
}

/** The sample certificates, keyed by stable id (used to seed the wizard). */
export const sampleCertificates: SampleCertificate[] = [
	{ id: 'ICVP-2026-0001', vaccineeName: 'Lovelace, Ada', issuedDate: '2026-02-12', data: validYellowFever() },
	{ id: 'ICVP-2026-0002', vaccineeName: 'Diallo, Idrissa', issuedDate: '2026-02-19', data: validPolio() },
	{ id: 'ICVP-2026-0003', vaccineeName: 'Lindqvist, Sara', issuedDate: '2026-05-09', data: invalidIncomplete() },
	{ id: 'ICVP-2026-0004', vaccineeName: 'Sato, Yuki', issuedDate: '2026-03-12', data: validWithWarning() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleCertificateRows: DashboardRow[] = sampleCertificates.map((s) => {
	const report = validateCertificate(s.data);
	const first = s.data.entries[0];
	return {
		id: s.id,
		vaccineeName: s.vaccineeName,
		centre: s.data.center.name,
		issuingCountry: s.data.center.countryAsIso31661Alpha3,
		primaryDisease: first?.disease || '',
		entriesCount: s.data.entries.length,
		vaccinationDate: first?.vaccinationDate || '',
		validityStatus: overallValidityStatus(report.overallValid),
		errorCount: report.firedRules.filter((r) => r.severity === 'error').length,
		warningCount: report.firedRules.filter((r) => r.severity === 'warning').length
	};
});
