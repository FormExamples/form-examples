// Prioritised flag detection for the First Aid at Work (FAW) competency
// report.
//
// Independent of the pass / needs-development / fail outcome (which the
// grader computes), this module surfaces flags for examiner attention:
//
//   high   — any critical-skill failure (with reason): ineffective CPR,
//            missed primary survey, failed unconscious choking, failed
//            major bleed control, missed anaphylaxis recognition, etc.
//            Also: expired prior certification.
//   medium — multiple non-critical deficiencies, slow response, hesitation
//            within a domain (multiple deficiencies clustered in one
//            category).
//   low    — improvement areas (single non-critical deficiency), debrief
//            and trainee-feedback notes captured.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

(function () {
'use strict';
window.FirstAidTrainingChecklist =
  window.FirstAidTrainingChecklist || {};

const NS = window.FirstAidTrainingChecklist;

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

  // --- High: per critical-skill failure (specific reason) ---------------
  for (const rule of grading.criticalFailures) {
    flags.push({
      id: `FLAG-CRIT-${rule.id}`,
      category: `Critical skill — ${rule.category}`,
      message: `Critical-skill failure: ${rule.description}`,
      priority: 'high'
    });
  }

  // --- High: prior certification expired --------------------------------
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

  // --- High/Medium: multiple non-critical deficiencies overall ----------
  const def = grading.deficiencies;
  if (def.length >= 2) {
    flags.push({
      id: 'FLAG-MULTI-DEF',
      category: 'Performance',
      message: `${def.length} non-critical deficiencies recorded — additional coaching recommended.`,
      priority: def.length > 2 ? 'high' : 'medium'
    });
  }

  // --- High: same domain has multiple deficiencies ----------------------
  /** @type {Record<string, FiredRule[]>} */
  const byCategory = {};
  for (const rule of def) {
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

  // --- Medium: hesitation in CPR compressions or ventilations -----------
  if (data.cprAed.effectiveCompressions === 'no') {
    flags.push({
      id: 'FLAG-CPR-COMPRESSIONS',
      category: 'CPR & AED',
      message: 'Ineffective chest compressions — coach to push hard (5-6 cm) and fast (100-120/min).',
      priority: 'medium'
    });
  }
  if (data.cprAed.effectiveVentilations === 'no') {
    flags.push({
      id: 'FLAG-CPR-VENTILATIONS',
      category: 'CPR & AED',
      message: 'Ineffective ventilations — coach airway opening and mask seal for visible chest rise.',
      priority: 'medium'
    });
  }

  // --- Medium: slow response / missed AVPU primary check ----------------
  if (data.primarySurveyDRABC.responseCheck === 'no') {
    flags.push({
      id: 'FLAG-PS-RESPONSE',
      category: 'Primary Survey',
      message: 'Slow or missed response check — practice AVPU and shake-and-shout every scenario.',
      priority: 'medium'
    });
  }

  // --- Medium: no haemostatic/dressing skill in major bleed ------------
  if (
    data.bleedingWoundCare.appliedDressingCorrectly === 'no' ||
    data.bleedingWoundCare.haemostaticDressingApplied === 'no'
  ) {
    flags.push({
      id: 'FLAG-BLEED-DRESSING',
      category: 'Bleeding',
      message: 'Hesitation with dressing/haemostatic application — drill wound packing and bandaging.',
      priority: 'medium'
    });
  }

  // --- Medium: anaphylaxis recognised but EpiPen technique poor --------
  if (
    data.medicalEmergencies.recognisedAnaphylaxis === 'yes' &&
    data.medicalEmergencies.administeredEpiPenSafely === 'no'
  ) {
    flags.push({
      id: 'FLAG-MED-EPIPEN',
      category: 'Medical Emergencies',
      message: 'Anaphylaxis recognised but EpiPen technique unsafe — practice outer-thigh injection drill.',
      priority: 'medium'
    });
  }

  // --- Low: improvement area (single non-critical deficiency) -----------
  if (def.length === 1) {
    flags.push({
      id: `FLAG-IMPROVE-${def[0].id}`,
      category: `Improvement area — ${def[0].category}`,
      message: `Room for improvement: ${def[0].description}`,
      priority: 'low'
    });
  }

  // --- Low: debrief / examiner / trainee notes captured ----------------
  const handover = data.recordingReportingHandover;
  if (handover.examinerNotes && handover.examinerNotes.trim() !== '') {
    flags.push({
      id: 'FLAG-DEBRIEF-EXAMINER',
      category: 'Debrief',
      message: 'Examiner notes recorded — review with trainee during debrief.',
      priority: 'low'
    });
  }
  if (handover.traineeFeedback && handover.traineeFeedback.trim() !== '') {
    flags.push({
      id: 'FLAG-DEBRIEF-TRAINEE',
      category: 'Debrief',
      message: 'Trainee self-feedback captured — incorporate into improvement plan.',
      priority: 'low'
    });
  }
  if (handover.debriefNotes && handover.debriefNotes.trim() !== '') {
    flags.push({
      id: 'FLAG-DEBRIEF-NOTES',
      category: 'Debrief',
      message: 'Structured debrief notes recorded for the training file.',
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
