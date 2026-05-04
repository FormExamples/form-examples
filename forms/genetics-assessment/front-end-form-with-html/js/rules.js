// Genetics Assessment — declarative rules.
//
// Each rule examines the AssessmentData and either fires (returning a
// `severity`: 'low' | 'moderate' | 'high') or does not (returning `''`).
// The grader collects every fired rule, picks the maximum severity for the
// final risk level, and reports the rule audit trail back to the clinician.
//
// Reference thresholds:
//   - Manchester score >= 15  -> consider BRCA testing (low-moderate)
//   - Manchester score >= 20  -> moderate mutation probability
//   - Manchester score >= 30  -> high mutation probability
//   - >= 1 Bethesda criterion -> indication for MMR IHC / MSI testing
//   - PREMM5 >= 5%            -> Lynch testing threshold
//   - Tyrer-Cuzick lifetime
//        >= 17%  moderate breast risk (NICE FH3 boundary)
//        >= 30%  high breast risk
//   - >= 3 affected first-degree relatives                 -> high
//   - Ashkenazi Jewish + breast/ovarian/pancreatic in family -> moderate
//   - paediatric / early-onset cluster (<= 50)               -> high

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 *
 * @typedef {Object} GeneticsRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData, ctx: GraderContext) => RiskLevel} evaluate
 */

/**
 * @typedef {Object} GraderContext
 * @property {number} manchesterScore
 * @property {number} bethesdaMet
 * @property {number | null} premm5Score
 * @property {number} tyrerCuzickLifetime
 * @property {number} affectedFirstDegree
 * @property {number} earlyOnsetUnder50
 * @property {number} paediatricCancers
 * @property {boolean} hasMaleBreast
 * @property {boolean} hasOvarian
 * @property {boolean} hasPancreatic
 * @property {boolean} hasBilateralBreast
 * @property {boolean} hasMultiplePrimaries
 */

(function () {
'use strict';
window.GeneticsAssessment = window.GeneticsAssessment || {};

/** @type {GeneticsRule[]} */
const rules = [
  // ─── Manchester Score thresholds (BRCA1/2) ────────────────
  {
    id: 'GEN-MAN-001',
    category: 'Manchester Score',
    description: 'Manchester score >= 15 — consider BRCA1/2 testing.',
    evaluate: (_d, ctx) => (ctx.manchesterScore >= 15 && ctx.manchesterScore < 20) ? 'moderate' : ''
  },
  {
    id: 'GEN-MAN-002',
    category: 'Manchester Score',
    description: 'Manchester score >= 20 — moderate probability of BRCA1/2 mutation.',
    evaluate: (_d, ctx) => (ctx.manchesterScore >= 20 && ctx.manchesterScore < 30) ? 'moderate' : ''
  },
  {
    id: 'GEN-MAN-003',
    category: 'Manchester Score',
    description: 'Manchester score >= 30 — high probability of BRCA1/2 mutation; testing strongly indicated.',
    evaluate: (_d, ctx) => ctx.manchesterScore >= 30 ? 'high' : ''
  },

  // ─── Bethesda criteria (Lynch syndrome) ───────────────────
  {
    id: 'GEN-BET-001',
    category: 'Bethesda',
    description: 'At least one Revised Bethesda criterion met — MMR IHC / MSI testing indicated.',
    evaluate: (_d, ctx) => ctx.bethesdaMet >= 1 ? 'moderate' : ''
  },
  {
    id: 'GEN-BET-002',
    category: 'Bethesda',
    description: 'Two or more Revised Bethesda criteria met — strong indication for Lynch syndrome workup.',
    evaluate: (_d, ctx) => ctx.bethesdaMet >= 2 ? 'high' : ''
  },

  // ─── PREMM5 threshold ─────────────────────────────────────
  {
    id: 'GEN-PREMM5-001',
    category: 'PREMM5',
    description: 'PREMM5 score >= 5% — Lynch syndrome germline testing indicated.',
    evaluate: (_d, ctx) =>
      ctx.premm5Score !== null && ctx.premm5Score >= 5 ? 'high' : ''
  },

  // ─── Tyrer-Cuzick (IBIS) lifetime risk ────────────────────
  {
    id: 'GEN-TC-001',
    category: 'Tyrer-Cuzick',
    description: 'Tyrer-Cuzick lifetime risk >= 17% — moderate-risk breast surveillance per NICE FH.',
    evaluate: (_d, ctx) =>
      ctx.tyrerCuzickLifetime >= 17 && ctx.tyrerCuzickLifetime < 30 ? 'moderate' : ''
  },
  {
    id: 'GEN-TC-002',
    category: 'Tyrer-Cuzick',
    description: 'Tyrer-Cuzick lifetime risk >= 30% — high-risk breast surveillance per NICE FH.',
    evaluate: (_d, ctx) => ctx.tyrerCuzickLifetime >= 30 ? 'high' : ''
  },

  // ─── Family history burden ────────────────────────────────
  {
    id: 'GEN-FAM-001',
    category: 'Family History',
    description: '>= 3 affected first-degree relatives — significant familial cancer burden.',
    evaluate: (_d, ctx) => ctx.affectedFirstDegree >= 3 ? 'high' : ''
  },
  {
    id: 'GEN-FAM-002',
    category: 'Family History',
    description: '>= 2 affected first-degree relatives — moderate familial cancer burden.',
    evaluate: (_d, ctx) =>
      ctx.affectedFirstDegree === 2 ? 'moderate' : ''
  },
  {
    id: 'GEN-FAM-003',
    category: 'Family History',
    description: 'Multiple early-onset cancers (<=50) in the family — strongly suggestive of hereditary syndrome.',
    evaluate: (_d, ctx) => ctx.earlyOnsetUnder50 >= 2 ? 'high' : ''
  },
  {
    id: 'GEN-FAM-004',
    category: 'Family History',
    description: 'Paediatric cancer cluster — at least one paediatric (<18) cancer in close relatives.',
    evaluate: (_d, ctx) => ctx.paediatricCancers >= 1 ? 'high' : ''
  },

  // ─── Specific tumour-type signals ─────────────────────────
  {
    id: 'GEN-TUM-001',
    category: 'Tumour Spectrum',
    description: 'Male breast cancer in family — consider BRCA2 testing.',
    evaluate: (_d, ctx) => ctx.hasMaleBreast ? 'moderate' : ''
  },
  {
    id: 'GEN-TUM-002',
    category: 'Tumour Spectrum',
    description: 'Ovarian cancer (any age) in family — BRCA1/2 testing indicated per NICE/NCCN.',
    evaluate: (_d, ctx) => ctx.hasOvarian ? 'moderate' : ''
  },
  {
    id: 'GEN-TUM-003',
    category: 'Tumour Spectrum',
    description: 'Pancreatic cancer in family — consider hereditary pancreatic cancer syndromes.',
    evaluate: (_d, ctx) => ctx.hasPancreatic ? 'moderate' : ''
  },
  {
    id: 'GEN-TUM-004',
    category: 'Tumour Spectrum',
    description: 'Bilateral breast cancer — strong indication for BRCA1/2 testing.',
    evaluate: (_d, ctx) => ctx.hasBilateralBreast ? 'high' : ''
  },
  {
    id: 'GEN-TUM-005',
    category: 'Proband History',
    description: 'Multiple primary cancers in proband — pathogenic-variant pre-test probability elevated.',
    evaluate: (_d, ctx) => ctx.hasMultiplePrimaries ? 'high' : ''
  },

  // ─── Ancestry-based risk modifiers ────────────────────────
  {
    id: 'GEN-ANC-001',
    category: 'Ancestry',
    description: 'Ashkenazi Jewish ancestry plus breast / ovarian / pancreatic cancer in proband or family — BRCA founder mutation testing recommended.',
    evaluate: (d, ctx) => {
      if (d.consanguinityAncestry.ashkenaziJewish !== 'yes') return '';
      const probandCancers = (d.personalMedicalHistory.cancers || []).map((c) => (c.type || '').toLowerCase());
      const probandHasBOP = probandCancers.some((t) =>
        t.includes('breast') || t.includes('ovar') || t.includes('pancrea')
      );
      const familyHasBOP = ctx.hasOvarian || ctx.hasMaleBreast || ctx.hasPancreatic;
      return (probandHasBOP || familyHasBOP) ? 'moderate' : '';
    }
  },
  {
    id: 'GEN-ANC-002',
    category: 'Ancestry',
    description: 'Consanguinity reported — increased risk of recessive conditions; carrier-screening relevant.',
    evaluate: (d) => d.consanguinityAncestry.consanguinity === 'yes' ? 'low' : ''
  },
  {
    id: 'GEN-ANC-003',
    category: 'Ancestry',
    description: 'Founding-population ancestry reported — population-specific founder variants may apply.',
    evaluate: (d) => d.consanguinityAncestry.foundingPopulation === 'yes' ? 'low' : ''
  },

  // ─── Suspected syndrome (clinician-entered) ───────────────
  {
    id: 'GEN-SYN-001',
    category: 'Suspected Syndrome',
    description: 'Referring clinician has named a suspected syndrome — formal genetics review indicated.',
    evaluate: (d) => (d.presentingConcern.suspectedSyndrome || '').trim() !== '' ? 'moderate' : ''
  },

  // ─── Lifestyle / general counselling ──────────────────────
  {
    id: 'GEN-COUN-001',
    category: 'General Counselling',
    description: 'Patient has reproductive concerns — preconception / prenatal genetic counselling relevant.',
    evaluate: (d) => d.patientUnderstandingConcerns.reproductiveImplications === 'yes' ? 'low' : ''
  }
];

window.GeneticsAssessment.rules = rules;
})();
