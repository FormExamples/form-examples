/* United Kingdom LPA for Financial Decisions — validator (vanilla JS).
 *
 * Pure-function port of the validation engine described in:
 *   doc/lpa-validation-rules.md
 *
 * Exposes window.validateLpa(lpa) returning:
 *   {
 *     validityBand: string,        // 'draft' | 'ready_for_signing' | ...
 *     compositeRisk: string,       // 'low' | 'moderate' | 'high' | 'critical'
 *     firedRules: FiredRule[],     // statutory blockers (priority === 'critical')
 *     additionalFlags: FiredRule[] // non-blocking warnings (priority in low/mod/high)
 *   }
 *
 * Property names are camelCase (mirroring the SQL snake_case columns).
 */

(function () {
  'use strict';

  // ---- helpers ----------------------------------------------------------

  function ageYears(dateOfBirth, asOf) {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime())) return null;
    const ref = asOf ? new Date(asOf) : new Date();
    if (Number.isNaN(ref.getTime())) return null;
    let age = ref.getFullYear() - dob.getFullYear();
    const m = ref.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && ref.getDate() < dob.getDate())) age -= 1;
    return age;
  }

  function nonEmpty(s) {
    return typeof s === 'string' && s.trim().length > 0;
  }

  function fullName(p) {
    if (!p) return '';
    return ((p.firstNames || '') + ' ' + (p.lastName || '')).trim().toLowerCase();
  }

  function sameName(a, b) {
    const na = fullName(a);
    const nb = fullName(b);
    return na.length > 0 && na === nb;
  }

  function rule(ruleId, priority, citation, fieldPath, message, remediation) {
    return { ruleId, priority, citation, fieldPath, message, remediation };
  }

  // ---- empty-LPA factory ------------------------------------------------

  function emptyPerson() {
    return {
      title: '',
      firstNames: '',
      lastName: '',
      otherNames: '',
      dateOfBirth: null,
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
      isTrustCorporation: false,
      trustCorporationNumber: '',
      isBankrupt: false,
      hasDebtReliefOrder: false
    };
  }

  function emptyWitness() {
    return {
      firstNames: '',
      lastName: '',
      addressLine1: '',
      postcode: '',
      signedAt: null,
      signaturePresent: false
    };
  }

  function emptyLpa() {
    return {
      donor: emptyPerson(),
      attorneys: [],
      decisionMode: '',
      decisionModeMixedText: '',
      hasContinuationSheet1: false,
      hasContinuationSheet2: false,
      hasContinuationSheet3: false,
      hasContinuationSheet4: false,
      replacementAttorneys: [],
      whenAttorneysCanAct: '',
      peopleToNotify: [],
      preferencesText: '',
      instructionsText: '',
      legalRightsAcknowledged: false,
      donorSignature: {
        present: false,
        signedAt: null,
        signedOnBehalf: false,
        capacityConfirmed: false,
        witness: emptyWitness()
      },
      certificateProvider: Object.assign(emptyPerson(), {
        knowsDonorAs: '',
        isOverEighteen: false,
        readLpa: false,
        noRestrictionsOnActing: false,
        isCareHomeOwner: false,
        isRelatedToDonorOrAttorney: false,
        signature: { present: false, signedAt: null }
      }),
      attorneySignatures: [],
      replacementSignatures: [],
      applicantKind: '',
      applicants: [],
      recipientKind: '',
      recipientCompanyName: '',
      recipientPersonIndex: null,
      prefersPost: false,
      prefersPhone: false,
      prefersEmail: false,
      prefersWelsh: false,
      prefersToBeContactedBy: '',
      contactPhone: '',
      contactEmail: '',
      paymentMethod: '',
      cardPaymentPhone: '',
      reducedFeeRequested: false,
      hasLpa120aEvidence: false,
      isRepeatApplication: false,
      repeatCaseNumber: '',
      registrationSignatures: [],
      status: 'draft'
    };
  }

  // ---- blocker rules ---------------------------------------------------

  function evaluateBlockers(lpa) {
    const fired = [];
    const today = new Date().toISOString().slice(0, 10);

    // Donor eligibility
    const donor = lpa.donor || {};
    const donorAge = ageYears(donor.dateOfBirth, lpa.donorSignature && lpa.donorSignature.signedAt || today);
    if (donor.dateOfBirth && donorAge !== null && donorAge < 18) {
      fired.push(rule(
        'DonorUnderEighteen', 'critical', 'MCA 2005 s. 9(2)(a)',
        'donor.dateOfBirth',
        'The donor is under 18 at signing.',
        'The donor must be 18 or older to make an LPA. Check the date of birth in section 1, or wait until the donor is 18.'
      ));
    }
    const sig = lpa.donorSignature || {};
    if (!sig.present || sig.capacityConfirmed === false) {
      // Soft: only fire when something has been signed elsewhere; otherwise leave for band 'draft'.
      const anyAttorneySigned = (lpa.attorneySignatures || []).some(s => s && s.present);
      if (anyAttorneySigned || (lpa.certificateProvider && lpa.certificateProvider.signature && lpa.certificateProvider.signature.present)) {
        fired.push(rule(
          'DonorMustHaveCapacity', 'critical', 'MCA 2005 s. 9(2)(c)',
          'donorSignature.present',
          'Donor signature missing or capacity not confirmed.',
          'The donor must sign section 9 themselves while they still have mental capacity. If the donor cannot physically sign, use LPC continuation sheet 3.'
        ));
      }
    }
    if (sig.signedOnBehalf === true && !lpa.hasContinuationSheet3) {
      fired.push(rule(
        'DonorCannotSignWithoutContinuationSheet3', 'critical', 'LPA Regs 2007 reg. 9(4)',
        'hasContinuationSheet3',
        'Donor signed by another person but LPC sheet 3 is missing.',
        'When the donor cannot physically sign, another adult may sign at the donor\'s direction — but you must attach LPC continuation sheet 3 with witness details.'
      ));
    }

    // Attorney eligibility
    const attorneys = lpa.attorneys || [];
    if (attorneys.length === 0) {
      fired.push(rule(
        'NoAttorneyAppointed', 'critical', 'MCA 2005 s. 9(1)',
        'attorneys',
        'No attorney appointed in section 2.',
        'An LPA must appoint at least one attorney. Add an attorney in section 2.'
      ));
    }
    attorneys.forEach(function (a, i) {
      const age = ageYears(a.dateOfBirth, today);
      if (a.dateOfBirth && age !== null && age < 18 && !a.isTrustCorporation) {
        fired.push(rule(
          'AttorneyUnderEighteen', 'critical', 'MCA 2005 s. 10(1)(a)',
          'attorneys[' + i + '].dateOfBirth',
          'Attorney ' + (i + 1) + ' is under 18.',
          'Attorneys must be 18 or older. Replace the under-18 attorney in section 2.'
        ));
      }
      if (a.isBankrupt || a.hasDebtReliefOrder) {
        fired.push(rule(
          'AttorneyBankruptOrDRO', 'critical', 'MCA 2005 s. 10(2); s. 13(8)',
          'attorneys[' + i + '].isBankrupt',
          'Attorney ' + (i + 1) + ' is bankrupt or has a debt relief order.',
          'A bankrupt person, or someone subject to a debt relief order, cannot act as attorney for property and financial affairs. Replace the attorney before signing.'
        ));
      }
      if (a.isTrustCorporation && !lpa.hasContinuationSheet4) {
        fired.push(rule(
          'TrustCorporationMissingContinuationSheet4', 'critical', 'LPA Regs 2007 reg. 9(5)',
          'hasContinuationSheet4',
          'Trust corporation appointed but LPC sheet 4 missing.',
          'When a trust corporation is appointed as attorney you must complete LPC continuation sheet 4 with the corporation\'s details and seal.'
        ));
      }
    });
    if (attorneys.length > 4 && !lpa.hasContinuationSheet1) {
      fired.push(rule(
        'OverFourAttorneysNoContinuation', 'critical', 'LPA Regs 2007 reg. 9(3)',
        'hasContinuationSheet1',
        'More than 4 attorneys but no LPC sheet 1 attached.',
        'The LP1F has space for 4 attorneys. To appoint more, attach LPC continuation sheet 1 with their details.'
      ));
    }

    // Decision mode
    if (lpa.decisionMode === 'jointly' && (lpa.replacementAttorneys || []).length === 0) {
      fired.push(rule(
        'JointlyButNoReplacement', 'critical', 'MCA 2005 s. 10(4)(a)',
        'replacementAttorneys',
        'Joint attorneys appointed with no replacement.',
        'When attorneys must act jointly, the LPA fails entirely if any one of them can no longer act. Strongly recommended: appoint at least one replacement attorney in section 4.'
      ));
    }
    if (lpa.decisionMode === 'mixed' && !nonEmpty(lpa.decisionModeMixedText) && !lpa.hasContinuationSheet2) {
      fired.push(rule(
        'MixedDecisionWithoutContinuationSheet', 'critical', 'MCA 2005 s. 10(4)(c); LPA Regs 2007 reg. 5(2)',
        'decisionModeMixedText',
        'Mixed decision mode without continuation sheet 2 or in-form text.',
        'The "mixed" mode requires you to specify which decisions are joint. Attach LPC continuation sheet 2 with that list.'
      ));
    }

    // Certificate provider eligibility
    const cp = lpa.certificateProvider || {};
    if (cp.firstNames || cp.lastName) {
      const cpAge = ageYears(cp.dateOfBirth, today);
      if (cp.dateOfBirth && cpAge !== null && cpAge < 18) {
        fired.push(rule(
          'CertificateProviderUnderEighteen', 'critical', 'LPA Regs 2007 reg. 8(1)',
          'certificateProvider.dateOfBirth',
          'Certificate provider is under 18.',
          'The certificate provider must be an adult. Choose a different person for section 10.'
        ));
      }
      const allActors = (attorneys || []).concat(lpa.replacementAttorneys || []);
      if (allActors.some(p => sameName(p, cp))) {
        fired.push(rule(
          'CertificateProviderIsAttorney', 'critical', 'LPA Regs 2007 reg. 8(1)(c)',
          'certificateProvider',
          'Certificate provider is also an attorney or replacement attorney.',
          'The certificate provider must be independent. They cannot also be one of the attorneys or replacement attorneys. Choose a different certificate provider.'
        ));
      }
      if (cp.isRelatedToDonorOrAttorney === true) {
        fired.push(rule(
          'CertificateProviderRelatedToAttorney', 'critical', 'LPA Regs 2007 reg. 8(1)(d)',
          'certificateProvider.isRelatedToDonorOrAttorney',
          'Certificate provider is family of donor or an attorney.',
          'The certificate provider cannot be a family member of the donor or any of the attorneys. Choose an independent person — a friend who has known the donor 2+ years, or a professional (GP, solicitor).'
        ));
      }
      if (cp.isCareHomeOwner === true) {
        fired.push(rule(
          'CertificateProviderIsCareHomeOwner', 'critical', 'LPA Regs 2007 reg. 8(2)',
          'certificateProvider.isCareHomeOwner',
          'Certificate provider works for or owns the donor\'s care home.',
          'If the donor lives in a care home, no one connected with that care home can be the certificate provider. Choose an independent person.'
        ));
      }
    }

    // Witnesses
    const dw = (lpa.donorSignature && lpa.donorSignature.witness) || {};
    if (dw.firstNames || dw.lastName) {
      if (sameName(dw, donor)) {
        fired.push(rule(
          'WitnessIsDonor', 'critical', 'LPA Regs 2007 reg. 9(2)',
          'donorSignature.witness',
          'Donor signature witness is the donor.',
          'A witness must be someone other than the person signing. Choose a different witness for the donor\'s signature.'
        ));
      }
      const allActors2 = (attorneys || []).concat(lpa.replacementAttorneys || []);
      if (allActors2.some(p => sameName(p, dw))) {
        fired.push(rule(
          'WitnessIsAttorney', 'critical', 'LPA Regs 2007 reg. 9(2)',
          'donorSignature.witness',
          'Donor signature witness is also an attorney.',
          'The donor\'s signature must be witnessed by someone who is not one of the attorneys or replacement attorneys.'
        ));
      }
    }
    (lpa.attorneySignatures || []).forEach(function (s, i) {
      const w = s && s.witness;
      if (w && (w.firstNames || w.lastName) && sameName(w, donor)) {
        fired.push(rule(
          'AttorneyWitnessIsDonor', 'critical', 'LPA Regs 2007 reg. 9(2)',
          'attorneySignatures[' + i + '].witness',
          'Attorney ' + (i + 1) + ' was witnessed by the donor.',
          'An attorney\'s signature must be witnessed by someone other than the donor. Choose a different witness for each attorney.'
        ));
      }
    });

    // People to notify
    const ptn = lpa.peopleToNotify || [];
    if (ptn.length > 5) {
      fired.push(rule(
        'PeopleToNotifyExceedsFive', 'critical', 'LP1F section 6',
        'peopleToNotify',
        'More than 5 people to notify.',
        'You can name up to 5 people to notify. Remove anyone above the fifth, or move them off the form.'
      ));
    }
    const allActors3 = (attorneys || []).concat(lpa.replacementAttorneys || []);
    ptn.forEach(function (p, i) {
      if (allActors3.some(a => sameName(a, p))) {
        fired.push(rule(
          'PersonToNotifyIsAttorney', 'critical', 'LP1F section 6',
          'peopleToNotify[' + i + ']',
          'Person to notify is also an attorney.',
          'A person who is going to be an attorney cannot also be a person-to-notify. Choose someone else, or remove them from section 6.'
        ));
      }
    });

    // Signing order
    const cpSig = (lpa.certificateProvider && lpa.certificateProvider.signature) || {};
    if (sig.signedAt && cpSig.signedAt && cpSig.signedAt < sig.signedAt) {
      fired.push(rule(
        'SigningOrderViolation', 'critical', 'LPA Regs 2007 reg. 9(6)',
        'certificateProvider.signature.signedAt',
        'Certificate provider signed before the donor.',
        'The signing order is fixed: donor first (section 9), then certificate provider (section 10), then attorneys (section 11). Re-sign in the correct order; do not change dates.'
      ));
    }
    (lpa.attorneySignatures || []).forEach(function (s, i) {
      if (s && s.signedAt && cpSig.signedAt && s.signedAt < cpSig.signedAt) {
        fired.push(rule(
          'SigningOrderViolation', 'critical', 'LPA Regs 2007 reg. 9(6)',
          'attorneySignatures[' + i + '].signedAt',
          'Attorney ' + (i + 1) + ' signed before the certificate provider.',
          'The signing order is fixed: donor first (section 9), then certificate provider (section 10), then attorneys (section 11). Re-sign in the correct order; do not change dates.'
        ));
      }
    });

    // Registration applicant
    if (lpa.applicantKind && lpa.applicantKind !== 'donor' && lpa.applicantKind !== 'attorneys') {
      fired.push(rule(
        'RegistrationApplicantInvalid', 'critical', 'LPA Regs 2007 reg. 11',
        'applicantKind',
        'Registration applicant is neither donor nor attorneys.',
        'Only the donor or one or more of the attorneys may apply to register. If attorneys are joint, all of them must sign the registration application in section 15.'
      ));
    }
    if (lpa.applicantKind === 'attorneys' && lpa.decisionMode === 'jointly') {
      const allSigned = (lpa.registrationSignatures || []).length >= attorneys.length
        && (lpa.registrationSignatures || []).every(s => s && s.present);
      if (attorneys.length > 0 && !allSigned) {
        fired.push(rule(
          'RegistrationApplicantInvalid', 'critical', 'LPA Regs 2007 reg. 11',
          'registrationSignatures',
          'Joint attorneys must all sign the registration application.',
          'Only the donor or one or more of the attorneys may apply to register. If attorneys are joint, all of them must sign the registration application in section 15.'
        ));
      }
    }

    return fired;
  }

  // ---- additional flags ------------------------------------------------

  function evaluateFlags(lpa) {
    const flags = [];

    if ((lpa.attorneys || []).length === 1 && (lpa.replacementAttorneys || []).length === 0) {
      flags.push(rule(
        'SingleAttorneyNoReplacement', 'moderate', 'LP12 Guide part A4',
        'replacementAttorneys',
        'Only one attorney appointed and no replacement.',
        'The LPA will become useless if the single attorney loses capacity or is unable to act. Strongly recommended: add a replacement attorney in section 4.'
      ));
    }

    if (lpa.whenAttorneysCanAct === 'only_when_no_capacity') {
      flags.push(rule(
        'OnlyWhenNoCapacitySelected', 'moderate', 'LP12 Guide part A5',
        'whenAttorneysCanAct',
        'Restricted to incapacity only.',
        'This option restricts the LPA to incapacity only and means attorneys cannot help with finances while you still have capacity. Banks and other organisations may also require evidence of incapacity each time. Consider "as soon as the LPA is registered".'
      ));
    }

    if ((lpa.peopleToNotify || []).length === 0) {
      flags.push(rule(
        'NoPeopleToNotify', 'low', 'LP12 Guide part A8',
        'peopleToNotify',
        'No people-to-notify chosen.',
        'People-to-notify give an external safeguarding check. Strongly recommended: list at least one trusted person who is not an attorney.'
      ));
    }

    if ((lpa.instructionsText || '').length > 500) {
      flags.push(rule(
        'InstructionsLong', 'low', 'LP12 Guide part A9',
        'instructionsText',
        'Instructions exceed 500 characters.',
        'Long or complex instructions can be legally incorrect and may cause the OPG to reject the LPA. Consider redrafting with a solicitor, or moving content into "preferences" (which are non-binding guidance).'
      ));
    }

    if (!nonEmpty(lpa.preferencesText) && !nonEmpty(lpa.instructionsText)) {
      flags.push(rule(
        'PreferencesEmpty', 'low', 'LP12 Guide part A9',
        'preferencesText',
        'Both preferences and instructions empty.',
        'Optional. The donor may want to leave non-binding preferences (e.g. "consult my children before selling the family home").'
      ));
    }

    (lpa.attorneys || []).forEach(function (a, i) {
      if (!a.isTrustCorporation && !nonEmpty(a.email)) {
        flags.push(rule(
          'AttorneyEmailMissing', 'low', 'LP1F section 2',
          'attorneys[' + i + '].email',
          'Attorney ' + (i + 1) + ' has no email address.',
          'Optional. OPG can deal with attorneys by post; email speeds up later correspondence.'
        ));
      }
    });

    if (!nonEmpty(lpa.prefersToBeContactedBy) && !lpa.prefersPost && !lpa.prefersPhone && !lpa.prefersEmail) {
      flags.push(rule(
        'EmergencyContactMissing', 'low', 'LP1F section 13',
        'prefersToBeContactedBy',
        'No contact preference set in section 13.',
        'Optional. Set a contact preference so OPG knows how to reach the donor or applicant.'
      ));
    }

    if (lpa.reducedFeeRequested && !lpa.hasLpa120aEvidence) {
      flags.push(rule(
        'ReducedFeeWithoutLPA120A', 'high', 'OPG fee policy',
        'hasLpa120aEvidence',
        'Reduced fee requested without LPA120A evidence.',
        'If you are asking for a reduced or waived fee, you must complete form LPA120A and attach evidence (bank statement, benefit letter, payslip). Without this the OPG will charge the full fee or return the form.'
      ));
    }

    if ((lpa.attorneys || []).length > 4 && !lpa.hasContinuationSheet1) {
      flags.push(rule(
        'OverFourAttorneysNoContinuation', 'high', 'LPA Regs 2007 reg. 9(3)',
        'hasContinuationSheet1',
        'More than 4 attorneys but no LPC sheet 1.',
        'LP1F only has space for 4 attorneys. Attach LPC continuation sheet 1 for the rest.'
      ));
    }

    return flags;
  }

  // ---- band ------------------------------------------------------------

  function evaluateBand(lpa, blockers) {
    if (lpa.status === 'registered') return 'registered';
    if (lpa.status === 'submitted') return 'submitted';
    if (lpa.status === 'rejected') return 'rejected';

    const donor = lpa.donor || {};
    const requiredCore =
      nonEmpty(donor.firstNames) && nonEmpty(donor.lastName) && donor.dateOfBirth &&
      (lpa.attorneys || []).length > 0 &&
      nonEmpty(lpa.decisionMode) &&
      nonEmpty(lpa.whenAttorneysCanAct) &&
      lpa.legalRightsAcknowledged &&
      nonEmpty(lpa.applicantKind) &&
      nonEmpty(lpa.paymentMethod);
    if (!requiredCore) return 'draft';

    const donorSigned = !!(lpa.donorSignature && lpa.donorSignature.present);
    const cpSigned = !!(lpa.certificateProvider && lpa.certificateProvider.signature && lpa.certificateProvider.signature.present);
    const attorneysAllSigned = (lpa.attorneys || []).length > 0
      && (lpa.attorneySignatures || []).length >= lpa.attorneys.length
      && (lpa.attorneySignatures || []).slice(0, lpa.attorneys.length).every(s => s && s.present);
    const regSigned = (lpa.registrationSignatures || []).some(s => s && s.present);

    if (!donorSigned && !cpSigned && !attorneysAllSigned) return 'ready_for_signing';
    if (donorSigned && cpSigned && attorneysAllSigned && regSigned) {
      const feeOk = !lpa.reducedFeeRequested || lpa.hasLpa120aEvidence;
      return feeOk ? 'ready_for_registration' : 'fully_signed';
    }
    if (donorSigned && cpSigned && attorneysAllSigned) return 'fully_signed';
    if (donorSigned || cpSigned || (lpa.attorneySignatures || []).some(s => s && s.present)) return 'partially_signed';
    return 'ready_for_signing';
  }

  // ---- composite risk --------------------------------------------------

  function evaluateCompositeRisk(blockers, flags) {
    if (blockers.length > 0) return 'critical';
    const priorities = flags.map(f => f.priority);
    if (priorities.indexOf('high') !== -1) return 'high';
    if (priorities.indexOf('moderate') !== -1) return 'moderate';
    return 'low';
  }

  // ---- public API ------------------------------------------------------

  function validateLpa(lpa) {
    const safe = lpa || emptyLpa();
    const firedRules = evaluateBlockers(safe);
    const additionalFlags = evaluateFlags(safe);
    return {
      validityBand: evaluateBand(safe, firedRules),
      compositeRisk: evaluateCompositeRisk(firedRules, additionalFlags),
      firedRules: firedRules,
      additionalFlags: additionalFlags
    };
  }

  window.LpaValidator = {
    validateLpa: validateLpa,
    emptyLpa: emptyLpa,
    emptyPerson: emptyPerson,
    emptyWitness: emptyWitness
  };
  window.validateLpa = validateLpa;
})();
