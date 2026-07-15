// Flagged-issue detection. Independent of the adaptive-functioning score
// (which the grader computes), this module raises clinician-facing flags
// for epilepsy / poorly-controlled seizures, psychotropic prescribing,
// dysphagia, missed national screening, mental-capacity concerns,
// significant behavioural risk, and required reasonable adjustments.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

// Wrapped in an IIFE; published via window.LearningDisabilityAssessment.

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Epilepsy / seizure activity ──────────────────────────
  if (data.medicalReview.hasEpilepsy === 'yes') {
    if (
      data.medicalReview.seizuresPerMonth !== null &&
      data.medicalReview.seizuresPerMonth >= 4
    ) {
      flags.push({
        id: 'FLAG-EPI-001',
        category: 'Medical Review',
        message: `Frequent seizures (${data.medicalReview.seizuresPerMonth}/month) — review epilepsy management urgently.`,
        priority: 'urgent'
      });
    } else {
      flags.push({
        id: 'FLAG-EPI-002',
        category: 'Medical Review',
        message: 'Active epilepsy — confirm seizure plan and rescue medication are in place.',
        priority: 'high'
      });
    }
  }

  // ─── Psychotropic / STOMP review ──────────────────────────
  if (data.medicalReview.takesPsychotropic === 'yes') {
    if (data.medicalReview.stompReviewDone !== 'yes') {
      flags.push({
        id: 'FLAG-STOMP-001',
        category: 'Medications',
        message: 'On psychotropic medication without a documented STOMP review.',
        priority: 'high'
      });
    } else {
      flags.push({
        id: 'FLAG-STOMP-002',
        category: 'Medications',
        message: 'On psychotropic medication — STOMP review recorded.',
        priority: 'low'
      });
    }
  }

  // ─── Mental health diagnosis ──────────────────────────────
  if (data.medicalReview.hasMentalHealthDiagnosis === 'yes') {
    flags.push({
      id: 'FLAG-MH-001',
      category: 'Medical Review',
      message: 'Co-occurring mental health diagnosis — coordinate with mental-health team.',
      priority: 'medium'
    });
  }

  // ─── Dysphagia ────────────────────────────────────────────
  if (data.medicalReview.hasDysphagia === 'yes') {
    flags.push({
      id: 'FLAG-DYS-001',
      category: 'Medical Review',
      message: 'Dysphagia present — choking and aspiration risk; SLT review recommended.',
      priority: 'high'
    });
  }

  // ─── BMI extremes ─────────────────────────────────────────
  if (
    data.physicalExamination.bmi !== null &&
    data.physicalExamination.bmi < 18.5
  ) {
    flags.push({
      id: 'FLAG-BMI-001',
      category: 'Physical Examination',
      message: `BMI ${data.physicalExamination.bmi} — underweight; nutritional review recommended.`,
      priority: 'medium'
    });
  } else if (
    data.physicalExamination.bmi !== null &&
    data.physicalExamination.bmi >= 30
  ) {
    flags.push({
      id: 'FLAG-BMI-002',
      category: 'Physical Examination',
      message: `BMI ${data.physicalExamination.bmi} — obesity; weight management support recommended.`,
      priority: 'medium'
    });
  }

  // ─── Hypertension ─────────────────────────────────────────
  if (
    data.physicalExamination.bloodPressureSystolic !== null &&
    data.physicalExamination.bloodPressureSystolic >= 140
  ) {
    flags.push({
      id: 'FLAG-BP-001',
      category: 'Physical Examination',
      message: `Systolic BP ${data.physicalExamination.bloodPressureSystolic} mmHg — hypertensive range.`,
      priority: 'medium'
    });
  }

  // ─── Missed national screening checks ─────────────────────
  if (data.physicalExamination.visionChecked === 'no') {
    flags.push({
      id: 'FLAG-SCREEN-001',
      category: 'Screening',
      message: 'No recent vision check — refer to optician.',
      priority: 'medium'
    });
  }
  if (data.physicalExamination.hearingChecked === 'no') {
    flags.push({
      id: 'FLAG-SCREEN-002',
      category: 'Screening',
      message: 'No recent hearing check — refer to audiology.',
      priority: 'medium'
    });
  }
  if (data.physicalExamination.dentalChecked === 'no') {
    flags.push({
      id: 'FLAG-SCREEN-003',
      category: 'Screening',
      message: 'No recent dental check — refer to dentist.',
      priority: 'low'
    });
  }
  if (data.physicalExamination.vaccinationsUpToDate === 'no') {
    flags.push({
      id: 'FLAG-SCREEN-004',
      category: 'Screening',
      message: 'Vaccinations not up to date — review immunisation history.',
      priority: 'medium'
    });
  }
  if (data.physicalExamination.cervicalScreening === 'no') {
    flags.push({
      id: 'FLAG-SCREEN-005',
      category: 'Screening',
      message: 'Cervical screening overdue — discuss with reasonable adjustments.',
      priority: 'medium'
    });
  }
  if (data.physicalExamination.breastScreening === 'no') {
    flags.push({
      id: 'FLAG-SCREEN-006',
      category: 'Screening',
      message: 'Breast screening overdue — discuss with reasonable adjustments.',
      priority: 'medium'
    });
  }
  if (data.physicalExamination.bowelScreening === 'no') {
    flags.push({
      id: 'FLAG-SCREEN-007',
      category: 'Screening',
      message: 'Bowel cancer screening overdue — discuss with reasonable adjustments.',
      priority: 'medium'
    });
  }

  // ─── Behavioural risk ─────────────────────────────────────
  if (data.behaviouralConcerns.selfInjurious === 'yes') {
    flags.push({
      id: 'FLAG-BEH-001',
      category: 'Behavioural Concerns',
      message: 'Self-injurious behaviour reported — positive behaviour support required.',
      priority: 'high'
    });
  }
  if (data.behaviouralConcerns.aggression === 'yes') {
    flags.push({
      id: 'FLAG-BEH-002',
      category: 'Behavioural Concerns',
      message: 'Aggression reported — review triggers and de-escalation plan.',
      priority: 'high'
    });
  }
  if (data.behaviouralConcerns.absconding === 'yes') {
    flags.push({
      id: 'FLAG-BEH-003',
      category: 'Behavioural Concerns',
      message: 'Absconding history — safety plan required.',
      priority: 'high'
    });
  }
  if (data.behaviouralConcerns.sexualisedBehaviour === 'yes') {
    flags.push({
      id: 'FLAG-BEH-004',
      category: 'Behavioural Concerns',
      message: 'Inappropriate sexualised behaviour reported — safeguarding review.',
      priority: 'high'
    });
  }
  if (
    (data.behaviouralConcerns.selfInjurious === 'yes' ||
     data.behaviouralConcerns.aggression === 'yes' ||
     data.behaviouralConcerns.propertyDamage === 'yes') &&
    data.behaviouralConcerns.hasBehaviourSupportPlan !== 'yes'
  ) {
    flags.push({
      id: 'FLAG-BEH-005',
      category: 'Behavioural Concerns',
      message: 'Significant behaviours of concern without a positive behaviour support plan.',
      priority: 'high'
    });
  }

  // ─── Mental capacity ──────────────────────────────────────
  if (data.mentalCapacityConsent.canConsentToHealthCheck === 'no') {
    flags.push({
      id: 'FLAG-CAP-001',
      category: 'Mental Capacity',
      message: 'Lacks capacity to consent to health check — best-interests decision required.',
      priority: 'high'
    });
  }
  if (data.mentalCapacityConsent.canConsentToMedication === 'no') {
    flags.push({
      id: 'FLAG-CAP-002',
      category: 'Mental Capacity',
      message: 'Lacks capacity to consent to medication — best-interests / LPA process required.',
      priority: 'high'
    });
  }
  if (data.mentalCapacityConsent.bestInterestsRequired === 'yes') {
    flags.push({
      id: 'FLAG-CAP-003',
      category: 'Mental Capacity',
      message: 'Best-interests decision flagged — document MCA assessment.',
      priority: 'medium'
    });
  }
  if (data.mentalCapacityConsent.hasDols === 'yes') {
    flags.push({
      id: 'FLAG-CAP-004',
      category: 'Mental Capacity',
      message: 'Deprivation of Liberty Safeguard in place — confirm authorisation is current.',
      priority: 'medium'
    });
  }

  // ─── Communication accessibility ──────────────────────────
  if (data.communicationNeeds.verbalAbility === 'non-verbal') {
    flags.push({
      id: 'FLAG-COMM-001',
      category: 'Communication',
      message: 'Non-verbal communication — confirm AAC / easy-read materials available.',
      priority: 'medium'
    });
  }
  if (data.communicationNeeds.needsInterpreter === 'yes') {
    flags.push({
      id: 'FLAG-COMM-002',
      category: 'Communication',
      message: `Interpreter required (${data.communicationNeeds.interpreterLanguage || 'language not specified'}).`,
      priority: 'medium'
    });
  }

  // ─── Reasonable adjustments hygiene ───────────────────────
  if (data.reasonableAdjustments.flagOnRecord !== 'yes') {
    flags.push({
      id: 'FLAG-ADJ-001',
      category: 'Reasonable Adjustments',
      message: 'Reasonable adjustments flag not yet set on the patient record.',
      priority: 'medium'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
