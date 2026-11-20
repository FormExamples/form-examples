import {
  capacityProblem,
  capacityUnconfirmed,
  detailsMissing,
  domicileOutside,
  executionIrregular,
  fewerThanTwoWitnesses,
  hasExecutor,
  marriageRevocationRisk,
  minorWithoutTrustee,
  noBeneficiary,
  residuaryMissing,
  sharesNot100,
  sharesTotalPercent,
  testatorUnder18,
  witnessCount,
  witnessIsBeneficiary,
  witnessUnder18
} from './will-rules';
import type { ValidationResult, ValidityClass, Will } from './types';
import { detectFlaggedIssues } from './flagged-issues';

// United Kingdom Last Will and Testament validity grader (England and Wales).
// Pure functions: take a `Will` object, evaluate the Wills Act 1837 formality
// predicates and the content-completeness predicates, and assign exactly one
// validity class. It is DOCUMENTATION SUPPORT, NOT LEGAL ADVICE: it cannot
// confirm that a will is valid, only that the record shows no known problem.
//
// Algorithm (spec §4), first matching class wins:
//   formalityRisk(d)   -> 'formality-risk'   (the will may be invalid or fail)
//   incomplete(d)      -> 'incomplete'       (content missing; completable)
//   otherwise          -> 'valid'            (ready to execute, or executed)
//
// `formality-risk` takes precedence over `incomplete`: if a formality problem
// exists, completing the content does not make the will safe to sign.

export function formalityRisk(d: Will): boolean {
  return (
    testatorUnder18(d) ||
    capacityProblem(d) ||
    domicileOutside(d) ||
    marriageRevocationRisk(d) ||
    witnessUnder18(d) ||
    witnessIsBeneficiary(d) ||
    fewerThanTwoWitnesses(d) ||
    executionIrregular(d)
  );
}

export function incomplete(d: Will): boolean {
  return (
    detailsMissing(d) ||
    capacityUnconfirmed(d) ||
    !hasExecutor(d) ||
    noBeneficiary(d) ||
    residuaryMissing(d) ||
    sharesNot100(d) ||
    minorWithoutTrustee(d)
  );
}

export function deriveValidityClass(d: Will): ValidityClass {
  if (formalityRisk(d)) return 'formality-risk';
  if (incomplete(d)) return 'incomplete';
  return 'valid';
}

export function validateWill(d: Will): ValidationResult {
  return {
    validityClass: deriveValidityClass(d),
    formalityRisk: formalityRisk(d),
    sharesTotalPercent: sharesTotalPercent(d),
    witnessCount: witnessCount(d),
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}
