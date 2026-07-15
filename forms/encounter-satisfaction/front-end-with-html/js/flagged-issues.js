// Flagged-issue detection for the Encounter Satisfaction Survey.
//
// High priority:   Any question rated 1 (Very Dissatisfied);
//                  any communication question rated <= 2.
// Medium priority: Any question rated 2 (Dissatisfied);
//                  overall mean <= 2.4 (Poor).
// Low priority:    First-time patient with fair satisfaction
//                  (mean 2.5-3.4).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 *
 * @typedef {Object} ScoredField
 * @property {string} field
 * @property {string} label
 * @property {number} score
 */

/** All Likert-scored fields with display labels, grouped by section. */
const SECTIONS = [
  {
    section: 'accessScheduling',
    labels: {
      easeOfScheduling: 'Ease of scheduling',
      waitForAppointment: 'Wait for appointment',
      waitInWaitingRoom: 'Wait in waiting room'
    }
  },
  {
    section: 'communication',
    labels: {
      listening: 'Provider listening',
      explainingCondition: 'Explaining condition',
      answeringQuestions: 'Answering questions',
      timeSpent: 'Time spent with patient'
    }
  },
  {
    section: 'staffProfessionalism',
    labels: {
      receptionCourtesy: 'Reception staff courtesy',
      nursingCourtesy: 'Nursing staff courtesy',
      respectShown: 'Respect shown'
    }
  },
  {
    section: 'careQuality',
    labels: {
      involvementInDecisions: 'Involvement in decisions',
      treatmentPlanExplanation: 'Treatment plan explanation',
      confidenceInCare: 'Confidence in care'
    }
  },
  {
    section: 'environment',
    labels: {
      cleanliness: 'Cleanliness',
      waitingAreaComfort: 'Waiting area comfort',
      privacy: 'Privacy'
    }
  },
  {
    section: 'overallSatisfaction',
    labels: {
      overallRating: 'Overall rating',
      likelyToRecommend: 'Likely to recommend',
      likelyToReturn: 'Likely to return'
    }
  }
];

const COMM_FIELDS = [
  { field: 'listening', label: 'Provider listening' },
  { field: 'explainingCondition', label: 'Explaining condition' },
  { field: 'answeringQuestions', label: 'Answering questions' },
  { field: 'timeSpent', label: 'Time spent with patient' }
];

/**
 * @param {AssessmentData} data
 * @returns {ScoredField[]}
 */
function getAllLikertScores(data) {
  /** @type {ScoredField[]} */
  const scores = [];
  for (const { section, labels } of SECTIONS) {
    const obj = data[section] || {};
    for (const field of Object.keys(labels)) {
      const v = obj[field];
      if (typeof v === 'number' && v >= 1 && v <= 5) {
        scores.push({ field, label: labels[field], score: v });
      }
    }
  }
  return scores;
}

/**
 * @param {AssessmentData} data
 * @param {number} compositeScore
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, compositeScore) {
  /** @type {AdditionalFlag[]} */
  const flags = [];
  const allScores = getAllLikertScores(data);

  // ─── High priority: Any question rated 1 ─────────────────
  for (const { field, label, score } of allScores) {
    if (score === 1) {
      flags.push({
        id: `FLAG-VDIS-${field}`,
        category: 'Very Dissatisfied Response',
        message: `Patient rated "${label}" as Very Dissatisfied (1/5)`,
        priority: 'high'
      });
    }
  }

  // ─── High priority: Communication questions rated <= 2 ───
  for (const { field, label } of COMM_FIELDS) {
    const score = data.communication ? data.communication[field] : null;
    if (typeof score === 'number' && score <= 2 && score !== 1) {
      flags.push({
        id: `FLAG-COMM-${field}`,
        category: 'Communication Concern',
        message:
          `Patient rated "${label}" as Dissatisfied (${score}/5) ` +
          `- communication improvement needed`,
        priority: 'high'
      });
    }
  }

  // ─── Medium priority: Any question rated 2 ───────────────
  for (const { field, label, score } of allScores) {
    if (score === 2) {
      const isComm = COMM_FIELDS.some((c) => c.field === field);
      if (!isComm) {
        flags.push({
          id: `FLAG-DIS-${field}`,
          category: 'Dissatisfied Response',
          message: `Patient rated "${label}" as Dissatisfied (2/5)`,
          priority: 'medium'
        });
      }
    }
  }

  // ─── Medium priority: Overall mean <= 2.4 (Poor) ─────────
  if (compositeScore > 0 && compositeScore <= 2.4) {
    flags.push({
      id: 'FLAG-POOR-OVERALL',
      category: 'Poor Overall Satisfaction',
      message:
        `Composite satisfaction score is ${compositeScore.toFixed(1)}/5.0 ` +
        `(Poor) - review required`,
      priority: 'medium'
    });
  }

  // ─── Low priority: First-visit patient with fair score ───
  if (
    data.visitInformation &&
    data.visitInformation.firstVisit === 'yes' &&
    compositeScore >= 2.5 &&
    compositeScore <= 3.4
  ) {
    flags.push({
      id: 'FLAG-FIRST-VISIT-FAIR',
      category: 'First Visit Feedback',
      message:
        `First-time patient rated experience as Fair ` +
        `(${compositeScore.toFixed(1)}/5.0) - follow up to improve retention`,
      priority: 'low'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags };
