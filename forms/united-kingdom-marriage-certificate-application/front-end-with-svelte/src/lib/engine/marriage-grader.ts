import {
  certificateOrderIncomplete,
  ceremonyAfterNoticeExpiry,
  closelyRelated,
  earliestCeremonyDate,
  immigrationEvidenceMissing,
  immigrationReferralIndicated,
  jointNoticeRequired,
  latestCeremonyDate,
  missingRequired,
  noticePeriodTooShort,
  parties,
  partyAlreadyMarried,
  partyUnder18,
  priorEvidenceMissing,
  residenceShort,
  witnessesInsufficient
} from './marriage-rules';

// United Kingdom marriage certificate application validity grader. Pure
// functions: take an `Application` object, evaluate eligibility, completeness
// and the supporting evidence, and assign exactly one class. It gives no legal
// advice; the register office decides each notice.
//
// Algorithm (spec §4), first matching class wins:
//   under 18 || already married/civil-partnered || closely related -> 'ineligible'
//   missing required field || half-specified certificate order     -> 'incomplete'
//   any evidence / timing / logistics shortfall                    -> 'needs-evidence'
//   otherwise                                                      -> 'ready-to-submit'
//
// `ineligible` takes precedence: no amount of evidence cures it, so it is
// reported before completeness.

import type { Application, ValidationResult, ValidityClass } from './types';
import { detectFlaggedIssues } from './flagged-issues';

function ineligible(a: Application): boolean {
  return (
    parties(a).some((x) => partyUnder18(x.party, a) || partyAlreadyMarried(x.party)) ||
    closelyRelated(a)
  );
}

function incomplete(a: Application): boolean {
  return missingRequired(a).length > 0 || certificateOrderIncomplete(a);
}

function needsEvidence(a: Application): boolean {
  const yes = (v: string): boolean => v === 'yes';
  return (
    parties(a).some(
      ({ party }) =>
        residenceShort(party) ||
        priorEvidenceMissing(party) ||
        immigrationEvidenceMissing(party) ||
        !yes(party.identityProvided) ||
        !yes(party.addressProofProvided)
    ) ||
    noticePeriodTooShort(a) ||
    ceremonyAfterNoticeExpiry(a) ||
    witnessesInsufficient(a) ||
    !yes(a.ceremony.venueConfirmed) ||
    (jointNoticeRequired(a) && !yes(a.notice.noticeGivenTogether))
  );
}

/**
 * Assign the single validity class (spec §4).
 */
export function deriveValidityClass(a: Application): ValidityClass {
  if (ineligible(a)) return 'ineligible';
  if (incomplete(a)) return 'incomplete';
  if (needsEvidence(a)) return 'needs-evidence';
  return 'ready-to-submit';
}

/**
 * Compute the full classification for the supplied application. This checks
 * eligibility, completeness and evidence only; it does NOT give legal advice.
 */
export function validateApplication(a: Application): ValidationResult {
  return {
    validityClass: deriveValidityClass(a),
    earliestCeremonyDate: earliestCeremonyDate(a),
    latestCeremonyDate: latestCeremonyDate(a),
    immigrationReferralIndicated: immigrationReferralIndicated(a),
    flaggedIssues: detectFlaggedIssues(a),
    timestamp: new Date().toISOString()
  };
}
