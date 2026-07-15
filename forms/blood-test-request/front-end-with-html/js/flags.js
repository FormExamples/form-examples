import { CRITICAL_PANELS } from './rules.js';
import { PANELS, countSelectedPanels } from './types.js';

// Safety-flag detection for the Blood Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: duplicate-recent-test, retest-interval-breach,
// fasting-required-not-met, missing-clinical-details, missing-indication,
// blood-borne-virus-precaution, stat-critical, no-test-selected, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.BloodTestRequest`.

/**
 * Detect safety flags for a blood-test request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - optional engine context ({ fastingViolation,
 *   preanalyticalBand, triageTier })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};
  const selectedCount = countSelectedPanels(data.panels);

  // --- No test selected ----------------------------------------------
  if (selectedCount === 0) {
    flags.push({
      flagId: 'F-NO-TEST-SELECTED-001',
      category: 'no-test-selected',
      priority: 'high',
      description: 'No blood-test panel has been selected.',
      suggestedAction: 'Query the referrer; a request with no panel selected cannot be processed.'
    });
  }

  // --- Fasting required not met --------------------------------------
  if (ctx.fastingViolation === true) {
    flags.push({
      flagId: 'F-FASTING-REQUIRED-NOT-MET-001',
      category: 'fasting-required-not-met',
      priority: 'medium',
      description: 'A fasting-required test was collected non-fasting, or fasting status is unknown.',
      suggestedAction: 'Confirm fasting status; consider re-collecting fasting samples (e.g. lipid profile, fasting glucose).'
    });
  }

  // --- Retest-interval breach (heuristic) ----------------------------
  // Monitoring panels ordered for a non-monitoring indication can breach the
  // RCPath minimum retesting interval; surface as a low-priority prompt.
  const monitoringPanels = ['hba1cMonitoring', 'lipidProfile', 'thyroidFunction'];
  const monitoringSelected = monitoringPanels.some((f) => data.panels[f] === true);
  if (
    monitoringSelected &&
    data.clinical.primaryIndication === 'routine-monitoring' &&
    (!data.clinical.clinicalDetails || data.clinical.clinicalDetails.trim() === '')
  ) {
    flags.push({
      flagId: 'F-RETEST-INTERVAL-BREACH-001',
      category: 'retest-interval-breach',
      priority: 'low',
      description: 'Routine monitoring test ordered without clinical details — may breach the RCPath minimum retesting interval.',
      suggestedAction: 'Check the date of the last identical test against the RCPath National Minimum Retesting Intervals (G147).'
    });
  }

  // --- Duplicate recent test (heuristic) -----------------------------
  if (
    data.panels.fullBloodCount === true &&
    data.panels.ureaElectrolytes === true &&
    data.clinical.primaryIndication === 'routine-monitoring' &&
    data.triage.urgency === 'routine' &&
    (!data.clinical.clinicalDetails || data.clinical.clinicalDetails.trim() === '')
  ) {
    flags.push({
      flagId: 'F-DUPLICATE-RECENT-TEST-001',
      category: 'duplicate-recent-test',
      priority: 'low',
      description: 'Routine FBC + U&E with no clinical details may duplicate a recent result.',
      suggestedAction: 'Confirm a recent identical result is not already available before bleeding.'
    });
  }

  // --- Blood-borne-virus precaution ----------------------------------
  if (data.safety.knownBloodBorneVirus === true) {
    flags.push({
      flagId: 'F-BLOOD-BORNE-VIRUS-PRECAUTION-001',
      category: 'blood-borne-virus-precaution',
      priority: 'medium',
      description: 'Patient has a known blood-borne virus.',
      suggestedAction: 'Apply standard / enhanced phlebotomy precautions and label the sample as a biohazard per local policy.'
    });
  }

  // --- Stat / critical test ------------------------------------------
  const criticalSelected = CRITICAL_PANELS.filter((f) => data.panels[f] === true);
  if (ctx.triageTier === 'stat' || criticalSelected.length > 0) {
    const names = criticalSelected
      .map((f) => {
        const p = PANELS.find((x) => x.field === f);
        return p ? p.label : f;
      })
      .join(', ');
    flags.push({
      flagId: 'F-STAT-CRITICAL-001',
      category: 'stat-critical',
      priority: 'high',
      description: names
        ? `Critical / time-sensitive test requested (${names}).`
        : 'Stat turnaround requested.',
      suggestedAction: 'Process immediately and telephone any critical result to the requesting clinician.'
    });
  }

  // --- Completeness / data-quality flags -----------------------------
  if (!data.clinical.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }
  if (!data.clinical.clinicalDetails || data.clinical.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'medium',
      description: 'No clinical details recorded to support the request.',
      suggestedAction: 'Query the referrer for the clinical details the laboratory needs to interpret the result.'
    });
  }

  return flags;
}

export { detectFlags };
