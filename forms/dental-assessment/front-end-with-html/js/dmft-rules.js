import { getDMFTScore } from './types.js';

// Declarative DMFT grading rules for the Dental Assessment form.
//
// Each rule evaluates patient data and returns true if its condition is
// present. The DMFT total score is the sum of D + M + F (0-32). The
// DMFT category is determined by the score range. Additional rules
// surface periodontal, oral-hygiene, TMJ, radiographic, and medical
// risk factors.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DMFTCategory} DMFTCategory
 *
 * @typedef {Object} DMFTRule
 * @property {string} id
 * @property {string} system
 * @property {string} description
 * @property {DMFTCategory} category
 * @property {(d: AssessmentData) => boolean} evaluate
 */

/** @type {DMFTRule[]} */
const dmftRules = [
  // ─── DMFT SCORE CATEGORIES ──────────────────────────────
  {
    id: 'DMFT-001',
    system: 'DMFT',
    description: 'Caries-free (DMFT = 0)',
    category: 'caries-free',
    evaluate: (d) => {
      const s = getDMFTScore(d.dmftAssessment.decayedTeeth, d.dmftAssessment.missingTeeth, d.dmftAssessment.filledTeeth);
      return s === 0;
    }
  },
  {
    id: 'DMFT-002',
    system: 'DMFT',
    description: 'Very low caries experience (DMFT 1-5)',
    category: 'very-low',
    evaluate: (d) => {
      const s = getDMFTScore(d.dmftAssessment.decayedTeeth, d.dmftAssessment.missingTeeth, d.dmftAssessment.filledTeeth);
      return s >= 1 && s <= 5;
    }
  },
  {
    id: 'DMFT-003',
    system: 'DMFT',
    description: 'Low caries experience (DMFT 6-10)',
    category: 'low',
    evaluate: (d) => {
      const s = getDMFTScore(d.dmftAssessment.decayedTeeth, d.dmftAssessment.missingTeeth, d.dmftAssessment.filledTeeth);
      return s >= 6 && s <= 10;
    }
  },
  {
    id: 'DMFT-004',
    system: 'DMFT',
    description: 'Moderate caries experience (DMFT 11-15)',
    category: 'moderate',
    evaluate: (d) => {
      const s = getDMFTScore(d.dmftAssessment.decayedTeeth, d.dmftAssessment.missingTeeth, d.dmftAssessment.filledTeeth);
      return s >= 11 && s <= 15;
    }
  },
  {
    id: 'DMFT-005',
    system: 'DMFT',
    description: 'High caries experience (DMFT 16-20)',
    category: 'high',
    evaluate: (d) => {
      const s = getDMFTScore(d.dmftAssessment.decayedTeeth, d.dmftAssessment.missingTeeth, d.dmftAssessment.filledTeeth);
      return s >= 16 && s <= 20;
    }
  },
  {
    id: 'DMFT-006',
    system: 'DMFT',
    description: 'Very high caries experience (DMFT 21+)',
    category: 'very-high',
    evaluate: (d) => {
      const s = getDMFTScore(d.dmftAssessment.decayedTeeth, d.dmftAssessment.missingTeeth, d.dmftAssessment.filledTeeth);
      return s >= 21;
    }
  },

  // ─── PERIODONTAL ────────────────────────────────────────
  {
    id: 'PERIO-001',
    system: 'Periodontal',
    description: 'Gum bleeding present',
    category: 'low',
    evaluate: (d) => d.periodontalAssessment.gumBleeding === 'yes'
  },
  {
    id: 'PERIO-002',
    system: 'Periodontal',
    description: 'Elevated pocket depths',
    category: 'moderate',
    evaluate: (d) => d.periodontalAssessment.pocketDepthsAboveNormal === 'yes'
  },
  {
    id: 'PERIO-003',
    system: 'Periodontal',
    description: 'Gum recession present',
    category: 'moderate',
    evaluate: (d) => d.periodontalAssessment.gumRecession === 'yes'
  },
  {
    id: 'PERIO-004',
    system: 'Periodontal',
    description: 'Tooth mobility',
    category: 'high',
    evaluate: (d) => d.periodontalAssessment.toothMobility === 'yes'
  },
  {
    id: 'PERIO-005',
    system: 'Periodontal',
    description: 'Furcation involvement',
    category: 'high',
    evaluate: (d) => d.periodontalAssessment.furcationInvolvement === 'yes'
  },

  // ─── ORAL HYGIENE ───────────────────────────────────────
  {
    id: 'OH-001',
    system: 'Oral Hygiene',
    description: 'Poor oral hygiene',
    category: 'moderate',
    evaluate: (d) => d.oralExamination.oralHygieneIndex === 'poor'
  },

  // ─── TMJ ────────────────────────────────────────────────
  {
    id: 'TMJ-001',
    system: 'TMJ',
    description: 'TMJ pain reported',
    category: 'low',
    evaluate: (d) => d.oralExamination.tmjPain === 'yes'
  },
  {
    id: 'TMJ-002',
    system: 'TMJ',
    description: 'Limited jaw opening',
    category: 'moderate',
    evaluate: (d) => d.oralExamination.tmjLimitedOpening === 'yes'
  },

  // ─── RADIOGRAPHIC ───────────────────────────────────────
  {
    id: 'RAD-001',
    system: 'Radiographic',
    description: 'Bone loss detected',
    category: 'moderate',
    evaluate: (d) =>
      d.radiographicFindings.boneLossPattern !== 'none' &&
      d.radiographicFindings.boneLossPattern !== ''
  },

  // ─── MEDICAL RISK FACTORS ───────────────────────────────
  {
    id: 'MED-001',
    system: 'Medical',
    description: 'Poorly controlled diabetes',
    category: 'moderate',
    evaluate: (d) =>
      d.medicalHistory.diabetes === 'yes' &&
      d.medicalHistory.diabetesControlled === 'no'
  },
  {
    id: 'MED-002',
    system: 'Medical',
    description: 'Immunosuppressed patient',
    category: 'high',
    evaluate: (d) => d.medicalHistory.immunosuppression === 'yes'
  },
  {
    id: 'MED-003',
    system: 'Medical',
    description: 'History of head/neck radiation',
    category: 'high',
    evaluate: (d) => d.medicalHistory.radiationTherapyHeadNeck === 'yes'
  }
];

export { dmftRules };
