import { describe, it, expect } from 'vitest';
import { calculateSafeguardingGrade, classifyUrgency } from './child-safeguarding-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { mandatoryRules } from './child-safeguarding-rules';
import type { AssessmentData } from './types';

/**
 * A blank referral (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		referrer: {
			referrerName: '',
			referrerRole: '',
			referrerOrganisation: '',
			referrerPhone: '',
			referrerEmail: '',
			referredAt: '',
			relationshipToChild: ''
		},
		child: {
			childName: '',
			childDateOfBirth: '',
			childAge: null,
			childSex: '',
			childAddress: '',
			childSetting: '',
			childReference: '',
			childEthnicity: '',
			childFirstLanguage: '',
			childDisability: ''
		},
		family: { carers: '', householdMembers: '', otherChildren: '', professionalsInvolved: '' },
		concern: {
			concernDescription: '',
			concernOnset: '',
			childDisclosed: '',
			referrerObservations: ''
		},
		category: { primaryCategory: '', additionalCategories: '', presentingEvidence: '' },
		risk: {
			immediateDanger: '',
			childWhereabouts: '',
			whoWithChild: '',
			allegedPersonInContact: '',
			otherChildrenAtRisk: ''
		},
		consent: {
			consentSought: '',
			consentStatus: '',
			sharingBasisWithoutConsent: '',
			familyAware: '',
			unsafeToInformReason: ''
		},
		informed: { agenciesContacted: '', strategyDiscussionHeld: '', previousSafeguardingHistory: '' },
		action: { requestedAction: '', referrerDeclaration: '', notes: '' }
	};
}

/** A referral that satisfies every mandatory rule (but leaves some recommended). */
function createValidReferral(): AssessmentData {
	const r = createDefaultAssessment();
	r.referrer.referrerName = 'Sarah Ahmed';
	r.referrer.referrerPhone = '020 7946 0000';
	r.child.childName = 'Jamie Clarke';
	r.child.childDateOfBirth = '2015-04-10';
	r.concern.concernDescription = 'Repeated unexplained bruising; child fearful of going home.';
	r.category.primaryCategory = 'physical';
	r.risk.immediateDanger = 'no';
	r.consent.consentStatus = 'given';
	return r;
}

/** A fully-complete referral (every mandatory AND recommended slot populated). */
function createCompleteReferral(): AssessmentData {
	const r = createValidReferral();
	r.referrer.referrerRole = 'Designated Safeguarding Lead';
	r.referrer.referrerOrganisation = 'Oakfield Primary School';
	r.referrer.relationshipToChild = 'Class teacher';
	r.child.childSex = 'male';
	r.child.childAddress = '3 Willow Lane, Leeds';
	r.family.carers = 'Mother — Emma Clarke';
	r.family.householdMembers = 'Mother; stepfather.';
	r.family.professionalsInvolved = 'GP; health visitor.';
	r.concern.concernOnset = 'Observed by class teacher over three weeks.';
	r.category.presentingEvidence = 'Bruising to upper arms; flinching.';
	r.risk.childWhereabouts = 'At school.';
	r.risk.whoWithChild = 'Class teacher.';
	r.consent.familyAware = 'yes';
	r.action.requestedAction = 'Assessment under s17.';
	r.action.referrerDeclaration = 'yes';
	return r;
}

describe('Child Safeguarding Referral completeness grader', () => {
	it('marks a blank referral incomplete with 0% completeness', () => {
		const g = calculateSafeguardingGrade(createDefaultAssessment());
		expect(g.status).toBe('incomplete');
		expect(g.completenessPercent).toBe(0);
		expect(g.satisfiedCount).toBe(0);
		expect(g.mandatoryCount).toBe(6);
	});

	it('marks a valid-but-thin referral partial (all mandatory, some recommended missing)', () => {
		const g = calculateSafeguardingGrade(createValidReferral());
		expect(g.satisfiedCount).toBe(6);
		expect(g.status).toBe('partial');
		expect(g.completenessPercent).toBeGreaterThan(0);
		expect(g.completenessPercent).toBeLessThan(100);
	});

	it('marks a fully-answered referral complete at 100%', () => {
		const g = calculateSafeguardingGrade(createCompleteReferral());
		expect(g.status).toBe('complete');
		expect(g.completenessPercent).toBe(100);
	});

	it('the referrer rule requires a name and at least one contact route', () => {
		const r = createValidReferral();
		r.referrer.referrerPhone = '';
		r.referrer.referrerEmail = '';
		const fired = calculateSafeguardingGrade(r).firedRules;
		expect(fired.find((f) => f.id === 'R-REFERRER-01')?.satisfied).toBe(false);
	});

	it('the consent-basis rule is satisfied by a lawful basis when consent is not given', () => {
		const r = createValidReferral();
		r.consent.consentStatus = 'refused';
		r.consent.sharingBasisWithoutConsent = '';
		expect(
			calculateSafeguardingGrade(r).firedRules.find((f) => f.id === 'R-CONSENT-BASIS-01')
				?.satisfied
		).toBe(false);
		r.consent.sharingBasisWithoutConsent = 'risk-of-serious-harm';
		expect(
			calculateSafeguardingGrade(r).firedRules.find((f) => f.id === 'R-CONSENT-BASIS-01')
				?.satisfied
		).toBe(true);
	});

	it('the conditional unsafe-to-inform slot enters the denominator only when the family is unaware', () => {
		const aware = createCompleteReferral();
		expect(calculateSafeguardingGrade(aware).completenessPercent).toBe(100);

		const unaware = createCompleteReferral();
		unaware.consent.familyAware = 'no';
		// The unsafe-to-inform slot now applies but is absent → below 100%.
		expect(calculateSafeguardingGrade(unaware).completenessPercent).toBeLessThan(100);
	});

	it('all rule IDs are unique', () => {
		const ids = mandatoryRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Child Safeguarding Referral urgency classification', () => {
	it('classifies immediate danger as emergency', () => {
		const r = createValidReferral();
		r.risk.immediateDanger = 'yes';
		expect(classifyUrgency(r)).toBe('emergency');
		expect(calculateSafeguardingGrade(r).urgency).toBe('emergency');
	});

	it('classifies a sexual category as urgent (s47)', () => {
		const r = createValidReferral();
		r.category.primaryCategory = 'sexual';
		expect(classifyUrgency(r)).toBe('urgent');
	});

	it('classifies a disclosure as urgent', () => {
		const r = createValidReferral();
		r.concern.childDisclosed = 'yes';
		expect(classifyUrgency(r)).toBe('urgent');
	});

	it('classifies other children at risk as urgent', () => {
		const r = createValidReferral();
		r.risk.otherChildrenAtRisk = 'yes';
		expect(classifyUrgency(r)).toBe('urgent');
	});

	it('classifies a routine physical-abuse concern as standard (s17)', () => {
		expect(classifyUrgency(createValidReferral())).toBe('standard');
	});

	it('computes urgency even for an incomplete referral', () => {
		const r = createDefaultAssessment();
		r.risk.immediateDanger = 'yes';
		const g = calculateSafeguardingGrade(r);
		expect(g.status).toBe('incomplete');
		expect(g.urgency).toBe('emergency');
	});
});

describe('Child Safeguarding Referral flagged-issue detection', () => {
	it('raises no flags for a complete referral with consent and no risk triggers', () => {
		expect(detectFlaggedIssues(createCompleteReferral())).toHaveLength(0);
	});

	it('raises the immediate-danger flag', () => {
		const r = createValidReferral();
		r.risk.immediateDanger = 'yes';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-IMMEDIATE-DANGER-001')).toBe(true);
	});

	it('raises the disclosure flag', () => {
		const r = createValidReferral();
		r.concern.childDisclosed = 'yes';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-DISCLOSURE-OF-ABUSE-001')).toBe(true);
	});

	it('raises the sexual-abuse-category flag when listed in additional categories', () => {
		const r = createValidReferral();
		r.category.additionalCategories = 'sexual, neglect';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-SEXUAL-ABUSE-CATEGORY-001')).toBe(true);
	});

	it('raises the no-consent-basis flag when consent is refused with no lawful basis', () => {
		const r = createValidReferral();
		r.consent.consentStatus = 'refused';
		r.consent.sharingBasisWithoutConsent = '';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-NO-CONSENT-BASIS-001')).toBe(true);
	});

	it('raises the mandatory-field-missing flag for a blank referral', () => {
		expect(
			detectFlaggedIssues(createDefaultAssessment()).some(
				(f) => f.id === 'F-MANDATORY-FIELD-MISSING-001'
			)
		).toBe(true);
	});

	it('raises the child-unaware flag when the family is unaware with a recorded reason', () => {
		const r = createCompleteReferral();
		r.consent.familyAware = 'no';
		r.consent.unsafeToInformReason = 'Informing would increase risk of flight.';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-CHILD-UNAWARE-UNSAFE-001')).toBe(true);
	});

	it('raises the previous-history flag', () => {
		const r = createValidReferral();
		r.informed.previousSafeguardingHistory = 'Prior CIN plan in 2023.';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-PREVIOUS-HISTORY-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const r = createDefaultAssessment();
		r.risk.immediateDanger = 'yes'; // high
		r.informed.previousSafeguardingHistory = 'Prior involvement.'; // low
		const flags = detectFlaggedIssues(r);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
