// Safety-flag detection for the Holter Monitor Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: syncope-red-flag, suspected-vt, post-stroke-af-detection,
// symptom-frequency-monitor-mismatch, missing-indication,
// missing-clinical-question, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect safety flags for an ambulatory ECG (Holter) monitoring request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context
 *   ({ matchFit, recommendedMonitor })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- Red-flag clinical categories ----------------------------------
  if (data.symptoms.syncope === true) {
    flags.push({
      flagId: 'F-SYNCOPE-RED-FLAG-001',
      category: 'syncope-red-flag',
      priority: 'high',
      description: 'Syncope reported — red flag for arrhythmic cause.',
      suggestedAction: 'Escalate to same-day / expedited cardiology review; consider inpatient monitoring or implantable loop recorder for recurrent unexplained syncope.'
    });
  }
  if (data.cardiac.knownArrhythmia === 'vt') {
    flags.push({
      flagId: 'F-SUSPECTED-VT-001',
      category: 'suspected-vt',
      priority: 'high',
      description: 'Known / suspected ventricular tachycardia.',
      suggestedAction: 'Treat as high priority; arrange urgent cardiology review and consider continuous telemetry rather than delayed ambulatory monitoring.'
    });
  }
  if (
    data.cardiac.recentStrokeTia === true ||
    data.request.primaryIndication === 'post-stroke-af-screen'
  ) {
    flags.push({
      flagId: 'F-POST-STROKE-AF-DETECTION-001',
      category: 'post-stroke-af-detection',
      priority: 'high',
      description: 'Recent stroke / TIA — AF-detection monitoring indicated.',
      suggestedAction: 'Use prolonged monitoring (7-14 day or implantable loop recorder) per NICE NG196; a 24-hour Holter has low yield for paroxysmal AF.'
    });
  }

  // --- Symptom-frequency / monitor-duration mismatch -----------------
  if (ctx.matchFit === 'mismatched') {
    flags.push({
      flagId: 'F-SYMPTOM-FREQUENCY-MONITOR-MISMATCH-001',
      category: 'symptom-frequency-monitor-mismatch',
      priority: 'medium',
      description: 'Requested monitor duration is a poor fit for the reported symptom frequency.',
      suggestedAction: ctx.recommendedMonitor
        ? `Consider redirecting to a ${ctx.recommendedMonitor} for adequate diagnostic yield.`
        : 'Confirm the monitor duration matches how often symptoms occur.'
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
      suggestedAction: 'Query the referrer for the specific question the monitoring should answer.'
    });
  }
  if (!data.symptoms.symptomFrequency) {
    flags.push({
      flagId: 'F-MISSING-SYMPTOM-FREQUENCY-001',
      category: 'other',
      priority: 'low',
      description: 'No symptom frequency recorded; monitor-duration matching cannot be assessed.',
      suggestedAction: 'Confirm how often symptoms occur to choose an appropriate monitor duration.'
    });
  }

  return flags;
}

export { detectFlags };
