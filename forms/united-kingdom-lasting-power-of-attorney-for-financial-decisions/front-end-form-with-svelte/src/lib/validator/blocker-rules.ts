import type { FiredRule, Lpa } from '$lib/types.js';
import { ageOnDate, personEquals, todayIso } from './utils.js';

// Each blocker rule is a pure function that returns a FiredRule when the
// rule predicate is satisfied, or null otherwise. The composite-risk
// algorithm promotes any blocker to `critical`.

function referenceDate(lpa: Lpa): string {
  return lpa.signedDate || todayIso();
}

export function donorUnderEighteen(lpa: Lpa): FiredRule | null {
  const age = ageOnDate(lpa.donor.dateOfBirth, referenceDate(lpa));
  if (age === null) return null;
  if (age >= 18) return null;
  return {
    ruleId: 'DonorUnderEighteen',
    priority: 'critical',
    citation: 'MCA 2005 s. 9(2)(a)',
    fieldPath: 'donor.dateOfBirth',
    message: 'Donor is under 18 at the date of signing.',
    remediation:
      'The donor must be 18 or older to make an LPA. Check the date of birth in section 1, or wait until the donor is 18.',
  };
}

export function donorMustHaveCapacity(lpa: Lpa): FiredRule | null {
  const donorSig = lpa.signatures.find(
    (s) => s.role === 'donor' && s.lp1fSection === 9,
  );
  // Only fire after the deed has otherwise reached the signing stage.
  if (lpa.status === '' || lpa.status === 'draft' || lpa.status === 'ready_for_signing') {
    return null;
  }
  if (donorSig && donorSig.signedOn) return null;
  return {
    ruleId: 'DonorMustHaveCapacity',
    priority: 'critical',
    citation: 'MCA 2005 s. 9(2)(c); Sch. 1 para. 2(1)(b)',
    fieldPath: 'signatures[role=donor]',
    message: 'Donor signature missing in section 9.',
    remediation:
      'The donor must sign section 9 themselves while they still have mental capacity. If the donor cannot physically sign, use LPC continuation sheet 3.',
  };
}

export function donorCannotSignWithoutContinuationSheet3(
  lpa: Lpa,
): FiredRule | null {
  const onBehalf = lpa.signatures.find(
    (s) => s.role === 'signing_on_behalf_of_donor',
  );
  if (!onBehalf) return null;
  const hasSheet3 = lpa.continuationSheets.some(
    (s) => s.kind === '3_donor_cannot_sign',
  );
  if (hasSheet3) return null;
  return {
    ruleId: 'DonorCannotSignWithoutContinuationSheet3',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 9(4) (approximate)',
    fieldPath: 'continuationSheets[kind=3_donor_cannot_sign]',
    message:
      'Donor signature is marked "signed on behalf of donor" but no LPC sheet 3 is attached.',
    remediation:
      'When the donor cannot physically sign, another adult may sign at the donor\u2019s direction \u2014 but you must attach LPC continuation sheet 3 with witness details.',
  };
}

export function noAttorneyAppointed(lpa: Lpa): FiredRule | null {
  if (lpa.attorneys.length > 0) return null;
  return {
    ruleId: 'NoAttorneyAppointed',
    priority: 'critical',
    citation: 'MCA 2005 s. 9(1)',
    fieldPath: 'attorneys',
    message: 'Section 2 contains zero attorneys.',
    remediation:
      'An LPA must appoint at least one attorney. Add an attorney in section 2.',
  };
}

export function attorneyUnderEighteen(lpa: Lpa): FiredRule | null {
  const ref = referenceDate(lpa);
  for (const a of lpa.attorneys) {
    if (a.person.isTrustCorporation) continue;
    const age = ageOnDate(a.person.dateOfBirth, ref);
    if (age !== null && age < 18) {
      return {
        ruleId: 'AttorneyUnderEighteen',
        priority: 'critical',
        citation: 'MCA 2005 s. 10(1)(a)',
        fieldPath: `attorneys[${a.ordinal - 1}].person.dateOfBirth`,
        message: 'An attorney is under 18.',
        remediation:
          'Attorneys must be 18 or older. Replace the under-18 attorney in section 2.',
      };
    }
  }
  return null;
}

export function attorneyBankruptOrDRO(lpa: Lpa): FiredRule | null {
  for (const a of lpa.attorneys) {
    if (a.person.isBankrupt || a.person.hasDebtReliefOrder) {
      return {
        ruleId: 'AttorneyBankruptOrDRO',
        priority: 'critical',
        citation: 'MCA 2005 s. 10(2); s. 13(8)',
        fieldPath: `attorneys[${a.ordinal - 1}].person`,
        message:
          'An attorney is currently bankrupt or subject to a debt relief order.',
        remediation:
          'A bankrupt person, or someone subject to a debt relief order, cannot act as attorney for property and financial affairs. Replace the attorney before signing.',
      };
    }
  }
  return null;
}

export function trustCorporationMissingContinuationSheet4(
  lpa: Lpa,
): FiredRule | null {
  const hasTrust = lpa.attorneys.some((a) => a.person.isTrustCorporation);
  if (!hasTrust) return null;
  const hasSheet4 = lpa.continuationSheets.some(
    (s) => s.kind === '4_trust_corporation',
  );
  if (hasSheet4) return null;
  return {
    ruleId: 'TrustCorporationMissingContinuationSheet4',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 9(5) (approximate)',
    fieldPath: 'continuationSheets[kind=4_trust_corporation]',
    message:
      'A trust corporation is appointed but no LPC continuation sheet 4 is attached.',
    remediation:
      'When a trust corporation is appointed as attorney you must complete LPC continuation sheet 4 with the corporation\u2019s details and seal.',
  };
}

export function overFourAttorneysNoContinuation(lpa: Lpa): FiredRule | null {
  if (lpa.attorneys.length <= 4) return null;
  const hasSheet1 = lpa.continuationSheets.some(
    (s) => s.kind === '1_additional_people',
  );
  if (hasSheet1) return null;
  return {
    ruleId: 'OverFourAttorneysNoContinuation',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 9(3) (approximate)',
    fieldPath: 'continuationSheets[kind=1_additional_people]',
    message: 'Section 2 lists more than 4 attorneys but no LPC sheet 1 is attached.',
    remediation:
      'The LP1F has space for 4 attorneys. To appoint more, attach LPC continuation sheet 1 with their details.',
  };
}

export function jointlyButNoReplacement(lpa: Lpa): FiredRule | null {
  if (lpa.decisionMode !== 'jointly') return null;
  if (lpa.replacementAttorneys.length > 0) return null;
  return {
    ruleId: 'JointlyButNoReplacement',
    priority: 'critical',
    citation: 'MCA 2005 s. 10(4)(a); LP12 Guide part A6',
    fieldPath: 'replacementAttorneys',
    message:
      'Attorneys are appointed "jointly" but no replacement attorney is listed.',
    remediation:
      'When attorneys must act jointly, the LPA fails entirely if any one of them can no longer act. Strongly recommended: appoint at least one replacement attorney in section 4.',
  };
}

export function mixedDecisionWithoutContinuationSheet(
  lpa: Lpa,
): FiredRule | null {
  if (lpa.decisionMode !== 'mixed') return null;
  const hasSheet2 = lpa.continuationSheets.some(
    (s) => s.kind === '2_additional_information',
  );
  const hasText =
    !!lpa.decisionModeMixedText.trim() ||
    !!lpa.preferencesAndInstructionsOverflow.decisionsJointlyOverflowText.trim();
  if (hasSheet2 || hasText) return null;
  return {
    ruleId: 'MixedDecisionWithoutContinuationSheet',
    priority: 'critical',
    citation: 'MCA 2005 s. 10(4)(c); LPA Regs 2007 reg. 5(2)',
    fieldPath: 'decisionModeMixedText',
    message:
      'Mixed decision mode requires LPC sheet 2 listing the joint decisions.',
    remediation:
      'The "mixed" mode requires you to specify which decisions are joint. Attach LPC continuation sheet 2 with that list.',
  };
}

export function certificateProviderUnderEighteen(lpa: Lpa): FiredRule | null {
  const cp = lpa.certificateProvider;
  if (!cp) return null;
  const age = ageOnDate(cp.person.dateOfBirth, referenceDate(lpa));
  if (age === null) return null;
  if (age >= 18) return null;
  return {
    ruleId: 'CertificateProviderUnderEighteen',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 8(1) (approximate)',
    fieldPath: 'certificateProvider.person.dateOfBirth',
    message: 'Certificate provider is under 18.',
    remediation:
      'The certificate provider must be an adult. Choose a different person for section 10.',
  };
}

export function certificateProviderIsAttorney(lpa: Lpa): FiredRule | null {
  const cp = lpa.certificateProvider;
  if (!cp) return null;
  const overlap =
    lpa.attorneys.some((a) => personEquals(a.person, cp.person)) ||
    lpa.replacementAttorneys.some((a) => personEquals(a.person, cp.person));
  if (!overlap) return null;
  return {
    ruleId: 'CertificateProviderIsAttorney',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 8(1)(c)',
    fieldPath: 'certificateProvider.person',
    message:
      'Certificate provider also appears as attorney or replacement attorney.',
    remediation:
      'The certificate provider must be independent. They cannot also be one of the attorneys or replacement attorneys. Choose a different certificate provider.',
  };
}

export function certificateProviderRelatedToAttorney(
  lpa: Lpa,
): FiredRule | null {
  const cp = lpa.certificateProvider;
  if (!cp) return null;
  if (!cp.isRelatedToDonorOrAttorney) return null;
  return {
    ruleId: 'CertificateProviderRelatedToAttorney',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 8(1)(d)',
    fieldPath: 'certificateProvider.isRelatedToDonorOrAttorney',
    message:
      'Certificate provider is a family member of the donor or an attorney.',
    remediation:
      'The certificate provider cannot be a family member of the donor or any of the attorneys. Choose an independent person \u2014 a friend who has known the donor 2+ years, or a professional (GP, solicitor).',
  };
}

export function certificateProviderIsCareHomeOwner(lpa: Lpa): FiredRule | null {
  const cp = lpa.certificateProvider;
  if (!cp) return null;
  if (!cp.isCareHomeOwnerOrEmployee) return null;
  return {
    ruleId: 'CertificateProviderIsCareHomeOwner',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 8(2)',
    fieldPath: 'certificateProvider.isCareHomeOwnerOrEmployee',
    message:
      'Certificate provider is connected with the donor\u2019s care home.',
    remediation:
      'If the donor lives in a care home, no one connected with that care home can be the certificate provider. Choose an independent person.',
  };
}

export function witnessIsDonor(lpa: Lpa): FiredRule | null {
  const donorSig = lpa.signatures.find(
    (s) => s.role === 'donor' && s.lp1fSection === 9,
  );
  if (!donorSig || !donorSig.witness) return null;
  if (personEquals(donorSig.witness.person, lpa.donor)) {
    return {
      ruleId: 'WitnessIsDonor',
      priority: 'critical',
      citation: 'LPA Regs 2007 reg. 9(2)',
      fieldPath: 'signatures[role=donor].witness',
      message: 'Donor\u2019s signature witness is the donor.',
      remediation:
        'A witness must be someone other than the person signing. Choose a different witness for the donor\u2019s signature.',
    };
  }
  return null;
}

export function witnessIsAttorney(lpa: Lpa): FiredRule | null {
  const donorSig = lpa.signatures.find(
    (s) => s.role === 'donor' && s.lp1fSection === 9,
  );
  if (!donorSig || !donorSig.witness) return null;
  const overlap =
    lpa.attorneys.some((a) =>
      personEquals(a.person, donorSig.witness!.person),
    ) ||
    lpa.replacementAttorneys.some((a) =>
      personEquals(a.person, donorSig.witness!.person),
    );
  if (!overlap) return null;
  return {
    ruleId: 'WitnessIsAttorney',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 9(2)',
    fieldPath: 'signatures[role=donor].witness',
    message:
      'Donor\u2019s signature witness is also an attorney or replacement attorney.',
    remediation:
      'The donor\u2019s signature must be witnessed by someone who is not one of the attorneys or replacement attorneys.',
  };
}

export function attorneyWitnessIsDonor(lpa: Lpa): FiredRule | null {
  const attorneySigs = lpa.signatures.filter(
    (s) =>
      (s.role === 'attorney' || s.role === 'replacement_attorney') &&
      s.lp1fSection === 11,
  );
  for (const s of attorneySigs) {
    if (s.witness && personEquals(s.witness.person, lpa.donor)) {
      return {
        ruleId: 'AttorneyWitnessIsDonor',
        priority: 'critical',
        citation: 'LPA Regs 2007 reg. 9(2)',
        fieldPath: 'signatures[role=attorney].witness',
        message: 'An attorney\u2019s signature witness is the donor.',
        remediation:
          'An attorney\u2019s signature must be witnessed by someone other than the donor. Choose a different witness for each attorney.',
      };
    }
  }
  return null;
}

export function peopleToNotifyExceedsFive(lpa: Lpa): FiredRule | null {
  if (lpa.peopleToNotify.length <= 5) return null;
  return {
    ruleId: 'PeopleToNotifyExceedsFive',
    priority: 'critical',
    citation: 'LP1F section 6; LP12 Guide part A8',
    fieldPath: 'peopleToNotify',
    message: 'More than 5 people to notify listed.',
    remediation:
      'You can name up to 5 people to notify. Remove anyone above the fifth, or move them off the form.',
  };
}

export function personToNotifyIsAttorney(lpa: Lpa): FiredRule | null {
  for (const ptn of lpa.peopleToNotify) {
    const overlap =
      lpa.attorneys.some((a) => personEquals(a.person, ptn.person)) ||
      lpa.replacementAttorneys.some((a) =>
        personEquals(a.person, ptn.person),
      );
    if (overlap) {
      return {
        ruleId: 'PersonToNotifyIsAttorney',
        priority: 'critical',
        citation: 'LP1F section 6 inline restriction (approximate)',
        fieldPath: `peopleToNotify[${ptn.ordinal - 1}].person`,
        message:
          'A person-to-notify is also listed as attorney or replacement attorney.',
        remediation:
          'A person who is going to be an attorney cannot also be a person-to-notify. Choose someone else, or remove them from section 6.',
      };
    }
  }
  return null;
}

export function signingOrderViolation(lpa: Lpa): FiredRule | null {
  const donorSig = lpa.signatures.find(
    (s) => s.role === 'donor' && s.lp1fSection === 9,
  );
  const cpSig = lpa.signatures.find(
    (s) => s.role === 'certificate_provider' && s.lp1fSection === 10,
  );
  const attorneySigs = lpa.signatures.filter(
    (s) =>
      (s.role === 'attorney' || s.role === 'replacement_attorney') &&
      s.lp1fSection === 11,
  );
  if (cpSig && cpSig.signedOn && donorSig && donorSig.signedOn) {
    if (cpSig.signedOn < donorSig.signedOn) {
      return makeOrderViolation();
    }
  }
  for (const s of attorneySigs) {
    if (s.signedOn && cpSig && cpSig.signedOn && s.signedOn < cpSig.signedOn) {
      return makeOrderViolation();
    }
  }
  return null;

  function makeOrderViolation(): FiredRule {
    return {
      ruleId: 'SigningOrderViolation',
      priority: 'critical',
      citation: 'LPA Regs 2007 reg. 9(6)',
      fieldPath: 'signatures[*].signedOn',
      message:
        'Signatures are not in the order donor (s.9) \u2192 certificate provider (s.10) \u2192 attorneys (s.11).',
      remediation:
        'The signing order is fixed: donor first (section 9), then certificate provider (section 10), then attorneys (section 11). Re-sign in the correct order; do not change dates.',
    };
  }
}

export function registrationApplicantInvalid(lpa: Lpa): FiredRule | null {
  const app = lpa.registrationApplication;
  if (!app.applicantKind) return null;
  if (app.applicantKind === 'donor') return null;
  if (app.applicantKind === 'attorneys') {
    // For joint appointments, every attorney must have signed section 15.
    if (lpa.decisionMode === 'jointly') {
      const applicantSigs = lpa.signatures.filter(
        (s) => s.role === 'applicant' && s.lp1fSection === 15,
      );
      const everyAttorneySigned = lpa.attorneys.every((a) =>
        applicantSigs.some((s) => s.signatoryPersonId === a.person.id),
      );
      if (!everyAttorneySigned) {
        return {
          ruleId: 'RegistrationApplicantInvalid',
          priority: 'critical',
          citation: 'LPA Regs 2007 reg. 11',
          fieldPath: 'signatures[role=applicant]',
          message:
            'Attorneys are appointed jointly but not all of them have signed section 15.',
          remediation:
            'Only the donor or one or more of the attorneys may apply to register. If attorneys are joint, all of them must sign the registration application in section 15.',
        };
      }
    }
    return null;
  }
  return {
    ruleId: 'RegistrationApplicantInvalid',
    priority: 'critical',
    citation: 'LPA Regs 2007 reg. 11',
    fieldPath: 'registrationApplication.applicantKind',
    message: 'Applicant kind is neither donor nor attorneys.',
    remediation:
      'Only the donor or one or more of the attorneys may apply to register.',
  };
}

// Ordered list of blocker rules. The validator runs them in this order
// and collects every FiredRule.
export const BLOCKER_RULES: ((lpa: Lpa) => FiredRule | null)[] = [
  donorUnderEighteen,
  donorMustHaveCapacity,
  donorCannotSignWithoutContinuationSheet3,
  noAttorneyAppointed,
  attorneyUnderEighteen,
  attorneyBankruptOrDRO,
  trustCorporationMissingContinuationSheet4,
  overFourAttorneysNoContinuation,
  jointlyButNoReplacement,
  mixedDecisionWithoutContinuationSheet,
  certificateProviderUnderEighteen,
  certificateProviderIsAttorney,
  certificateProviderRelatedToAttorney,
  certificateProviderIsCareHomeOwner,
  witnessIsDonor,
  witnessIsAttorney,
  attorneyWitnessIsDonor,
  peopleToNotifyExceedsFive,
  personToNotifyIsAttorney,
  signingOrderViolation,
  registrationApplicantInvalid,
];

export function applyBlockerRules(lpa: Lpa): FiredRule[] {
  const fired: FiredRule[] = [];
  for (const rule of BLOCKER_RULES) {
    const r = rule(lpa);
    if (r) fired.push(r);
  }
  return fired;
}
