import { P as derived, J as attr_class, a8 as stringify, V as escape_html, Q as ensure_array_like, G as attr, K as bind_props } from "../../../../chunks/renderer.js";
import { T as TOTAL_STEPS, S as STEPS } from "../../../../chunks/steps.js";
import "clsx";
let personCounter = 0;
function nextId(prefix) {
  personCounter += 1;
  return `${prefix}-${personCounter.toString(36)}`;
}
function createEmptyAddress() {
  return {
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    postcode: "",
    countryAsIso3166_1Alpha2: "GB"
  };
}
function createEmptyPerson() {
  return {
    id: nextId("person"),
    title: "",
    firstNames: "",
    lastName: "",
    otherNames: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: createEmptyAddress(),
    isTrustCorporation: false,
    trustCorporationNumber: "",
    isBankrupt: false,
    hasDebtReliefOrder: false
  };
}
function createEmptyLpa() {
  return {
    id: nextId("lpa"),
    donor: createEmptyPerson(),
    attorneys: [],
    replacementAttorneys: [],
    decisionMode: "",
    decisionModeMixedText: "",
    whenAttorneysCanAct: "",
    certificateProvider: null,
    peopleToNotify: [],
    preferencesText: "",
    instructionsText: "",
    preferencesAndInstructionsOverflow: {
      preferencesOverflowText: "",
      instructionsOverflowText: "",
      decisionsJointlyOverflowText: "",
      replacementStepInOverflowText: ""
    },
    legalRightsAcknowledged: false,
    signatures: [],
    continuationSheets: [],
    registrationApplication: {
      applicantKind: "",
      paymentMethod: "",
      cardPaymentPhone: "",
      reducedFeeRequested: false,
      hasLpa120aEvidence: false,
      isRepeatApplication: false,
      repeatCaseNumber: "",
      paymentReference: "",
      paymentDate: "",
      paymentAmount: null
    },
    registrationRecipient: {
      recipientKind: "",
      recipientPersonId: "",
      companyName: "",
      prefersPost: false,
      prefersPhone: false,
      prefersEmail: false,
      prefersWelsh: false,
      contactPhone: "",
      contactEmail: "",
      otherFirstNames: "",
      otherLastName: "",
      otherAddressLine1: "",
      otherAddressLine2: "",
      otherAddressLine3: "",
      otherPostcode: ""
    },
    opgReferenceNumber: "",
    opgRegistrationDate: "",
    status: "draft",
    signedDate: ""
  };
}
function ageOnDate(dob, referenceDate2) {
  if (!dob || !referenceDate2) return null;
  const birth = new Date(dob);
  const ref = new Date(referenceDate2);
  if (Number.isNaN(birth.valueOf()) || Number.isNaN(ref.valueOf())) return null;
  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (monthDiff < 0 || monthDiff === 0 && ref.getDate() < birth.getDate()) {
    age -= 1;
  }
  return age;
}
function todayIso() {
  const d = /* @__PURE__ */ new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function namesEqual(a, b) {
  const lhs = a.trim().toLowerCase();
  const rhs = b.trim().toLowerCase();
  if (!lhs || !rhs) return false;
  return lhs === rhs;
}
function personEquals(a, b) {
  if (a.id && b.id && a.id === b.id) return true;
  if (!a.dateOfBirth || !b.dateOfBirth) return false;
  if (a.dateOfBirth !== b.dateOfBirth) return false;
  return namesEqual(a.firstNames, b.firstNames) && namesEqual(a.lastName, b.lastName);
}
function referenceDate(lpa) {
  return lpa.signedDate || todayIso();
}
function donorUnderEighteen(lpa) {
  const age = ageOnDate(lpa.donor.dateOfBirth, referenceDate(lpa));
  if (age === null) return null;
  if (age >= 18) return null;
  return {
    ruleId: "DonorUnderEighteen",
    priority: "critical",
    citation: "MCA 2005 s. 9(2)(a)",
    fieldPath: "donor.dateOfBirth",
    message: "Donor is under 18 at the date of signing.",
    remediation: "The donor must be 18 or older to make an LPA. Check the date of birth in section 1, or wait until the donor is 18."
  };
}
function donorMustHaveCapacity(lpa) {
  const donorSig = lpa.signatures.find(
    (s) => s.role === "donor" && s.lp1fSection === 9
  );
  if (lpa.status === "" || lpa.status === "draft" || lpa.status === "ready_for_signing") {
    return null;
  }
  if (donorSig && donorSig.signedOn) return null;
  return {
    ruleId: "DonorMustHaveCapacity",
    priority: "critical",
    citation: "MCA 2005 s. 9(2)(c); Sch. 1 para. 2(1)(b)",
    fieldPath: "signatures[role=donor]",
    message: "Donor signature missing in section 9.",
    remediation: "The donor must sign section 9 themselves while they still have mental capacity. If the donor cannot physically sign, use LPC continuation sheet 3."
  };
}
function donorCannotSignWithoutContinuationSheet3(lpa) {
  const onBehalf = lpa.signatures.find(
    (s) => s.role === "signing_on_behalf_of_donor"
  );
  if (!onBehalf) return null;
  const hasSheet3 = lpa.continuationSheets.some(
    (s) => s.kind === "3_donor_cannot_sign"
  );
  if (hasSheet3) return null;
  return {
    ruleId: "DonorCannotSignWithoutContinuationSheet3",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 9(4) (approximate)",
    fieldPath: "continuationSheets[kind=3_donor_cannot_sign]",
    message: 'Donor signature is marked "signed on behalf of donor" but no LPC sheet 3 is attached.',
    remediation: "When the donor cannot physically sign, another adult may sign at the donor’s direction — but you must attach LPC continuation sheet 3 with witness details."
  };
}
function noAttorneyAppointed(lpa) {
  if (lpa.attorneys.length > 0) return null;
  return {
    ruleId: "NoAttorneyAppointed",
    priority: "critical",
    citation: "MCA 2005 s. 9(1)",
    fieldPath: "attorneys",
    message: "Section 2 contains zero attorneys.",
    remediation: "An LPA must appoint at least one attorney. Add an attorney in section 2."
  };
}
function attorneyUnderEighteen(lpa) {
  const ref = referenceDate(lpa);
  for (const a of lpa.attorneys) {
    if (a.person.isTrustCorporation) continue;
    const age = ageOnDate(a.person.dateOfBirth, ref);
    if (age !== null && age < 18) {
      return {
        ruleId: "AttorneyUnderEighteen",
        priority: "critical",
        citation: "MCA 2005 s. 10(1)(a)",
        fieldPath: `attorneys[${a.ordinal - 1}].person.dateOfBirth`,
        message: "An attorney is under 18.",
        remediation: "Attorneys must be 18 or older. Replace the under-18 attorney in section 2."
      };
    }
  }
  return null;
}
function attorneyBankruptOrDRO(lpa) {
  for (const a of lpa.attorneys) {
    if (a.person.isBankrupt || a.person.hasDebtReliefOrder) {
      return {
        ruleId: "AttorneyBankruptOrDRO",
        priority: "critical",
        citation: "MCA 2005 s. 10(2); s. 13(8)",
        fieldPath: `attorneys[${a.ordinal - 1}].person`,
        message: "An attorney is currently bankrupt or subject to a debt relief order.",
        remediation: "A bankrupt person, or someone subject to a debt relief order, cannot act as attorney for property and financial affairs. Replace the attorney before signing."
      };
    }
  }
  return null;
}
function trustCorporationMissingContinuationSheet4(lpa) {
  const hasTrust = lpa.attorneys.some((a) => a.person.isTrustCorporation);
  if (!hasTrust) return null;
  const hasSheet4 = lpa.continuationSheets.some(
    (s) => s.kind === "4_trust_corporation"
  );
  if (hasSheet4) return null;
  return {
    ruleId: "TrustCorporationMissingContinuationSheet4",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 9(5) (approximate)",
    fieldPath: "continuationSheets[kind=4_trust_corporation]",
    message: "A trust corporation is appointed but no LPC continuation sheet 4 is attached.",
    remediation: "When a trust corporation is appointed as attorney you must complete LPC continuation sheet 4 with the corporation’s details and seal."
  };
}
function overFourAttorneysNoContinuation(lpa) {
  if (lpa.attorneys.length <= 4) return null;
  const hasSheet1 = lpa.continuationSheets.some(
    (s) => s.kind === "1_additional_people"
  );
  if (hasSheet1) return null;
  return {
    ruleId: "OverFourAttorneysNoContinuation",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 9(3) (approximate)",
    fieldPath: "continuationSheets[kind=1_additional_people]",
    message: "Section 2 lists more than 4 attorneys but no LPC sheet 1 is attached.",
    remediation: "The LP1F has space for 4 attorneys. To appoint more, attach LPC continuation sheet 1 with their details."
  };
}
function jointlyButNoReplacement(lpa) {
  if (lpa.decisionMode !== "jointly") return null;
  if (lpa.replacementAttorneys.length > 0) return null;
  return {
    ruleId: "JointlyButNoReplacement",
    priority: "critical",
    citation: "MCA 2005 s. 10(4)(a); LP12 Guide part A6",
    fieldPath: "replacementAttorneys",
    message: 'Attorneys are appointed "jointly" but no replacement attorney is listed.',
    remediation: "When attorneys must act jointly, the LPA fails entirely if any one of them can no longer act. Strongly recommended: appoint at least one replacement attorney in section 4."
  };
}
function mixedDecisionWithoutContinuationSheet(lpa) {
  if (lpa.decisionMode !== "mixed") return null;
  const hasSheet2 = lpa.continuationSheets.some(
    (s) => s.kind === "2_additional_information"
  );
  const hasText = !!lpa.decisionModeMixedText.trim() || !!lpa.preferencesAndInstructionsOverflow.decisionsJointlyOverflowText.trim();
  if (hasSheet2 || hasText) return null;
  return {
    ruleId: "MixedDecisionWithoutContinuationSheet",
    priority: "critical",
    citation: "MCA 2005 s. 10(4)(c); LPA Regs 2007 reg. 5(2)",
    fieldPath: "decisionModeMixedText",
    message: "Mixed decision mode requires LPC sheet 2 listing the joint decisions.",
    remediation: 'The "mixed" mode requires you to specify which decisions are joint. Attach LPC continuation sheet 2 with that list.'
  };
}
function certificateProviderUnderEighteen(lpa) {
  const cp = lpa.certificateProvider;
  if (!cp) return null;
  const age = ageOnDate(cp.person.dateOfBirth, referenceDate(lpa));
  if (age === null) return null;
  if (age >= 18) return null;
  return {
    ruleId: "CertificateProviderUnderEighteen",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 8(1) (approximate)",
    fieldPath: "certificateProvider.person.dateOfBirth",
    message: "Certificate provider is under 18.",
    remediation: "The certificate provider must be an adult. Choose a different person for section 10."
  };
}
function certificateProviderIsAttorney(lpa) {
  const cp = lpa.certificateProvider;
  if (!cp) return null;
  const overlap = lpa.attorneys.some((a) => personEquals(a.person, cp.person)) || lpa.replacementAttorneys.some((a) => personEquals(a.person, cp.person));
  if (!overlap) return null;
  return {
    ruleId: "CertificateProviderIsAttorney",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 8(1)(c)",
    fieldPath: "certificateProvider.person",
    message: "Certificate provider also appears as attorney or replacement attorney.",
    remediation: "The certificate provider must be independent. They cannot also be one of the attorneys or replacement attorneys. Choose a different certificate provider."
  };
}
function certificateProviderRelatedToAttorney(lpa) {
  const cp = lpa.certificateProvider;
  if (!cp) return null;
  if (!cp.isRelatedToDonorOrAttorney) return null;
  return {
    ruleId: "CertificateProviderRelatedToAttorney",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 8(1)(d)",
    fieldPath: "certificateProvider.isRelatedToDonorOrAttorney",
    message: "Certificate provider is a family member of the donor or an attorney.",
    remediation: "The certificate provider cannot be a family member of the donor or any of the attorneys. Choose an independent person — a friend who has known the donor 2+ years, or a professional (GP, solicitor)."
  };
}
function certificateProviderIsCareHomeOwner(lpa) {
  const cp = lpa.certificateProvider;
  if (!cp) return null;
  if (!cp.isCareHomeOwnerOrEmployee) return null;
  return {
    ruleId: "CertificateProviderIsCareHomeOwner",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 8(2)",
    fieldPath: "certificateProvider.isCareHomeOwnerOrEmployee",
    message: "Certificate provider is connected with the donor’s care home.",
    remediation: "If the donor lives in a care home, no one connected with that care home can be the certificate provider. Choose an independent person."
  };
}
function witnessIsDonor(lpa) {
  const donorSig = lpa.signatures.find(
    (s) => s.role === "donor" && s.lp1fSection === 9
  );
  if (!donorSig || !donorSig.witness) return null;
  if (personEquals(donorSig.witness.person, lpa.donor)) {
    return {
      ruleId: "WitnessIsDonor",
      priority: "critical",
      citation: "LPA Regs 2007 reg. 9(2)",
      fieldPath: "signatures[role=donor].witness",
      message: "Donor’s signature witness is the donor.",
      remediation: "A witness must be someone other than the person signing. Choose a different witness for the donor’s signature."
    };
  }
  return null;
}
function witnessIsAttorney(lpa) {
  const donorSig = lpa.signatures.find(
    (s) => s.role === "donor" && s.lp1fSection === 9
  );
  if (!donorSig || !donorSig.witness) return null;
  const overlap = lpa.attorneys.some(
    (a) => personEquals(a.person, donorSig.witness.person)
  ) || lpa.replacementAttorneys.some(
    (a) => personEquals(a.person, donorSig.witness.person)
  );
  if (!overlap) return null;
  return {
    ruleId: "WitnessIsAttorney",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 9(2)",
    fieldPath: "signatures[role=donor].witness",
    message: "Donor’s signature witness is also an attorney or replacement attorney.",
    remediation: "The donor’s signature must be witnessed by someone who is not one of the attorneys or replacement attorneys."
  };
}
function attorneyWitnessIsDonor(lpa) {
  const attorneySigs = lpa.signatures.filter(
    (s) => (s.role === "attorney" || s.role === "replacement_attorney") && s.lp1fSection === 11
  );
  for (const s of attorneySigs) {
    if (s.witness && personEquals(s.witness.person, lpa.donor)) {
      return {
        ruleId: "AttorneyWitnessIsDonor",
        priority: "critical",
        citation: "LPA Regs 2007 reg. 9(2)",
        fieldPath: "signatures[role=attorney].witness",
        message: "An attorney’s signature witness is the donor.",
        remediation: "An attorney’s signature must be witnessed by someone other than the donor. Choose a different witness for each attorney."
      };
    }
  }
  return null;
}
function peopleToNotifyExceedsFive(lpa) {
  if (lpa.peopleToNotify.length <= 5) return null;
  return {
    ruleId: "PeopleToNotifyExceedsFive",
    priority: "critical",
    citation: "LP1F section 6; LP12 Guide part A8",
    fieldPath: "peopleToNotify",
    message: "More than 5 people to notify listed.",
    remediation: "You can name up to 5 people to notify. Remove anyone above the fifth, or move them off the form."
  };
}
function personToNotifyIsAttorney(lpa) {
  for (const ptn of lpa.peopleToNotify) {
    const overlap = lpa.attorneys.some((a) => personEquals(a.person, ptn.person)) || lpa.replacementAttorneys.some(
      (a) => personEquals(a.person, ptn.person)
    );
    if (overlap) {
      return {
        ruleId: "PersonToNotifyIsAttorney",
        priority: "critical",
        citation: "LP1F section 6 inline restriction (approximate)",
        fieldPath: `peopleToNotify[${ptn.ordinal - 1}].person`,
        message: "A person-to-notify is also listed as attorney or replacement attorney.",
        remediation: "A person who is going to be an attorney cannot also be a person-to-notify. Choose someone else, or remove them from section 6."
      };
    }
  }
  return null;
}
function signingOrderViolation(lpa) {
  const donorSig = lpa.signatures.find(
    (s) => s.role === "donor" && s.lp1fSection === 9
  );
  const cpSig = lpa.signatures.find(
    (s) => s.role === "certificate_provider" && s.lp1fSection === 10
  );
  const attorneySigs = lpa.signatures.filter(
    (s) => (s.role === "attorney" || s.role === "replacement_attorney") && s.lp1fSection === 11
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
  function makeOrderViolation() {
    return {
      ruleId: "SigningOrderViolation",
      priority: "critical",
      citation: "LPA Regs 2007 reg. 9(6)",
      fieldPath: "signatures[*].signedOn",
      message: "Signatures are not in the order donor (s.9) → certificate provider (s.10) → attorneys (s.11).",
      remediation: "The signing order is fixed: donor first (section 9), then certificate provider (section 10), then attorneys (section 11). Re-sign in the correct order; do not change dates."
    };
  }
}
function registrationApplicantInvalid(lpa) {
  const app = lpa.registrationApplication;
  if (!app.applicantKind) return null;
  if (app.applicantKind === "donor") return null;
  if (app.applicantKind === "attorneys") {
    if (lpa.decisionMode === "jointly") {
      const applicantSigs = lpa.signatures.filter(
        (s) => s.role === "applicant" && s.lp1fSection === 15
      );
      const everyAttorneySigned = lpa.attorneys.every(
        (a) => applicantSigs.some((s) => s.signatoryPersonId === a.person.id)
      );
      if (!everyAttorneySigned) {
        return {
          ruleId: "RegistrationApplicantInvalid",
          priority: "critical",
          citation: "LPA Regs 2007 reg. 11",
          fieldPath: "signatures[role=applicant]",
          message: "Attorneys are appointed jointly but not all of them have signed section 15.",
          remediation: "Only the donor or one or more of the attorneys may apply to register. If attorneys are joint, all of them must sign the registration application in section 15."
        };
      }
    }
    return null;
  }
  return {
    ruleId: "RegistrationApplicantInvalid",
    priority: "critical",
    citation: "LPA Regs 2007 reg. 11",
    fieldPath: "registrationApplication.applicantKind",
    message: "Applicant kind is neither donor nor attorneys.",
    remediation: "Only the donor or one or more of the attorneys may apply to register."
  };
}
const BLOCKER_RULES = [
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
  registrationApplicantInvalid
];
function applyBlockerRules(lpa) {
  const fired = [];
  for (const rule of BLOCKER_RULES) {
    const r = rule(lpa);
    if (r) fired.push(r);
  }
  return fired;
}
function singleAttorneyNoReplacement(lpa) {
  if (lpa.attorneys.length !== 1) return null;
  if (lpa.replacementAttorneys.length > 0) return null;
  return {
    ruleId: "SingleAttorneyNoReplacement",
    priority: "moderate",
    citation: "LP12 Guide part A4",
    fieldPath: "replacementAttorneys",
    message: "Only one attorney is appointed and no replacement attorney is listed.",
    remediation: "The LPA will become useless if the single attorney loses capacity or is unable to act. Strongly recommended: add a replacement attorney in section 4."
  };
}
function onlyWhenNoCapacitySelected(lpa) {
  if (lpa.whenAttorneysCanAct !== "only_when_no_capacity") return null;
  return {
    ruleId: "OnlyWhenNoCapacitySelected",
    priority: "moderate",
    citation: "LP12 Guide part A5",
    fieldPath: "whenAttorneysCanAct",
    message: "Attorneys can act only when the donor has no capacity.",
    remediation: 'This option restricts the LPA to incapacity only and means attorneys cannot help with finances while you still have capacity. Banks and other organisations may also require evidence of incapacity each time. Consider "as soon as the LPA is registered".'
  };
}
function noPeopleToNotify(lpa) {
  if (lpa.peopleToNotify.length > 0) return null;
  return {
    ruleId: "NoPeopleToNotify",
    priority: "low",
    citation: "LP12 Guide part A8",
    fieldPath: "peopleToNotify",
    message: "No people-to-notify are listed.",
    remediation: "People-to-notify give an external safeguarding check. Strongly recommended: list at least one trusted person who is not an attorney."
  };
}
function instructionsLong(lpa) {
  if (lpa.instructionsText.length <= 500) return null;
  return {
    ruleId: "InstructionsLong",
    priority: "low",
    citation: "LP12 Guide part A9",
    fieldPath: "instructionsText",
    message: "Instructions are longer than 500 characters.",
    remediation: 'Long or complex instructions can be legally incorrect and may cause the OPG to reject the LPA. Consider redrafting with a solicitor, or moving content into "preferences" (which are non-binding guidance).'
  };
}
function preferencesEmpty(lpa) {
  if (lpa.preferencesText.trim() || lpa.instructionsText.trim()) return null;
  return {
    ruleId: "PreferencesEmpty",
    priority: "low",
    citation: "LP12 Guide part A9",
    fieldPath: "preferencesText",
    message: "Both preferences and instructions are empty.",
    remediation: 'Optional. The donor may want to leave non-binding preferences (e.g. "consult my children before selling the family home").'
  };
}
function attorneyEmailMissing(lpa) {
  const anyMissing = lpa.attorneys.some(
    (a) => !a.person.email.trim() && !a.person.isTrustCorporation
  );
  if (!anyMissing) return null;
  return {
    ruleId: "AttorneyEmailMissing",
    priority: "low",
    citation: "LP1F section 2",
    fieldPath: "attorneys[*].person.email",
    message: "One or more attorneys have no email address.",
    remediation: "Optional. OPG can deal with attorneys by post; email speeds up later correspondence."
  };
}
function emergencyContactMissing(lpa) {
  const r = lpa.registrationRecipient;
  if (r.prefersPost || r.prefersPhone || r.prefersEmail) return null;
  return {
    ruleId: "EmergencyContactMissing",
    priority: "low",
    citation: "LP1F section 13",
    fieldPath: "registrationRecipient",
    message: "No preferred contact method selected.",
    remediation: "Optional. Set a contact preference so OPG knows how to reach the donor or applicant."
  };
}
function reducedFeeWithoutLPA120A(lpa) {
  const app = lpa.registrationApplication;
  if (!app.reducedFeeRequested) return null;
  if (app.hasLpa120aEvidence) return null;
  return {
    ruleId: "ReducedFeeWithoutLPA120A",
    priority: "high",
    citation: "OPG fee policy; LPA120A",
    fieldPath: "registrationApplication.hasLpa120aEvidence",
    message: "Reduced fee requested without LPA120A evidence.",
    remediation: "If you are asking for a reduced or waived fee, you must complete form LPA120A and attach evidence (bank statement, benefit letter, payslip). Without this the OPG will charge the full fee or return the form."
  };
}
function overFourAttorneysFlag(lpa) {
  if (lpa.attorneys.length <= 4) return null;
  const hasSheet1 = lpa.continuationSheets.some(
    (s) => s.kind === "1_additional_people"
  );
  if (hasSheet1) return null;
  return {
    ruleId: "OverFourAttorneysNoContinuation",
    priority: "high",
    citation: "LPA Regs 2007 reg. 9(3) (approximate)",
    fieldPath: "continuationSheets[kind=1_additional_people]",
    message: "More than 4 attorneys but no LPC sheet 1 attached.",
    remediation: "LP1F only has space for 4 attorneys. Attach LPC continuation sheet 1 for the rest."
  };
}
const FLAG_RULES = [
  reducedFeeWithoutLPA120A,
  overFourAttorneysFlag,
  singleAttorneyNoReplacement,
  onlyWhenNoCapacitySelected,
  noPeopleToNotify,
  instructionsLong,
  preferencesEmpty,
  attorneyEmailMissing,
  emergencyContactMissing
];
function applyFlagRules(lpa) {
  const fired = [];
  for (const rule of FLAG_RULES) {
    const r = rule(lpa);
    if (r) fired.push(r);
  }
  return fired;
}
function computeValidityBand(lpa) {
  if (lpa.status === "registered") return "registered";
  if (lpa.status === "rejected") return "rejected";
  if (lpa.status === "submitted") return "submitted";
  const donorSigned = lpa.signatures.some(
    (s) => s.role === "donor" && s.lp1fSection === 9 && !!s.signedOn
  );
  const cpSigned = lpa.signatures.some(
    (s) => s.role === "certificate_provider" && s.lp1fSection === 10 && !!s.signedOn
  );
  const allAttorneysSigned = lpa.attorneys.length > 0 && lpa.attorneys.every(
    (a) => lpa.signatures.some(
      (s) => (s.role === "attorney" || s.role === "replacement_attorney") && s.lp1fSection === 11 && s.signatoryPersonId === a.person.id && !!s.signedOn
    )
  );
  const section15Signed = lpa.signatures.some(
    (s) => s.role === "applicant" && s.lp1fSection === 15 && !!s.signedOn
  );
  const feeOk = !!lpa.registrationApplication.paymentMethod && (!lpa.registrationApplication.reducedFeeRequested || lpa.registrationApplication.hasLpa120aEvidence);
  if (donorSigned && cpSigned && allAttorneysSigned && section15Signed && feeOk) {
    return "ready_for_registration";
  }
  if (donorSigned && cpSigned && allAttorneysSigned) {
    return "fully_signed";
  }
  if (donorSigned) {
    return "partially_signed";
  }
  const ready = !!lpa.donor.firstNames.trim() && !!lpa.donor.lastName.trim() && !!lpa.donor.dateOfBirth && lpa.attorneys.length > 0 && !!lpa.decisionMode && !!lpa.whenAttorneysCanAct && !!lpa.certificateProvider;
  return ready ? "ready_for_signing" : "draft";
}
function computeCompositeRisk(firedRules, flags) {
  if (firedRules.length > 0) return "critical";
  if (flags.some((f) => f.priority === "high")) return "high";
  if (flags.some((f) => f.priority === "moderate")) return "moderate";
  return "low";
}
function validateLpa(lpa) {
  const firedRules = applyBlockerRules(lpa);
  const additionalFlags = applyFlagRules(lpa);
  const compositeRisk = computeCompositeRisk(firedRules, additionalFlags);
  const validityBand = computeValidityBand(lpa);
  return {
    validityBand,
    compositeRisk,
    firedRules,
    additionalFlags
  };
}
class LpaStore {
  data = createEmptyLpa();
  currentStep = 1;
  #result = derived(() => validateLpa(this.data));
  get result() {
    return this.#result();
  }
  set result($$value) {
    return this.#result($$value);
  }
  reset() {
    this.data = createEmptyLpa();
    this.currentStep = 1;
  }
  goto(n) {
    if (n >= 1 && n <= TOTAL_STEPS) this.currentStep = n;
  }
  addAttorney() {
    this.data.attorneys.push({
      person: createEmptyPerson(),
      ordinal: this.data.attorneys.length + 1
    });
  }
  removeAttorney(idx) {
    this.data.attorneys.splice(idx, 1);
    this.data.attorneys.forEach((a, i) => {
      a.ordinal = i + 1;
    });
  }
  addReplacementAttorney() {
    this.data.replacementAttorneys.push({
      person: createEmptyPerson(),
      ordinal: this.data.replacementAttorneys.length + 1,
      replacementStepInCondition: ""
    });
  }
  removeReplacementAttorney(idx) {
    this.data.replacementAttorneys.splice(idx, 1);
    this.data.replacementAttorneys.forEach((a, i) => {
      a.ordinal = i + 1;
    });
  }
  addPersonToNotify() {
    if (this.data.peopleToNotify.length >= 5) return;
    this.data.peopleToNotify.push({
      person: createEmptyPerson(),
      ordinal: this.data.peopleToNotify.length + 1
    });
  }
  removePersonToNotify(idx) {
    this.data.peopleToNotify.splice(idx, 1);
    this.data.peopleToNotify.forEach((p, i) => {
      p.ordinal = i + 1;
    });
  }
  ensureCertificateProvider() {
    if (!this.data.certificateProvider) {
      this.data.certificateProvider = {
        person: createEmptyPerson(),
        knowsDonorAs: "",
        isOverEighteen: false,
        readLpa: false,
        noRestrictionsOnActing: false,
        isRelatedToDonorOrAttorney: false,
        isCareHomeOwnerOrEmployee: false,
        eligibilityConfirmationAt: ""
      };
    }
  }
}
const store = new LpaStore();
function ValidationSummary($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const result = derived(() => store.result);
    function riskClass(risk) {
      if (risk === "critical") return "bg-red-100 text-red-900 border-red-300";
      if (risk === "high") return "bg-orange-100 text-orange-900 border-orange-300";
      if (risk === "moderate") return "bg-yellow-100 text-yellow-900 border-yellow-300";
      return "bg-green-100 text-green-900 border-green-300";
    }
    $$renderer2.push(`<aside${attr_class(`border rounded p-4 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto ${stringify(riskClass(result().compositeRisk))}`)}><h3 class="text-sm font-bold uppercase tracking-wide">Validation</h3> <p class="text-xs mt-1">Validity band: <span class="font-mono">${escape_html(result().validityBand)}</span></p> <p class="text-xs">Composite risk: <span class="font-mono">${escape_html(result().compositeRisk)}</span></p> `);
    if (result().firedRules.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-3"><h4 class="text-xs font-bold uppercase">Statutory blockers (${escape_html(result().firedRules.length)})</h4> <ul class="mt-1 space-y-2"><!--[-->`);
      const each_array = ensure_array_like(result().firedRules);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let r = each_array[$$index];
        $$renderer2.push(`<li class="text-xs"><p class="font-semibold">${escape_html(r.ruleId)}</p> <p class="opacity-80">${escape_html(r.message)}</p> <p class="opacity-60 italic">${escape_html(r.citation)}</p> <p class="opacity-80">${escape_html(r.remediation)}</p></li>`);
      }
      $$renderer2.push(`<!--]--></ul></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (result().additionalFlags.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-3"><h4 class="text-xs font-bold uppercase">Flags (${escape_html(result().additionalFlags.length)})</h4> <ul class="mt-1 space-y-2"><!--[-->`);
      const each_array_1 = ensure_array_like(result().additionalFlags);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let f = each_array_1[$$index_1];
        $$renderer2.push(`<li class="text-xs"><p class="font-semibold">${escape_html(f.ruleId)} (${escape_html(f.priority)})</p> <p class="opacity-80">${escape_html(f.message)}</p> <p class="opacity-80">${escape_html(f.remediation)}</p></li>`);
      }
      $$renderer2.push(`<!--]--></ul></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (result().firedRules.length === 0 && result().additionalFlags.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-xs mt-3">No issues detected.</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></aside>`);
  });
}
function WizardNav($$renderer) {
  $$renderer.push(`<nav class="bg-white border border-slate-200 rounded-lg p-3 sticky top-4"><h3 class="text-sm font-bold uppercase tracking-wide text-slate-700 mb-2">Steps</h3> <ol class="space-y-1"><!--[-->`);
  const each_array = ensure_array_like(STEPS);
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let s = each_array[$$index];
    $$renderer.push(`<li><a${attr("href", `#step-${stringify(s.number)}`)} class="block text-sm text-slate-700 hover:text-brand-700 hover:bg-brand-50 rounded px-2 py-1"><span class="font-mono text-xs text-slate-500">${escape_html(s.number)}.</span> ${escape_html(s.short)}</a></li>`);
  }
  $$renderer.push(`<!--]--></ol></nav>`);
}
function Field($$renderer, $$props) {
  let { label, hint = "", children } = $$props;
  $$renderer.push(`<label class="block"><span class="text-sm text-slate-700 font-medium">${escape_html(label)}</span> `);
  if (hint) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<span class="text-xs text-slate-500 block mb-1">${escape_html(hint)}</span>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--> `);
  children($$renderer);
  $$renderer.push(`<!----></label>`);
}
function TextInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = "", placeholder = "", type = "text" } = $$props;
    $$renderer2.push(`<input${attr("type", type)}${attr("placeholder", placeholder)}${attr("value", value)} class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-brand-500"/>`);
    bind_props($$props, { value });
  });
}
function DateInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = "" } = $$props;
    $$renderer2.push(`<input type="date"${attr("value", value)} class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-brand-500"/>`);
    bind_props($$props, { value });
  });
}
function CheckboxField($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { label, checked = false } = $$props;
    $$renderer2.push(`<label class="inline-flex items-start gap-2"><input type="checkbox"${attr("checked", checked, true)} class="mt-1"/> <span class="text-sm text-slate-700">${escape_html(label)}</span></label>`);
    bind_props($$props, { checked });
  });
}
function AddressInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { address = void 0 } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3">`);
      Field($$renderer3, {
        label: "Address line 1",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            placeholder: "House number and street",
            get value() {
              return address.addressLine1;
            },
            set value($$value) {
              address.addressLine1 = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Address line 2",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            placeholder: "Locality",
            get value() {
              return address.addressLine2;
            },
            set value($$value) {
              address.addressLine2 = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Address line 3",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            placeholder: "Town / city",
            get value() {
              return address.addressLine3;
            },
            set value($$value) {
              address.addressLine3 = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Postcode",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            placeholder: "e.g. SW1A 1AA",
            get value() {
              return address.postcode;
            },
            set value($$value) {
              address.postcode = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Country",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            placeholder: "GB",
            get value() {
              return address.countryAsIso3166_1Alpha2;
            },
            set value($$value) {
              address.countryAsIso3166_1Alpha2 = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { address });
  });
}
function PersonCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      person = void 0,
      showTrustCorporation = false,
      showBankruptcyFlags = false,
      showEmail = true
    } = $$props;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-3"><div class="grid grid-cols-1 md:grid-cols-3 gap-3">`);
      Field($$renderer3, {
        label: "Title",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            placeholder: "Mr / Mrs / Mx / Dr",
            get value() {
              return person.title;
            },
            set value($$value) {
              person.title = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "First names",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            get value() {
              return person.firstNames;
            },
            set value($$value) {
              person.firstNames = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Last name",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            get value() {
              return person.lastName;
            },
            set value($$value) {
              person.lastName = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Other names known by",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            get value() {
              return person.otherNames;
            },
            set value($$value) {
              person.otherNames = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Date of birth",
        children: ($$renderer4) => {
          DateInput($$renderer4, {
            get value() {
              return person.dateOfBirth;
            },
            set value($$value) {
              person.dateOfBirth = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      if (showEmail) {
        $$renderer3.push("<!--[0-->");
        Field($$renderer3, {
          label: "Email",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              type: "email",
              get value() {
                return person.email;
              },
              set value($$value) {
                person.email = $$value;
                $$settled = false;
              }
            });
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      Field($$renderer3, {
        label: "Phone",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            type: "tel",
            get value() {
              return person.phone;
            },
            set value($$value) {
              person.phone = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----></div> `);
      AddressInput($$renderer3, {
        get address() {
          return person.address;
        },
        set address($$value) {
          person.address = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (showTrustCorporation) {
        $$renderer3.push("<!--[0-->");
        CheckboxField($$renderer3, {
          label: "This attorney is a trust corporation",
          get checked() {
            return person.isTrustCorporation;
          },
          set checked($$value) {
            person.isTrustCorporation = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        if (person.isTrustCorporation) {
          $$renderer3.push("<!--[0-->");
          Field($$renderer3, {
            label: "Trust corporation number",
            children: ($$renderer4) => {
              TextInput($$renderer4, {
                get value() {
                  return person.trustCorporationNumber;
                },
                set value($$value) {
                  person.trustCorporationNumber = $$value;
                  $$settled = false;
                }
              });
            }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (showBankruptcyFlags) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="space-y-1">`);
        CheckboxField($$renderer3, {
          label: "Currently bankrupt",
          get checked() {
            return person.isBankrupt;
          },
          set checked($$value) {
            person.isBankrupt = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        CheckboxField($$renderer3, {
          label: "Subject to a debt relief order",
          get checked() {
            return person.hasDebtReliefOrder;
          },
          set checked($$value) {
            person.hasDebtReliefOrder = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { person });
  });
}
function Step1Donor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 1 — Donor (LP1F section 1)</h2> <p class="text-sm text-slate-600 mb-3">The person making the LPA. Must be 18 or older and have mental capacity at the time of signing.</p> `);
      PersonCard($$renderer3, {
        get person() {
          return store.data.donor;
        },
        set person($$value) {
          store.data.donor = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step2Attorneys($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 2 — Attorneys (LP1F section 2)</h2> <p class="text-sm text-slate-600 mb-3">One or more people (or a single trust corporation) who will make financial decisions for the donor.
    Each attorney must be 18+, not bankrupt, and not subject to a debt relief order. If you appoint
    more than 4 attorneys, attach LPC continuation sheet 1.</p> <div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(store.data.attorneys);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let a = each_array[i];
        $$renderer3.push(`<div class="space-y-2"><div class="flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-700">Attorney #${escape_html(a.ordinal)}</h3> <button type="button" class="text-xs text-red-700 hover:underline">Remove</button></div> `);
        PersonCard($$renderer3, {
          showTrustCorporation: true,
          showBankruptcyFlags: true,
          get person() {
            return store.data.attorneys[i].person;
          },
          set person($$value) {
            store.data.attorneys[i].person = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--></div> <button type="button" class="mt-4 px-3 py-2 rounded bg-brand-600 text-white text-sm hover:bg-brand-700">Add attorney</button></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function RadioGroup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { name, options, value = "" } = $$props;
    $$renderer2.push(`<div class="flex flex-col gap-1"><!--[-->`);
    const each_array = ensure_array_like(options);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let opt = each_array[$$index];
      $$renderer2.push(`<label class="inline-flex items-start gap-2"><input type="radio"${attr("name", name)}${attr("value", opt.value)}${attr("checked", value === opt.value, true)} class="mt-1"/> <span class="text-sm text-slate-700">${escape_html(opt.label)}</span></label>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
function TextareaInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = "", rows = 4, maxlength = 2e3, placeholder = "" } = $$props;
    $$renderer2.push(`<textarea${attr("rows", rows)}${attr("maxlength", maxlength)}${attr("placeholder", placeholder)} class="w-full border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-brand-500">`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <span class="text-xs text-slate-500">${escape_html(value.length)} / ${escape_html(maxlength)}</span>`);
    bind_props($$props, { value });
  });
}
function Step3DecisionMode($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const options = [
      {
        value: "single_attorney",
        label: "Single attorney (only one attorney appointed)"
      },
      {
        value: "jointly_and_severally",
        label: "Jointly and severally (attorneys can act together or independently)"
      },
      {
        value: "jointly",
        label: "Jointly (attorneys must always act together)"
      },
      {
        value: "mixed",
        label: "Jointly for some decisions, jointly and severally for others (mixed)"
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 3 — How attorneys make decisions (LP1F section 3)</h2> <p class="text-sm text-slate-600 mb-3">Choose how the attorneys must act. “Jointly” means the LPA fails if any attorney drops
    out unless you have a replacement. “Mixed” requires LPC continuation sheet 2 listing
    which decisions are joint.</p> `);
      RadioGroup($$renderer3, {
        name: "decisionMode",
        options,
        get value() {
          return store.data.decisionMode;
        },
        set value($$value) {
          store.data.decisionMode = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (store.data.decisionMode === "mixed") {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="mt-3">`);
        Field($$renderer3, {
          label: "Which decisions are joint?",
          hint: "Brief summary; long lists continue on LPC sheet 2.",
          children: ($$renderer4) => {
            TextareaInput($$renderer4, {
              rows: 4,
              maxlength: 2e3,
              get value() {
                return store.data.decisionModeMixedText;
              },
              set value($$value) {
                store.data.decisionModeMixedText = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step4ReplacementAttorneys($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 4 — Replacement attorneys (LP1F section 4)</h2> <p class="text-sm text-slate-600 mb-3">Zero or more people who step in if an original attorney can no longer act. Strongly
    recommended when attorneys are appointed jointly. Optional “when and how” override
    continues on LPC sheet 2 if long.</p> <div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(store.data.replacementAttorneys);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let r = each_array[i];
        $$renderer3.push(`<div class="space-y-2"><div class="flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-700">Replacement #${escape_html(r.ordinal)}</h3> <button type="button" class="text-xs text-red-700 hover:underline">Remove</button></div> `);
        PersonCard($$renderer3, {
          showBankruptcyFlags: true,
          get person() {
            return store.data.replacementAttorneys[i].person;
          },
          set person($$value) {
            store.data.replacementAttorneys[i].person = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Step-in condition (optional)",
          hint: "When and how this replacement takes over.",
          children: ($$renderer4) => {
            TextareaInput($$renderer4, {
              rows: 2,
              maxlength: 500,
              get value() {
                return store.data.replacementAttorneys[i].replacementStepInCondition;
              },
              set value($$value) {
                store.data.replacementAttorneys[i].replacementStepInCondition = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--></div> <button type="button" class="mt-4 px-3 py-2 rounded bg-brand-600 text-white text-sm hover:bg-brand-700">Add replacement attorney</button></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step5WhenAttorneysCanAct($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const options = [
      {
        value: "as_soon_as_registered",
        label: "As soon as the LPA is registered (recommended) — attorneys may help with finances while the donor still has capacity, with the donor’s consent."
      },
      {
        value: "only_when_no_capacity",
        label: "Only when the donor does not have mental capacity — attorneys cannot act until evidence of incapacity is provided."
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 5 — When attorneys can act (LP1F section 5)</h2> <p class="text-sm text-slate-600 mb-3">Decide when the attorneys can begin using the LPA. The “only when no capacity” option
    significantly restricts day-to-day usefulness.</p> `);
      RadioGroup($$renderer3, {
        name: "whenCanAct",
        options,
        get value() {
          return store.data.whenAttorneysCanAct;
        },
        set value($$value) {
          store.data.whenAttorneysCanAct = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step6PeopleToNotify($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 6 — People to notify (LP1F section 6)</h2> <p class="text-sm text-slate-600 mb-3">Up to 5 people who will be notified when the OPG is asked to register the LPA. They can object
    if they have concerns. People-to-notify cannot also be attorneys.</p> <div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(store.data.peopleToNotify);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let p = each_array[i];
        $$renderer3.push(`<div class="space-y-2"><div class="flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-700">Person to notify #${escape_html(p.ordinal)}</h3> <button type="button" class="text-xs text-red-700 hover:underline">Remove</button></div> `);
        PersonCard($$renderer3, {
          showEmail: false,
          get person() {
            return store.data.peopleToNotify[i].person;
          },
          set person($$value) {
            store.data.peopleToNotify[i].person = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--></div> `);
      if (store.data.peopleToNotify.length < 5) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button type="button" class="mt-4 px-3 py-2 rounded bg-brand-600 text-white text-sm hover:bg-brand-700">Add person to notify</button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<p class="mt-2 text-xs text-slate-500">Maximum of 5 people to notify reached.</p>`);
      }
      $$renderer3.push(`<!--]--></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step7PreferencesAndInstructions($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 7 — Preferences and instructions (LP1F section 7)</h2> <p class="text-sm text-slate-600 mb-3">Preferences are non-binding guidance. Instructions are legally binding on the attorneys.
    Long or complex instructions risk OPG rejection \\u2014 keep them clear and concrete.</p> <div class="space-y-4">`);
      Field($$renderer3, {
        label: "Preferences (optional, non-binding)",
        children: ($$renderer4) => {
          TextareaInput($$renderer4, {
            rows: 5,
            maxlength: 2e3,
            get value() {
              return store.data.preferencesText;
            },
            set value($$value) {
              store.data.preferencesText = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Instructions (legally binding)",
        children: ($$renderer4) => {
          TextareaInput($$renderer4, {
            rows: 5,
            maxlength: 2e3,
            get value() {
              return store.data.instructionsText;
            },
            set value($$value) {
              store.data.instructionsText = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----></div></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step8LegalRights($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 8 — Legal rights (LP1F section 8)</h2> <p class="text-sm text-slate-600 mb-3">The donor must read and understand the legal-rights statement printed on the LP1F. By
    confirming below, the donor acknowledges they have read this section.</p> <div class="bg-slate-100 rounded p-3 text-sm text-slate-700"><p>As donor, I understand: my attorneys will act in my best interests under the Mental
      Capacity Act 2005; the LPA must be registered with the OPG before it can be used; I can
      cancel the LPA at any time while I have mental capacity; I am giving my attorneys legal
      authority to manage my property and financial affairs.</p></div> <div class="mt-3">`);
      CheckboxField($$renderer3, {
        label: "I have read and understood the legal rights statement.",
        get checked() {
          return store.data.legalRightsAcknowledged;
        },
        set checked($$value) {
          store.data.legalRightsAcknowledged = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function SignaturePad($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value = "", label = "Signature (typed)" } = $$props;
    $$renderer2.push(`<label class="block"><span class="text-sm text-slate-700 font-medium">${escape_html(label)}</span> <span class="text-xs text-slate-500 block mb-1">Type the signatory’s full name. A wet-ink signature is required on the printed PDF.</span> <input type="text"${attr("value", value)} class="w-full border border-slate-300 rounded px-2 py-2 font-serif italic text-lg focus:outline-none focus:ring focus:ring-brand-500" placeholder="(signature)"/></label>`);
    bind_props($$props, { value });
  });
}
function Step9DonorSignature($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    function ensureDonorSignature() {
      let sig = store.data.signatures.find((s) => s.role === "donor" && s.lp1fSection === 9);
      if (!sig) {
        sig = {
          id: `sig-donor-${store.data.donor.id}`,
          signatoryPersonId: store.data.donor.id,
          role: "donor",
          lp1fSection: 9,
          signatureBlobPath: "",
          signedOn: "",
          signedOnBehalfFullName: "",
          isWitnessed: true,
          witness: {
            person: createEmptyPerson(),
            witnessSignatureBlobPath: "",
            witnessedOn: ""
          }
        };
        store.data.signatures.push(sig);
      }
      return sig;
    }
    const donorSig = derived(ensureDonorSignature);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 9 — Donor signature (LP1F section 9)</h2> <p class="text-sm text-slate-600 mb-3">The donor signs in the presence of an adult witness. The witness must not be the donor or
    one of the attorneys. If the donor cannot physically sign, attach LPC continuation sheet 3.</p> <div class="space-y-4">`);
      SignaturePad($$renderer3, {
        label: "Donor signature",
        get value() {
          return donorSig().signatureBlobPath;
        },
        set value($$value) {
          donorSig().signatureBlobPath = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Date signed",
        children: ($$renderer4) => {
          DateInput($$renderer4, {
            get value() {
              return donorSig().signedOn;
            },
            set value($$value) {
              donorSig().signedOn = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Signed on behalf (full name, optional)",
        hint: "Only complete if the donor cannot sign and another adult signs at the donor's direction; requires LPC sheet 3.",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            get value() {
              return donorSig().signedOnBehalfFullName;
            },
            set value($$value) {
              donorSig().signedOnBehalfFullName = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> <h3 class="text-sm font-semibold mt-3 text-slate-700">Witness</h3> `);
      if (donorSig().witness) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3">`);
        Field($$renderer3, {
          label: "Witness first names",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return donorSig().witness.person.firstNames;
              },
              set value($$value) {
                donorSig().witness.person.firstNames = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Witness last name",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return donorSig().witness.person.lastName;
              },
              set value($$value) {
                donorSig().witness.person.lastName = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----></div> `);
        AddressInput($$renderer3, {
          get address() {
            return donorSig().witness.person.address;
          },
          set address($$value) {
            donorSig().witness.person.address = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        SignaturePad($$renderer3, {
          label: "Witness signature",
          get value() {
            return donorSig().witness.witnessSignatureBlobPath;
          },
          set value($$value) {
            donorSig().witness.witnessSignatureBlobPath = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Witness date",
          children: ($$renderer4) => {
            DateInput($$renderer4, {
              get value() {
                return donorSig().witness.witnessedOn;
              },
              set value($$value) {
                donorSig().witness.witnessedOn = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!---->`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step10CertificateProviderSignature($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    store.ensureCertificateProvider();
    const cp = derived(() => store.data.certificateProvider);
    function ensureCpSignature() {
      let sig = store.data.signatures.find((s) => s.role === "certificate_provider" && s.lp1fSection === 10);
      if (!sig) {
        sig = {
          id: `sig-cp-${cp().person.id}`,
          signatoryPersonId: cp().person.id,
          role: "certificate_provider",
          lp1fSection: 10,
          signatureBlobPath: "",
          signedOn: "",
          signedOnBehalfFullName: "",
          isWitnessed: false,
          witness: null
        };
        store.data.signatures.push(sig);
      }
      return sig;
    }
    const cpSig = derived(ensureCpSignature);
    const knowsDonorOptions = [
      {
        value: "friend",
        label: "A friend who has known the donor personally for at least 2 years"
      },
      {
        value: "professional",
        label: "A professional (GP, solicitor, registered social worker, etc.)"
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 10 — Certificate provider (LP1F section 10)</h2> <p class="text-sm text-slate-600 mb-3">The certificate provider confirms the donor understands the LPA and is not under pressure
    to make it. They must be independent of the donor and attorneys.</p> <div class="space-y-4"><div class="grid grid-cols-1 md:grid-cols-3 gap-3">`);
      Field($$renderer3, {
        label: "Title",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            placeholder: "Mr / Mrs / Mx / Dr",
            get value() {
              return cp().person.title;
            },
            set value($$value) {
              cp().person.title = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "First names",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            get value() {
              return cp().person.firstNames;
            },
            set value($$value) {
              cp().person.firstNames = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Last name",
        children: ($$renderer4) => {
          TextInput($$renderer4, {
            get value() {
              return cp().person.lastName;
            },
            set value($$value) {
              cp().person.lastName = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Date of birth",
        children: ($$renderer4) => {
          DateInput($$renderer4, {
            get value() {
              return cp().person.dateOfBirth;
            },
            set value($$value) {
              cp().person.dateOfBirth = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----></div> `);
      AddressInput($$renderer3, {
        get address() {
          return cp().person.address;
        },
        set address($$value) {
          cp().person.address = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "How the certificate provider knows the donor",
        children: ($$renderer4) => {
          RadioGroup($$renderer4, {
            name: "knowsDonorAs",
            options: knowsDonorOptions,
            get value() {
              return cp().knowsDonorAs;
            },
            set value($$value) {
              cp().knowsDonorAs = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----> <div class="space-y-1"><h3 class="text-sm font-semibold text-slate-700">Eligibility confirmations</h3> `);
      CheckboxField($$renderer3, {
        label: "I am 18 or older.",
        get checked() {
          return cp().isOverEighteen;
        },
        set checked($$value) {
          cp().isOverEighteen = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      CheckboxField($$renderer3, {
        label: "I have read this LPA (or had it read to me) and discussed it with the donor.",
        get checked() {
          return cp().readLpa;
        },
        set checked($$value) {
          cp().readLpa = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      CheckboxField($$renderer3, {
        label: "No one is forcing or pressuring the donor to make this LPA.",
        get checked() {
          return cp().noRestrictionsOnActing;
        },
        set checked($$value) {
          cp().noRestrictionsOnActing = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      CheckboxField($$renderer3, {
        label: "I am a family member of the donor or of one of the attorneys.",
        get checked() {
          return cp().isRelatedToDonorOrAttorney;
        },
        set checked($$value) {
          cp().isRelatedToDonorOrAttorney = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      CheckboxField($$renderer3, {
        label: "I own, manage, or am employed by the donor’s care home.",
        get checked() {
          return cp().isCareHomeOwnerOrEmployee;
        },
        set checked($$value) {
          cp().isCareHomeOwnerOrEmployee = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div> `);
      SignaturePad($$renderer3, {
        label: "Certificate provider signature",
        get value() {
          return cpSig().signatureBlobPath;
        },
        set value($$value) {
          cpSig().signatureBlobPath = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      Field($$renderer3, {
        label: "Date signed",
        children: ($$renderer4) => {
          DateInput($$renderer4, {
            get value() {
              return cpSig().signedOn;
            },
            set value($$value) {
              cpSig().signedOn = $$value;
              $$settled = false;
            }
          });
        }
      });
      $$renderer3.push(`<!----></div></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step11AttorneySignatures($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    function ensureAttorneySignature(personId, role) {
      let sig = store.data.signatures.find((s) => s.lp1fSection === 11 && s.signatoryPersonId === personId);
      if (!sig) {
        sig = {
          id: `sig-${role}-${personId}`,
          signatoryPersonId: personId,
          role,
          lp1fSection: 11,
          signatureBlobPath: "",
          signedOn: "",
          signedOnBehalfFullName: "",
          isWitnessed: true,
          witness: {
            person: createEmptyPerson(),
            witnessSignatureBlobPath: "",
            witnessedOn: ""
          }
        };
        store.data.signatures.push(sig);
      }
      return sig;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 11 — Attorney signatures (LP1F section 11)</h2> <p class="text-sm text-slate-600 mb-3">Each attorney and each replacement attorney signs in turn, with their own witness. The
    witness must not be the donor. Attorneys sign after the certificate provider.</p> `);
      if (store.data.attorneys.length === 0 && store.data.replacementAttorneys.length === 0) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<p class="text-sm text-red-700">No attorneys have been added in section 2 or section 4. Return to step 2 to add at
      least one attorney before collecting signatures.</p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="space-y-6"><!--[-->`);
      const each_array = ensure_array_like(store.data.attorneys);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let a = each_array[$$index];
        const sig = ensureAttorneySignature(a.person.id, "attorney");
        $$renderer3.push(`<div class="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-3"><h3 class="text-sm font-semibold text-slate-700">Attorney #${escape_html(a.ordinal)} — ${escape_html(a.person.firstNames)} ${escape_html(a.person.lastName)}</h3> `);
        SignaturePad($$renderer3, {
          label: "Attorney signature",
          get value() {
            return sig.signatureBlobPath;
          },
          set value($$value) {
            sig.signatureBlobPath = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Date signed",
          children: ($$renderer4) => {
            DateInput($$renderer4, {
              get value() {
                return sig.signedOn;
              },
              set value($$value) {
                sig.signedOn = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----> <h4 class="text-sm font-semibold text-slate-700 mt-2">Witness</h4> `);
        if (sig.witness) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3">`);
          Field($$renderer3, {
            label: "Witness first names",
            children: ($$renderer4) => {
              TextInput($$renderer4, {
                get value() {
                  return sig.witness.person.firstNames;
                },
                set value($$value) {
                  sig.witness.person.firstNames = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----> `);
          Field($$renderer3, {
            label: "Witness last name",
            children: ($$renderer4) => {
              TextInput($$renderer4, {
                get value() {
                  return sig.witness.person.lastName;
                },
                set value($$value) {
                  sig.witness.person.lastName = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----></div> `);
          AddressInput($$renderer3, {
            get address() {
              return sig.witness.person.address;
            },
            set address($$value) {
              sig.witness.person.address = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> `);
          SignaturePad($$renderer3, {
            label: "Witness signature",
            get value() {
              return sig.witness.witnessSignatureBlobPath;
            },
            set value($$value) {
              sig.witness.witnessSignatureBlobPath = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> `);
          Field($$renderer3, {
            label: "Witness date",
            children: ($$renderer4) => {
              DateInput($$renderer4, {
                get value() {
                  return sig.witness.witnessedOn;
                },
                set value($$value) {
                  sig.witness.witnessedOn = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--> <!--[-->`);
      const each_array_1 = ensure_array_like(store.data.replacementAttorneys);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let r = each_array_1[$$index_1];
        const sig = ensureAttorneySignature(r.person.id, "replacement_attorney");
        $$renderer3.push(`<div class="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-3"><h3 class="text-sm font-semibold text-slate-700">Replacement #${escape_html(r.ordinal)} — ${escape_html(r.person.firstNames)} ${escape_html(r.person.lastName)}</h3> `);
        SignaturePad($$renderer3, {
          label: "Replacement attorney signature",
          get value() {
            return sig.signatureBlobPath;
          },
          set value($$value) {
            sig.signatureBlobPath = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Date signed",
          children: ($$renderer4) => {
            DateInput($$renderer4, {
              get value() {
                return sig.signedOn;
              },
              set value($$value) {
                sig.signedOn = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----> <h4 class="text-sm font-semibold text-slate-700 mt-2">Witness</h4> `);
        if (sig.witness) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3">`);
          Field($$renderer3, {
            label: "Witness first names",
            children: ($$renderer4) => {
              TextInput($$renderer4, {
                get value() {
                  return sig.witness.person.firstNames;
                },
                set value($$value) {
                  sig.witness.person.firstNames = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----> `);
          Field($$renderer3, {
            label: "Witness last name",
            children: ($$renderer4) => {
              TextInput($$renderer4, {
                get value() {
                  return sig.witness.person.lastName;
                },
                set value($$value) {
                  sig.witness.person.lastName = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----></div> `);
          AddressInput($$renderer3, {
            get address() {
              return sig.witness.person.address;
            },
            set address($$value) {
              sig.witness.person.address = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> `);
          SignaturePad($$renderer3, {
            label: "Witness signature",
            get value() {
              return sig.witness.witnessSignatureBlobPath;
            },
            set value($$value) {
              sig.witness.witnessSignatureBlobPath = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> `);
          Field($$renderer3, {
            label: "Witness date",
            children: ($$renderer4) => {
              DateInput($$renderer4, {
                get value() {
                  return sig.witness.witnessedOn;
                },
                set value($$value) {
                  sig.witness.witnessedOn = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!---->`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--></div></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step12Applicant($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let selectedAttorneyIds = [];
    const applicantOptions = [
      {
        value: "donor",
        label: "The donor is applying to register the LPA"
      },
      {
        value: "attorneys",
        label: "One or more attorneys are applying to register the LPA"
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 12 — Applicant (LP1F section 12)</h2> <p class="text-sm text-slate-600 mb-3">Only the donor or one or more attorneys may apply to register the LPA. When attorneys
    are appointed jointly, every joint attorney must apply (and sign section 15).</p> `);
      RadioGroup($$renderer3, {
        name: "applicantKind",
        options: applicantOptions,
        get value() {
          return store.data.registrationApplication.applicantKind;
        },
        set value($$value) {
          store.data.registrationApplication.applicantKind = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (store.data.registrationApplication.applicantKind === "attorneys") {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="mt-4 space-y-3"><h3 class="text-sm font-semibold text-slate-700">Which attorneys are applying?</h3> `);
        if (store.data.attorneys.length === 0) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<p class="text-sm text-red-700">No attorneys have been added yet. Go back to step 2 to add at least one.</p>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--> <!--[-->`);
        const each_array = ensure_array_like(store.data.attorneys);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let a = each_array[$$index];
          $$renderer3.push(`<div class="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-2"><label class="inline-flex items-start gap-2"><input type="checkbox" class="mt-1"${attr("checked", selectedAttorneyIds.includes(a.person.id), true)}/> <span class="text-sm text-slate-700">Attorney #${escape_html(a.ordinal)} — ${escape_html(a.person.firstNames)} ${escape_html(a.person.lastName)}</span></label> `);
          if (selectedAttorneyIds.includes(a.person.id)) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6 text-sm text-slate-700"><p><span class="font-medium">Full name:</span> ${escape_html(`${a.person.firstNames} ${a.person.lastName}`.trim() || "(not set)")}</p> <p><span class="font-medium">Date of birth:</span> ${escape_html(a.person.dateOfBirth || "(not set)")}</p></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step13Recipient($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const recipient = derived(() => store.data.registrationRecipient);
    const recipientOptions = [
      { value: "donor", label: "Send to the donor" },
      { value: "attorney", label: "Send to one of the attorneys" },
      {
        value: "other",
        label: "Send to someone else (e.g. solicitor)"
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 13 — Who receives the LPA (LP1F section 13)</h2> <p class="text-sm text-slate-600 mb-3">Choose who the OPG should send the registered LPA to, and how they would like to be
    contacted about the application.</p> `);
      RadioGroup($$renderer3, {
        name: "recipientKind",
        options: recipientOptions,
        get value() {
          return recipient().recipientKind;
        },
        set value($$value) {
          recipient().recipientKind = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (recipient().recipientKind === "other") {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="mt-4 space-y-3"><div class="grid grid-cols-1 md:grid-cols-2 gap-3">`);
        Field($$renderer3, {
          label: "Recipient first names",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return recipient().otherFirstNames;
              },
              set value($$value) {
                recipient().otherFirstNames = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Recipient last name",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return recipient().otherLastName;
              },
              set value($$value) {
                recipient().otherLastName = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----></div> `);
        Field($$renderer3, {
          label: "Company / firm (optional)",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return recipient().companyName;
              },
              set value($$value) {
                recipient().companyName = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Address line 1",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return recipient().otherAddressLine1;
              },
              set value($$value) {
                recipient().otherAddressLine1 = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Address line 2",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return recipient().otherAddressLine2;
              },
              set value($$value) {
                recipient().otherAddressLine2 = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Address line 3",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return recipient().otherAddressLine3;
              },
              set value($$value) {
                recipient().otherAddressLine3 = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----> `);
        Field($$renderer3, {
          label: "Postcode",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return recipient().otherPostcode;
              },
              set value($$value) {
                recipient().otherPostcode = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="mt-4 space-y-3"><h3 class="text-sm font-semibold text-slate-700">Contact preferences</h3> `);
      CheckboxField($$renderer3, {
        label: "Prefer to be contacted by post",
        get checked() {
          return recipient().prefersPost;
        },
        set checked($$value) {
          recipient().prefersPost = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      CheckboxField($$renderer3, {
        label: "Prefer to be contacted by phone",
        get checked() {
          return recipient().prefersPhone;
        },
        set checked($$value) {
          recipient().prefersPhone = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      CheckboxField($$renderer3, {
        label: "Prefer to be contacted by email",
        get checked() {
          return recipient().prefersEmail;
        },
        set checked($$value) {
          recipient().prefersEmail = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      CheckboxField($$renderer3, {
        label: "Prefer correspondence in Welsh",
        get checked() {
          return recipient().prefersWelsh;
        },
        set checked($$value) {
          recipient().prefersWelsh = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (recipient().prefersPhone) {
        $$renderer3.push("<!--[0-->");
        Field($$renderer3, {
          label: "Contact phone",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              type: "tel",
              get value() {
                return recipient().contactPhone;
              },
              set value($$value) {
                recipient().contactPhone = $$value;
                $$settled = false;
              }
            });
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (recipient().prefersEmail) {
        $$renderer3.push("<!--[0-->");
        Field($$renderer3, {
          label: "Contact email",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              type: "email",
              get value() {
                return recipient().contactEmail;
              },
              set value($$value) {
                recipient().contactEmail = $$value;
                $$settled = false;
              }
            });
          }
        });
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step14ApplicationFee($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const app = derived(() => store.data.registrationApplication);
    const paymentOptions = [
      {
        value: "card",
        label: "Pay by debit or credit card (the OPG will phone for details)"
      },
      {
        value: "cheque",
        label: 'Pay by cheque (make payable to "Office of the Public Guardian")'
      }
    ];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 14 — Application fee (LP1F section 14)</h2> <p class="text-sm text-slate-600 mb-3">The standard LPA registration fee is £82. If the donor is on a low income or
    means-tested benefits, a reduction or exemption may apply (use LPA120A).</p> `);
      RadioGroup($$renderer3, {
        name: "paymentMethod",
        options: paymentOptions,
        get value() {
          return app().paymentMethod;
        },
        set value($$value) {
          app().paymentMethod = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (app().paymentMethod === "card") {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="mt-3">`);
        Field($$renderer3, {
          label: "Phone number for card payment",
          hint: "The OPG will call this number to take card details.",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              type: "tel",
              get value() {
                return app().cardPaymentPhone;
              },
              set value($$value) {
                app().cardPaymentPhone = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="mt-4 space-y-2">`);
      CheckboxField($$renderer3, {
        label: "Apply for a reduced or no fee (requires LPA120A evidence)",
        get checked() {
          return app().reducedFeeRequested;
        },
        set checked($$value) {
          app().reducedFeeRequested = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (app().reducedFeeRequested) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<p class="text-xs text-slate-500 ml-6">Download form LPA120A from the OPG and attach evidence of low income or benefits.</p> <div class="ml-6">`);
        CheckboxField($$renderer3, {
          label: "LPA120A evidence is attached",
          get checked() {
            return app().hasLpa120aEvidence;
          },
          set checked($$value) {
            app().hasLpa120aEvidence = $$value;
            $$settled = false;
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      CheckboxField($$renderer3, {
        label: "This is a repeat application after a previous LPA was rejected",
        get checked() {
          return app().isRepeatApplication;
        },
        set checked($$value) {
          app().isRepeatApplication = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      if (app().isRepeatApplication) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="ml-6">`);
        Field($$renderer3, {
          label: "Previous OPG case number",
          children: ($$renderer4) => {
            TextInput($$renderer4, {
              get value() {
                return app().repeatCaseNumber;
              },
              set value($$value) {
                app().repeatCaseNumber = $$value;
                $$settled = false;
              }
            });
          }
        });
        $$renderer3.push(`<!----></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function Step15RegistrationSignature($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const app = derived(() => store.data.registrationApplication);
    function applicantsToSign() {
      if (app().applicantKind === "donor") {
        return [
          {
            personId: store.data.donor.id,
            label: `Donor — ${store.data.donor.firstNames} ${store.data.donor.lastName}`.trim()
          }
        ];
      }
      if (app().applicantKind === "attorneys") {
        const ids = new Set(store.data.signatures.filter((s) => s.role === "applicant" && s.lp1fSection === 15).map((s) => s.signatoryPersonId));
        return store.data.attorneys.filter((a) => ids.has(a.person.id)).map((a) => ({
          personId: a.person.id,
          label: `Attorney #${a.ordinal} — ${a.person.firstNames} ${a.person.lastName}`.trim()
        }));
      }
      return [];
    }
    const applicants = derived(applicantsToSign);
    function sigFor(personId) {
      return store.data.signatures.find((s) => s.role === "applicant" && s.lp1fSection === 15 && s.signatoryPersonId === personId);
    }
    const allJointAttorneysSigned = derived(() => {
      if (store.data.decisionMode !== "jointly") return true;
      if (app().applicantKind !== "attorneys") return true;
      return store.data.attorneys.every((a) => {
        const sig = sigFor(a.person.id);
        return !!sig && !!sig.signedOn;
      });
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<section><h2 class="text-xl font-semibold mb-2">Step 15 — Registration signature (LP1F section 15)</h2> <p class="text-sm text-slate-600 mb-3">Each applicant signs the registration request. If attorneys are appointed jointly, every
    joint attorney must sign here.</p> `);
      if (app().applicantKind === "") {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<p class="text-sm text-red-700">Choose an applicant kind in step 12 first.</p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(applicants());
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let a = each_array[$$index];
        const sig = sigFor(a.personId);
        if (sig) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-3"><h3 class="text-sm font-semibold text-slate-700">${escape_html(a.label)}</h3> `);
          SignaturePad($$renderer3, {
            label: "Applicant signature",
            get value() {
              return sig.signatureBlobPath;
            },
            set value($$value) {
              sig.signatureBlobPath = $$value;
              $$settled = false;
            }
          });
          $$renderer3.push(`<!----> `);
          Field($$renderer3, {
            label: "Date signed",
            children: ($$renderer4) => {
              DateInput($$renderer4, {
                get value() {
                  return sig.signedOn;
                },
                set value($$value) {
                  sig.signedOn = $$value;
                  $$settled = false;
                }
              });
            }
          });
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
      $$renderer3.push(`<!--]--></div> `);
      if (!allJointAttorneysSigned()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<p class="mt-4 text-sm text-red-700">Attorneys are appointed jointly. Every joint attorney must sign section 15 before
      the OPG will accept the registration application.</p>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></section>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const stepNumber = derived(() => data.step);
    const stepDef = derived(() => STEPS.find((s) => s.number === stepNumber()));
    const prevHref = derived(() => stepNumber() > 1 ? `/lpa/${stepNumber() - 1}` : null);
    const nextHref = derived(() => stepNumber() < TOTAL_STEPS ? `/lpa/${stepNumber() + 1}` : null);
    $$renderer2.push(`<div class="grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] gap-6"><aside class="order-2 lg:order-1">`);
    WizardNav($$renderer2);
    $$renderer2.push(`<!----></aside> <article class="order-1 lg:order-2 bg-white border border-slate-200 rounded-lg p-6">`);
    if (stepDef()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-xs uppercase tracking-wide text-slate-500 mb-2">Step ${escape_html(stepNumber())} of ${escape_html(TOTAL_STEPS)} · LP1F section ${escape_html(stepDef().lp1fSection)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (stepNumber() === 1) {
      $$renderer2.push("<!--[0-->");
      Step1Donor($$renderer2);
    } else if (stepNumber() === 2) {
      $$renderer2.push("<!--[1-->");
      Step2Attorneys($$renderer2);
    } else if (stepNumber() === 3) {
      $$renderer2.push("<!--[2-->");
      Step3DecisionMode($$renderer2);
    } else if (stepNumber() === 4) {
      $$renderer2.push("<!--[3-->");
      Step4ReplacementAttorneys($$renderer2);
    } else if (stepNumber() === 5) {
      $$renderer2.push("<!--[4-->");
      Step5WhenAttorneysCanAct($$renderer2);
    } else if (stepNumber() === 6) {
      $$renderer2.push("<!--[5-->");
      Step6PeopleToNotify($$renderer2);
    } else if (stepNumber() === 7) {
      $$renderer2.push("<!--[6-->");
      Step7PreferencesAndInstructions($$renderer2);
    } else if (stepNumber() === 8) {
      $$renderer2.push("<!--[7-->");
      Step8LegalRights($$renderer2);
    } else if (stepNumber() === 9) {
      $$renderer2.push("<!--[8-->");
      Step9DonorSignature($$renderer2);
    } else if (stepNumber() === 10) {
      $$renderer2.push("<!--[9-->");
      Step10CertificateProviderSignature($$renderer2);
    } else if (stepNumber() === 11) {
      $$renderer2.push("<!--[10-->");
      Step11AttorneySignatures($$renderer2);
    } else if (stepNumber() === 12) {
      $$renderer2.push("<!--[11-->");
      Step12Applicant($$renderer2);
    } else if (stepNumber() === 13) {
      $$renderer2.push("<!--[12-->");
      Step13Recipient($$renderer2);
    } else if (stepNumber() === 14) {
      $$renderer2.push("<!--[13-->");
      Step14ApplicationFee($$renderer2);
    } else if (stepNumber() === 15) {
      $$renderer2.push("<!--[14-->");
      Step15RegistrationSignature($$renderer2);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="mt-6 flex justify-between border-t border-slate-200 pt-4">`);
    if (prevHref()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a${attr("href", prevHref())} class="px-3 py-2 rounded border border-slate-300 text-sm text-slate-700 hover:bg-slate-100">← Previous</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span></span>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (nextHref()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<a${attr("href", nextHref())} class="px-3 py-2 rounded bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700">Next →</a>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<a href="/" class="px-3 py-2 rounded bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700">Finish</a>`);
    }
    $$renderer2.push(`<!--]--></div></article> <aside class="order-3">`);
    ValidationSummary($$renderer2);
    $$renderer2.push(`<!----></aside></div>`);
  });
}
export {
  _page as default
};
