// Safety-flag detection for the Sleep Study Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: occupational-driver-osa, severe-daytime-sleepiness,
// suspected-narcolepsy, missing-epworth, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.SleepStudyTestRequest`.

(function () {
'use strict';
window.SleepStudyTestRequest =
  window.SleepStudyTestRequest || {};
const NS = window.SleepStudyTestRequest;

const EPWORTH_ABNORMAL = NS.EPWORTH_ABNORMAL || 11;
const EPWORTH_SEVERE = NS.EPWORTH_SEVERE || 16;

function epworthValue(d) {
  const v = d.scores.epworthScore;
  if (v === null || v === undefined || v === '') return null;
  return Number(v);
}

/**
 * Detect safety flags for a sleep study request.
 *
 * @param {object} data - the request data model
 * @returns {object[]} safety flags
 */
function detectFlags(data) {
  const flags = [];
  const epworth = epworthValue(data);

  // --- Occupational driver with OSA-suggestive sleepiness ------------
  if (
    data.symptoms.occupationalDriver === true &&
    ((epworth !== null && epworth >= EPWORTH_ABNORMAL) ||
      data.request.primaryIndication === 'suspected-osa' ||
      data.request.primaryIndication === 'driver-assessment')
  ) {
    flags.push({
      flagId: 'F-OCCUPATIONAL-DRIVER-OSA-001',
      category: 'occupational-driver-osa',
      priority: 'high',
      description: 'Occupational / vocational driver with suspected or confirmed OSA-related sleepiness.',
      suggestedAction: 'Fast-track vocational-driver assessment; advise on DVLA notification and fitness to drive.'
    });
  }

  // --- Severe daytime sleepiness -------------------------------------
  if (epworth !== null && epworth >= EPWORTH_SEVERE) {
    flags.push({
      flagId: 'F-SEVERE-DAYTIME-SLEEPINESS-001',
      category: 'severe-daytime-sleepiness',
      priority: 'high',
      description: `Severe excessive daytime sleepiness (Epworth ${epworth} ≥ ${EPWORTH_SEVERE}).`,
      suggestedAction: 'Prioritise the study; counsel on driving and operating machinery pending assessment.'
    });
  }

  // --- Suspected narcolepsy ------------------------------------------
  if (data.request.primaryIndication === 'suspected-narcolepsy') {
    flags.push({
      flagId: 'F-SUSPECTED-NARCOLEPSY-001',
      category: 'suspected-narcolepsy',
      priority: 'medium',
      description: 'Suspected narcolepsy / central hypersomnolence.',
      suggestedAction: 'Route to the MSLT pathway with preceding polysomnography; consider sleep-medicine referral.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (epworth === null) {
    flags.push({
      flagId: 'F-MISSING-EPWORTH-001',
      category: 'missing-epworth',
      priority: 'medium',
      description: 'No Epworth Sleepiness Scale score recorded.',
      suggestedAction: 'Record the Epworth score; it drives priority, triage, and DVLA decisions.'
    });
  }
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
      priority: 'low',
      description: 'No specific clinical question recorded.',
      suggestedAction: 'Query the referrer for the specific question the study should answer.'
    });
  }

  return flags;
}

Object.assign(NS, { detectFlags });
})();
