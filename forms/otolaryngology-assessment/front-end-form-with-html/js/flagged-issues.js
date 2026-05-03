// Flagged-issue detection for the Otolaryngology Assessment.
//
// Independent of the SNOT-22 numeric total, this module raises clinician
// flags for red-flag presentations (sudden hearing loss, neck mass, tympanic
// perforation, head/neck cancer history, severe symptom domains) that may
// warrant urgent or specialist review.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AdditionalFlag} AdditionalFlag
 */

(function () {
'use strict';
window.OtolaryngologyAssessment = window.OtolaryngologyAssessment || {};

/**
 * @param {AssessmentData} data
 * @returns {AdditionalFlag[]}
 */
function detectAdditionalFlags(data) {
  /** @type {AdditionalFlag[]} */
  const flags = [];

  // ─── Red-flag presentations ───────────────────────────────
  if (data.oropharyngealNeckExamination.neckMass === 'yes') {
    flags.push({
      id: 'FLAG-NECK-001',
      category: 'Neck Examination',
      message: `Neck mass identified${data.oropharyngealNeckExamination.neckMassDetails ? ': ' + data.oropharyngealNeckExamination.neckMassDetails : ''} — 2-week-wait head & neck referral indicated.`,
      priority: 'urgent'
    });
  }

  if (data.pastEntHistory.headNeckCancer === 'yes') {
    flags.push({
      id: 'FLAG-HX-001',
      category: 'Past History',
      message: 'Personal history of head and neck cancer — heightened surveillance required.',
      priority: 'high'
    });
  }

  if (data.pastEntHistory.headNeckRadiotherapy === 'yes') {
    flags.push({
      id: 'FLAG-HX-002',
      category: 'Past History',
      message: 'Prior head and neck radiotherapy — consider late effects (xerostomia, fibrosis, hypothyroidism).',
      priority: 'medium'
    });
  }

  // ─── Otoscopy ─────────────────────────────────────────────
  for (const side of /** @type {const} */ (['right', 'left'])) {
    const tm = data.otoscopy[side].tympanicMembrane;
    if (tm === 'perforated') {
      flags.push({
        id: `FLAG-OTO-PERF-${side.toUpperCase()}`,
        category: 'Otoscopy',
        message: `${capitalize(side)} tympanic membrane perforated — assess hearing, water precautions, ENT review.`,
        priority: 'high'
      });
    }
    if (tm === 'effusion') {
      flags.push({
        id: `FLAG-OTO-EFFU-${side.toUpperCase()}`,
        category: 'Otoscopy',
        message: `${capitalize(side)} middle-ear effusion — consider tympanometry and audiology referral.`,
        priority: 'medium'
      });
    }
  }

  // ─── Sudden hearing loss / vertigo ────────────────────────
  if (
    data.pastEntHistory.hearingLoss === 'yes' &&
    data.historyOfPresentIllness.onsetType === 'sudden'
  ) {
    flags.push({
      id: 'FLAG-AUD-001',
      category: 'Audiology',
      message: 'Sudden-onset hearing loss reported — urgent ENT/audiology referral recommended within 24-48 hours.',
      priority: 'urgent'
    });
  }

  if (
    data.pastEntHistory.vertigo === 'yes' &&
    data.historyOfPresentIllness.onsetType === 'sudden'
  ) {
    flags.push({
      id: 'FLAG-VEST-001',
      category: 'Vestibular',
      message: 'Sudden-onset vertigo — exclude central cause; consider HINTS exam and urgent review.',
      priority: 'high'
    });
  }

  // ─── Nasal polyps ─────────────────────────────────────────
  for (const side of /** @type {const} */ (['right', 'left'])) {
    const polyps = data.anteriorRhinoscopy[side].polyps;
    if (polyps === 'large') {
      flags.push({
        id: `FLAG-RHINO-POLYP-${side.toUpperCase()}`,
        category: 'Rhinoscopy',
        message: `${capitalize(side)} large nasal polyps — likely contributing to obstruction; consider intranasal steroid trial and ENT referral.`,
        priority: 'high'
      });
    } else if (polyps === 'medium') {
      flags.push({
        id: `FLAG-RHINO-POLYPM-${side.toUpperCase()}`,
        category: 'Rhinoscopy',
        message: `${capitalize(side)} medium nasal polyps documented.`,
        priority: 'medium'
      });
    }
    const disch = data.anteriorRhinoscopy[side].discharge;
    if (disch === 'purulent') {
      flags.push({
        id: `FLAG-RHINO-PUS-${side.toUpperCase()}`,
        category: 'Rhinoscopy',
        message: `${capitalize(side)} purulent nasal discharge — consider acute bacterial sinusitis.`,
        priority: 'medium'
      });
    }
    if (disch === 'blood') {
      flags.push({
        id: `FLAG-RHINO-BLOOD-${side.toUpperCase()}`,
        category: 'Rhinoscopy',
        message: `${capitalize(side)} blood-stained nasal discharge — exclude tumour or significant trauma.`,
        priority: 'high'
      });
    }
  }

  // ─── Oropharyngeal exam ───────────────────────────────────
  if (data.oropharyngealNeckExamination.tonsils === 'asymmetric') {
    flags.push({
      id: 'FLAG-OROPHX-001',
      category: 'Oropharynx',
      message: 'Asymmetric tonsils — exclude tonsillar malignancy; consider ENT referral.',
      priority: 'high'
    });
  }
  if (data.oropharyngealNeckExamination.oralMucosa === 'ulcerated') {
    flags.push({
      id: 'FLAG-OROPHX-002',
      category: 'Oropharynx',
      message: 'Oral mucosal ulceration — if persistent >3 weeks, urgent 2-week-wait referral.',
      priority: 'high'
    });
  }
  if (data.oropharyngealNeckExamination.cervicalLymphadenopathy === 'yes') {
    flags.push({
      id: 'FLAG-LN-001',
      category: 'Cervical Lymphadenopathy',
      message: `Cervical lymphadenopathy${data.oropharyngealNeckExamination.cervicalLymphadenopathyDetails ? ': ' + data.oropharyngealNeckExamination.cervicalLymphadenopathyDetails : ''} — characterise (size, mobility, tenderness) and consider USS / FNA.`,
      priority: 'medium'
    });
  }
  if (data.oropharyngealNeckExamination.thyroidEnlarged === 'yes') {
    flags.push({
      id: 'FLAG-THY-001',
      category: 'Thyroid',
      message: 'Thyroid enlargement on examination — TFTs and thyroid USS recommended.',
      priority: 'medium'
    });
  }

  // ─── External examination ────────────────────────────────
  if (data.externalExamination.facialAsymmetry === 'yes') {
    flags.push({
      id: 'FLAG-EXT-001',
      category: 'External Examination',
      message: 'Facial asymmetry — assess facial nerve function and parotid region.',
      priority: 'medium'
    });
  }
  if (data.externalExamination.skinLesions === 'yes') {
    flags.push({
      id: 'FLAG-EXT-002',
      category: 'External Examination',
      message: 'Skin lesions noted — document and consider dermoscopy / dermatology referral.',
      priority: 'low'
    });
  }

  // ─── Lifestyle ────────────────────────────────────────────
  if (data.pastEntHistory.smoking === 'yes') {
    flags.push({
      id: 'FLAG-SOC-001',
      category: 'Social History',
      message: 'Active smoking — head/neck cancer risk factor; advise cessation.',
      priority: 'medium'
    });
  }
  if (data.pastEntHistory.alcohol === 'yes') {
    flags.push({
      id: 'FLAG-SOC-002',
      category: 'Social History',
      message: 'Significant alcohol use — head/neck cancer risk factor; quantify and advise.',
      priority: 'low'
    });
  }

  // ─── SNOT-22 domain hot-spots ─────────────────────────────
  const snot = data.snot22;
  // Sleep domain (4 items)
  const sleepItems = [
    snot.difficultyFallingAsleep, snot.wakingUpAtNight,
    snot.lackOfGoodNightsSleep, snot.wakingUpTired
  ];
  if (sleepItems.every((v) => v !== null) && sumNumbers(sleepItems) >= 12) {
    flags.push({
      id: 'FLAG-SNOT-SLEEP',
      category: 'SNOT-22',
      message: `High sleep-domain burden (${sumNumbers(sleepItems)}/20) — screen for OSA and consider sleep study.`,
      priority: 'medium'
    });
  }
  // Psychological domain (4 items)
  const psychItems = [
    snot.frustratedRestlessIrritable, snot.sad,
    snot.embarrassed, snot.fatigue
  ];
  if (psychItems.every((v) => v !== null) && sumNumbers(psychItems) >= 12) {
    flags.push({
      id: 'FLAG-SNOT-PSY',
      category: 'SNOT-22',
      message: `High psychological-domain burden (${sumNumbers(psychItems)}/20) — consider mental-health support alongside ENT management.`,
      priority: 'medium'
    });
  }

  // Sort: urgent > high > medium > low
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  return flags;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function sumNumbers(arr) {
  let total = 0;
  for (const v of arr) if (v !== null && v !== undefined) total += Number(v);
  return total;
}

window.OtolaryngologyAssessment.detectAdditionalFlags = detectAdditionalFlags;
})();
