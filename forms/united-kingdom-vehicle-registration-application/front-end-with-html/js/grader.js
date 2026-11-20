import { evaluate, feeDue } from './rules.js';

// United Kingdom Vehicle Registration Application validity grader. Pure
// functions: take a `VehicleApplication` object, evaluate its completeness and
// the documents and fee the DVLA asks for, and assign exactly one validity
// class. It makes NO decision on the application; only the DVLA decides.
//
// Algorithm (spec section 4), first matching class wins:
//   any missing data item (field, format, blocking, declaration)  -> 'incomplete'
//   any missing document or fee                                  -> 'needs-supporting-documents'
//   otherwise                                                    -> 'ready-to-submit'
//
// `incomplete` takes precedence over `needs-supporting-documents`: the
// applicant must finish the form before gathering the evidence to enclose.

/**
 * @typedef {import('./types.js').VehicleApplication} VehicleApplication
 * @typedef {import('./types.js').ValidityClass} ValidityClass
 */

/**
 * Compute the full validity classification for the supplied application.
 * @param {VehicleApplication} d
 * @returns {{ validityClass: ValidityClass,
 *             feeDueAsPence: number | null,
 *             missingItemCount: number,
 *             rules: import('./types.js').RuleFinding[] }}
 */
function validateApplication(d) {
  const found = evaluate(d);
  /** @type {ValidityClass} */
  let validityClass = 'ready-to-submit';
  if (found.data.length > 0) validityClass = 'incomplete';
  else if (found.documents.length > 0) validityClass = 'needs-supporting-documents';
  return {
    validityClass,
    feeDueAsPence: feeDue(d),
    missingItemCount: found.data.length + found.documents.length,
    rules: found.data.concat(found.documents)
  };
}

export { validateApplication };
