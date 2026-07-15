import { anticholinergicBandFor, burdenBandFor, polypharmacyBandFor, requiredSectionsComplete } from './rules.js';
import { anticholinergicBandLabel, burdenBandLabel, polypharmacyBandLabel, reviewStatusLabel } from './types.js';

// SMR grader. Pure functions: take a `ReviewData` object (a parent review plus
// its repeating medicine list) and derive the documentation-form outputs
// (spec §4). This is NOT a single numeric score — it emits:
//
//   medicineCount              = count(medicines)
//   regularMedicineCount       = count(medicines where isRegular == 'yes')
//   anticholinergicBurdenScore = sum(medicine.anticholinergicBurdenPoints ?? 0)
//   polypharmacyBand           = none | polypharmacy | hyperpolypharmacy
//   anticholinergicBand        = low | significant   (significant at ACB >= 3)
//   burdenBand                 = low | moderate | high  (max of the two bands)
//   reviewStatus               = complete | incomplete
//   stopFlags[]                = one per medicine with a non-empty stoppCriterion
//   startFlags[]               = one per medicine with a non-empty startCriterion
//
// A missing `anticholinergicBurdenPoints` contributes 0 to the ACB sum. The
// firedRules audit trail mirrors the grade_rule SQL table.

/**
 * @typedef {import('./types.js').ReviewData} ReviewData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').MedicineFlag} MedicineFlag
 */

// Wrapped in an IIFE; published via window.StructuredMedicationReview.

/**
 * Sum the per-medicine anticholinergic burden points. A null / missing value
 * contributes 0.
 * @param {import('./types.js').Medicine[]} medicines
 * @returns {number}
 */
function sumAnticholinergicBurden(medicines) {
  let total = 0;
  for (const m of medicines) {
    const p = m.anticholinergicBurdenPoints;
    if (typeof p === 'number' && !Number.isNaN(p)) {
      total += p;
    }
  }
  return total;
}

/**
 * Collect one flag per medicine carrying a non-empty STOPP / START criterion.
 * @param {import('./types.js').Medicine[]} medicines
 * @param {'stoppCriterion' | 'startCriterion'} key
 * @returns {MedicineFlag[]}
 */
function collectCriterionFlags(medicines, key) {
  /** @type {MedicineFlag[]} */
  const flags = [];
  medicines.forEach((m, idx) => {
    const criterion = (m[key] || '').trim();
    if (criterion !== '') {
      flags.push({
        drugName: m.drugName || `Medicine ${idx + 1}`,
        criterion
      });
    }
  });
  return flags;
}

/**
 * Compute the full SMR grade for the supplied review data.
 * @param {ReviewData} data
 * @returns {Omit<GradingResult, 'flaggedIssues' | 'timestamp'>}
 */
function calculateSmrGrade(data) {
  const medicines = data.medicines || [];

  const medicineCount = medicines.length;
  const regularMedicineCount =
    medicines.filter((m) => m.isRegular === 'yes').length;
  const anticholinergicBurdenScore = sumAnticholinergicBurden(medicines);

  const polypharmacyBand = polypharmacyBandFor(regularMedicineCount);
  const anticholinergicBand = anticholinergicBandFor(anticholinergicBurdenScore);
  const burdenBand = burdenBandFor(regularMedicineCount, anticholinergicBurdenScore);

  const reviewStatus = requiredSectionsComplete(data) ? 'complete' : 'incomplete';

  const stopFlags = collectCriterionFlags(medicines, 'stoppCriterion');
  const startFlags = collectCriterionFlags(medicines, 'startCriterion');

  // Audit trail mirroring the grade_rule table.
  /** @type {FiredRule[]} */
  const firedRules = [
    {
      id: 'R-POLYPHARMACY-01',
      category: 'polypharmacy',
      description: `${regularMedicineCount} regular medicine(s) — ${polypharmacyBandLabel(polypharmacyBand)}`
    },
    {
      id: 'R-ANTICHOLINERGIC-BURDEN-01',
      category: 'anticholinergic-burden',
      description: `Anticholinergic burden score ${anticholinergicBurdenScore} — ${anticholinergicBandLabel(anticholinergicBand)}`
    },
    {
      id: 'R-BURDEN-BAND-01',
      category: 'burden-band',
      description: `Composite ${burdenBandLabel(burdenBand)} (worse of polypharmacy and anticholinergic bands)`
    },
    {
      id: 'R-REVIEW-STATUS-01',
      category: 'review-status',
      description: `Review status: ${reviewStatusLabel(reviewStatus)}`
    }
  ];
  for (const f of stopFlags) {
    firedRules.push({
      id: 'R-STOPP-01',
      category: 'stopp',
      description: `STOPP — ${f.drugName}: ${f.criterion}`
    });
  }
  for (const f of startFlags) {
    firedRules.push({
      id: 'R-START-01',
      category: 'start',
      description: `START — ${f.drugName}: ${f.criterion}`
    });
  }

  return {
    medicineCount,
    regularMedicineCount,
    anticholinergicBurdenScore,
    polypharmacyBand,
    anticholinergicBand,
    burdenBand,
    reviewStatus,
    stopFlags,
    startFlags,
    firedRules
  };
}

export { sumAnticholinergicBurden, collectCriterionFlags, calculateSmrGrade };
