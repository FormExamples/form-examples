import type { AssessmentData, PrimaryCategory, Status, Urgency } from '#lib/engine/types.js';
import { calculateSafeguardingGrade } from '#lib/engine/child-safeguarding-grader.js';
import { createDefaultAssessment } from '#lib/stores/assessment.svelte.js';

/** A sample referral: an identifier and the full data the engine grades. */
export interface SampleAssessment {
	id: string;
	childName: string;
	updatedDate: string;
	data: AssessmentData;
}

/** A row in the duty-team dashboard, derived by running the shared engine. */
export interface DashboardRow {
	id: string;
	childReference: string;
	childName: string;
	updatedDate: string;
	status: Status;
	urgency: Urgency;
	completenessPercent: number;
	primaryCategory: PrimaryCategory;
	referrerName: string;
	flagCount: number;
}

/** Emergency: child in immediate danger; incomplete (no consent basis, no category). */
function emergencyIncomplete(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer = {
		referrerName: 'Sarah Ahmed',
		referrerRole: 'Designated Safeguarding Lead',
		referrerOrganisation: 'Oakfield Primary School',
		referrerPhone: '020 7946 0000',
		referrerEmail: 's.ahmed@oakfield.sch.uk',
		referredAt: '2026-06-30T09:15',
		relationshipToChild: 'Class teacher'
	};
	r.child.childName = 'Jamie Clarke';
	r.child.childDateOfBirth = '2015-04-10';
	r.child.childSex = 'male';
	r.concern.concernDescription =
		'Child arrived with untreated burn and disclosed being locked outside overnight.';
	r.concern.childDisclosed = 'yes';
	// primaryCategory left blank → incomplete.
	r.risk.immediateDanger = 'yes';
	r.risk.childWhereabouts = 'In the school medical room.';
	r.risk.otherChildrenAtRisk = 'yes';
	// consentStatus / sharingBasis left blank → no consent basis → incomplete.
	r.consent.familyAware = 'no';
	r.consent.unsafeToInformReason = 'Informing the carer may place the child at further risk.';
	r.informed.previousSafeguardingHistory = 'CIN plan closed 2024.';
	return r;
}

/** Urgent (s47): sexual category + alleged person in contact; complete. */
function urgentComplete(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer = {
		referrerName: 'Dr Priya Nair',
		referrerRole: 'GP',
		referrerOrganisation: 'Riverside Medical Centre',
		referrerPhone: '0161 496 0000',
		referrerEmail: 'p.nair@riverside.nhs.uk',
		referredAt: '2026-06-28T14:40',
		relationshipToChild: 'Registered GP'
	};
	r.child = {
		childName: 'Aisha Bello',
		childDateOfBirth: '2012-11-02',
		childAge: null,
		childSex: 'female',
		childAddress: '14 Canal Street, Manchester',
		childSetting: 'Meadow High School',
		childReference: '611 209 3344',
		childEthnicity: 'Black British',
		childFirstLanguage: 'English',
		childDisability: ''
	};
	r.family.carers = 'Mother — Grace Bello';
	r.family.householdMembers = 'Mother; mother’s partner.';
	r.family.professionalsInvolved = 'School nurse.';
	r.concern.concernDescription =
		'Signs consistent with sexual abuse; mother’s partner named by the child.';
	r.concern.concernOnset = 'Raised during a routine appointment on 28 June.';
	r.concern.childDisclosed = 'yes';
	r.category.primaryCategory = 'sexual';
	r.category.presentingEvidence = 'Disclosure plus corroborating physical signs.';
	r.risk.immediateDanger = 'no';
	r.risk.childWhereabouts = 'At home with mother.';
	r.risk.whoWithChild = 'Mother.';
	r.risk.allegedPersonInContact = 'yes';
	r.consent.consentSought = 'yes';
	r.consent.consentStatus = 'given';
	r.consent.familyAware = 'yes';
	r.action.requestedAction = 'Strategy discussion and s47 enquiry.';
	r.action.referrerDeclaration = 'yes';
	return r;
}

/** Standard (s17): neglect concern, consent given; partial (recommended gaps). */
function standardPartial(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer = {
		referrerName: 'Tom Reilly',
		referrerRole: 'Health visitor',
		referrerOrganisation: 'Belfast Health Trust',
		referrerPhone: '028 9032 0000',
		referrerEmail: '',
		referredAt: '2026-06-25T11:00',
		relationshipToChild: 'Health visitor'
	};
	r.child.childName = 'Connor Byrne';
	r.child.childAge = 3;
	r.child.childSex = 'male';
	r.concern.concernDescription =
		'Persistent poor hygiene, missed health appointments, and developmental delay.';
	r.category.primaryCategory = 'neglect';
	r.risk.immediateDanger = 'no';
	r.consent.consentSought = 'yes';
	r.consent.consentStatus = 'given';
	r.consent.familyAware = 'yes';
	// Several recommended fields left blank → partial.
	return r;
}

/** Standard (s17): consent refused with a lawful basis; complete. */
function standardConsentBasis(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer = {
		referrerName: 'Ada Okafor',
		referrerRole: 'Social worker',
		referrerOrganisation: 'Cardiff Children’s Services',
		referrerPhone: '029 2087 0000',
		referrerEmail: 'a.okafor@cardiff.gov.uk',
		referredAt: '2026-06-26T16:20',
		relationshipToChild: 'Duty social worker'
	};
	r.child = {
		childName: 'Ffion Davies',
		childDateOfBirth: '2016-07-19',
		childAge: null,
		childSex: 'female',
		childAddress: '21 Maple Grove, Cardiff',
		childSetting: 'Maple Grove Primary',
		childReference: '778 334 1090',
		childEthnicity: 'White Welsh',
		childFirstLanguage: 'Welsh',
		childDisability: 'Hearing impairment.'
	};
	r.family.carers = 'Father — Rhys Davies';
	r.family.householdMembers = 'Father; grandmother.';
	r.family.professionalsInvolved = 'GP; teacher of the deaf.';
	r.concern.concernDescription = 'Emotional harm from ongoing exposure to domestic abuse.';
	r.concern.concernOnset = 'Escalating reports over two months.';
	r.category.primaryCategory = 'emotional';
	r.category.presentingEvidence = 'Withdrawal, regression, and reported incidents.';
	r.risk.immediateDanger = 'no';
	r.risk.childWhereabouts = 'At home.';
	r.risk.whoWithChild = 'Father.';
	r.consent.consentSought = 'yes';
	r.consent.consentStatus = 'refused';
	r.consent.sharingBasisWithoutConsent = 'risk-of-serious-harm';
	r.consent.familyAware = 'yes';
	r.action.requestedAction = 'Assessment under s17.';
	r.action.referrerDeclaration = 'yes';
	return r;
}

/** The sample referrals, keyed by stable id (used to seed the wizard). */
export const sampleAssessments: SampleAssessment[] = [
	{ id: 'CSR-2026-0001', childName: 'Clarke, Jamie', updatedDate: '2026-06-30', data: emergencyIncomplete() },
	{ id: 'CSR-2026-0002', childName: 'Bello, Aisha', updatedDate: '2026-06-28', data: urgentComplete() },
	{ id: 'CSR-2026-0003', childName: 'Byrne, Connor', updatedDate: '2026-06-25', data: standardPartial() },
	{ id: 'CSR-2026-0004', childName: 'Davies, Ffion', updatedDate: '2026-06-26', data: standardConsentBasis() }
];

/** Dashboard rows derived by running the shared engine over each sample. */
export const sampleAssessmentRows: DashboardRow[] = sampleAssessments.map((s) => {
	const g = calculateSafeguardingGrade(s.data);
	return {
		id: s.id,
		childReference: s.data.child.childReference || '—',
		childName: s.childName,
		updatedDate: s.updatedDate,
		status: g.status,
		urgency: g.urgency,
		completenessPercent: g.completenessPercent,
		primaryCategory: s.data.category.primaryCategory,
		referrerName: s.data.referrer.referrerName,
		flagCount: g.flaggedIssues.length
	};
});
