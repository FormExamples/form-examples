import { COMPRESSION_DEPTH_MAX, COMPRESSION_DEPTH_MIN, COMPRESSION_RATE_MAX, COMPRESSION_RATE_MIN, compressionDepthInRange, compressionRateInRange } from './types.js';

// Prioritised flag detection for the BLS Skills Verification report.
//
// Independent of the pass/fail outcome (which the grader computes), this
// module surfaces flags for examiner attention:
//
//   high   — any critical-action failure (with reason), expired
//            certification, multiple non-critical deficiencies in the
//            same domain
//   medium — multiple non-critical deficiencies overall, hesitation on
//            compression depth, slow time to first AED shock,
//            measured rate or depth out of AHA range
//   low    — areas with room for improvement, debrief notes captured

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/** Slow AED-shock threshold (seconds). */
const SLOW_AED_SECONDS = 90;

/**
 * Build the list of flagged issues for the examiner report.
 *
 * @param {AssessmentData} data
 * @param {{ criticalFailures: FiredRule[], nonCriticalDeficiencies: FiredRule[] }} grading
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, grading) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── High: critical-action failures with the specific reason ──────────
  for (const rule of grading.criticalFailures) {
    flags.push({
      id: `FLAG-CRIT-${rule.id}`,
      category: `Critical action — ${rule.category}`,
      message: `Critical-action failure: ${rule.description}`,
      priority: 'high'
    });
  }

  // ─── High: prior certification expired ────────────────────────────────
  const expiry = data.traineeDetails.priorCertificationExpiry;
  if (expiry) {
    const expiryDate = new Date(expiry);
    if (!Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now()) {
      flags.push({
        id: 'FLAG-CERT-EXPIRED',
        category: 'Trainee Details',
        message: `Prior certification expired on ${expiry} — recertification required.`,
        priority: 'high'
      });
    }
  }

  // ─── Medium: multiple non-critical deficiencies overall ───────────────
  const ncDef = grading.nonCriticalDeficiencies;
  if (ncDef.length >= 2) {
    flags.push({
      id: 'FLAG-MULTI-DEF',
      category: 'Performance',
      message: `${ncDef.length} non-critical deficiencies recorded — additional coaching recommended.`,
      priority: ncDef.length > 2 ? 'high' : 'medium'
    });
  }

  // ─── High: same domain has multiple deficiencies ──────────────────────
  /** @type {Record<string, FiredRule[]>} */
  const byCategory = {};
  for (const rule of ncDef) {
    if (!byCategory[rule.category]) byCategory[rule.category] = [];
    byCategory[rule.category].push(rule);
  }
  for (const [category, rules] of Object.entries(byCategory)) {
    if (rules.length >= 2) {
      flags.push({
        id: `FLAG-DOMAIN-${category.replace(/\s+/g, '-').toUpperCase()}`,
        category: `Domain weakness — ${category}`,
        message: `${rules.length} deficiencies clustered in ${category}; targeted remediation suggested.`,
        priority: 'high'
      });
    }
  }

  // ─── Medium: numeric measurement out of AHA range ─────────────────────
  const rate = data.chestCompressions.compressionRate;
  if (rate !== null && rate !== undefined && !compressionRateInRange(rate)) {
    flags.push({
      id: 'FLAG-CC-RATE-RANGE',
      category: 'Chest Compressions',
      message: `Measured compression rate ${rate}/min outside AHA target ${COMPRESSION_RATE_MIN}-${COMPRESSION_RATE_MAX}/min.`,
      priority: 'medium'
    });
  }
  const depth = data.chestCompressions.compressionDepth;
  if (depth !== null && depth !== undefined && !compressionDepthInRange(depth)) {
    flags.push({
      id: 'FLAG-CC-DEPTH-RANGE',
      category: 'Chest Compressions',
      message: `Measured compression depth ${depth} cm outside AHA target ${COMPRESSION_DEPTH_MIN}-${COMPRESSION_DEPTH_MAX} cm.`,
      priority: 'medium'
    });
  }

  // ─── Medium: hesitation in compression depth ──────────────────────────
  if (
    data.chestCompressions.compressionsAtCorrectDepth === 'no' ||
    (depth !== null && depth !== undefined && depth < COMPRESSION_DEPTH_MIN)
  ) {
    flags.push({
      id: 'FLAG-CC-HESITATE-DEPTH',
      category: 'Chest Compressions',
      message: 'Hesitation observed in compression depth — coach to push harder (5-6 cm).',
      priority: 'medium'
    });
  }

  // ─── Medium: slow time to first AED shock ─────────────────────────────
  const shockTime = data.aedShockDelivery.timeToFirstShockSeconds;
  if (shockTime !== null && shockTime !== undefined && shockTime > SLOW_AED_SECONDS) {
    flags.push({
      id: 'FLAG-AED-SLOW',
      category: 'AED Use',
      message: `Time to first shock ${shockTime} s exceeds ${SLOW_AED_SECONDS} s — practice rapid AED retrieval and pad placement.`,
      priority: 'medium'
    });
  }

  // ─── Low: room for improvement (single non-critical deficiency) ───────
  if (ncDef.length === 1) {
    flags.push({
      id: `FLAG-IMPROVE-${ncDef[0].id}`,
      category: `Improvement area — ${ncDef[0].category}`,
      message: `Room for improvement: ${ncDef[0].description}`,
      priority: 'low'
    });
  }

  // ─── Low: debrief / examiner notes captured for the record ────────────
  if (data.teamDynamicsHandoff.examinerNotes && data.teamDynamicsHandoff.examinerNotes.trim() !== '') {
    flags.push({
      id: 'FLAG-DEBRIEF-EXAMINER',
      category: 'Debrief',
      message: 'Examiner notes recorded — review with trainee during debrief.',
      priority: 'low'
    });
  }
  if (data.teamDynamicsHandoff.traineeFeedback && data.teamDynamicsHandoff.traineeFeedback.trim() !== '') {
    flags.push({
      id: 'FLAG-DEBRIEF-TRAINEE',
      category: 'Debrief',
      message: 'Trainee self-feedback captured — incorporate into improvement plan.',
      priority: 'low'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectAdditionalFlags, SLOW_AED_SECONDS };
