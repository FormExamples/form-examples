// Declarative Council Tax discount eligibility rules (England).
//
// This form is a COMPLETENESS and ELIGIBILITY instrument. This module holds the
// primitive predicates the grader (`grader.js`) and the flag detector
// (`flags.js`) compose:
//
//   - counted adults (who counts when working out the household),
//   - the student course criteria (GOV.UK: 1 year, 21 hours a week),
//   - per-claim disqualifiers and missing-item checks,
//   - the indicative outcome.
//
// Nothing here decides that a discount is awarded. ELIGIBILITY IS DECIDED BY THE
// BILLING AUTHORITY; the rules only encode what the public GOV.UK guidance
// says, so the grader can pre-check an application. See `doc/index.md`.

/**
 * @typedef {import('./types.js').Application} Application
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/** Statuses that are disregarded (not counted) when counting adults. */
const DISREGARDED_STATUSES = [
  'full-time-student',
  'severely-mentally-impaired',
  'under-18',
  'apprentice',
  'education-18-19',
  'live-in-carer',
  'care-leaver',
  'other-disregarded'
];

/** Disregarded statuses that need evidence held (certificate or declaration). */
const EVIDENCE_STATUSES = [
  'full-time-student',
  'severely-mentally-impaired',
  'apprentice',
  'care-leaver'
];

/** Claim types that are discounts, exemptions or disregards (not the means-tested CTR). */
const DISCOUNT_CLAIMS = [
  'single-person-discount',
  'all-disregarded-discount',
  'student-exemption',
  'severe-mental-impairment',
  'disabled-band-reduction',
  'care-leaver-relief'
];

/**
 * The occupants other than the applicant: none when the applicant says nobody
 * else lives in the property.
 * @param {Application} a
 */
function roster(a) {
  return a.household.othersLive === 'no' ? [] : a.household.occupants;
}

/** A status counts as an adult when unanswered or `counted-adult`. */
function countsAsAdult(status) {
  return status === '' || status === 'counted-adult' || status === undefined || status === null;
}

/** Whole years between an ISO birth date and an ISO date; null when either is missing. */
function ageOn(birthDate, onDate) {
  if (!nonEmpty(birthDate) || !nonEmpty(onDate)) return null;
  const b = birthDate.split('-').map(Number);
  const o = onDate.split('-').map(Number);
  if (b.length < 3 || o.length < 3 || b.some(Number.isNaN) || o.some(Number.isNaN)) return null;
  let age = o[0] - b[0];
  if (o[1] < b[1] || (o[1] === b[1] && o[2] < b[2])) age -= 1;
  return age;
}

/** Whole days from one ISO date to another (to - from); null when either is missing. */
function daysBetween(from, to) {
  if (!nonEmpty(from) || !nonEmpty(to)) return null;
  const f = Date.parse(from + 'T00:00:00Z');
  const t = Date.parse(to + 'T00:00:00Z');
  if (Number.isNaN(f) || Number.isNaN(t)) return null;
  return Math.round((t - f) / 86400000);
}

/**
 * Number of counted adults: the applicant plus every roster occupant whose
 * status is unanswered or `counted-adult`.
 * @param {Application} a
 * @returns {number}
 */
function countedAdults(a) {
  let n = countsAsAdult(a.applicant.status) ? 1 : 0;
  for (const o of roster(a)) {
    if (countsAsAdult(o.status)) n += 1;
  }
  return n;
}

/** Number of people (applicant and occupants) with the given status. */
function countWithStatus(a, status) {
  let n = a.applicant.status === status ? 1 : 0;
  for (const o of roster(a)) {
    if (o.status === status) n += 1;
  }
  return n;
}

/**
 * Whether the student course meets the GOV.UK full-time criteria: at least one
 * year and 21 hours a week, or (under 20, up to A level) 3 months and 12 hours.
 * The applicant's age on the effective date selects the under-20 route.
 * @param {Application} a
 * @returns {boolean}
 */
function studentCourseQualifies(a) {
  const months = a.evidence.studentCourseMonths;
  const hours = a.evidence.studentHoursPerWeek;
  if (months === null || hours === null || months === undefined || hours === undefined) return false;
  if (months >= 12 && hours >= 21) return true;
  const age = ageOn(a.applicant.birthDate, a.claim.effectiveDate || a.claim.applicationDate);
  return age !== null && age < 20 && months >= 3 && hours >= 12;
}

/** Disregarded occupants (and the applicant) whose evidence is not recorded as held. */
function disregardedWithoutEvidence(a) {
  return roster(a).filter(
    (o) => EVIDENCE_STATUSES.indexOf(o.status) !== -1 && o.evidenceHeld !== 'yes'
  );
}

/** Occupants whose date of birth conflicts with their stated status. */
function ageStatusMismatches(a) {
  const on = a.claim.effectiveDate || a.claim.applicationDate;
  return roster(a).filter((o) => {
    const age = ageOn(o.birthDate, on);
    if (age === null) return false;
    if (o.status === 'under-18' && age >= 18) return true;
    if (o.status === 'counted-adult' && age < 18) return true;
    if (o.status === 'education-18-19' && (age < 18 || age > 19)) return true;
    return false;
  });
}

/** True when the effective date is before the application date (backdating). */
function isBackdated(a) {
  const d = daysBetween(a.claim.effectiveDate, a.claim.applicationDate);
  return d !== null && d > 0;
}

/** Student exists on the roster (applicant or occupant). */
function hasStudent(a) {
  return countWithStatus(a, 'full-time-student') > 0;
}

/**
 * Hard disqualifiers: facts that make the claim likely ineligible. Each entry
 * is { code, message }.
 * @param {Application} a
 * @returns {{code: string, message: string}[]}
 */
function disqualifiers(a) {
  const out = [];
  const t = a.claim.claimType;
  if (t === '') return out;
  const adults = countedAdults(a);
  if (DISCOUNT_CLAIMS.indexOf(t) !== -1 && a.property.mainResidence === 'no') {
    out.push({ code: 'not-main-residence', message: 'The property is not the applicant\'s main home.' });
  }
  if (t === 'single-person-discount' && adults !== 1) {
    out.push({
      code: 'adult-count',
      message: adults === 0
        ? 'No counted adult lives in the property; the 50% discount for a fully disregarded household may apply instead.'
        : `${adults} counted adults live in the property; the single person discount needs exactly one.`
    });
  }
  if (t === 'all-disregarded-discount') {
    if (adults !== 0) {
      out.push({ code: 'adult-count', message: `${adults} counted adult(s) live in the property; the 50% discount needs every resident to be disregarded.` });
    } else if (roster(a).length === 0 && countsAsAdult(a.applicant.status)) {
      out.push({ code: 'adult-count', message: 'No disregarded resident is listed.' });
    }
  }
  if (t === 'student-exemption') {
    if (adults > 0) {
      out.push({ code: 'adult-count', message: 'A counted adult who is not a full-time student lives in the property, so it is a discount, not an exemption.' });
    } else if (!hasStudent(a)) {
      out.push({ code: 'no-student', message: 'No full-time student is listed on the roster.' });
    }
    if (studentEvidenceStarted(a) && !studentCourseQualifies(a)) {
      out.push({ code: 'course-criteria', message: 'The course does not meet the full-time criteria (1 year and 21 hours a week).' });
    }
  }
  if (t === 'severe-mental-impairment') {
    if (a.evidence.smiCertificate === 'no') out.push({ code: 'smi-certificate', message: 'No certificate of severe mental impairment.' });
    if (a.evidence.qualifyingBenefit === 'no') out.push({ code: 'smi-benefit', message: 'The person receives no qualifying benefit.' });
  }
  if (t === 'disabled-band-reduction') {
    if (a.evidence.disabilityAdaptation === 'none') out.push({ code: 'adaptation', message: 'No qualifying adaptation or extra space for the disabled person.' });
    if (a.evidence.disabledPersonMainHome === 'no') out.push({ code: 'main-home', message: 'The property is not a disabled person\'s main home.' });
  }
  if (t === 'care-leaver-relief') {
    const age = a.evidence.careLeaverAgeYears;
    if (age !== null && age !== undefined && age >= 25) {
      out.push({ code: 'care-leaver-age', message: 'Care leaver relief is for care leavers under 25.' });
    }
  }
  return out;
}

/** True once the applicant has entered any student course detail. */
function studentEvidenceStarted(a) {
  return a.evidence.studentCourseMonths !== null && a.evidence.studentHoursPerWeek !== null;
}

/**
 * Missing required items: answers and evidence still needed. Each entry is
 * { code, message }.
 * @param {Application} a
 * @returns {{code: string, message: string}[]}
 */
function missingItems(a) {
  const out = [];
  const t = a.claim.claimType;
  const need = (cond, code, message) => { if (cond) out.push({ code, message }); };
  need(t === '', 'claim-type', 'Choose the claim type.');
  need(!nonEmpty(a.claim.billingAuthority), 'billing-authority', 'Name the billing authority.');
  need(!nonEmpty(a.claim.effectiveDate), 'effective-date', 'Give the date the discount should start from.');
  need(!nonEmpty(a.applicant.name), 'applicant-name', 'Give the applicant\'s name.');
  need(!nonEmpty(a.property.postcode), 'postcode', 'Give the property postcode.');
  need(a.household.othersLive === '', 'others-live', 'Say whether anyone else lives in the property.');
  need(a.property.band === '', 'band', 'Choose the Council Tax band.');
  need(a.property.mainResidence === '' && DISCOUNT_CLAIMS.indexOf(t) !== -1, 'main-residence', 'Say whether the property is the applicant\'s main home.');
  if (t === 'severe-mental-impairment') {
    need(a.evidence.smiCertificate === '', 'smi-certificate', 'Say whether a severe mental impairment certificate is held.');
    need(a.evidence.qualifyingBenefit === '', 'smi-benefit', 'Say whether a qualifying benefit is received.');
  }
  if (t === 'student-exemption') {
    need(a.evidence.studentCertificate !== 'yes', 'student-certificate', 'Provide the course provider\'s student certificate.');
    need(!studentEvidenceStarted(a), 'student-course', 'Give the course length and weekly hours.');
  }
  if (t === 'disabled-band-reduction') {
    need(a.evidence.disabilityAdaptation === '', 'adaptation', 'Say which adaptation or extra space applies.');
    need(a.evidence.disabledPersonMainHome === '', 'main-home', 'Say whether the property is a disabled person\'s main home.');
  }
  if (t === 'care-leaver-relief') {
    need(a.evidence.careLeaverProof !== 'yes', 'care-leaver-proof', 'Provide proof from the local authority that looked after the applicant.');
    need(a.evidence.careLeaverAgeYears === null || a.evidence.careLeaverAgeYears === undefined, 'care-leaver-age', 'Give the care leaver\'s age.');
  }
  need(disregardedWithoutEvidence(a).length > 0, 'occupant-evidence', 'Hold evidence for each disregarded occupant.');
  need(roster(a).some((o) => !nonEmpty(o.name)), 'occupant-name', 'Name every occupant on the roster.');
  need(a.declaration.declaredTrue !== 'yes', 'declared-true', 'Declare the information is true and complete.');
  need(a.declaration.agreesToReportChanges !== 'yes', 'report-changes', 'Agree to report changes within 21 days.');
  need(a.declaration.fraudWarningAcknowledged !== 'yes', 'fraud-warning', 'Acknowledge the fraud warning.');
  return out;
}

/**
 * Indicative outcome if the authority agrees.
 * @param {Application} a
 * @returns {string}
 */
function indicativeOutcome(a) {
  switch (a.claim.claimType) {
    case 'single-person-discount': return '25-percent-discount';
    case 'all-disregarded-discount': return '50-percent-discount';
    case 'student-exemption': return 'full-exemption';
    case 'severe-mental-impairment': return 'smi-disregard';
    case 'disabled-band-reduction': return 'band-reduction';
    case 'care-leaver-relief': return 'care-leaver-relief';
    case 'council-tax-reduction': return 'means-tested-reduction';
    default: return 'none';
  }
}

export {
  roster, nonEmpty, countsAsAdult, ageOn, daysBetween, countedAdults, countWithStatus,
  studentCourseQualifies, disregardedWithoutEvidence, ageStatusMismatches,
  isBackdated, hasStudent, disqualifiers, missingItems, indicativeOutcome,
  studentEvidenceStarted, DISCOUNT_CLAIMS, DISREGARDED_STATUSES, EVIDENCE_STATUSES
};
