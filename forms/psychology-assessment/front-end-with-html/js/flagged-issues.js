// Flagged-issue detection. Independent of DASS-21 severity (which is
// computed by the grader), this module raises clinician-facing flags for
// risk-screen positives, severe/extremely-severe subscale scores, severe
// functional impairment, and support/treatment concerns. Suicidal ideation
// and thoughts of harm to others always escalate to URGENT regardless of
// DASS-21 totals.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').SubscaleScore} SubscaleScore
 */

// Wrapped in an IIFE; published via window.PsychologyAssessment.

/**
 * @param {AssessmentData} data
 * @param {SubscaleScore} depression
 * @param {SubscaleScore} anxiety
 * @param {SubscaleScore} stress
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, depression, anxiety, stress) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // --- Risk-screen escalations -------------------------------------
  if (data.riskScreen.suicidalIdeation === 'yes') {
    flags.push({
      id: 'FLAG-RISK-001',
      category: 'Risk Screen',
      message:
        'Suicidal ideation reported - urgent clinician review required before next session.',
      priority: 'urgent'
    });
  }

  if (data.riskScreen.harmToOthers === 'yes') {
    flags.push({
      id: 'FLAG-RISK-002',
      category: 'Risk Screen',
      message:
        'Thoughts of harming others reported - urgent clinician review and risk assessment.',
      priority: 'urgent'
    });
  }

  if (data.riskScreen.selfHarm === 'yes') {
    flags.push({
      id: 'FLAG-RISK-003',
      category: 'Risk Screen',
      message: 'Self-harm reported - safety planning recommended.',
      priority: 'high'
    });
  }

  if (data.riskScreen.psychiatricEmergencyHistory === 'yes') {
    flags.push({
      id: 'FLAG-RISK-004',
      category: 'Risk Screen',
      message:
        'Previous psychiatric emergency - review prior crisis plans and supports.',
      priority: 'high'
    });
  }

  if (data.riskScreen.hasSafetyPlan === 'no') {
    flags.push({
      id: 'FLAG-RISK-005',
      category: 'Risk Screen',
      message:
        'No current safety plan in place - consider collaborative safety planning.',
      priority: 'medium'
    });
  }

  // --- Subscale severity escalations -------------------------------
  if (depression.severity === 'extremely-severe') {
    flags.push({
      id: 'FLAG-DASS-D-001',
      category: 'Depression',
      message: `Depression DASS-21 score ${depression.scaled} - extremely severe range.`,
      priority: 'high'
    });
  } else if (depression.severity === 'severe') {
    flags.push({
      id: 'FLAG-DASS-D-002',
      category: 'Depression',
      message: `Depression DASS-21 score ${depression.scaled} - severe range.`,
      priority: 'medium'
    });
  }

  if (anxiety.severity === 'extremely-severe') {
    flags.push({
      id: 'FLAG-DASS-A-001',
      category: 'Anxiety',
      message: `Anxiety DASS-21 score ${anxiety.scaled} - extremely severe range.`,
      priority: 'high'
    });
  } else if (anxiety.severity === 'severe') {
    flags.push({
      id: 'FLAG-DASS-A-002',
      category: 'Anxiety',
      message: `Anxiety DASS-21 score ${anxiety.scaled} - severe range.`,
      priority: 'medium'
    });
  }

  if (stress.severity === 'extremely-severe') {
    flags.push({
      id: 'FLAG-DASS-S-001',
      category: 'Stress',
      message: `Stress DASS-21 score ${stress.scaled} - extremely severe range.`,
      priority: 'high'
    });
  } else if (stress.severity === 'severe') {
    flags.push({
      id: 'FLAG-DASS-S-002',
      category: 'Stress',
      message: `Stress DASS-21 score ${stress.scaled} - severe range.`,
      priority: 'medium'
    });
  }

  // --- Functional impact -------------------------------------------
  const fi = data.functionalImpact;
  const severeImpacts = [
    fi.workImpact,
    fi.relationshipImpact,
    fi.dailyActivitiesImpact,
    fi.sleepImpact
  ].filter((x) => x === 'severe').length;

  if (severeImpacts >= 2) {
    flags.push({
      id: 'FLAG-FUNC-001',
      category: 'Functional Impact',
      message: `Severe functional impairment in ${severeImpacts} domains - prioritise intervention planning.`,
      priority: 'high'
    });
  } else if (severeImpacts === 1) {
    flags.push({
      id: 'FLAG-FUNC-002',
      category: 'Functional Impact',
      message: 'Severe functional impairment in 1 domain - clarify support needs.',
      priority: 'medium'
    });
  }

  // --- Support, treatment, substance use ---------------------------
  if (data.supportAndHistory.socialSupport === 'isolated') {
    flags.push({
      id: 'FLAG-SUPP-001',
      category: 'Support and History',
      message:
        'Patient reports social isolation - consider connection-focused interventions.',
      priority: 'medium'
    });
  }

  if (data.supportAndHistory.substanceUseConcern === 'yes') {
    flags.push({
      id: 'FLAG-SUPP-002',
      category: 'Support and History',
      message:
        'Substance-use concern reported - consider co-occurring disorders screening.',
      priority: 'medium'
    });
  }

  if (
    data.supportAndHistory.familyMentalHealthHistory === 'yes' &&
    (depression.severity === 'severe' ||
      depression.severity === 'extremely-severe' ||
      anxiety.severity === 'severe' ||
      anxiety.severity === 'extremely-severe')
  ) {
    flags.push({
      id: 'FLAG-SUPP-003',
      category: 'Support and History',
      message:
        'Family mental-health history with elevated current symptoms - consider psychiatric referral.',
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
