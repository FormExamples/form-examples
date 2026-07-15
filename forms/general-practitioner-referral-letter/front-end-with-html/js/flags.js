import { MANDATORY_ALWAYS } from './rules.js';

// Referral-flag detection. Independent of the completeness status (which the
// grader produces), this module raises referrer-facing flags per spec §5:
//
//   - Suspected-cancer pathway (high)      — urgency == 'two-week-wait'.
//   - Emergency features (high)            — urgency == 'emergency' OR a
//                                            red-flag symptom is documented.
//   - Mandatory information missing (high) — any always-mandatory field absent.
//   - Urgency information missing (medium) — urgent / two-week-wait selected but
//                                            urgencyReason, suspectedCancerCriterion,
//                                            or suspectedCancerPathway absent.
//   - Consent not documented (medium)      — consentToShare != 'yes'.
//   - No safety-netting recorded (low)     — safetyNetting absent.
//
// Rows here mirror the `general_practitioner_referral_letter_grade_flag` SQL
// table (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').Referral} Referral
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.GeneralPractitionerReferralLetter.

const nonEmpty = (s) => typeof s === 'string' && s.trim() !== '';

/**
 * Names the always-mandatory fields that are blank, mirroring MANDATORY_ALWAYS
 * in `rules.js`. Used by the mandatory-information-missing flag.
 * @param {Referral} r
 * @returns {string[]}
 */
function missingMandatoryFields(r) {
  const missing = [];
  const always = MANDATORY_ALWAYS || [];
  for (const field of always) {
    if (field.present(r) !== true) missing.push(field.label);
  }
  return missing;
}

/**
 * @param {Referral} referral
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(referral) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const urgency = referral.urgencyInfo.urgency;

  // ─── Suspected-cancer pathway (HIGH) ────────────────────────
  if (urgency === 'two-week-wait') {
    flags.push({
      id: 'F-SUSPECTED-CANCER-PATHWAY-001',
      category: 'suspected-cancer-pathway',
      priority: 'high',
      description:
        'This is a suspected-cancer (two-week-wait) referral — it must be routed on the suspected-cancer pathway, not as a routine referral.',
      suggestedAction:
        'Name the NICE NG12 criterion and the tumour-site pathway, and book on the two-week-wait pathway so the patient is seen within two weeks.'
    });
  }

  // ─── Emergency features (HIGH) ──────────────────────────────
  if (urgency === 'emergency' || nonEmpty(referral.clinical.redFlagSymptoms)) {
    flags.push({
      id: 'F-EMERGENCY-FEATURES-001',
      category: 'emergency-features',
      priority: 'high',
      description:
        'Emergency features are present (emergency urgency selected or a red-flag symptom documented) — a routine referral letter is not appropriate.',
      suggestedAction:
        'Arrange same-day assessment or call 999 / acute admission now; do not send this as a routine letter.'
    });
  }

  // ─── Mandatory information missing (HIGH) ───────────────────
  const missing = missingMandatoryFields(referral);
  if (missing.length > 0) {
    flags.push({
      id: 'F-MANDATORY-INFORMATION-MISSING-001',
      category: 'mandatory-information-missing',
      priority: 'high',
      description:
        `One or more mandatory fields are missing: ${missing.join(', ')}. The receiving service may reject or bounce the referral.`,
      suggestedAction:
        'Complete the missing mandatory field(s) so the referral is sendable.'
    });
  }

  // ─── Urgency information missing (MEDIUM) ───────────────────
  const urgencyReasonMissing =
    (urgency === 'urgent' || urgency === 'two-week-wait') &&
    !nonEmpty(referral.urgencyInfo.urgencyReason);
  const cancerDetailMissing =
    urgency === 'two-week-wait' &&
    (!nonEmpty(referral.urgencyInfo.suspectedCancerCriterion) ||
      !nonEmpty(referral.urgencyInfo.suspectedCancerPathway));
  if (urgencyReasonMissing || cancerDetailMissing) {
    flags.push({
      id: 'F-URGENCY-INFORMATION-MISSING-001',
      category: 'urgency-information-missing',
      priority: 'medium',
      description:
        'An urgent or two-week-wait referral is selected but the urgency reason, suspected-cancer criterion, or pathway is missing.',
      suggestedAction:
        'Record the urgency reason and, for two-week-wait, the named criterion and tumour-site pathway.'
    });
  }

  // ─── Consent not documented (MEDIUM) ────────────────────────
  if (referral.expectations.consentToShare !== 'yes') {
    flags.push({
      id: 'F-CONSENT-NOT-DOCUMENTED-001',
      category: 'consent-not-documented',
      priority: 'medium',
      description:
        'Consent to share information with the receiving service is not documented — the referral remains sendable but consent should be recorded.',
      suggestedAction:
        'Record that the patient consented to the referral and to information-sharing, per Montgomery v Lanarkshire (2015).'
    });
  }

  // ─── No safety-netting recorded (LOW) ───────────────────────
  if (!nonEmpty(referral.expectations.safetyNetting)) {
    flags.push({
      id: 'F-NO-SAFETY-NETTING-001',
      category: 'no-safety-netting',
      priority: 'low',
      description:
        'No safety-netting advice or follow-up is documented for the patient while awaiting the appointment.',
      suggestedAction:
        'Record the safety-netting advice given to the patient and when to seek further help.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { missingMandatoryFields, detectFlaggedIssues };
