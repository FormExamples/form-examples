import type { AdditionalFlag, Lpa } from '#lib/types.js';

// Non-statutory warning flags. The composite-risk algorithm sets
// compositeRisk to the worst flag priority when no blocker has fired.

export function singleAttorneyNoReplacement(lpa: Lpa): AdditionalFlag | null {
  if (lpa.attorneys.length !== 1) return null;
  if (lpa.replacementAttorneys.length > 0) return null;
  return {
    ruleId: 'SingleAttorneyNoReplacement',
    priority: 'moderate',
    citation: 'LP12 Guide part A4',
    fieldPath: 'replacementAttorneys',
    message:
      'Only one attorney is appointed and no replacement attorney is listed.',
    remediation:
      'The LPA will become useless if the single attorney loses capacity or is unable to act. Strongly recommended: add a replacement attorney in section 4.',
  };
}

export function onlyWhenNoCapacitySelected(lpa: Lpa): AdditionalFlag | null {
  if (lpa.whenAttorneysCanAct !== 'only_when_no_capacity') return null;
  return {
    ruleId: 'OnlyWhenNoCapacitySelected',
    priority: 'moderate',
    citation: 'LP12 Guide part A5',
    fieldPath: 'whenAttorneysCanAct',
    message: 'Attorneys can act only when the donor has no capacity.',
    remediation:
      'This option restricts the LPA to incapacity only and means attorneys cannot help with finances while you still have capacity. Banks and other organisations may also require evidence of incapacity each time. Consider "as soon as the LPA is registered".',
  };
}

export function noPeopleToNotify(lpa: Lpa): AdditionalFlag | null {
  if (lpa.peopleToNotify.length > 0) return null;
  return {
    ruleId: 'NoPeopleToNotify',
    priority: 'low',
    citation: 'LP12 Guide part A8',
    fieldPath: 'peopleToNotify',
    message: 'No people-to-notify are listed.',
    remediation:
      'People-to-notify give an external safeguarding check. Strongly recommended: list at least one trusted person who is not an attorney.',
  };
}

export function instructionsLong(lpa: Lpa): AdditionalFlag | null {
  if (lpa.instructionsText.length <= 500) return null;
  return {
    ruleId: 'InstructionsLong',
    priority: 'low',
    citation: 'LP12 Guide part A9',
    fieldPath: 'instructionsText',
    message: 'Instructions are longer than 500 characters.',
    remediation:
      'Long or complex instructions can be legally incorrect and may cause the OPG to reject the LPA. Consider redrafting with a solicitor, or moving content into "preferences" (which are non-binding guidance).',
  };
}

export function preferencesEmpty(lpa: Lpa): AdditionalFlag | null {
  if (lpa.preferencesText.trim() || lpa.instructionsText.trim()) return null;
  return {
    ruleId: 'PreferencesEmpty',
    priority: 'low',
    citation: 'LP12 Guide part A9',
    fieldPath: 'preferencesText',
    message: 'Both preferences and instructions are empty.',
    remediation:
      'Optional. The donor may want to leave non-binding preferences (e.g. "consult my children before selling the family home").',
  };
}

export function attorneyEmailMissing(lpa: Lpa): AdditionalFlag | null {
  const anyMissing = lpa.attorneys.some(
    (a) => !a.person.email.trim() && !a.person.isTrustCorporation,
  );
  if (!anyMissing) return null;
  return {
    ruleId: 'AttorneyEmailMissing',
    priority: 'low',
    citation: 'LP1F section 2',
    fieldPath: 'attorneys[*].person.email',
    message: 'One or more attorneys have no email address.',
    remediation:
      'Optional. OPG can deal with attorneys by post; email speeds up later correspondence.',
  };
}

export function emergencyContactMissing(lpa: Lpa): AdditionalFlag | null {
  const r = lpa.registrationRecipient;
  if (r.prefersPost || r.prefersPhone || r.prefersEmail) return null;
  return {
    ruleId: 'EmergencyContactMissing',
    priority: 'low',
    citation: 'LP1F section 13',
    fieldPath: 'registrationRecipient',
    message: 'No preferred contact method selected.',
    remediation:
      'Optional. Set a contact preference so OPG knows how to reach the donor or applicant.',
  };
}

export function reducedFeeWithoutLPA120A(lpa: Lpa): AdditionalFlag | null {
  const app = lpa.registrationApplication;
  if (!app.reducedFeeRequested) return null;
  if (app.hasLpa120aEvidence) return null;
  return {
    ruleId: 'ReducedFeeWithoutLPA120A',
    priority: 'high',
    citation: 'OPG fee policy; LPA120A',
    fieldPath: 'registrationApplication.hasLpa120aEvidence',
    message: 'Reduced fee requested without LPA120A evidence.',
    remediation:
      'If you are asking for a reduced or waived fee, you must complete form LPA120A and attach evidence (bank statement, benefit letter, payslip). Without this the OPG will charge the full fee or return the form.',
  };
}

export function overFourAttorneysFlag(lpa: Lpa): AdditionalFlag | null {
  // Counterpart of the blocker; reported as a high flag during draft.
  if (lpa.attorneys.length <= 4) return null;
  const hasSheet1 = lpa.continuationSheets.some(
    (s) => s.kind === '1_additional_people',
  );
  if (hasSheet1) return null;
  return {
    ruleId: 'OverFourAttorneysNoContinuation',
    priority: 'high',
    citation: 'LPA Regs 2007 reg. 9(3) (approximate)',
    fieldPath: 'continuationSheets[kind=1_additional_people]',
    message: 'More than 4 attorneys but no LPC sheet 1 attached.',
    remediation:
      'LP1F only has space for 4 attorneys. Attach LPC continuation sheet 1 for the rest.',
  };
}

export const FLAG_RULES: ((lpa: Lpa) => AdditionalFlag | null)[] = [
  reducedFeeWithoutLPA120A,
  overFourAttorneysFlag,
  singleAttorneyNoReplacement,
  onlyWhenNoCapacitySelected,
  noPeopleToNotify,
  instructionsLong,
  preferencesEmpty,
  attorneyEmailMissing,
  emergencyContactMissing,
];

export function applyFlagRules(lpa: Lpa): AdditionalFlag[] {
  const fired: AdditionalFlag[] = [];
  for (const rule of FLAG_RULES) {
    const r = rule(lpa);
    if (r) fired.push(r);
  }
  return fired;
}
