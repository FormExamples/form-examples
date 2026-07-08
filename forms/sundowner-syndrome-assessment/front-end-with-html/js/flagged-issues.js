// Flagged-issue detection for the sundowner syndrome assessment.
//
// Independent of the CMAI/NPI totals, this module raises clinician-facing
// flags grouped by priority:
//
//   high   — aggressive / violent behaviour, fall risk, self-harm risk,
//            recent delirium, severe carer burnout
//   medium — sleep disturbance, sedative / antipsychotic burden, recent
//            medication change, moderate carer strain, infection or pain
//            triggers
//   low    — environmental contributors (lighting, noise, clutter,
//            unfamiliar setting, mirrors), routine inconsistency
//
// The returned list is sorted high -> medium -> low.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

(function () {
'use strict';
window.SundownerSyndromeAssessment = window.SundownerSyndromeAssessment || {};
const NS = window.SundownerSyndromeAssessment;
const { cmaiItems } = NS;

// CMAI item numbers that represent specifically aggressive behaviour
// (versus general agitation). Items 4 (cursing), 7 (hitting), 8 (kicking),
// 11 (throwing), 13 (screaming), 14 (biting), 15 (scratching), 21 (hurting
// self/others), 25 (destroying property).
const AGGRESSIVE_ITEM_NUMBERS = [4, 7, 8, 10, 11, 13, 14, 15, 21, 25];

// CMAI item numbers that represent direct self-harm risk: 7 (hitting,
// includes self), 17 (intentional falling), 20 (eating inappropriate
// substances), 21 (hurting self or others).
const SELF_HARM_ITEM_NUMBERS = [7, 17, 20, 21];

// CMAI item numbers that represent fall / injury risk: 1 (pacing/wandering),
// 16 (trying to leave), 17 (intentional falling), 29 (general restlessness).
const FALL_RISK_ITEM_NUMBERS = [1, 16, 17, 29];

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];
  const cmai = data.behaviouralSymptoms?.cmai || {};
  const npi = data.behaviouralSymptoms?.npi || {};

  // helpers
  const cmaiAt = (n) => {
    const id = `cmai${String(n).padStart(2, '0')}`;
    const v = cmai[id];
    return typeof v === 'number' ? v : 0;
  };
  const npiScore = (key) => {
    const e = npi[key] || { frequency: 0, severity: 0 };
    const f = Number(e.frequency) || 0;
    const s = Number(e.severity) || 0;
    return (f >= 1 && f <= 4 && s >= 1 && s <= 3) ? f * s : 0;
  };

  // ─── HIGH priority ───────────────────────────────────────────

  // Aggressive behaviour: any aggressive item rated >= 4 (several times
  // a week or more).
  const aggressiveActive = AGGRESSIVE_ITEM_NUMBERS
    .map((n) => ({ n, v: cmaiAt(n) }))
    .filter((x) => x.v >= 4);
  if (aggressiveActive.length > 0) {
    const labels = aggressiveActive
      .map((x) => {
        const item = cmaiItems.find((it) => it.number === x.n);
        return item ? `#${x.n} ${item.label} (rated ${x.v})` : `#${x.n}`;
      })
      .join('; ');
    flags.push({
      id: 'FLAG-AGGRESSION-001',
      category: 'Aggressive Behaviour',
      message: `Aggressive behaviour observed at least several times a week: ${labels}. Safety planning and de-escalation training indicated.`,
      priority: 'high'
    });
  }
  if (npiScore('agitationAggression') >= 6) {
    flags.push({
      id: 'FLAG-AGGRESSION-002',
      category: 'Aggressive Behaviour',
      message: `NPI agitation/aggression domain score ${npiScore('agitationAggression')} of 12 — clinically significant.`,
      priority: 'high'
    });
  }

  // Self-harm risk
  const selfHarmActive = SELF_HARM_ITEM_NUMBERS
    .map((n) => ({ n, v: cmaiAt(n) }))
    .filter((x) => x.v >= 3);
  if (selfHarmActive.length > 0) {
    const labels = selfHarmActive
      .map((x) => {
        const item = cmaiItems.find((it) => it.number === x.n);
        return item ? `#${x.n} ${item.label} (rated ${x.v})` : `#${x.n}`;
      })
      .join('; ');
    flags.push({
      id: 'FLAG-SELFHARM-001',
      category: 'Self-Harm Risk',
      message: `Self-harm-related behaviour observed: ${labels}. Constant supervision may be required.`,
      priority: 'high'
    });
  }

  // Fall risk
  const fallActive = FALL_RISK_ITEM_NUMBERS
    .map((n) => ({ n, v: cmaiAt(n) }))
    .filter((x) => x.v >= 4);
  if (fallActive.length > 0 || cmaiAt(17) >= 2) {
    flags.push({
      id: 'FLAG-FALL-001',
      category: 'Fall Risk',
      message: 'Wandering, restlessness, or intentional falling observed. Falls-prevention review recommended.',
      priority: 'high'
    });
  }

  // Recent delirium history is a high-priority red flag for sundowning
  if (data.cognitiveStatus.priorDeliriumHistory === 'yes') {
    flags.push({
      id: 'FLAG-DELIRIUM-001',
      category: 'Cognitive Status',
      message: 'Prior delirium history — re-assess for active delirium (infection, dehydration, medication).',
      priority: 'high'
    });
  }

  // Severe carer burnout / strain
  if (data.carerImpact.carerStrainLevel === 'severe' ||
      data.carerImpact.carerBurnoutSigns === 'yes') {
    flags.push({
      id: 'FLAG-CARER-001',
      category: 'Carer Impact',
      message: 'Severe carer strain or burnout — urgent respite, support, or alternative placement should be considered.',
      priority: 'high'
    });
  }

  // ─── MEDIUM priority ─────────────────────────────────────────

  // Sleep disturbance
  if (data.sleepWakeCycle.nighttimeWandering === 'yes' ||
      data.sleepWakeCycle.reversedSleepCycle === 'yes' ||
      (data.sleepWakeCycle.averageHoursOfSleep !== null &&
       data.sleepWakeCycle.averageHoursOfSleep < 5)) {
    flags.push({
      id: 'FLAG-SLEEP-001',
      category: 'Sleep-Wake Cycle',
      message: 'Significant sleep-wake disturbance (nighttime wandering, reversed cycle, or short sleep). Sleep hygiene and circadian-rhythm interventions indicated.',
      priority: 'medium'
    });
  }
  if (npiScore('sleep') >= 6) {
    flags.push({
      id: 'FLAG-SLEEP-002',
      category: 'Sleep-Wake Cycle',
      message: `NPI sleep domain score ${npiScore('sleep')} of 12 — clinically significant.`,
      priority: 'medium'
    });
  }

  // Medication interactions / burden
  if (data.medicationReview.anticholinergicBurden === 'yes') {
    flags.push({
      id: 'FLAG-MED-001',
      category: 'Medication Review',
      message: 'Anticholinergic burden present — known to worsen confusion and sundowning. Consider deprescribing.',
      priority: 'medium'
    });
  }
  if (data.medicationReview.sedativeUse === 'yes' &&
      data.medicationReview.antipsychoticUse === 'yes') {
    flags.push({
      id: 'FLAG-MED-002',
      category: 'Medication Review',
      message: 'Concurrent sedative + antipsychotic use — interaction risk; review indications and dosing.',
      priority: 'medium'
    });
  } else if (data.medicationReview.antipsychoticUse === 'yes') {
    flags.push({
      id: 'FLAG-MED-003',
      category: 'Medication Review',
      message: 'Antipsychotic in use — review indication, dose, and stroke risk in dementia (BPSD off-label).',
      priority: 'medium'
    });
  }
  if (data.medicationReview.recentMedicationChange === 'yes') {
    flags.push({
      id: 'FLAG-MED-004',
      category: 'Medication Review',
      message: 'Recent medication change reported — may be contributing to behavioural symptoms.',
      priority: 'medium'
    });
  }
  if (data.medicationReview.medicationAdherence === 'poor') {
    flags.push({
      id: 'FLAG-MED-005',
      category: 'Medication Review',
      message: 'Poor medication adherence — review pillbox / supervised dosing.',
      priority: 'medium'
    });
  }

  // Acute medical triggers (infection, pain, dehydration)
  if (data.triggerIdentification.infection === 'yes') {
    flags.push({
      id: 'FLAG-TRIG-001',
      category: 'Trigger Identification',
      message: 'Infection identified as trigger — screen for UTI / chest / cellulitis as common precipitants.',
      priority: 'medium'
    });
  }
  if (data.triggerIdentification.pain === 'yes') {
    flags.push({
      id: 'FLAG-TRIG-002',
      category: 'Trigger Identification',
      message: 'Untreated pain identified as trigger — review analgesia and pain-assessment tools (e.g. Abbey).',
      priority: 'medium'
    });
  }
  if (data.triggerIdentification.dehydration === 'yes') {
    flags.push({
      id: 'FLAG-TRIG-003',
      category: 'Trigger Identification',
      message: 'Dehydration identified as trigger — fluid balance and hydration plan.',
      priority: 'medium'
    });
  }

  // Moderate carer strain
  if (data.carerImpact.carerStrainLevel === 'moderate' &&
      !flags.some((f) => f.id === 'FLAG-CARER-001')) {
    flags.push({
      id: 'FLAG-CARER-002',
      category: 'Carer Impact',
      message: 'Moderate carer strain reported — proactive support and respite-care planning recommended.',
      priority: 'medium'
    });
  }
  if (data.carerImpact.carerSleepDisturbed === 'yes') {
    flags.push({
      id: 'FLAG-CARER-003',
      category: 'Carer Impact',
      message: 'Carer sleep disturbed by patient — assess carer sleep deprivation and respite need.',
      priority: 'medium'
    });
  }

  // ─── LOW priority ────────────────────────────────────────────

  if (data.environmentalAssessment.adequateDaylight === 'no') {
    flags.push({
      id: 'FLAG-ENV-001',
      category: 'Environmental',
      message: 'Inadequate daylight exposure — consider bright-light therapy / outdoor time to support circadian rhythm.',
      priority: 'low'
    });
  }
  if (data.environmentalAssessment.excessiveNoise === 'yes') {
    flags.push({
      id: 'FLAG-ENV-002',
      category: 'Environmental',
      message: 'Excessive noise in environment — sensory overload may worsen agitation.',
      priority: 'low'
    });
  }
  if (data.environmentalAssessment.cluttered === 'yes') {
    flags.push({
      id: 'FLAG-ENV-003',
      category: 'Environmental',
      message: 'Cluttered environment — declutter to reduce confusion and tripping hazards.',
      priority: 'low'
    });
  }
  if (data.environmentalAssessment.mirrorsOrShadows === 'yes') {
    flags.push({
      id: 'FLAG-ENV-004',
      category: 'Environmental',
      message: 'Mirrors or shadows present — may trigger misperceptions / hallucinations; consider covering or relocating.',
      priority: 'low'
    });
  }
  if (data.environmentalAssessment.consistentRoutine === 'no') {
    flags.push({
      id: 'FLAG-ENV-005',
      category: 'Environmental',
      message: 'Inconsistent routine — establish predictable daily schedule to reduce sundowning.',
      priority: 'low'
    });
  }
  if (data.environmentalAssessment.unfamiliarEnvironment === 'yes') {
    flags.push({
      id: 'FLAG-ENV-006',
      category: 'Environmental',
      message: 'Unfamiliar environment reported — orientation aids (clocks, calendars, signage) recommended.',
      priority: 'low'
    });
  }

  // Sort: high -> medium -> low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.SundownerSyndromeAssessment.detectAdditionalFlags = detectAdditionalFlags;
})();
