// Prioritised flag detection for the Lifeguard Competency Verification
// report. Independent of the pass/fail/needs-development outcome
// (which the grader computes), this module surfaces flags for examiner
// attention:
//
//   high   — any critical-competency failure (with reason): timed swim
//            missed, unconscious-rescue tow inadequate, spinal handling
//            unsafe, ineffective CPR, slow AED, scanning lapse,
//            expired prior certification, multiple deficiencies in one
//            domain
//   medium — multiple non-critical deficiencies, slow physical fitness
//            measurement, hesitation in compression depth, slow time to
//            first AED shock, single critical numeric out of range
//   low    — improvement areas, debrief notes captured

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

(function () {
'use strict';
window.LifeguardCertificationChecklist =
  window.LifeguardCertificationChecklist || {};

const NS = window.LifeguardCertificationChecklist;
const {
  SWIM_50M_MAX_SECONDS,
  SWIM_200M_MAX_SECONDS,
  COMPRESSION_RATE_MIN,
  COMPRESSION_RATE_MAX,
  COMPRESSION_DEPTH_MIN,
  COMPRESSION_DEPTH_MAX,
  SLOW_AED_SECONDS,
  SURFACE_DIVE_MIN_METRES,
  swim50mWithinTarget,
  swim200mWithinTarget,
  compressionRateInRange,
  compressionDepthInRange,
  surfaceDiveDepthAdequate
} = NS;

/**
 * Build the list of flagged issues for the examiner report.
 *
 * @param {AssessmentData} data
 * @param {{ criticalFailures: FiredRule[], deficiencies: FiredRule[] }} grading
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data, grading) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── High: critical-competency failures with the specific reason ──────
  for (const rule of grading.criticalFailures) {
    flags.push({
      id: `FLAG-CRIT-${rule.id}`,
      category: `Critical competency — ${rule.category}`,
      message: `Critical-competency failure: ${rule.description}`,
      priority: 'high'
    });
  }

  // ─── High: prior certification expired ────────────────────────────────
  const expiry = data.candidateDetails.priorCertificationExpiry;
  if (expiry) {
    const expiryDate = new Date(expiry);
    if (!Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now()) {
      flags.push({
        id: 'FLAG-CERT-EXPIRED',
        category: 'Candidate Details',
        message: `Prior certification expired on ${expiry} — recertification required.`,
        priority: 'high'
      });
    }
  }

  // ─── High: domain weakness (multiple deficiencies in same category) ──
  /** @type {Record<string, FiredRule[]>} */
  const byCategory = {};
  for (const rule of grading.deficiencies) {
    if (!byCategory[rule.category]) byCategory[rule.category] = [];
    byCategory[rule.category].push(rule);
  }
  for (const [category, rules] of Object.entries(byCategory)) {
    if (rules.length >= 2) {
      flags.push({
        id: `FLAG-DOMAIN-${category.replace(/\s+/g, '-').toUpperCase()}`,
        category: `Domain weakness — ${category}`,
        message: `${rules.length} deficiencies clustered in ${category}; targeted remediation recommended before recertification.`,
        priority: 'high'
      });
    }
  }

  // ─── Medium: multiple non-critical deficiencies overall ───────────────
  const def = grading.deficiencies;
  if (def.length >= 2) {
    flags.push({
      id: 'FLAG-MULTI-DEF',
      category: 'Performance',
      message: `${def.length} non-critical deficiencies recorded — additional coaching recommended.`,
      priority: def.length > 3 ? 'high' : 'medium'
    });
  }

  // ─── Medium: 50 m swim slow but within margin (or numeric out of range)
  const swim50 = data.physicalFitnessSwim.swim50mTimeSeconds;
  if (swim50 !== null && swim50 !== undefined && !swim50mWithinTarget(swim50)) {
    flags.push({
      id: 'FLAG-SWIM-50M-SLOW',
      category: 'Physical Fitness',
      message: `Measured 50 m swim time ${swim50}s exceeds NPLQ target of ${SWIM_50M_MAX_SECONDS}s.`,
      priority: 'high'
    });
  } else if (swim50 !== null && swim50 !== undefined && swim50 > (SWIM_50M_MAX_SECONDS - 5)) {
    flags.push({
      id: 'FLAG-SWIM-50M-MARGIN',
      category: 'Physical Fitness',
      message: `50 m swim ${swim50}s is within target but close to the ${SWIM_50M_MAX_SECONDS}s limit — recommend conditioning.`,
      priority: 'medium'
    });
  }

  // ─── Medium: 200 m swim slow ──────────────────────────────────────────
  const swim200 = data.physicalFitnessSwim.swim200mTimeSeconds;
  if (swim200 !== null && swim200 !== undefined && !swim200mWithinTarget(swim200)) {
    flags.push({
      id: 'FLAG-SWIM-200M-SLOW',
      category: 'Physical Fitness',
      message: `Measured 200 m swim time ${swim200}s exceeds suggested ${SWIM_200M_MAX_SECONDS}s target.`,
      priority: 'medium'
    });
  }

  // ─── Medium: surface dive depth shallow ──────────────────────────────
  const dive = data.physicalFitnessSwim.surfaceDiveDepthMetres;
  if (dive !== null && dive !== undefined && !surfaceDiveDepthAdequate(dive)) {
    flags.push({
      id: 'FLAG-DIVE-SHALLOW',
      category: 'Physical Fitness',
      message: `Surface dive recovered at ${dive}m — below ${SURFACE_DIVE_MIN_METRES}m suggested NPLQ minimum.`,
      priority: 'medium'
    });
  }

  // ─── Medium: compression rate / depth out of range ───────────────────
  const rate = data.cprAed.compressionRate;
  if (rate !== null && rate !== undefined && !compressionRateInRange(rate)) {
    flags.push({
      id: 'FLAG-CPR-RATE-RANGE',
      category: 'CPR & AED',
      message: `Measured compression rate ${rate}/min outside target ${COMPRESSION_RATE_MIN}-${COMPRESSION_RATE_MAX}/min.`,
      priority: 'medium'
    });
  }
  const depth = data.cprAed.compressionDepth;
  if (depth !== null && depth !== undefined && !compressionDepthInRange(depth)) {
    flags.push({
      id: 'FLAG-CPR-DEPTH-RANGE',
      category: 'CPR & AED',
      message: `Measured compression depth ${depth}cm outside target ${COMPRESSION_DEPTH_MIN}-${COMPRESSION_DEPTH_MAX}cm.`,
      priority: 'medium'
    });
  }

  // ─── Medium: hesitation in compression depth ──────────────────────────
  if (
    data.cprAed.effectiveCompressions === 'no' ||
    (depth !== null && depth !== undefined && depth < COMPRESSION_DEPTH_MIN)
  ) {
    flags.push({
      id: 'FLAG-CPR-HESITATE-DEPTH',
      category: 'CPR & AED',
      message: 'Hesitation in compression depth observed — coach to push harder (5-6 cm).',
      priority: 'medium'
    });
  }

  // ─── Medium: slow time to first AED shock ─────────────────────────────
  const shockTime = data.cprAed.timeToFirstShockSeconds;
  if (shockTime !== null && shockTime !== undefined && shockTime > SLOW_AED_SECONDS) {
    flags.push({
      id: 'FLAG-AED-SLOW',
      category: 'CPR & AED',
      message: `Time to first shock ${shockTime}s exceeds ${SLOW_AED_SECONDS}s target — practice rapid AED retrieval and pad placement.`,
      priority: 'medium'
    });
  }

  // ─── Low: single non-critical deficiency = improvement area ──────────
  if (def.length === 1) {
    flags.push({
      id: `FLAG-IMPROVE-${def[0].id}`,
      category: `Improvement area — ${def[0].category}`,
      message: `Room for improvement: ${def[0].description}`,
      priority: 'low'
    });
  }

  // ─── Low: examiner / candidate notes captured for the record ─────────
  if (data.overallResultSignoff.examinerNotes &&
      data.overallResultSignoff.examinerNotes.trim() !== '') {
    flags.push({
      id: 'FLAG-DEBRIEF-EXAMINER',
      category: 'Debrief',
      message: 'Examiner notes recorded — review with candidate during debrief.',
      priority: 'low'
    });
  }
  if (data.overallResultSignoff.candidateFeedback &&
      data.overallResultSignoff.candidateFeedback.trim() !== '') {
    flags.push({
      id: 'FLAG-DEBRIEF-CANDIDATE',
      category: 'Debrief',
      message: 'Candidate self-feedback captured — incorporate into improvement plan.',
      priority: 'low'
    });
  }
  if (data.overallResultSignoff.developmentAreas &&
      data.overallResultSignoff.developmentAreas.trim() !== '') {
    flags.push({
      id: 'FLAG-DEVELOPMENT-AREAS',
      category: 'Development',
      message: 'Development areas noted — supply written feedback to candidate.',
      priority: 'low'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(NS, {
  detectAdditionalFlags
});
})();
