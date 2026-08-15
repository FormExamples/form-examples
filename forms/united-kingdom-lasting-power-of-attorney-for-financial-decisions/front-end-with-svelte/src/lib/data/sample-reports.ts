import type {
	Address,
	Attorney,
	CompositeRisk,
	DecisionMode,
	Lpa,
	LpaStatus,
	Person,
	PersonToNotify,
	ReplacementAttorney,
	ValidityBand,
	WhenAttorneysCanAct
} from '#lib/types.js';
import { createDefaultLpa } from '#lib/stores/lpa.svelte.js';
import { createEmptyPerson } from '#lib/factory.js';
import { validateLpa } from '#lib/validator/validator.js';

/** A sample LPA: a stable id, display metadata, and the full data the engine validates. */
export interface SampleLpa {
	id: string;
	createdAt: string;
	data: Lpa;
}

/** A row in the case dashboard, derived by running the shared validation engine. */
export interface DashboardRow {
	id: string;
	donorName: string;
	attorneyCount: number;
	decisionMode: DecisionMode;
	whenAttorneysCanAct: WhenAttorneysCanAct;
	replacementAttorneyCount: number;
	peopleToNotifyCount: number;
	validityBand: ValidityBand;
	compositeRisk: CompositeRisk;
	opgStatus: LpaStatus;
	opgReferenceNumber: string;
	createdAt: string;
}

function address(line1: string, line3: string, postcode: string): Address {
	return {
		addressLine1: line1,
		addressLine2: '',
		addressLine3: line3,
		postcode,
		countryAsIso3166_1Alpha2: 'GB'
	};
}

function person(
	id: string,
	title: string,
	firstNames: string,
	lastName: string,
	dateOfBirth: string,
	addr: Address,
	email = ''
): Person {
	return {
		...createEmptyPerson(),
		id,
		title,
		firstNames,
		lastName,
		dateOfBirth,
		email,
		address: addr
	};
}

function attorney(ordinal: number, p: Person): Attorney {
	return { ordinal, person: p };
}

function replacement(ordinal: number, p: Person): ReplacementAttorney {
	return { ordinal, person: p, replacementStepInCondition: '' };
}

function personToNotify(ordinal: number, p: Person): PersonToNotify {
	return { ordinal, person: p };
}

// 1. Fresh draft — only the donor entered.
function draftDonorOnly(): Lpa {
	const d = createDefaultLpa();
	d.id = 'lpa-0001';
	d.donor = person(
		'p-1-donor',
		'Mrs',
		'Margaret',
		'Thompson',
		'1948-07-12',
		address('14 Cherrywood Lane', 'Wokingham', 'RG40 2AA'),
		'margaret.thompson@example.co.uk'
	);
	d.status = 'draft';
	return d;
}

// 2. Single attorney, no replacement, no people to notify — ready for signing,
// fires SingleAttorneyNoReplacement + NoPeopleToNotify flags (moderate).
function readyForSigning(): Lpa {
	const d = createDefaultLpa();
	d.id = 'lpa-0002';
	d.donor = person(
		'p-2-donor',
		'Mr',
		'David',
		'Walker',
		'1955-03-04',
		address('27 Beechfield Road', 'Manchester', 'M14 7HQ'),
		'david.walker@example.co.uk'
	);
	d.attorneys = [
		attorney(
			1,
			person(
				'p-2-att-1',
				'Mrs',
				'Susan',
				'Walker',
				'1958-11-30',
				address('27 Beechfield Road', 'Manchester', 'M14 7HQ'),
				'susan.walker@example.co.uk'
			)
		)
	];
	d.decisionMode = 'single_attorney';
	d.whenAttorneysCanAct = 'as_soon_as_registered';
	d.certificateProvider = {
		person: person(
			'p-2-cp',
			'Dr',
			'Helen',
			'Rashid',
			'1972-02-19',
			address('5 Wilmslow Road', 'Manchester', 'M20 4QF'),
			'helen.rashid@example.nhs.uk'
		),
		knowsDonorAs: 'professional',
		isOverEighteen: true,
		readLpa: true,
		noRestrictionsOnActing: true,
		isRelatedToDonorOrAttorney: false,
		isCareHomeOwnerOrEmployee: false,
		eligibilityConfirmationAt: ''
	};
	d.preferencesText = 'Consult my sister before any property sale.';
	d.legalRightsAcknowledged = true;
	d.status = 'ready_for_signing';
	return d;
}

// 3. Registered — jointly and severally, two attorneys, a replacement, three
// people to notify. OPG reference assigned (band registered, risk low).
function registered(): Lpa {
	const d = createDefaultLpa();
	d.id = 'lpa-0003';
	d.donor = person(
		'p-3-donor',
		'Mr',
		'James',
		'Pemberton',
		'1942-09-21',
		address('42 Ashwood Close', 'Bristol', 'BS9 3RP'),
		'james.pemberton@example.co.uk'
	);
	d.attorneys = [
		attorney(
			1,
			person('p-3-att-1', 'Ms', 'Charlotte', 'Pemberton', '1971-06-04', address('8 Linden Avenue', 'Bath', 'BA2 5DU'), 'charlotte.pemberton@example.co.uk')
		),
		attorney(
			2,
			person('p-3-att-2', 'Mr', 'Edward', 'Pemberton', '1973-12-15', address('11 Granville Terrace', 'Bristol', 'BS6 7AB'), 'edward.pemberton@example.co.uk')
		)
	];
	d.replacementAttorneys = [
		replacement(
			1,
			person('p-3-rep-1', 'Mrs', 'Patricia', 'Holloway', '1969-03-22', address('3 Stoke Park Road', 'Bristol', 'BS9 1JS'), 'patricia.holloway@example.co.uk')
		)
	];
	d.peopleToNotify = [
		personToNotify(1, person('p-3-ptn-1', '', 'Robert', 'Pemberton', '', address('22 Brook Lane', 'Bristol', 'BS6 5DR'))),
		personToNotify(2, person('p-3-ptn-2', '', 'Eleanor', 'Pemberton', '', address('4 Oakfield Place', 'Bath', 'BA1 6PD'))),
		personToNotify(3, person('p-3-ptn-3', '', 'Michael', 'Carter', '', address('60 Park View', 'Bristol', 'BS7 9NG')))
	];
	d.decisionMode = 'jointly_and_severally';
	d.whenAttorneysCanAct = 'as_soon_as_registered';
	d.certificateProvider = {
		person: person('p-3-cp', 'Mr', 'Andrew', 'Sheridan', '1965-08-10', address('19 Whiteladies Road', 'Bristol', 'BS8 2LS'), 'andrew.sheridan@example.co.uk'),
		knowsDonorAs: 'professional',
		isOverEighteen: true,
		readLpa: true,
		noRestrictionsOnActing: true,
		isRelatedToDonorOrAttorney: false,
		isCareHomeOwnerOrEmployee: false,
		eligibilityConfirmationAt: ''
	};
	d.preferencesText = 'Attorneys to consult each other before any single transaction over £5,000.';
	d.legalRightsAcknowledged = true;
	d.status = 'registered';
	d.signedDate = '2026-02-02';
	d.opgReferenceNumber = 'OPG-2026-77412189';
	d.opgRegistrationDate = '2026-03-20';
	return d;
}

// 4. Attorney under 18 — fires AttorneyUnderEighteen blocker (critical).
function attorneyUnderEighteen(): Lpa {
	const d = createDefaultLpa();
	d.id = 'lpa-0004';
	d.donor = person(
		'p-4-donor',
		'Mr',
		'Peter',
		'Llewellyn',
		'1952-05-14',
		address('9 Castle Street', 'Cardiff', 'CF10 1BS'),
		'peter.llewellyn@example.co.uk'
	);
	d.attorneys = [
		attorney(1, person('p-4-att-1', 'Miss', 'Rhian', 'Llewellyn', '2010-08-04', address('9 Castle Street', 'Cardiff', 'CF10 1BS')))
	];
	d.decisionMode = 'single_attorney';
	d.whenAttorneysCanAct = 'as_soon_as_registered';
	d.signedDate = '2026-05-01';
	d.status = 'draft';
	return d;
}

// 5. Jointly without a replacement — fires JointlyButNoReplacement (critical).
function jointlyNoReplacement(): Lpa {
	const d = createDefaultLpa();
	d.id = 'lpa-0005';
	d.donor = person(
		'p-5-donor',
		'Mrs',
		'Elizabeth',
		'Forsyth',
		'1947-01-30',
		address('70 St Stephens Avenue', 'Edinburgh', 'EH3 5AD'),
		'elizabeth.forsyth@example.co.uk'
	);
	d.attorneys = [
		attorney(1, person('p-5-att-1', 'Mr', 'Iain', 'Forsyth', '1972-05-22', address('11 Comely Bank', 'Edinburgh', 'EH4 1AG'), 'iain.forsyth@example.co.uk')),
		attorney(2, person('p-5-att-2', 'Ms', 'Fiona', 'MacLeod', '1975-11-08', address('22 Bruntsfield Place', 'Edinburgh', 'EH10 4HJ'), 'fiona.macleod@example.co.uk'))
	];
	d.decisionMode = 'jointly';
	d.whenAttorneysCanAct = 'only_when_no_capacity';
	d.certificateProvider = {
		person: person('p-5-cp', 'Mr', 'Duncan', 'Reid', '1961-09-14', address('14 George Street', 'Edinburgh', 'EH2 2PF')),
		knowsDonorAs: 'friend',
		isOverEighteen: true,
		readLpa: true,
		noRestrictionsOnActing: true,
		isRelatedToDonorOrAttorney: false,
		isCareHomeOwnerOrEmployee: false,
		eligibilityConfirmationAt: ''
	};
	d.legalRightsAcknowledged = true;
	d.status = 'ready_for_signing';
	return d;
}

// 6. Submitted to OPG, reduced fee requested without LPA120A evidence — fires
// ReducedFeeWithoutLPA120A (high flag).
function submittedReducedFee(): Lpa {
	const d = createDefaultLpa();
	d.id = 'lpa-0006';
	d.donor = person(
		'p-6-donor',
		'Mr',
		'Frank',
		'Doherty',
		'1953-04-17',
		address('5 Riverside Walk', 'Newcastle upon Tyne', 'NE1 3DX'),
		'frank.doherty@example.co.uk'
	);
	d.attorneys = [
		attorney(1, person('p-6-att-1', 'Mrs', 'Sarah', 'Doherty', '1980-07-04', address('9 Heaton Park View', 'Newcastle upon Tyne', 'NE6 5AF'), 'sarah.doherty@example.co.uk')),
		attorney(2, person('p-6-att-2', 'Mr', 'Liam', 'Doherty', '1982-11-12', address('20 Jesmond Vale', 'Newcastle upon Tyne', 'NE2 1NN'), 'liam.doherty@example.co.uk'))
	];
	d.replacementAttorneys = [
		replacement(1, person('p-6-rep-1', 'Ms', 'Bridget', 'O’Connor', '1978-03-08', address('30 Acorn Road', 'Newcastle upon Tyne', 'NE2 2DJ'), 'bridget.oconnor@example.co.uk'))
	];
	d.peopleToNotify = [
		personToNotify(1, person('p-6-ptn-1', '', 'Maureen', 'Doherty', '', address('2 Heaton Road', 'Newcastle upon Tyne', 'NE6 1SD')))
	];
	d.decisionMode = 'jointly_and_severally';
	d.whenAttorneysCanAct = 'as_soon_as_registered';
	d.certificateProvider = {
		person: person('p-6-cp', 'Mr', 'Stephen', 'Mitchell', '1959-06-02', address('11 Grey Street', 'Newcastle upon Tyne', 'NE1 6EF')),
		knowsDonorAs: 'friend',
		isOverEighteen: true,
		readLpa: true,
		noRestrictionsOnActing: true,
		isRelatedToDonorOrAttorney: false,
		isCareHomeOwnerOrEmployee: false,
		eligibilityConfirmationAt: ''
	};
	d.legalRightsAcknowledged = true;
	d.signedDate = '2026-03-15';
	d.registrationApplication = {
		...d.registrationApplication,
		applicantKind: 'donor',
		paymentMethod: 'card',
		cardPaymentPhone: '0191 555 0182',
		reducedFeeRequested: true,
		hasLpa120aEvidence: false,
		paymentAmount: 41
	};
	d.status = 'submitted';
	return d;
}

/** The sample LPAs, keyed by stable id (used to seed the wizard). */
export const sampleLpas: SampleLpa[] = [
	{ id: 'lpa-0001', createdAt: '2026-05-10', data: draftDonorOnly() },
	{ id: 'lpa-0002', createdAt: '2026-04-22', data: readyForSigning() },
	{ id: 'lpa-0003', createdAt: '2026-03-15', data: registered() },
	{ id: 'lpa-0004', createdAt: '2026-05-01', data: attorneyUnderEighteen() },
	{ id: 'lpa-0005', createdAt: '2026-04-29', data: jointlyNoReplacement() },
	{ id: 'lpa-0006', createdAt: '2026-02-18', data: submittedReducedFee() }
];

/** Look up a sample LPA's full data by id. */
export function findSampleLpa(id: string): Lpa | undefined {
	return sampleLpas.find((s) => s.id === id)?.data;
}

function donorName(d: Lpa): string {
	const name = [d.donor.title, d.donor.firstNames, d.donor.lastName]
		.filter((s) => s && s.length > 0)
		.join(' ')
		.trim();
	return name || '(unnamed donor)';
}

/** Dashboard rows derived by running the shared validation engine over each sample. */
export const sampleLpaRows: DashboardRow[] = sampleLpas.map((s) => {
	const v = validateLpa(s.data);
	return {
		id: s.id,
		donorName: donorName(s.data),
		attorneyCount: s.data.attorneys.length,
		decisionMode: s.data.decisionMode,
		whenAttorneysCanAct: s.data.whenAttorneysCanAct,
		replacementAttorneyCount: s.data.replacementAttorneys.length,
		peopleToNotifyCount: s.data.peopleToNotify.length,
		validityBand: v.validityBand,
		compositeRisk: v.compositeRisk,
		opgStatus: s.data.status,
		opgReferenceNumber: s.data.opgReferenceNumber,
		createdAt: s.createdAt
	};
});
