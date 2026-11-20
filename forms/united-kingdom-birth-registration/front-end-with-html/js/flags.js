import {
  STATUTORY_DAYS, dateInconsistencies, daysSinceBirth, deadlineApproaching, identityInsufficient, identityNotOriginal,
  informantProblem, lateRegistration, missingItems, nonEmpty, outOfScopeReason, overTwelveMonths,
  paternityEvidenceMissing, paternityRouteProblem, unmarriedFatherLeftOff
} from './rules.js';
import { birthCountryLabel } from './types.js';

// Flagged-issue detection (statutory deadlines, informant, parentage, evidence,
// and the certificate order). Independent of the readiness class (which the
// grader produces), this module raises applicant- and registrar-facing flags per
// spec section 5:
//
//   - Out of scope (high)               - a stillbirth, or a birth outside England and Wales.
//   - Missing required items (high)     - required fields still blank.
//   - Date inconsistent (high)          - registration before birth, mother born after child.
//   - Late registration (high)          - after the 42-day statutory period.
//   - Deadline approaching (medium)     - 35 to 42 days since birth.
//   - Informant not qualified (high)    - not a qualified informant, or parents able to register.
//   - Paternity route (high)            - basis cannot record the second parent.
//   - Paternity evidence (high)         - signed form or court document not in hand.
//   - Identity evidence (high/medium)   - no accepted documents, or not originals.
//   - Certificate order (medium)        - delivery address or payment missing.
//   - Unmarried father left off (low)   - how to add him later.
//   - Multiple birth (low)              - each child registered separately.
//   - Red book (low)                    - the registrar may ask to see it.
//
// Rows here mirror the `united_kingdom_birth_registration_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). NOTHING here
// registers a birth or discharges a statutory duty.

/**
 * @typedef {import('./types.js').BirthRegistration} BirthRegistration
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {BirthRegistration} d
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(d) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  // --- Out of scope (HIGH) -----------------------------------
  const scope = outOfScopeReason(d);
  if (scope === 'stillbirth') {
    flags.push({
      id: 'F-OUT-OF-SCOPE-STILLBIRTH-001',
      category: 'out-of-scope',
      priority: 'high',
      description:
        'A child born dead after the 24th week of pregnancy is a stillbirth, which is registered separately from a live birth and needs a medical certificate of stillbirth.',
      suggestedAction:
        'Contact the local register office about registering a stillbirth; do not use this application.'
    });
  } else if (scope === 'other-country') {
    flags.push({
      id: 'F-OUT-OF-SCOPE-COUNTRY-001',
      category: 'out-of-scope',
      priority: 'high',
      description:
        `A birth in ${birthCountryLabel(d.child.birthCountry)} is registered under that country's own rules, not the England and Wales register.`,
      suggestedAction:
        'Register with the National Records of Scotland, nidirect (Northern Ireland), or the local authority abroad and, if wanted, the UK Overseas Registration Unit.'
    });
  }

  // --- Missing required items (HIGH) -------------------------
  const missing = missingItems(d);
  if (missing.length > 0) {
    flags.push({
      id: 'F-MISSING-REQUIRED-001',
      category: 'missing-required',
      priority: 'high',
      description:
        `${missing.length} required ${missing.length === 1 ? 'item is' : 'items are'} missing: ${missing.map((m) => m.label).join('; ')}.`,
      suggestedAction:
        'Complete the missing items before attending the register office; the registrar needs them to make the entry.'
    });
  }

  // --- Date inconsistencies (HIGH) ---------------------------
  const inconsistent = dateInconsistencies(d);
  if (inconsistent.includes('registration-before-birth')) {
    flags.push({
      id: 'F-DATE-REGISTRATION-BEFORE-BIRTH-001',
      category: 'date-inconsistent',
      priority: 'high',
      description: 'The registration date is before the date of birth.',
      suggestedAction: 'Correct the registration date or the date of birth.'
    });
  }
  if (inconsistent.includes('mother-born-after-child')) {
    flags.push({
      id: 'F-DATE-MOTHER-BORN-AFTER-CHILD-001',
      category: 'date-inconsistent',
      priority: 'high',
      description: "The mother's date of birth is on or after the child's date of birth.",
      suggestedAction: "Check the mother's and the child's dates of birth."
    });
  }

  // --- Statutory 42-day period -------------------------------
  const days = daysSinceBirth(d);
  if (lateRegistration(d)) {
    const twelve = overTwelveMonths(d);
    flags.push({
      id: 'F-LATE-REGISTRATION-001',
      category: 'late-registration',
      priority: 'high',
      description:
        `Registration is ${days} days after the birth; a birth in England and Wales must be registered within ${STATUTORY_DAYS} days.` +
        (twelve ? ' More than 12 months after the birth the Registrar General’s authority is needed.' : ''),
      suggestedAction:
        twelve
          ? 'Contact the register office or the General Register Office about late registration before attending.'
          : 'Register without further delay and tell the registrar why the birth was not registered in time.'
    });
  } else if (deadlineApproaching(d)) {
    flags.push({
      id: 'F-DEADLINE-APPROACHING-001',
      category: 'deadline-approaching',
      priority: 'medium',
      description:
        `Registration falls ${days} days after the birth, within a week of the ${STATUTORY_DAYS}-day statutory period.`,
      suggestedAction: 'Book the register office appointment now so the birth is registered in time.'
    });
  }

  // --- Informant (HIGH) --------------------------------------
  const informant = informantProblem(d);
  if (informant === 'not-qualified') {
    flags.push({
      id: 'F-INFORMANT-NOT-QUALIFIED-001',
      category: 'informant-not-qualified',
      priority: 'high',
      description:
        'The informant is not a qualified informant. Only a parent, someone present at the birth, someone responsible for the child, or hospital administrative staff may register a birth.',
      suggestedAction: 'Ask a parent, or another qualified informant, to register the birth.'
    });
  } else if (informant === 'parents-able-to-register') {
    flags.push({
      id: 'F-INFORMANT-PARENTS-ABLE-001',
      category: 'informant-not-qualified',
      priority: 'high',
      description:
        'A person who is not a parent may register only if the parents cannot (for example for medical reasons), and that has not been confirmed.',
      suggestedAction: 'Confirm why the parents cannot register, or ask a parent to register.'
    });
  } else if (informant === 'second-parent-not-recorded') {
    flags.push({
      id: 'F-INFORMANT-SECOND-PARENT-001',
      category: 'informant-not-qualified',
      priority: 'high',
      description:
        'The informant is the father or second parent, but no second parent is recorded on the entry.',
      suggestedAction: 'Record the second parent and the basis, or choose the mother as informant.'
    });
  }

  // --- Paternity route and evidence (HIGH) -------------------
  const route = paternityRouteProblem(d);
  if (route === 'basis-not-valid') {
    flags.push({
      id: 'F-PATERNITY-ROUTE-001',
      category: 'paternity-route',
      priority: 'high',
      description:
        'The stated basis cannot be used to record the second parent for these parents.',
      suggestedAction:
        'Unmarried parents: register together, bring a signed statutory declaration of parentage, or bring a court document giving parental responsibility. A male couple needs a parental order.'
    });
  } else if (route === 'joint-needs-both') {
    flags.push({
      id: 'F-PATERNITY-JOINT-001',
      category: 'paternity-route',
      priority: 'high',
      description: 'Joint registration needs both parents to attend and sign the register together.',
      suggestedAction: 'Choose both parents as informants, or use a statutory declaration or court document.'
    });
  } else if (route === 'clinic-treatment-needed') {
    flags.push({
      id: 'F-PATERNITY-CLINIC-001',
      category: 'paternity-route',
      priority: 'high',
      description:
        'A female couple who are not married or civil partners must have been treated together by a UK licensed clinic under a parenthood agreement for both to be recorded.',
      suggestedAction: 'Confirm the licensed-clinic treatment and parenthood agreement.'
    });
  } else if (route === 'mother-only') {
    flags.push({
      id: 'F-PATERNITY-MOTHER-ONLY-001',
      category: 'paternity-route',
      priority: 'high',
      description: 'A second parent is included although the parents are recorded as mother only.',
      suggestedAction: "Change the parents' relationship, or do not include a second parent."
    });
  }
  if (paternityEvidenceMissing(d)) {
    flags.push({
      id: 'F-PATERNITY-EVIDENCE-001',
      category: 'paternity-evidence',
      priority: 'high',
      description:
        'The basis needs a signed statutory declaration, a court document, or a parental order, and it is not yet in hand.',
      suggestedAction: 'Obtain the signed form or court document and bring the original to the register office.'
    });
  }
  if (unmarriedFatherLeftOff(d)) {
    flags.push({
      id: 'F-UNMARRIED-FATHER-001',
      category: 'unmarried-father',
      priority: 'low',
      description:
        "The mother is registering without the father: his details are left off the entry and may be added later by an application to re-register the birth.",
      suggestedAction: 'If the father should be named, register together or arrange a statutory declaration first.'
    });
  }

  // --- Identity evidence -------------------------------------
  if (identityInsufficient(d)) {
    flags.push({
      id: 'F-IDENTITY-EVIDENCE-001',
      category: 'identity-evidence',
      priority: 'high',
      description:
        'No acceptable identity evidence is held: one accepted document (for example a passport or photocard driving licence), or two from the secondary list, is needed.',
      suggestedAction:
        'Gather one accepted identity document, or two secondary documents such as a utility bill and a bank statement, showing your name.'
    });
  }
  if (identityNotOriginal(d)) {
    flags.push({
      id: 'F-IDENTITY-ORIGINALS-001',
      category: 'identity-evidence',
      priority: 'medium',
      description: 'The identity documents must be originals; photocopies are not accepted.',
      suggestedAction: 'Bring the original documents to the register office.'
    });
  }

  // --- Certificate order (MEDIUM) ----------------------------
  const c = d.certificate;
  if (typeof c.certificatesRequested === 'number' && c.certificatesRequested > 0) {
    if (!nonEmpty(c.deliveryAddress)) {
      flags.push({
        id: 'F-CERTIFICATE-DELIVERY-001',
        category: 'certificate-order',
        priority: 'medium',
        description: 'Certificates are ordered but no delivery address is given.',
        suggestedAction: 'Enter the postal address the certificates should be sent to.'
      });
    }
    if (c.paymentConfirmed === 'no') {
      flags.push({
        id: 'F-CERTIFICATE-PAYMENT-001',
        category: 'certificate-order',
        priority: 'medium',
        description: 'Payment for the certificates is not confirmed; a debit or credit card is needed.',
        suggestedAction: 'Have a debit or credit card ready when ordering.'
      });
    }
  }

  // --- Multiple birth and red book (LOW) ---------------------
  if (d.child.multipleBirth === 'twins' || d.child.multipleBirth === 'triplets-or-more') {
    flags.push({
      id: 'F-MULTIPLE-BIRTH-001',
      category: 'multiple-birth',
      priority: 'low',
      description:
        'Each child of a multiple birth is registered separately, each with its own entry and certificate.',
      suggestedAction: 'Complete one application for each child, and tell the registrar the birth order and times.'
    });
  }
  if (d.informant.redBookPresented === 'no') {
    flags.push({
      id: 'F-RED-BOOK-001',
      category: 'other',
      priority: 'low',
      description: "The child's personal child health record (red book) will not be brought; some registrars ask to see it.",
      suggestedAction: 'Bring the red book if you have it.'
    });
  }

  return flags;
}

export { detectFlaggedIssues };
