// United Kingdom Vehicle Registration Application validity grader. Pure
// functions: take a `VehicleApplication`, evaluate its completeness and the
// documents and fee the DVLA asks for, and assign exactly one validity class. It
// makes NO decision on the application; only the DVLA decides.
//
// Algorithm (spec section 4), first matching class wins:
//   any missing data item (field, format, blocking, declaration)  -> 'incomplete'
//   any missing document or fee                                  -> 'needs-supporting-documents'
//   otherwise                                                    -> 'ready-to-submit'

import type { ValidityClass, ValidationResult, VehicleApplication } from './types';
import { detectFlaggedIssues } from './flagged-issues';
import { evaluate, feeDue } from './vra-rules';

/** Assign the single validity class (spec section 4). */
export function deriveValidityClass(d: VehicleApplication): ValidityClass {
  const found = evaluate(d);
  if (found.data.length > 0) return 'incomplete';
  if (found.documents.length > 0) return 'needs-supporting-documents';
  return 'ready-to-submit';
}

/**
 * Compute the full validity classification for the supplied application. This
 * checks completeness and validity only; it does NOT decide the application.
 */
export function validateApplication(d: VehicleApplication): ValidationResult {
  const found = evaluate(d);
  return {
    validityClass: deriveValidityClass(d),
    feeDueAsPence: feeDue(d),
    missingItemCount: found.data.length + found.documents.length,
    rules: found.data.concat(found.documents),
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}
