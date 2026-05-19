/**
 * UK Statement of Fitness for Work — grading engine.
 *
 * 1:1 TypeScript port of `../front-end-form-with-html/js/grader.js`.
 * Rule IDs (R-VALID-*, R-ADAPT-*, R-PERIOD-*, R-SAFE-*) and flag
 * categories must remain identical across the static HTML, the
 * SvelteKit front-end, and the Rust backend so dashboards can group
 * rows by flag category.
 */

import {
  computePeriodDays,
  countAdaptations,
  type AdaptationIntensity,
  type FiredRule,
  type FitNote,
  type GradingResult,
  type PeriodCompliance,
  type Recommendation,
  type SafetyFlag,
  type YesNo,
} from '../types.js';

const AUTO_DISABILITY_REGEX =
  /\b(hiv|human immunodeficiency virus|cancer|carcinoma|malignan|neoplasm|multiple sclerosis|\bms\b)\b/i;
const DRIVING_REGEX = /\b(should not drive|must not drive|do not drive|no driving)\b/i;

function classifyAdaptation(count: number): AdaptationIntensity {
  switch (count) {
    case 0:
      return 'none';
    case 1:
      return 'light';
    case 2:
      return 'moderate';
    case 3:
      return 'substantial';
    case 4:
      return 'comprehensive';
    default:
      return '';
  }
}

function classifyPeriod(
  days: number | null,
  withinFirst6Months: boolean,
): PeriodCompliance {
  if (days === null || days === undefined) return '';
  if (days < 7) return 'self_cert_range';
  if (days > 180) return 'very_long_term';
  if (days > 90 && withinFirst6Months) return 'exceeds_initial_max';
  if (days > 28) return 'long_term';
  return 'compliant';
}

export function gradeFitNote(fitNote: FitNote): GradingResult {
  const firedRules: FiredRule[] = [];
  const flags: SafetyFlag[] = [];

  // Validity rules --------------------------------------------------------
  if (!fitNote.clinician.name) {
    firedRules.push({
      ruleId: 'R-VALID-NAME-001',
      ruleSet: 'validity',
      severity: 'high',
      description: 'Issuer name missing (DWP policy 3.7).',
    });
    flags.push({
      flagId: 'F-VALID-NAME',
      category: 'invalid_no_name',
      priority: 'high',
      description: 'Fit note is invalid: no issuer name.',
      suggestedAction:
        'Issue a corrected fit note with the clinician name printed.',
    });
  }
  if (!fitNote.clinician.profession) {
    firedRules.push({
      ruleId: 'R-VALID-PROFESSION-001',
      ruleSet: 'validity',
      severity: 'high',
      description: 'Issuer profession missing (DWP policy 3.7).',
    });
    flags.push({
      flagId: 'F-VALID-PROFESSION',
      category: 'invalid_no_profession',
      priority: 'high',
      description: 'Fit note is invalid: no issuer profession.',
      suggestedAction:
        'Re-issue with the profession (doctor / nurse / OT / pharmacist / physio).',
    });
  }
  if (!fitNote.medicalPractice.postalAddressAsFullText) {
    firedRules.push({
      ruleId: 'R-VALID-PRACTICE-001',
      ruleSet: 'validity',
      severity: 'high',
      description: 'Practice address missing (DWP policy 3.7).',
    });
    flags.push({
      flagId: 'F-VALID-PRACTICE',
      category: 'invalid_no_practice_address',
      priority: 'high',
      description: 'Fit note is invalid: no practice address.',
      suggestedAction: 'Re-issue with the practice address printed.',
    });
  }
  if (fitNote.isNonMedical === 'yes') {
    firedRules.push({
      ruleId: 'R-VALID-REASON-001',
      ruleSet: 'validity',
      severity: 'medium',
      description:
        'Reason appears non-medical; fit notes cannot be issued for non-medical problems (DWP policy 3.6).',
    });
    flags.push({
      flagId: 'F-NON-MEDICAL',
      category: 'non_medical_reason_detected',
      priority: 'medium',
      description: 'Reason for the fit note appears to be non-medical.',
      suggestedAction:
        'Discuss alternative support (ACAS, careers advice, debt advice).',
    });
  }
  const isValid = !firedRules.some(
    (r) => r.ruleSet === 'validity' && r.severity === 'high',
  );

  // Adaptation rules ------------------------------------------------------
  const adaptationCount = countAdaptations(fitNote);
  let adaptationIntensity: AdaptationIntensity = '';
  if (fitNote.fitnessForWork === 'may_be_fit') {
    adaptationIntensity = classifyAdaptation(adaptationCount);
    firedRules.push({
      ruleId: 'R-ADAPT-' + adaptationIntensity.toUpperCase() + '-001',
      ruleSet: 'adaptation',
      severity: adaptationCount >= 3 ? 'medium' : 'low',
      description:
        'Adaptation count = ' +
        adaptationCount +
        ' → intensity ' +
        adaptationIntensity +
        '.',
    });
    if (adaptationCount === 0) {
      flags.push({
        flagId: 'F-ADAPT-NONE',
        category: 'may_be_fit_no_adaptations',
        priority: 'medium',
        description: '"May be fit" selected but no adaptations chosen.',
        suggestedAction:
          'Tick at least one adaptation or change the fitness selection to "not fit".',
      });
    }
    if (!fitNote.comments) {
      firedRules.push({
        ruleId: 'R-ADAPT-COMMENT-001',
        ruleSet: 'adaptation',
        severity: 'medium',
        description:
          'Comments box empty when "may be fit" selected (DWP policy 5.6).',
      });
      flags.push({
        flagId: 'F-NO-COMMENTS',
        category: 'may_be_fit_no_comments',
        priority: 'medium',
        description: 'Comments box is empty.',
        suggestedAction:
          'Provide practical advice about what the patient can do at work.',
      });
    }
  }

  // Period rules ----------------------------------------------------------
  const periodDays = computePeriodDays(fitNote);
  let withinFirst6Months: YesNo = '';
  if (fitNote.conditionFirstRecordedDate && fitNote.assessmentDate) {
    const condition = new Date(fitNote.conditionFirstRecordedDate);
    const assessment = new Date(fitNote.assessmentDate);
    if (
      !Number.isNaN(condition.getTime()) &&
      !Number.isNaN(assessment.getTime())
    ) {
      const diffDays =
        (assessment.getTime() - condition.getTime()) / (1000 * 60 * 60 * 24);
      withinFirst6Months = diffDays <= 183 ? 'yes' : 'no';
    }
  }
  const periodCompliance = classifyPeriod(
    periodDays,
    withinFirst6Months === 'yes',
  );
  if (periodCompliance) {
    firedRules.push({
      ruleId:
        'R-PERIOD-' + periodCompliance.toUpperCase().replace(/_/g, '-') + '-001',
      ruleSet: 'period',
      severity:
        periodCompliance === 'exceeds_initial_max'
          ? 'high'
          : periodCompliance === 'very_long_term'
            ? 'medium'
            : 'low',
      description: 'Period = ' + periodDays + ' days → ' + periodCompliance,
    });
  }
  if (periodCompliance === 'exceeds_initial_max') {
    flags.push({
      flagId: 'F-PERIOD-MAX',
      category: 'duration_exceeds_3_months_in_first_6_months',
      priority: 'high',
      description:
        'Period exceeds the 3-month maximum allowed in the first six months of the condition.',
      suggestedAction:
        'Reduce period to ≤ 3 months or document why the rule does not apply.',
    });
  }
  if (periodCompliance === 'self_cert_range') {
    flags.push({
      flagId: 'F-SELF-CERT',
      category: 'self_cert_range',
      priority: 'low',
      description: 'Absence is < 7 days; a fit note is not required.',
      suggestedAction:
        'Recommend self-certification (employee statement of sickness).',
    });
  }
  if (periodDays !== null && periodDays > 28) {
    flags.push({
      flagId: 'F-4W',
      category: 'long_absence_four_weeks',
      priority: 'low',
      description: 'Absence > 4 weeks — consider Access to Work referral.',
      suggestedAction:
        'Signpost the patient to Access to Work and the Health Adjustment Passport.',
    });
  }
  if (periodDays !== null && periodDays > 84) {
    flags.push({
      flagId: 'F-12W',
      category: 'long_absence_twelve_weeks',
      priority: 'medium',
      description: 'Absence > 12 weeks — review SSP entitlement.',
      suggestedAction:
        'Discuss SSP, ESA, or Universal Credit eligibility with the patient.',
    });
  }

  // Safety-flag rules -----------------------------------------------------
  if (
    fitNote.isAutomaticDisability === 'yes' ||
    (fitNote.diagnosisText && AUTO_DISABILITY_REGEX.test(fitNote.diagnosisText))
  ) {
    firedRules.push({
      ruleId: 'R-SAFE-DISABILITY-001',
      ruleSet: 'safety',
      severity: 'medium',
      description:
        'Diagnosis matches automatic disability (Equality Act 2010 s.6).',
    });
    flags.push({
      flagId: 'F-AUTO-DISABILITY',
      category: 'automatic_disability',
      priority: 'medium',
      description:
        'Condition is automatically classed as a disability (HIV / cancer / MS).',
      suggestedAction:
        'Signpost to Access to Work, the Health Adjustment Passport, and condition-specific charities.',
    });
  }
  if (fitNote.diagnosisCategory === 'mental_health') {
    firedRules.push({
      ruleId: 'R-SAFE-MH-001',
      ruleSet: 'safety',
      severity: 'medium',
      description: 'Mental-health diagnosis selected.',
    });
    flags.push({
      flagId: 'F-MENTAL-HEALTH',
      category: 'mental_health_condition',
      priority: 'medium',
      description:
        'Mental-health diagnosis — additional support pathways available.',
      suggestedAction:
        'Signpost to NHS Talking Therapies, MIND, or workplace mental-health resources.',
    });
  }
  if (fitNote.comments && DRIVING_REGEX.test(fitNote.comments)) {
    firedRules.push({
      ruleId: 'R-SAFE-DRIVE-001',
      ruleSet: 'safety',
      severity: 'medium',
      description: 'Comments include a driving restriction.',
    });
    flags.push({
      flagId: 'F-DRIVING',
      category: 'driving_restriction_recommended',
      priority: 'medium',
      description: 'Driving restriction recommended in comments.',
      suggestedAction: 'Confirm DVLA notification obligations with the patient.',
    });
  }
  if (fitNote.safeguardingConcern === 'yes') {
    firedRules.push({
      ruleId: 'R-SAFE-SAFEGUARDING-001',
      ruleSet: 'safety',
      severity: 'high',
      description: 'Safeguarding concern flagged.',
    });
    flags.push({
      flagId: 'F-SAFEGUARDING',
      category: 'safeguarding_concern',
      priority: 'high',
      description: 'Safeguarding concern raised by the clinician.',
      suggestedAction:
        'Follow local safeguarding policy; do not print details on the fit note.',
    });
  }
  if (fitNote.clinician.isPrivatePractice === 'yes') {
    firedRules.push({
      ruleId: 'R-SAFE-PRIVATE-001',
      ruleSet: 'safety',
      severity: 'low',
      description: 'Issuer is in private practice (non-NHS).',
    });
    flags.push({
      flagId: 'F-PRIVATE',
      category: 'private_practice',
      priority: 'low',
      description:
        'Fit note issued in private practice; acceptance is at employer discretion (DWP policy 3.4).',
      suggestedAction:
        'Inform the patient that the employer may request additional evidence.',
    });
  }
  if (fitNote.issueSetting === 'secondary_care_discharge') {
    firedRules.push({
      ruleId: 'R-SAFE-DISCHARGE-001',
      ruleSet: 'safety',
      severity: 'medium',
      description: 'Fit note issued on hospital discharge (DWP policy 3.5).',
    });
    flags.push({
      flagId: 'F-DISCHARGE',
      category: 'secondary_care_discharge',
      priority: 'medium',
      description: 'Issued on hospital discharge; ensure GP is informed.',
      suggestedAction: "Send a copy of the fit note to the patient's GP.",
    });
  }
  if (
    fitNote.clinician.profession === 'nurse' ||
    fitNote.clinician.profession === 'occupational_therapist' ||
    fitNote.clinician.profession === 'pharmacist' ||
    fitNote.clinician.profession === 'physiotherapist'
  ) {
    firedRules.push({
      ruleId: 'R-SAFE-NEW-AUTH-001',
      ruleSet: 'safety',
      severity: 'low',
      description: '2022-authorised issuer profession.',
    });
    flags.push({
      flagId: 'F-NEW-AUTH',
      category: 'new_authority_hcp',
      priority: 'low',
      description:
        'Issued by a 2022-authorised profession (' +
        fitNote.clinician.profession +
        ').',
      suggestedAction: 'No action required — informational.',
    });
  }
  if (fitNote.willAssessAgain === 'yes') {
    firedRules.push({
      ruleId: 'R-SAFE-REVIEW-001',
      ruleSet: 'safety',
      severity: 'low',
      description: 'Review at end of period requested.',
    });
    flags.push({
      flagId: 'F-REVIEW',
      category: 'ongoing_review_required',
      priority: 'low',
      description: 'Clinician will reassess at end of period.',
      suggestedAction:
        'Book a follow-up review around ' +
        (fitNote.plannedReviewDate || 'the end of the period') +
        '.',
    });
  }

  // Recommendation --------------------------------------------------------
  let recommendation: Recommendation = 'standard';
  if (!isValid) {
    recommendation = 'review_for_validity';
  } else if (
    flags.some((f) => f.category === 'automatic_disability') ||
    periodCompliance === 'very_long_term'
  ) {
    recommendation = 'refer_access_to_work';
  } else if (
    adaptationIntensity === 'substantial' ||
    adaptationIntensity === 'comprehensive' ||
    periodCompliance === 'long_term'
  ) {
    recommendation = 'refer_occupational_health';
  } else if (
    periodDays !== null &&
    periodDays >= 84 &&
    fitNote.fitnessForWork === 'not_fit'
  ) {
    recommendation = 'refer_employment_advisor';
  }

  return {
    fitnessCategory: fitNote.fitnessForWork,
    adaptationIntensity,
    adaptationCount,
    periodDays,
    periodCompliance,
    isWithinFirstSixMonthsOfCondition: withinFirst6Months,
    isValid: isValid ? 'yes' : 'no',
    recommendation,
    firedRules,
    safetyFlags: flags,
  };
}
