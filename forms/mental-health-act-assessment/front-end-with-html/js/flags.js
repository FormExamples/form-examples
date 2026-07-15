import { gradeMentalHealthActAssessment } from './grader.js';
import { isDetaining, nonEmpty, riskLimbStatus } from './rules.js';

// Flagged-issue detection (safety, legal, and governance). Independent of the
// completeness status (which the grader produces), this module raises
// AMHP/clinician-facing flags per spec §5:
//
//   - Criteria not met (high)                     — a required criterion is not-met.
//   - Missing second medical recommendation (high) — s2/s3 with no doctor 2.
//   - Section 12 doctor absent (high)             — s2/s3 with neither doctor s12.
//   - Least-restrictive / human-rights concern (high) — s3/s2/detaining with a
//                                                    not-met or undocumented
//                                                    least-restrictive criterion.
//   - Appropriate treatment not available (high)  — s3 with treatment not-met.
//   - Nearest relative not consulted (medium)     — s3 with NR not consulted /
//                                                    an unresolved objection.
//   - Statutory time limit exceeded (medium)      — the two medical examinations
//                                                    are more than 5 days apart.
//   - No bed identified (medium)                  — detaining section, no bed.
//   - No prior acquaintance (low)                 — neither doctor acquainted.
//   - Incomplete documentation (low)              — the assessment is not yet
//                                                    classifiable as valid.
//
// Rows here mirror the `mental_health_act_assessment_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action). NOTHING here
// decides whether to detain; the flags support professional judgement.

/**
 * @typedef {import('./types.js').MentalHealthActAssessment} MentalHealthActAssessment
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Milliseconds in five days — the s2/s3 statutory window between the two medical
// examinations (Mental Health Act 1983, Code of Practice).
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

/**
 * Parse an ISO datetime string into a Date, or null when empty / unparseable.
 * @param {string | null} value
 * @returns {Date | null}
 */
function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * @param {MentalHealthActAssessment} data
 * @param {{ recommendedSectionClass: string }} grade  - result from the grader
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];
  const cls = grade.recommendedSectionClass;
  const detaining = isDetaining(cls);
  const isTwoDoctorSection = cls === 'section-2' || cls === 'section-3';

  // ─── Criteria not met (HIGH) ────────────────────────────────
  if (detaining) {
    const unmet = [];
    if (data.mentalDisorder.mentalDisorderPresent === 'not-met') {
      unmet.push('mental disorder not established');
    }
    if (riskLimbStatus(data) === 'not-met') {
      unmet.push('no risk limb met (own health, own safety, or others)');
    }
    if (unmet.length > 0) {
      flags.push({
        id: 'F-CRITERIA-NOT-MET-001',
        category: 'criteria-not-met',
        priority: 'high',
        description:
          `A statutory criterion required by the recommended section is not met: ${unmet.join('; ')}. A detaining section cannot lawfully rest on unmet criteria.`,
        suggestedAction:
          'Re-examine the statutory criteria; if a criterion genuinely cannot be met, a detaining section is not lawful and a less restrictive option should be considered.'
      });
    }
  }

  // ─── Missing second medical recommendation (HIGH) ───────────
  if (isTwoDoctorSection && !nonEmpty(data.professionals.doctor2Name)) {
    flags.push({
      id: 'F-MISSING-SECOND-RECOMMENDATION-001',
      category: 'missing-second-recommendation',
      priority: 'high',
      description:
        'This section requires two medical recommendations but only one doctor is recorded.',
      suggestedAction:
        'Obtain a second medical recommendation from a registered medical practitioner before the application is made.'
    });
  }

  // ─── Section 12 doctor absent (HIGH) ────────────────────────
  if (
    isTwoDoctorSection &&
    data.professionals.doctor1Section12Approved !== 'yes' &&
    data.professionals.doctor2Section12Approved !== 'yes'
  ) {
    flags.push({
      id: 'F-S12-DOCTOR-ABSENT-001',
      category: 's12-doctor-absent',
      priority: 'high',
      description:
        'Neither medical recommendation is from a Section 12(2) approved doctor; at least one is required for this section.',
      suggestedAction:
        'Ensure at least one recommending doctor is Section 12 approved.'
    });
  }

  // ─── Least-restrictive / human-rights concern (HIGH) ────────
  if (detaining) {
    if (data.leastRestrictive.leastRestrictiveMet === 'not-met') {
      flags.push({
        id: 'F-LEAST-RESTRICTIVE-CONCERN-001',
        category: 'least-restrictive-concern',
        priority: 'high',
        description:
          'A less restrictive alternative is available but a detaining section is recommended — an Article 5 (right to liberty) concern.',
        suggestedAction:
          'Consider informal admission, community treatment, or care under the Mental Capacity Act before proceeding with detention.'
      });
    } else if (!nonEmpty(data.leastRestrictive.alternativesConsidered)) {
      flags.push({
        id: 'F-LEAST-RESTRICTIVE-CONCERN-002',
        category: 'least-restrictive-concern',
        priority: 'high',
        description:
          'No less restrictive alternatives are documented while a detaining section is recommended — an Article 5 (right to liberty) concern.',
        suggestedAction:
          'Document the alternatives considered (informal, community, MCA) and why they are insufficient.'
      });
    }
  }

  // ─── Appropriate treatment not available (HIGH) ─────────────
  if (
    cls === 'section-3' &&
    data.treatment.appropriateTreatmentAvailable === 'not-met'
  ) {
    flags.push({
      id: 'F-APPROPRIATE-TREATMENT-UNAVAILABLE-001',
      category: 'appropriate-treatment-unavailable',
      priority: 'high',
      description:
        'Section 3 requires that appropriate medical treatment is available, but it is recorded as not available.',
      suggestedAction:
        'Confirm the availability of appropriate medical treatment and where it will be provided, or reconsider the section.'
    });
  }

  // ─── Nearest relative not consulted (MEDIUM) ────────────────
  if (cls === 'section-3') {
    if (data.nearestRelative.nearestRelativeConsulted === 'no') {
      flags.push({
        id: 'F-NEAREST-RELATIVE-NOT-CONSULTED-001',
        category: 'nearest-relative-not-consulted',
        priority: 'medium',
        description:
          'Section 3 recommended but the nearest relative has not been consulted and consultation is not recorded as impracticable.',
        suggestedAction:
          'Consult the nearest relative, or record why consultation is not reasonably practicable.'
      });
    } else if (data.nearestRelative.nearestRelativeObjection === 'yes') {
      flags.push({
        id: 'F-NEAREST-RELATIVE-NOT-CONSULTED-002',
        category: 'nearest-relative-not-consulted',
        priority: 'medium',
        description:
          'The nearest relative objects to a Section 3 application; an objection must be resolved (e.g. by displacement) before the application can proceed.',
        suggestedAction:
          'Address the nearest relative’s objection, or apply to displace the nearest relative if appropriate.'
      });
    }
  }

  // ─── Statutory time limit exceeded (MEDIUM) ─────────────────
  const exam1 = parseDate(data.professionals.doctor1ExaminedAt);
  const exam2 = parseDate(data.professionals.doctor2ExaminedAt);
  if (isTwoDoctorSection && exam1 !== null && exam2 !== null) {
    const gap = Math.abs(exam2.getTime() - exam1.getTime());
    if (gap > FIVE_DAYS_MS) {
      flags.push({
        id: 'F-TIME-LIMIT-EXCEEDED-001',
        category: 'time-limit-exceeded',
        priority: 'medium',
        description:
          'The two medical examinations are more than 5 days apart, exceeding the statutory interval for a Section 2 / Section 3 application.',
        suggestedAction:
          'Arrange for the examinations to fall within 5 days of each other before the application is made.'
      });
    }
  }

  // ─── No bed identified (MEDIUM) ─────────────────────────────
  if (detaining && data.recommendation.bedIdentified === 'no') {
    flags.push({
      id: 'F-NO-BED-IDENTIFIED-001',
      category: 'no-bed-identified',
      priority: 'medium',
      description:
        'A detaining section is recommended but no receiving bed has been identified.',
      suggestedAction:
        'Identify and confirm a receiving bed before the person is conveyed.'
    });
  }

  // ─── No prior acquaintance (LOW) ────────────────────────────
  if (isTwoDoctorSection && data.professionals.priorAcquaintance === 'no') {
    flags.push({
      id: 'F-NO-PRIOR-ACQUAINTANCE-001',
      category: 'no-prior-acquaintance',
      priority: 'low',
      description:
        'Neither doctor was previously acquainted with the patient; the Code of Practice recommends one should be, where practicable.',
      suggestedAction:
        'Where practicable, involve a doctor with prior acquaintance of the patient, or record why this was not possible.'
    });
  }

  // ─── Incomplete documentation (LOW) ─────────────────────────
  // Emitted whenever the assessment is not yet classifiable as valid (a
  // required signatory or evidence field is empty). The grader owns the status;
  // we recompute it here so this module stays independent of call order.
  const status = gradeMentalHealthActAssessment(data).completenessStatus;
  if (status === 'incomplete') {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'One or more required signatories or evidence fields are missing, so the assessment cannot yet be classified as valid.',
      suggestedAction:
        'Complete the outstanding signatories and evidence fields, then re-validate.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
