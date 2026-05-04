// Pure form-completeness validator for the Medical Records Release
// Permission form. Mirrors `src/lib/engine/form-validator.ts` from the
// SvelteKit implementation: each missing required field, each invalid
// email, and each cross-field date inconsistency surfaces as a fired rule.

(function () {
'use strict';
const NS = window.MedicalRecordsReleasePermission =
  window.MedicalRecordsReleasePermission || {};
const {
  validationRules,
  completenessPercent,
  validationStatus,
  completenessStatus,
  isValidEmail
} = NS;

/**
 * Validate the full assessment data and return a completeness score plus a
 * list of fired rules. Pure function: no side effects.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   completenessScore: number,
 *   completenessStatusLabel: string,
 *   validationStatusLabel: string,
 *   firedRules: FiredRule[],
 *   completedFields: number,
 *   totalFields: number
 * }}
 */
function validateForm(data) {
  const firedRules = [];
  const totalFields = validationRules.length;
  let completedFields = 0;

  for (const rule of validationRules) {
    const section = data[rule.section];
    const value = section ? section[rule.field] : undefined;

    let isComplete = false;
    if (Array.isArray(value)) {
      isComplete = value.length > 0;
    } else if (typeof value === 'string') {
      // Acknowledgement / signature fields must explicitly be 'yes' to count.
      if (
        rule.field === 'acknowledgedRightToRevoke' ||
        rule.field === 'acknowledgedDataProtection' ||
        rule.field === 'acknowledgedNoChargeForAccess' ||
        rule.field === 'patientSignatureConfirmed' ||
        rule.field === 'witnessSignatureConfirmed'
      ) {
        isComplete = value === 'yes';
      } else {
        isComplete = value.trim() !== '';
      }
    } else {
      isComplete = value !== null && value !== undefined;
    }

    if (isComplete) {
      completedFields++;
    } else {
      firedRules.push({
        id: rule.id,
        domain: rule.section,
        description: rule.description,
        score: 0
      });
    }
  }

  // Email format validation
  if (data.patientInformation.email && !isValidEmail(data.patientInformation.email)) {
    firedRules.push({
      id: 'RULE-FMT-001',
      domain: 'patientInformation',
      description: 'Patient email format is invalid',
      score: 0
    });
  }

  if (data.authorizedRecipient.recipientEmail && !isValidEmail(data.authorizedRecipient.recipientEmail)) {
    firedRules.push({
      id: 'RULE-FMT-002',
      domain: 'authorizedRecipient',
      description: 'Recipient email format is invalid',
      score: 0
    });
  }

  // End date must be after start date.
  if (data.authorizationPeriod.startDate && data.authorizationPeriod.endDate) {
    if (data.authorizationPeriod.endDate < data.authorizationPeriod.startDate) {
      firedRules.push({
        id: 'RULE-FMT-003',
        domain: 'authorizationPeriod',
        description: 'Authorization end date must be after start date',
        score: 0
      });
    }
  }

  // Specific date range requires both endpoints.
  if (data.recordsToRelease.specificDateRange === 'yes') {
    if (!data.recordsToRelease.dateFrom) {
      firedRules.push({
        id: 'RULE-FMT-004',
        domain: 'recordsToRelease',
        description: 'Record date range "from" date is required when specific date range is selected',
        score: 0
      });
    }
    if (!data.recordsToRelease.dateTo) {
      firedRules.push({
        id: 'RULE-FMT-005',
        domain: 'recordsToRelease',
        description: 'Record date range "to" date is required when specific date range is selected',
        score: 0
      });
    }
  }

  // Purpose "other" requires details.
  if (
    data.purposeOfRelease.purpose === 'other' &&
    !data.purposeOfRelease.otherDetails.trim()
  ) {
    firedRules.push({
      id: 'RULE-FMT-006',
      domain: 'purposeOfRelease',
      description: 'Details are required when purpose is "Other"',
      score: 0
    });
  }

  const score = completenessPercent(completedFields, totalFields);
  return {
    completenessScore: score,
    completenessStatusLabel: completenessStatus(score),
    validationStatusLabel: validationStatus(firedRules.length),
    firedRules,
    completedFields,
    totalFields
  };
}

Object.assign(NS, { validateForm });
})();
