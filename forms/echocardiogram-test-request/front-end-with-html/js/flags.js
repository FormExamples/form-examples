// Safety-flag detection for the Echocardiogram Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-endocarditis, severe-symptomatic-valve,
// acute-heart-failure, raised-bnp, rarely-appropriate-indication,
// missing-indication, missing-clinical-question, duplicate-recent-echo, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.EchocardiogramTestRequest`.

(function () {
'use strict';
window.EchocardiogramTestRequest =
  window.EchocardiogramTestRequest || {};
const NS = window.EchocardiogramTestRequest;

const NT_PROBNP_RAISED = 2000; // NICE NG106: > 2000 ng/L is the urgent threshold

/**
 * Detect safety flags for an echocardiogram request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ appropriatenessBand })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Red-flag categories -------------------------------------------
  if (data.redFlags.suspectedEndocarditis === true) {
    flags.push({
      flagId: 'F-SUSPECTED-ENDOCARDITIS-001',
      category: 'suspected-endocarditis',
      priority: 'high',
      description: 'Suspected infective endocarditis.',
      suggestedAction: 'Arrange urgent TTE then TOE; discuss with cardiology and follow ESC 2023 endocarditis pathway.'
    });
  }
  if (data.redFlags.severeSymptomaticValve === true) {
    flags.push({
      flagId: 'F-SEVERE-SYMPTOMATIC-VALVE-001',
      category: 'severe-symptomatic-valve',
      priority: 'high',
      description: 'Severe symptomatic valve disease suspected.',
      suggestedAction: 'Prioritise urgent echo; refer to valve / heart-failure service for consideration of intervention.'
    });
  }
  if (data.redFlags.acuteHeartFailure === true) {
    flags.push({
      flagId: 'F-ACUTE-HEART-FAILURE-001',
      category: 'acute-heart-failure',
      priority: 'high',
      description: 'Acute heart failure suspected.',
      suggestedAction: 'Arrange inpatient / same-day echo alongside acute heart-failure management.'
    });
  }

  // --- Investigation-driven concerns ---------------------------------
  if (
    data.investigations.bnpOrNtProbnp !== null &&
    data.investigations.bnpOrNtProbnp !== undefined &&
    Number(data.investigations.bnpOrNtProbnp) > NT_PROBNP_RAISED
  ) {
    flags.push({
      flagId: 'F-RAISED-BNP-001',
      category: 'raised-bnp',
      priority: 'high',
      description: 'Natriuretic peptide (NT-proBNP) above 2000 ng/L.',
      suggestedAction: 'NICE NG106: arrange specialist assessment and echo within 2 weeks.'
    });
  }

  // --- Appropriateness concern ---------------------------------------
  if (ctx.appropriatenessBand === 'rarely-appropriate') {
    flags.push({
      flagId: 'F-RARELY-APPROPRIATE-INDICATION-001',
      category: 'rarely-appropriate-indication',
      priority: 'medium',
      description: 'Requested echo type is rarely appropriate for the stated indication.',
      suggestedAction: 'Query the referrer; confirm the requested study is the right examination for the indication.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (!data.request.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.request.clinicalQuestion || data.request.clinicalQuestion.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-QUESTION-001',
      category: 'missing-clinical-question',
      priority: 'medium',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the echo should answer.'
    });
  }

  // --- Duplicate recent echo -----------------------------------------
  if (duplicateRecentEcho(data)) {
    flags.push({
      flagId: 'F-DUPLICATE-RECENT-ECHO-001',
      category: 'duplicate-recent-echo',
      priority: 'low',
      description: 'A previous echo was performed within the last 6 months.',
      suggestedAction: 'Confirm a repeat study is clinically indicated; review the prior report before booking.'
    });
  }

  return flags;
}

/**
 * Whether a previous echo was recorded within the last ~6 months. Treats a
 * present `previousEchoDate` within 183 days of today as a recent study.
 */
function duplicateRecentEcho(d) {
  const hasPrior = d.request.previousEcho && d.request.previousEcho !== 'none' && d.request.previousEcho !== '';
  if (!hasPrior) return false;
  if (!d.request.previousEchoDate) return false;
  const prior = Date.parse(d.request.previousEchoDate);
  if (Number.isNaN(prior)) return false;
  const days = (Date.now() - prior) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 183;
}

Object.assign(NS, { detectFlags });
})();
