// Declarative Social Security card application (Form SS-5) rules.
//
// This form is a DOCUMENTATION-SUPPORT and COMPLETENESS instrument, not legal
// advice and not an SSA decision. This module holds the primitive predicates
// the grader (`grader.js`) and the flag detector (`flags.js`) compose (spec §4):
//
//   - the replacement-card limits (3 per calendar year, 10 per lifetime) and
//     the exceptions to them (20 CFR 422.103(e), POMS RM 10205.400),
//   - the evidence requirements (identity, age, US citizenship or lawful alien
//     status, legal name change) from the SS-5 instructions (20 CFR 422.107),
//   - the age rules (in-person application from age 12 for an original card;
//     a parent or guardian signs for an applicant under 18),
//   - the required-field list and the Tell-SSA death items.
//
// Nothing in this file decides that SSA will issue a card; it encodes what the
// published rules require so the grader can classify the application. Federal
// rules only: state of residence is recorded but does not change any rule.

/**
 * @typedef {import('./types.js').SocialSecurityApplication} SocialSecurityApplication
 */

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/** Replacement cards allowed per calendar year (IRTPA 2004; 20 CFR 422.103(e)). */
const LIMIT_PER_YEAR = 3;
/** Replacement cards allowed per lifetime. */
const LIMIT_PER_LIFETIME = 10;
/** Age from which an original card application must be made in person. */
const IN_PERSON_AGE = 12;
/** Age below which a parent or guardian signs. */
const ADULT_AGE = 18;

/** USPS codes for the 50 states, DC, and the territories SSA serves. */
const STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
  'WV', 'WI', 'WY', 'AS', 'GU', 'MP', 'PR', 'VI'
];

/** Citizenship documents that prove US citizenship. */
const CITIZEN_DOCUMENTS = [
  'us-birth-certificate',
  'us-passport',
  'certificate-of-naturalization',
  'certificate-of-citizenship',
  'consular-report-of-birth-abroad'
];
/** Documents that prove lawful alien status. */
const ALIEN_DOCUMENTS = [
  'permanent-resident-card',
  'i-94-with-work-authorization',
  'employment-authorization-document'
];
/** Identity documents SSA accepts (when current and an original or certified copy). */
const IDENTITY_DOCUMENTS = [
  'us-driver-license', 'state-id-card', 'us-passport', 'military-id',
  'employee-id', 'school-id', 'health-insurance-card'
];
const AGE_DOCUMENTS = [
  'us-birth-certificate', 'us-passport', 'hospital-record', 'religious-record', 'immigration-record'
];
const NAME_CHANGE_DOCUMENTS = [
  'marriage-certificate', 'divorce-decree', 'court-order', 'certificate-of-naturalization'
];

/** Lower-case, trim, and collapse whitespace for name comparison. @param {string} text */
function normalize(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim().replace(/[.,]+$/, '');
}

/**
 * Whole years between two ISO dates; null when either is missing or the order is wrong.
 * @param {string | null} from
 * @param {string | null} to
 * @returns {number | null}
 */
function yearsBetween(from, to) {
  if (!from || !to) return null;
  const a = String(from).slice(0, 10).split('-').map(Number);
  const b = String(to).slice(0, 10).split('-').map(Number);
  if (a.length < 3 || b.length < 3 || a.some(Number.isNaN) || b.some(Number.isNaN)) return null;
  let years = b[0] - a[0];
  if (b[1] < a[1] || (b[1] === a[1] && b[2] < a[2])) years -= 1;
  return years < 0 ? null : years;
}

/** Age in whole years on the application date. @param {SocialSecurityApplication} d */
function ageAtApplication(d) {
  return yearsBetween(d.applicant.dateOfBirth, d.request.applicationDate);
}

/** @param {SocialSecurityApplication} d */
function isMinor(d) {
  const age = ageAtApplication(d);
  return age !== null && age < ADULT_AGE;
}

/** Tell SSA: the person in item 1 has died. @param {SocialSecurityApplication} d */
function applicantDeceased(d) {
  return d.tellSsa.applicantDeceased === 'yes';
}

/**
 * Whether the replacement limits apply. A legal name change card is not
 * counted toward either limit.
 * @param {SocialSecurityApplication} d
 */
function limitApplies(d) {
  return d.request.requestType === 'replacement' && d.request.nameChange !== 'yes';
}

/** The applicant already has 3 this year or 10 in a lifetime. @param {SocialSecurityApplication} d */
function limitReached(d) {
  if (!limitApplies(d)) return false;
  const year = d.request.replacementsThisYear;
  const life = d.request.replacementsLifetime;
  return (year !== null && year >= LIMIT_PER_YEAR) || (life !== null && life >= LIMIT_PER_LIFETIME);
}

/** An exception reason is claimed and supported by documents. @param {SocialSecurityApplication} d */
function limitExceptionValid(d) {
  return nonEmpty(d.request.limitExceptionReason) && d.request.limitExceptionEvidence === 'yes';
}

/** Limit reached with no supported exception: SSA denies the replacement card. @param {SocialSecurityApplication} d */
function limitBlocked(d) {
  return limitReached(d) && !limitExceptionValid(d);
}

/** One replacement short of a limit (2 this year, or 9 in a lifetime). @param {SocialSecurityApplication} d */
function limitNear(d) {
  if (!limitApplies(d) || limitReached(d)) return false;
  const year = d.request.replacementsThisYear;
  const life = d.request.replacementsLifetime;
  return (year !== null && year === LIMIT_PER_YEAR - 1) || (life !== null && life === LIMIT_PER_LIFETIME - 1);
}

/** An original card for an applicant aged 12 or older must be requested in person. @param {SocialSecurityApplication} d */
function inPersonRequired(d) {
  const age = ageAtApplication(d);
  return d.request.requestType === 'original' && age !== null && age >= IN_PERSON_AGE;
}

/** The application is by mail where in-person is required. @param {SocialSecurityApplication} d */
function inPersonViolation(d) {
  return inPersonRequired(d) && d.request.channel === 'mail';
}

/** Proof of identity is required for every application. Unacceptable when absent, expired, or not listed. @param {SocialSecurityApplication} d */
function identityEvidenceMissing(d) {
  return IDENTITY_DOCUMENTS.indexOf(d.evidence.identityDocument) === -1 || d.evidence.identityDocumentExpired === 'yes';
}

/** The identity document is expired. @param {SocialSecurityApplication} d */
function identityDocumentExpired(d) {
  return d.evidence.identityDocumentExpired === 'yes';
}

/** Proof of age is required for an original card and for a date-of-birth correction. @param {SocialSecurityApplication} d */
function ageEvidenceRequired(d) {
  return d.request.requestType === 'original' ||
    (d.request.requestType === 'correction' && d.request.dateOfBirthCorrection === 'yes');
}

/** @param {SocialSecurityApplication} d */
function ageEvidenceMissing(d) {
  return ageEvidenceRequired(d) && AGE_DOCUMENTS.indexOf(d.evidence.ageDocument) === -1;
}

/** Citizenship or status evidence is required unless SSA already holds it for a replacement. @param {SocialSecurityApplication} d */
function citizenshipEvidenceRequired(d) {
  if (d.request.requestType === 'replacement') return d.evidence.citizenshipOnFile !== 'yes';
  return true;
}

/**
 * The citizenship document does not match the claimed citizenship or status.
 * @param {SocialSecurityApplication} d
 */
function citizenshipEvidenceMissing(d) {
  if (!citizenshipEvidenceRequired(d)) return false;
  const doc = d.evidence.citizenshipDocument;
  if (d.applicant.citizenship === 'us-citizen') return CITIZEN_DOCUMENTS.indexOf(doc) === -1;
  if (d.applicant.citizenship === 'legal-alien-allowed-to-work' ||
      d.applicant.citizenship === 'legal-alien-not-allowed-to-work') {
    return ALIEN_DOCUMENTS.indexOf(doc) === -1 && doc !== 'certificate-of-naturalization';
  }
  return true;
}

/**
 * A lawfully admitted noncitizen without work authorization needs a valid
 * non-work reason (a federal or state benefit or law requiring the number).
 * @param {SocialSecurityApplication} d
 */
function workAuthorizationMissing(d) {
  return d.request.requestType === 'original' &&
    d.applicant.citizenship === 'legal-alien-not-allowed-to-work' &&
    d.applicant.nonWorkReasonValid !== 'yes';
}

/** @param {SocialSecurityApplication} d */
function nameChangeEvidenceMissing(d) {
  return d.request.nameChange === 'yes' && NAME_CHANGE_DOCUMENTS.indexOf(d.evidence.nameChangeDocument) === -1;
}

/** Photocopies and notarized copies are not accepted. @param {SocialSecurityApplication} d */
function documentsNotOriginal(d) {
  return d.evidence.documentsOriginalOrCertified === 'no';
}

/** The name differs from the birth name with no legal name change recorded. @param {SocialSecurityApplication} d */
function nameDiffersWithoutChange(d) {
  const onCard = normalize(d.applicant.nameOnCard);
  const atBirth = normalize(d.applicant.nameAtBirth);
  return onCard !== '' && atBirth !== '' && onCard !== atBirth && d.request.nameChange !== 'yes';
}

/** The signer is not the applicant. @param {SocialSecurityApplication} d */
function signedByAnother(d) {
  const r = d.filer.signerRelationship;
  return r !== '' && r !== 'self';
}

/** A person under 18 must have a parent or guardian sign. @param {SocialSecurityApplication} d */
function minorSignerProblem(d) {
  if (!isMinor(d)) return false;
  const r = d.filer.signerRelationship;
  return r === 'self' || r === 'other' || (r !== '' && !nonEmpty(d.filer.signerName));
}

/** The signer, when not the applicant, has not shown their own identity. @param {SocialSecurityApplication} d */
function signerIdentityMissing(d) {
  return signedByAnother(d) && d.filer.signerIdentityDocument !== 'yes';
}

/** The previous-application answer contradicts a replacement or correction request. @param {SocialSecurityApplication} d */
function priorApplicationInconsistent(d) {
  return (d.request.requestType === 'replacement' || d.request.requestType === 'correction') &&
    d.request.previouslyApplied === 'no';
}

/** @param {SocialSecurityApplication} d */
function stateInvalid(d) {
  const s = d.applicant.stateOfResidence;
  return nonEmpty(s) && STATE_CODES.indexOf(s.trim().toUpperCase()) === -1;
}

/**
 * Required form fields that are still blank. Each entry is `{ id, label }`.
 * @param {SocialSecurityApplication} d
 * @returns {{ id: string, label: string }[]}
 */
function missingFields(d) {
  const r = d.request;
  const a = d.applicant;
  const out = [];
  const need = (ok, id, label) => { if (!ok) out.push({ id, label }); };
  need(nonEmpty(r.requestType), 'requestType', 'Type of request');
  need(nonEmpty(r.applicationDate), 'applicationDate', 'Application date');
  need(nonEmpty(r.channel), 'channel', 'How the application is submitted');
  need(nonEmpty(r.previouslyApplied), 'previouslyApplied', 'Whether an SSN was applied for before');
  need(nonEmpty(r.nameChange), 'nameChange', 'Whether the name changed');
  need(nonEmpty(a.nameOnCard), 'nameOnCard', 'Name to be shown on the card');
  need(nonEmpty(a.nameAtBirth), 'nameAtBirth', 'Full name at birth');
  need(nonEmpty(a.dateOfBirth), 'dateOfBirth', 'Date of birth');
  need(nonEmpty(a.placeOfBirthCity), 'placeOfBirthCity', 'City of birth');
  need(nonEmpty(a.placeOfBirthRegion), 'placeOfBirthRegion', 'State or country of birth');
  need(nonEmpty(a.sex), 'sex', 'Sex');
  need(nonEmpty(a.citizenship), 'citizenship', 'Citizenship');
  need(nonEmpty(a.motherNameAtBirth), 'motherNameAtBirth', "Mother's name at birth");
  need(nonEmpty(a.mailingAddress), 'mailingAddress', 'Mailing address');
  need(nonEmpty(a.stateOfResidence) && !stateInvalid(d), 'stateOfResidence', 'State of residence');
  need(nonEmpty(d.filer.signerRelationship), 'signerRelationship', 'Who is signing');
  need(d.filer.signaturePresent === 'yes', 'signaturePresent', 'Signature');
  need(nonEmpty(d.evidence.documentsOriginalOrCertified), 'documentsOriginalOrCertified', 'Whether documents are originals or certified copies');
  need(nonEmpty(d.tellSsa.applicantDeceased), 'applicantDeceased', 'Whether the applicant has died');
  if (r.requestType === 'replacement' || r.requestType === 'correction') {
    need(nonEmpty(a.nameOnMostRecentCard), 'nameOnMostRecentCard', 'Name on the most recent card');
  }
  if (r.requestType === 'replacement') {
    need(r.replacementsThisYear !== null && r.replacementsThisYear !== undefined, 'replacementsThisYear', 'Replacement cards this calendar year');
    need(r.replacementsLifetime !== null && r.replacementsLifetime !== undefined, 'replacementsLifetime', 'Replacement cards in a lifetime');
  }
  return out;
}

/**
 * Evidence items that are missing, expired, or not acceptable. Each entry is
 * `{ id, label }`.
 * @param {SocialSecurityApplication} d
 * @returns {{ id: string, label: string }[]}
 */
function evidenceGaps(d) {
  const out = [];
  const add = (cond, id, label) => { if (cond) out.push({ id, label }); };
  add(identityEvidenceMissing(d), 'identity', 'Current proof of identity');
  add(ageEvidenceMissing(d), 'age', 'Proof of age');
  add(citizenshipEvidenceMissing(d), 'citizenship', 'Proof of US citizenship or lawful alien status');
  add(workAuthorizationMissing(d), 'work-authorization', 'Work authorization or a valid non-work reason');
  add(nameChangeEvidenceMissing(d), 'name-change', 'Legal name-change document');
  add(documentsNotOriginal(d), 'originals', 'Original or certified documents');
  add(signerIdentityMissing(d), 'signer-identity', "Signer's own proof of identity");
  return out;
}

export {
  nonEmpty, normalize, yearsBetween, ageAtApplication, isMinor, applicantDeceased,
  LIMIT_PER_YEAR, LIMIT_PER_LIFETIME, IN_PERSON_AGE, ADULT_AGE, STATE_CODES,
  CITIZEN_DOCUMENTS, ALIEN_DOCUMENTS, IDENTITY_DOCUMENTS, AGE_DOCUMENTS, NAME_CHANGE_DOCUMENTS,
  limitApplies, limitReached, limitExceptionValid, limitBlocked, limitNear,
  inPersonRequired, inPersonViolation,
  identityEvidenceMissing, identityDocumentExpired, ageEvidenceRequired, ageEvidenceMissing,
  citizenshipEvidenceRequired, citizenshipEvidenceMissing, workAuthorizationMissing,
  nameChangeEvidenceMissing, documentsNotOriginal, nameDiffersWithoutChange,
  signedByAnother, minorSignerProblem, signerIdentityMissing, priorApplicationInconsistent,
  stateInvalid, missingFields, evidenceGaps
};
