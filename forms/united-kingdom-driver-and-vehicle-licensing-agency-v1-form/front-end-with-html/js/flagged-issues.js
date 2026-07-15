// DVLA V1 flagged-issue detection. Independent of the completeness check,
// this module raises clinician- or DVLA-significant flags for high-risk
// responses (eyesight failure, uncontrolled diplopia, monocular without
// adaptation, etc.). Direct port of `src/lib/engine/flagged-issues.ts`.
//
// Priority ladder:
//   urgent — patient asserts they do not meet the eyesight standard, or
//            uncontrolled diplopia not yet 6 months stable.
//   high   — uncontrolled vision condition likely to bar driving.
//   medium — condition present that requires individual review.
//   low    — supportive context flag.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

/**
 * @param {AssessmentData} data
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  // ─── Q1 — Eyesight standard failure ──────────────────────
  if (data.eyesightStandards.meetsStandard === 'no') {
    flags.push({
      id: 'V1-FLAG-EYE-001',
      category: 'Eyesight Standard',
      message: 'Patient declares they do not meet the Snellen 6/12 eyesight standard for driving.',
      priority: 'urgent'
    });
  }

  // ─── Q2 — Monocular vision ───────────────────────────────
  if (data.visionInBothEyes.hasVisionInBothEyes === 'no') {
    if (data.visionInBothEyes.adaptation === 'not-adapted') {
      flags.push({
        id: 'V1-FLAG-MONO-001',
        category: 'Monocular Vision',
        message: 'Monocular vision without adaptation period — patient must not drive until adapted (typically 3+ months).',
        priority: 'high'
      });
    } else if (data.visionInBothEyes.adaptation === 'adapted-self') {
      flags.push({
        id: 'V1-FLAG-MONO-002',
        category: 'Monocular Vision',
        message: 'Monocular vision adaptation has not been reviewed by a healthcare professional.',
        priority: 'medium'
      });
    } else if (data.visionInBothEyes.adaptation === 'adapted-advised') {
      flags.push({
        id: 'V1-FLAG-MONO-003',
        category: 'Monocular Vision',
        message: 'Monocular vision with confirmed healthcare-professional-supervised adaptation.',
        priority: 'low'
      });
    }
  }

  // ─── Q3 — Visual field problem ───────────────────────────
  if (data.fieldOfVision.hasProblem === 'yes') {
    if (data.fieldOfVision.causedSolelyByEyeCondition === 'no') {
      flags.push({
        id: 'V1-FLAG-VF-001',
        category: 'Visual Field',
        message: `Visual-field defect with non-ocular cause (${data.fieldOfVision.cause || 'unspecified'}) — DVLA visual-field testing recommended.`,
        priority: 'high'
      });
    } else {
      flags.push({
        id: 'V1-FLAG-VF-002',
        category: 'Visual Field',
        message: 'Visual-field defect of ocular origin — DVLA visual-field testing recommended.',
        priority: 'medium'
      });
    }
  }

  // ─── Q4 — Glaucoma ───────────────────────────────────────
  if (data.glaucoma.hasCondition === 'yes') {
    flags.push({
      id: 'V1-FLAG-GLA-001',
      category: 'Glaucoma',
      message: `Glaucoma reported (${data.glaucoma.whichEyes || 'unspecified'}) — visual-field assessment indicated.`,
      priority: data.glaucoma.whichEyes === 'both' ? 'high' : 'medium'
    });
  }

  // ─── Q5 — Retinitis Pigmentosa ───────────────────────────
  if (data.retinitisPigmentosa.hasCondition === 'yes') {
    flags.push({
      id: 'V1-FLAG-RP-001',
      category: 'Retinitis Pigmentosa',
      message: `Retinitis pigmentosa reported (${data.retinitisPigmentosa.whichEyes || 'unspecified'}) — progressive condition; ongoing visual-field review required.`,
      priority: 'high'
    });
  }

  // ─── Q7 — Blepharospasm ──────────────────────────────────
  if (data.blepharospasm.hasCondition === 'yes') {
    if (data.blepharospasm.adequatelyControlled === 'no') {
      flags.push({
        id: 'V1-FLAG-BLEPH-001',
        category: 'Blepharospasm',
        message: 'Blepharospasm not adequately controlled — patient must not drive until controlled.',
        priority: 'high'
      });
    } else if (data.blepharospasm.hasHadTreatment === 'no') {
      flags.push({
        id: 'V1-FLAG-BLEPH-002',
        category: 'Blepharospasm',
        message: 'Blepharospasm reported with no treatment history — review required.',
        priority: 'medium'
      });
    } else {
      flags.push({
        id: 'V1-FLAG-BLEPH-003',
        category: 'Blepharospasm',
        message: 'Blepharospasm reported as adequately controlled with treatment.',
        priority: 'low'
      });
    }
  }

  // ─── Q8 — Night Blindness ────────────────────────────────
  if (data.nightBlindness.hasCondition === 'yes') {
    flags.push({
      id: 'V1-FLAG-NB-001',
      category: 'Night Blindness',
      message: `Night blindness reported (${data.nightBlindness.whichEyes || 'unspecified'}) — patient should not drive in low light.`,
      priority: 'medium'
    });
  }

  // ─── Q9 — Double vision ──────────────────────────────────
  if (data.doubleVision.hasCondition === 'yes') {
    if (data.doubleVision.controlled === 'no') {
      if (data.doubleVision.sameForSixMonthsOrMore === 'yes') {
        flags.push({
          id: 'V1-FLAG-DV-001',
          category: 'Double Vision',
          message: 'Uncontrolled diplopia stable for 6+ months — eligibility hinges on adaptation declaration and DVLA review.',
          priority: 'high'
        });
      } else {
        flags.push({
          id: 'V1-FLAG-DV-002',
          category: 'Double Vision',
          message: 'Uncontrolled diplopia not yet stable for 6 months — patient must not drive until controlled or stable adaptation achieved.',
          priority: 'urgent'
        });
      }
    } else {
      flags.push({
        id: 'V1-FLAG-DV-003',
        category: 'Double Vision',
        message: 'Diplopia reported as controlled — review treatment device (patch/prism).',
        priority: 'medium'
      });
    }
  }

  // ─── Q10 — Other vision condition ────────────────────────
  if (data.otherVisionConditions.hasOther === 'yes') {
    flags.push({
      id: 'V1-FLAG-OTH-001',
      category: 'Other Vision Conditions',
      message: 'Additional vision condition reported — manual clinical review required.',
      priority: 'medium'
    });
  }

  // ─── Q11 — No recent contact ─────────────────────────────
  if (data.recentContact.hadContact === 'no') {
    flags.push({
      id: 'V1-FLAG-CONTACT-001',
      category: 'Recent Contact',
      message: 'No healthcare-professional contact in the last 12 months — DVLA may need to seek up-to-date medical evidence.',
      priority: 'low'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlaggedIssues };
