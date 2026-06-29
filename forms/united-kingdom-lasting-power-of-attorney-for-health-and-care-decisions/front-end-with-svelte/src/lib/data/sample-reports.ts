import { createDefaultApplication } from '$lib/stores/lpa.svelte';
import { calculateLpaValidity } from '$lib/engine/composite-validator';
import type {
	Attorney,
	CertificateProvider,
	LpaApplication,
	Signature,
	ValidityStatus
} from '$lib/engine/types';

/** A sample LP1H application keyed by its registration reference. */
export interface SampleLpa {
	id: string;
	application: LpaApplication;
}

/** A derived dashboard row produced by running the validity engine over a sample. */
export interface DashboardRow {
	id: string;
	donorName: string;
	jurisdiction: string;
	attorneyCount: number;
	decisionRule: string;
	validityStatus: ValidityStatus;
	completenessScore: number;
	flagCount: number;
}

function attorney(
	givenNames: string,
	familyName: string,
	birthDate: string,
	relationship: Attorney['relationshipToDonor']
): Attorney {
	return {
		title: '',
		givenNames,
		familyName,
		birthDate,
		email: '',
		phone: '',
		postalAddressAsFullText: `${givenNames} ${familyName}, Cardiff`,
		countryAsIso31661Alpha2: 'GB',
		postcode: 'CF10 1AA',
		relationshipToDonor: relationship,
		isBankrupt: 'no',
		capacityDeclared: 'yes'
	};
}

function skillBasedCertificateProvider(): CertificateProvider {
	return {
		title: 'Dr',
		givenNames: 'Helen',
		familyName: 'Morgan',
		email: 'h.morgan@example.nhs.uk',
		phone: '',
		postalAddressAsFullText: 'Heath Surgery, Cardiff',
		countryAsIso31661Alpha2: 'GB',
		postcode: 'CF14 4XW',
		route: 'skill-based',
		profession: 'general-practitioner',
		professionRegistrationNumber: 'GMC-1234567',
		yearsKnownDonor: null,
		relationshipToDonor: 'professional',
		declaredNotFamily: 'yes',
		declaredNotEmployee: 'yes',
		declaredNotAttorney: 'yes'
	};
}

function donorSignature(): Signature {
	return {
		signerRole: 'donor',
		signerIndex: 0,
		signedAt: '2026-03-01T10:00:00Z',
		signatureMethod: 'wet-ink',
		witnessName: 'Olwen Rees',
		witnessAddress: '7 Park Place, Cardiff',
		witnessSignedAt: '2026-03-01T10:05:00Z',
		witnessIsAttorney: 'no'
	};
}

function cpSignature(): Signature {
	return {
		signerRole: 'certificate-provider',
		signerIndex: 0,
		signedAt: '2026-03-02T10:00:00Z',
		signatureMethod: 'wet-ink',
		witnessName: 'Gareth Lloyd',
		witnessAddress: '12 High Street, Cardiff',
		witnessSignedAt: '2026-03-02T10:05:00Z',
		witnessIsAttorney: 'no'
	};
}

function attorneySignature(index: number): Signature {
	return {
		signerRole: 'attorney',
		signerIndex: index,
		signedAt: '2026-03-03T10:00:00Z',
		signatureMethod: 'wet-ink',
		witnessName: 'Olwen Rees',
		witnessAddress: '7 Park Place, Cardiff',
		witnessSignedAt: '2026-03-03T10:05:00Z',
		witnessIsAttorney: 'no'
	};
}

/** A fully completed, statutorily valid LP1H application (ready to register). */
function validApplication(): LpaApplication {
	const app = createDefaultApplication();
	app.jurisdiction = 'wales';
	app.donor = {
		...app.donor,
		title: 'Mrs',
		givenNames: 'Angharad',
		familyName: 'Pritchard',
		birthDate: '1955-06-12',
		postalAddressAsFullText: '24 Cathedral Road, Cardiff',
		countryAsIso31661Alpha2: 'GB',
		postcode: 'CF11 9LJ',
		jurisdiction: 'wales',
		preferredLanguage: 'cy',
		capacityDeclared: 'yes',
		capacityDeclaredAt: '2026-03-01T10:00:00Z'
	};
	app.attorneys = [
		attorney('Rhys', 'Pritchard', '1980-02-03', 'child'),
		attorney('Carys', 'Davies', '1982-09-21', 'child')
	];
	app.decisionRule = 'jointly-and-severally';
	app.certificateProvider = skillBasedCertificateProvider();
	app.lstChoice = 'option-a';
	app.lstDonorInitialled = 'yes';
	app.signatures = [donorSignature(), cpSignature(), attorneySignature(0), attorneySignature(1)];
	app.registration = {
		...app.registration,
		applicantRole: 'donor',
		applicantSignedAt: '2026-03-04T10:00:00Z',
		feeAmountPounds: 82,
		feeRemission: 'none',
		feeRemissionReason: '',
		submittedAt: '2026-03-05T10:00:00Z',
		submissionChannel: 'post'
	};
	return app;
}

// LPA-2026-0001 — complete and valid (ready to register).
const sample1 = validApplication();

// LPA-2026-0002 — needs correction: skill-based CP missing registration number.
const sample2 = validApplication();
sample2.jurisdiction = 'england';
sample2.donor = {
	...sample2.donor,
	title: 'Mr',
	givenNames: 'Benedict',
	familyName: 'Okafor',
	birthDate: '1948-01-30',
	jurisdiction: 'england',
	preferredLanguage: 'en',
	postalAddressAsFullText: '5 Elm Grove, Bristol',
	postcode: 'BS6 6RD'
};
sample2.attorneys = [
	attorney('Ada', 'Okafor', '1975-05-05', 'child'),
	attorney('Chidi', 'Okafor', '1978-11-11', 'child'),
	attorney('Ngozi', 'Okafor', '1981-03-03', 'child')
];
sample2.decisionRule = 'jointly';
sample2.certificateProvider = {
	...skillBasedCertificateProvider(),
	professionRegistrationNumber: ''
};
sample2.signatures = [
	donorSignature(),
	cpSignature(),
	attorneySignature(0),
	attorneySignature(1),
	attorneySignature(2)
];

// LPA-2026-0003 — invalid: no life-sustaining-treatment choice, no certificate provider.
const sample3 = validApplication();
sample3.jurisdiction = 'wales';
sample3.donor = {
	...sample3.donor,
	title: 'Ms',
	givenNames: 'Catrin',
	familyName: 'Davies',
	birthDate: '1962-07-19',
	jurisdiction: 'wales',
	postalAddressAsFullText: '88 Bridge Street, Swansea',
	postcode: 'SA1 1TY'
};
sample3.attorneys = [attorney('Iwan', 'Davies', '1990-04-04', 'child')];
sample3.certificateProvider = null;
sample3.lstChoice = '';
sample3.lstDonorInitialled = '';
sample3.signatures = [donorSignature()];

// LPA-2026-0004 — complete and valid, four attorneys, mixed decision rule.
const sample4 = validApplication();
sample4.jurisdiction = 'england';
sample4.donor = {
	...sample4.donor,
	title: 'Mr',
	givenNames: 'David',
	familyName: 'Smith',
	birthDate: '1940-12-01',
	jurisdiction: 'england',
	preferredLanguage: 'en',
	postalAddressAsFullText: '3 Orchard Close, Exeter',
	postcode: 'EX4 6QT'
};
sample4.attorneys = [
	attorney('Emma', 'Smith', '1968-08-08', 'child'),
	attorney('Frank', 'Smith', '1970-10-10', 'child'),
	attorney('Grace', 'Smith', '1972-02-02', 'child'),
	attorney('Henry', 'Smith', '1974-06-06', 'child')
];
sample4.decisionRule = 'mixed';
sample4.jointDecisionSet = 'Decisions about where the donor lives must be made jointly.';
sample4.signatures = [
	donorSignature(),
	cpSignature(),
	attorneySignature(0),
	attorneySignature(1),
	attorneySignature(2),
	attorneySignature(3)
];

/** The seed LP1H applications, keyed by registration reference. */
export const sampleLpas: SampleLpa[] = [
	{ id: 'LPA-2026-0001', application: sample1 },
	{ id: 'LPA-2026-0002', application: sample2 },
	{ id: 'LPA-2026-0003', application: sample3 },
	{ id: 'LPA-2026-0004', application: sample4 }
];

/** Dashboard rows derived by running the validity engine over each sample. */
export const sampleLpaRows: DashboardRow[] = sampleLpas.map(({ id, application }) => {
	const validity = calculateLpaValidity(application);
	return {
		id,
		donorName: `${application.donor.givenNames} ${application.donor.familyName}`.trim(),
		jurisdiction: application.donor.jurisdiction,
		attorneyCount: application.attorneys.length,
		decisionRule: application.decisionRule,
		validityStatus: validity.validityStatus,
		completenessScore: validity.completenessScore,
		flagCount: validity.firedRules.length + validity.additionalFlags.length
	};
});
