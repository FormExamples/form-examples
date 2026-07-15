import { countSelectedMarkers, markerLabel } from './types.js';

// Safety-flag detection for the Tumor Marker Test Request engine.
//
// Pure function returning safety flags using the grade_flag categories from
// SQL migration 07: suspected-cancer-2ww, inappropriate-screening-use,
// marker-indication-mismatch, missing-clinical-details, missing-indication,
// no-marker-selected, other.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.

/**
 * Detect safety flags for a serum tumour-marker request.
 *
 * @param {object} data - the request data model
 * @param {object} [context] - engine context ({ triageTier, mismatchedMarkers,
 *   screeningMisuse })
 * @returns {object[]} safety flags
 */
function detectFlags(data, context) {
  const flags = [];
  const ctx = context || {};

  // --- No marker selected --------------------------------------------
  if (countSelectedMarkers(data.markers) === 0) {
    flags.push({
      flagId: 'F-NO-MARKER-SELECTED-001',
      category: 'no-marker-selected',
      priority: 'high',
      description: 'No tumour marker has been selected on the request.',
      suggestedAction: 'Reject or query the referrer; specify at least one marker before processing.'
    });
  }

  // --- Suspected-cancer two-week-wait --------------------------------
  if (ctx.triageTier === 'two-week-wait') {
    flags.push({
      flagId: 'F-SUSPECTED-CANCER-2WW-001',
      category: 'suspected-cancer-2ww',
      priority: 'high',
      description: 'Request meets a suspected-cancer two-week-wait threshold.',
      suggestedAction: 'Process on the suspected-cancer two-week-wait pathway; ensure the referring team has made any required 2WW referral.'
    });
  }

  // --- Inappropriate screening use -----------------------------------
  if (ctx.screeningMisuse === true) {
    flags.push({
      flagId: 'F-INAPPROPRIATE-SCREENING-USE-001',
      category: 'inappropriate-screening-use',
      priority: 'high',
      description: 'Tumour markers requested as broad screening in an unselected population.',
      suggestedAction: 'Query the referrer; tumour markers are poor screening tests (low specificity) per ACB / RCPath guidance.'
    });
  }

  // --- Marker-indication mismatch ------------------------------------
  if (Array.isArray(ctx.mismatchedMarkers) && ctx.mismatchedMarkers.length > 0) {
    const names = ctx.mismatchedMarkers.map((f) => markerLabel(f)).join(', ');
    flags.push({
      flagId: 'F-MARKER-INDICATION-MISMATCH-001',
      category: 'marker-indication-mismatch',
      priority: 'medium',
      description: `Marker(s) ${names} do not match the recorded indication "${data.context.primaryIndication}".`,
      suggestedAction: 'Query the referrer to confirm the marker selection matches the clinical indication.'
    });
  }

  // --- Missing indication --------------------------------------------
  if (!data.context.primaryIndication) {
    flags.push({
      flagId: 'F-MISSING-INDICATION-001',
      category: 'missing-indication',
      priority: 'medium',
      description: 'No primary clinical indication recorded.',
      suggestedAction: 'Query the referrer for the clinical indication before vetting.'
    });
  }

  // --- Missing clinical details --------------------------------------
  if (!data.context.clinicalDetails || data.context.clinicalDetails.trim() === '') {
    flags.push({
      flagId: 'F-MISSING-CLINICAL-DETAILS-001',
      category: 'missing-clinical-details',
      priority: 'medium',
      description: 'No clinical details / supporting history recorded.',
      suggestedAction: 'Query the referrer for clinical details; markers cannot be interpreted without context.'
    });
  }

  return flags;
}

export { detectFlags };
