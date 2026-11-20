import {
  ADULT_AGE,
  LIMIT_PER_LIFETIME,
  LIMIT_PER_YEAR,
  ageAtApplication,
  ageEvidenceMissing,
  applicantDeceased,
  citizenshipEvidenceMissing,
  documentsNotOriginal,
  identityDocumentExpired,
  identityEvidenceMissing,
  inPersonViolation,
  isMinor,
  limitBlocked,
  limitExceptionValid,
  limitNear,
  limitReached,
  minorSignerProblem,
  missingFields,
  nameChangeEvidenceMissing,
  nameDiffersWithoutChange,
  nonEmpty,
  priorApplicationInconsistent,
  signedByAnother,
  signerIdentityMissing,
  stateInvalid,
  workAuthorizationMissing
} from './ss5-rules';

// Flagged-issue detection (eligibility, evidence, and form completeness).
// Independent of the application class (which the grader produces), this
// module raises applicant- and preparer-facing flags per spec §5:
//
//   - Applicant deceased (high)           - a card cannot be issued; report the death.
//   - Death not yet reported (medium)     - Tell SSA of the death.
//   - Replacement limit reached (high)    - 3 per year / 10 per lifetime, no supported exception.
//   - Exception claimed (low / medium)    - supported by documents, or not yet.
//   - Near a limit (low)                  - one replacement short of a limit.
//   - Identity / age / citizenship /
//     work-authorization / name-change
//     evidence missing (high)             - the SS-5 evidence rules.
//   - Documents not original (medium), name differs from birth name (medium).
//   - In-person application required (high), minor signer problem (high),
//     signer identity missing (medium), adult signed by another (medium),
//     signature missing (high), required fields missing (medium).
//   - Prior-application answer inconsistent (medium), state not recognized (low).
//
// Rows here mirror the `ss5_application_grade_flag` SQL table (flag_id,
// category, priority, description, suggested_action). NOTHING here decides an
// application; the flags support the applicant's and the preparer's work. SSA
// decides.

import type { FlaggedIssue, SocialSecurityApplication } from './types';

/**
 * @param {SocialSecurityApplication} d
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(d: SocialSecurityApplication): FlaggedIssue[] {
  const flags: FlaggedIssue[] = [];

  // --- Applicant deceased (HIGH) and death report (MEDIUM) -------------
  if (applicantDeceased(d)) {
    flags.push({
      id: 'F-APPLICANT-DECEASED-001',
      category: 'applicant-deceased',
      priority: 'high',
      description:
        'The person in item 1 has died. SSA does not issue a Social Security card for a deceased person, so Form SS-5 cannot be used.',
      suggestedAction:
        'Do not submit an SS-5. Report the death to SSA instead (funeral home, or 1-800-772-1213).'
    });
    if (d.tellSsa.deathReportedToSsa !== 'yes') {
      flags.push({
        id: 'F-DEATH-REPORT-001',
        category: 'applicant-deceased',
        priority: 'medium',
        description: 'The death has not yet been reported to SSA.',
        suggestedAction:
          'Tell SSA about the death: the funeral home usually reports it, or a family member can call 1-800-772-1213.'
      });
    }
  }

  // --- Replacement limits ----------------------------------------------
  if (limitBlocked(d)) {
    flags.push({
      id: 'F-REPLACEMENT-LIMIT-001',
      category: 'replacement-limit',
      priority: 'high',
      description: `A replacement-card limit is reached (${LIMIT_PER_YEAR} per calendar year or ${LIMIT_PER_LIFETIME} per lifetime) and no supported exception is recorded. SSA denies the replacement card.`,
      suggestedAction:
        'Wait until the next calendar year, or document an exception: a legal name change, a legend change, non-receipt of a card, an SSA error, or hardship.'
    });
  }
  if (limitReached(d) && limitExceptionValid(d)) {
    flags.push({
      id: 'F-REPLACEMENT-LIMIT-EXCEPTION-001',
      category: 'replacement-limit',
      priority: 'low',
      description:
        'A replacement-card limit is reached but an exception reason is claimed with supporting documents. SSA decides whether the exception applies.',
      suggestedAction: 'Bring the documents that support the exception reason.'
    });
  }
  if (
    limitReached(d) &&
    nonEmpty(d.request.limitExceptionReason) &&
    d.request.limitExceptionEvidence !== 'yes'
  ) {
    flags.push({
      id: 'F-REPLACEMENT-LIMIT-EXCEPTION-002',
      category: 'replacement-limit',
      priority: 'medium',
      description: 'An exception reason is claimed but no supporting documents are available.',
      suggestedAction: 'Gather documentation for the exception reason before applying.'
    });
  }
  if (limitNear(d)) {
    flags.push({
      id: 'F-REPLACEMENT-LIMIT-NEAR-001',
      category: 'replacement-limit',
      priority: 'low',
      description: 'This would be the last replacement card allowed before a limit is reached.',
      suggestedAction:
        'Keep the new card in a safe place; a legal name change does not count toward the limits.'
    });
  }

  // --- Evidence ---------------------------------------------------------
  if (identityEvidenceMissing(d)) {
    flags.push({
      id: 'F-IDENTITY-EVIDENCE-001',
      category: 'identity-evidence',
      priority: 'high',
      description: identityDocumentExpired(d)
        ? 'The identity document is expired. SSA requires a current, unexpired document.'
        : 'No acceptable proof of identity is recorded. SSA requires a current document showing name, identifying information, and preferably a photograph.',
      suggestedAction:
        'Bring a current US driver license, state ID card, or US passport (or another listed identity document).'
    });
  }
  if (ageEvidenceMissing(d)) {
    flags.push({
      id: 'F-AGE-EVIDENCE-001',
      category: 'age-evidence',
      priority: 'high',
      description:
        'No acceptable proof of age is recorded. SSA requires one for an original card or a date-of-birth correction.',
      suggestedAction:
        'Bring a US birth certificate or, if unavailable, a US passport or another listed record.'
    });
  }
  if (citizenshipEvidenceMissing(d)) {
    flags.push({
      id: 'F-CITIZENSHIP-EVIDENCE-001',
      category: 'citizenship-evidence',
      priority: 'high',
      description:
        'No acceptable proof of US citizenship or lawful alien status matching the citizenship answer is recorded.',
      suggestedAction:
        'Bring a US birth certificate or passport (citizen), or a Permanent Resident Card, Form I-94 with work authorization, or Employment Authorization Document (noncitizen).'
    });
  }
  if (workAuthorizationMissing(d)) {
    flags.push({
      id: 'F-WORK-AUTHORIZATION-001',
      category: 'work-authorization',
      priority: 'high',
      description:
        'A lawfully admitted noncitizen without work authorization needs a valid non-work reason (a federal or state law or benefit that requires an SSN).',
      suggestedAction:
        'Obtain the letter from the benefit-paying agency that shows why the number is required, and bring it with the immigration documents.'
    });
  }
  if (nameChangeEvidenceMissing(d)) {
    flags.push({
      id: 'F-NAME-CHANGE-EVIDENCE-001',
      category: 'name-change-evidence',
      priority: 'high',
      description: 'A legal name change is claimed but no document proving it is recorded.',
      suggestedAction:
        'Bring the marriage certificate, divorce decree, or court order that shows the new name.'
    });
  }
  if (nameDiffersWithoutChange(d)) {
    flags.push({
      id: 'F-NAME-DIFFERS-001',
      category: 'name-change-evidence',
      priority: 'medium',
      description:
        'The name on the card differs from the name at birth, but no legal name change is recorded.',
      suggestedAction:
        'Answer the name-change question and provide the name-change document, or correct the names.'
    });
  }
  if (documentsNotOriginal(d)) {
    flags.push({
      id: 'F-DOCUMENT-ORIGINALS-001',
      category: 'document-quality',
      priority: 'medium',
      description:
        'SSA accepts only original documents or copies certified by the issuing agency; photocopies and notarized copies are rejected.',
      suggestedAction: 'Obtain originals or agency-certified copies of every document.'
    });
  }

  // --- Channel, signer, and signature ------------------------------------
  if (inPersonViolation(d)) {
    flags.push({
      id: 'F-IN-PERSON-001',
      category: 'in-person-required',
      priority: 'high',
      description:
        'An applicant aged 12 or older requesting an original card must apply in person, not by mail.',
      suggestedAction: 'Visit a Social Security office with the original documents.'
    });
  }
  if (minorSignerProblem(d)) {
    flags.push({
      id: 'F-MINOR-SIGNER-001',
      category: 'signer-authority',
      priority: 'high',
      description: `The applicant is under ${ADULT_AGE}, so a parent or legal guardian must sign and give their name and relationship.`,
      suggestedAction:
        'Have a parent or legal guardian sign, and record their name and relationship.'
    });
  }
  if (signedByAnother(d) && !isMinor(d) && ageAtApplication(d) !== null) {
    flags.push({
      id: 'F-ADULT-SIGNER-001',
      category: 'signer-authority',
      priority: 'medium',
      description:
        'An adult applicant is being signed for by another person. SSA accepts this only where the applicant cannot sign and the signer has legal authority.',
      suggestedAction:
        'Bring proof of the signer authority, such as a court order or power of attorney.'
    });
  }
  if (signerIdentityMissing(d)) {
    flags.push({
      id: 'F-SIGNER-IDENTITY-001',
      category: 'signer-authority',
      priority: 'medium',
      description:
        'The person signing for the applicant has not shown their own proof of identity.',
      suggestedAction: 'The signer must bring their own current identity document.'
    });
  }
  if (d.filer.signaturePresent !== 'yes') {
    flags.push({
      id: 'F-SIGNATURE-001',
      category: 'signer-authority',
      priority: 'high',
      description: 'The application is not signed (item 19). SSA returns an unsigned SS-5.',
      suggestedAction: 'Sign and date the application.'
    });
  }

  // --- Form completeness and consistency ---------------------------------
  const missing = missingFields(d).filter((m) => m.id !== 'signaturePresent');
  if (missing.length > 0) {
    flags.push({
      id: 'F-MISSING-FIELDS-001',
      category: 'missing-field',
      priority: 'medium',
      description: `Required items are blank: ${missing.map((m) => m.label).join('; ')}.`,
      suggestedAction: 'Complete every required item on the SS-5.'
    });
  }
  if (priorApplicationInconsistent(d)) {
    flags.push({
      id: 'F-PRIOR-APPLICATION-001',
      category: 'missing-field',
      priority: 'medium',
      description:
        'A replacement or corrected card is requested, but the answer says no Social Security number was applied for before.',
      suggestedAction:
        'Check whether an original card was already issued, or change the request type to an original card.'
    });
  }
  if (stateInvalid(d)) {
    flags.push({
      id: 'F-STATE-VERIFY-001',
      category: 'state-verify',
      priority: 'low',
      description:
        'The state of residence is not a recognized two-letter USPS code. SS-5 rules are federal and do not vary by state.',
      suggestedAction: 'Enter a valid two-letter code such as CA, NY, or TX.'
    });
  }

  const rank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return flags
    .map((f, i) => ({ f, i }))
    .sort((a, b) => rank[a.f.priority] - rank[b.f.priority] || a.i - b.i)
    .map((x) => x.f);
}

export { detectFlaggedIssues };
