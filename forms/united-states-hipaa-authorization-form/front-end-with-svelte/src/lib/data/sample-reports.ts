import type { HipaaAuthorization, PrimaryPurpose, ValidityStatus } from '$lib/engine/types';
import { validateAuthorization } from '$lib/engine/validate-authorization';
import { createDefaultAuthorization } from '$lib/stores/authorization.svelte';
import { recordCategoryLabels } from '$lib/engine/utils';

/** A sample authorization: an identifier and the full data the engine validates. */
export interface SampleAuthorization {
	id: string;
	patientName: string;
	signedDate: string;
	data: HipaaAuthorization;
}

/** A row in the dashboard, derived by running the shared validity engine. */
export interface DashboardRow {
	id: string;
	patientName: string;
	recipientOrganization: string;
	primaryPurpose: PrimaryPurpose;
	categories: string;
	validityStatus: ValidityStatus;
	completenessScore: number;
	highFlagCount: number;
	flagCount: number;
}

/** Apply the patient-rights acknowledgements (all confirmed). */
function acknowledgeAll(a: HipaaAuthorization): void {
	a.patientRightsAcknowledgement = {
		...a.patientRightsAcknowledgement,
		acknowledgedRightToRevoke: 'yes',
		acknowledgedNoConditioning: 'yes',
		acknowledgedRedisclosureWarning: 'yes',
		acknowledgedRightToCopy: 'yes'
	};
}

/** A fully-valid eligibility-determination authorization (medical + mental health). */
function validEligibility(): HipaaAuthorization {
	const a = createDefaultAuthorization();
	a.patient = { ...a.patient, name: 'Alice Anderson', birthDate: '1972-03-04', streetAddress: '12 Oak St', city: 'Nashville', state: 'TN', zipCode: '37011', phone: '615-555-0101' };
	a.signer = { ...a.signer, relationship: 'self' };
	a.disclosingSource = { ...a.disclosingSource, identificationMode: 'class', classDescription: 'All hospitals and clinics that treated me from 2020 to today.' };
	a.authorizedRecipient = { ...a.authorizedRecipient, recipientName: 'Eligibility Unit', recipientOrganization: 'Tennessee Department of Human Services' };
	a.recordsToDisclose = { ...a.recordsToDisclose, includeMedicalHealth: 'yes', medicalHealthInitials: 'AA', includeMentalHealth: 'yes', mentalHealthInitials: 'AA' };
	a.purposeOfDisclosure = { ...a.purposeOfDisclosure, primaryPurpose: 'eligibility-determination' };
	a.expiration = { ...a.expiration, kind: 'date', expirationDate: '2027-05-18' };
	acknowledgeAll(a);
	a.signatureWitness = { ...a.signatureWitness, individualSignatureConfirmed: 'yes', signatureDate: '2026-05-18', witnessName: 'C. Carter', witnessSignatureConfirmed: 'yes', witnessDate: '2026-05-18' };
	return a;
}

/** An invalid authorization: substance-use records without the 42 CFR Part 2 notice/initials. */
function invalidSubstanceUse(): HipaaAuthorization {
	const a = createDefaultAuthorization();
	a.patient = { ...a.patient, name: 'Bob Brown', birthDate: '1985-11-20', streetAddress: '88 Pine Ave', city: 'Philadelphia', state: 'PA', zipCode: '19103', phone: '215-555-0144' };
	a.signer = { ...a.signer, relationship: 'self' };
	a.disclosingSource = { ...a.disclosingSource, identificationMode: 'specific', specificPersonsOrOrganizations: 'Riverside Recovery Center' };
	a.authorizedRecipient = { ...a.authorizedRecipient, recipientName: 'Claims', recipientOrganization: 'Pennsylvania DHS' };
	a.recordsToDisclose = { ...a.recordsToDisclose, includeMedicalHealth: 'yes', medicalHealthInitials: 'BB', includeSubstanceUse: 'yes' };
	a.purposeOfDisclosure = { ...a.purposeOfDisclosure, primaryPurpose: 'continuing-treatment' };
	a.expiration = { ...a.expiration, kind: 'event', expirationEvent: 'Conclusion of treatment' };
	acknowledgeAll(a);
	a.signatureWitness = { ...a.signatureWitness, individualSignatureConfirmed: 'yes', signatureDate: '2026-01-04' };
	return a;
}

/** A fully-valid insurance-claim authorization (medical health only). */
function validInsuranceClaim(): HipaaAuthorization {
	const a = createDefaultAuthorization();
	a.patient = { ...a.patient, name: 'Carla Castillo', birthDate: '1990-07-15', streetAddress: '5 Maple Rd', city: 'Austin', state: 'TX', zipCode: '78701', phone: '512-555-0199' };
	a.signer = { ...a.signer, relationship: 'self' };
	a.disclosingSource = { ...a.disclosingSource, identificationMode: 'specific', specificPersonsOrOrganizations: 'Dr. Lopez, Family Medicine' };
	a.authorizedRecipient = { ...a.authorizedRecipient, recipientName: 'Claims Dept', recipientOrganization: 'Acme Insurance Co.' };
	a.recordsToDisclose = { ...a.recordsToDisclose, includeMedicalHealth: 'yes', medicalHealthInitials: 'CC', otherDescription: 'Discharge summary for 2026 admission.' };
	a.purposeOfDisclosure = { ...a.purposeOfDisclosure, primaryPurpose: 'insurance-claim' };
	a.expiration = { ...a.expiration, kind: 'date', expirationDate: '2026-12-31' };
	acknowledgeAll(a);
	a.signatureWitness = { ...a.signatureWitness, individualSignatureConfirmed: 'yes', signatureDate: '2026-04-12' };
	return a;
}

/** An invalid authorization: HIV/AIDS records without state consent or initials. */
function invalidHivAids(): HipaaAuthorization {
	const a = createDefaultAuthorization();
	a.patient = { ...a.patient, name: 'David Diallo', birthDate: '1968-02-09', streetAddress: '300 Elm Blvd', city: 'Memphis', state: 'TN', zipCode: '38103', phone: '901-555-0170' };
	a.signer = { ...a.signer, relationship: 'guardian', representativeName: 'Dana Diallo' };
	// representativeAuthorityDescription intentionally left empty → fires representative-authority.
	a.disclosingSource = { ...a.disclosingSource, identificationMode: 'specific', specificPersonsOrOrganizations: 'Memorial Hospital' };
	a.authorizedRecipient = { ...a.authorizedRecipient, recipientName: 'Records', recipientOrganization: 'Memorial Hospital' };
	a.recordsToDisclose = { ...a.recordsToDisclose, includeMedicalHealth: 'yes', medicalHealthInitials: 'DD', includeHivAids: 'yes' };
	a.purposeOfDisclosure = { ...a.purposeOfDisclosure, primaryPurpose: 'continuing-treatment' };
	a.expiration = { ...a.expiration, kind: 'date', expirationDate: '2026-09-30' };
	acknowledgeAll(a);
	a.signatureWitness = { ...a.signatureWitness, individualSignatureConfirmed: 'yes', signatureDate: '2026-03-30' };
	return a;
}

/** The sample authorizations, keyed by stable id (used to seed the wizard). */
export const sampleAuthorizations: SampleAuthorization[] = [
	{ id: 'HIPAA-2026-0001', patientName: 'Anderson, Alice', signedDate: '2026-05-18', data: validEligibility() },
	{ id: 'HIPAA-2026-0002', patientName: 'Brown, Bob', signedDate: '2026-01-04', data: invalidSubstanceUse() },
	{ id: 'HIPAA-2026-0003', patientName: 'Castillo, Carla', signedDate: '2026-04-12', data: validInsuranceClaim() },
	{ id: 'HIPAA-2026-0004', patientName: 'Diallo, David', signedDate: '2026-03-30', data: invalidHivAids() }
];

/** Dashboard rows derived by running the shared validity engine over each sample. */
export const sampleAuthorizationRows: DashboardRow[] = sampleAuthorizations.map((s) => {
	const result = validateAuthorization(s.data);
	return {
		id: s.id,
		patientName: s.patientName,
		recipientOrganization:
			s.data.authorizedRecipient.recipientOrganization || s.data.authorizedRecipient.recipientName,
		primaryPurpose: s.data.purposeOfDisclosure.primaryPurpose,
		categories: recordCategoryLabels(s.data.recordsToDisclose).join(', ') || '—',
		validityStatus: result.validityStatus,
		completenessScore: result.completenessScore,
		highFlagCount:
			result.firedRules.filter((r) => r.priority === 'high').length +
			result.additionalFlags.filter((f) => f.priority === 'high').length,
		flagCount: result.firedRules.length + result.additionalFlags.length
	};
});
