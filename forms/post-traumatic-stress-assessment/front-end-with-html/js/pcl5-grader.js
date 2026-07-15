// PCL-5 grader. Pure functions: take an `AssessmentData` object, return the
// total score (0-80), the cluster sub-totals, the `SeverityCategory`, and a
// boolean for the DSM-5 provisional-diagnosis pattern.
//
// Severity bands (PCL-5 total score, 0-80):
//   0-20    -> Minimal
//   21-32   -> Mild
//   33-37   -> Moderate (probable PTSD threshold)
//   38-80   -> Severe
//
// DSM-5 provisional pattern: ≥ 1 B item, ≥ 1 C item, ≥ 2 D items, ≥ 2 E items
// each rated ≥ 2 (Moderately), AND total ≥ 33.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ClusterScores} ClusterScores
 * @typedef {import('./types.js').SeverityCategory} SeverityCategory
 * @typedef {import('./types.js').PclItemScore} PclItemScore
 */

const CUT_OFF = 33;

/** @param {PclItemScore[]} items */
function sum(items) {
  return items.reduce((acc, v) => acc + (v == null ? 0 : v), 0);
}

/**
 * Per-cluster sums.
 * @param {AssessmentData} d
 * @returns {ClusterScores}
 */
function computeClusterScores(d) {
  return {
    b: sum([
      d.clusterBIntrusion.item1RepeatedDisturbingMemories,
      d.clusterBIntrusion.item2RepeatedDisturbingDreams,
      d.clusterBIntrusion.item3FeelingReliving,
      d.clusterBIntrusion.item4FeelingUpsetByReminders,
      d.clusterBIntrusion.item5StrongPhysicalReactions
    ]),
    c: sum([
      d.clusterCAvoidance.item6AvoidingMemoriesThoughtsFeelings,
      d.clusterCAvoidance.item7AvoidingExternalReminders
    ]),
    d: sum([
      d.clusterDNegativeAlterations.item8TroubleRememberingImportantParts,
      d.clusterDNegativeAlterations.item9StrongNegativeBeliefs,
      d.clusterDNegativeAlterations.item10BlamingSelfOrOthers,
      d.clusterDNegativeAlterations.item11StrongNegativeFeelings,
      d.clusterDNegativeAlterations.item12LossOfInterest,
      d.clusterDNegativeAlterations.item13FeelingDistantFromOthers,
      d.clusterDNegativeAlterations.item14TroubleExperiencingPositiveFeelings
    ]),
    e: sum([
      d.clusterEArousalReactivity.item15IrritableOrAggressive,
      d.clusterEArousalReactivity.item16RecklessOrSelfDestructive,
      d.clusterEArousalReactivity.item17SuperAlertOrOnGuard,
      d.clusterEArousalReactivity.item18JumpyOrEasilyStartled,
      d.clusterEArousalReactivity.item19DifficultyConcentrating,
      d.clusterEArousalReactivity.item20TroubleSleeping
    ])
  };
}

/**
 * @param {number} total
 * @returns {SeverityCategory}
 */
function categorise(total) {
  if (total <= 20) return 'Minimal';
  if (total <= 32) return 'Mild';
  if (total <= 37) return 'Moderate';
  return 'Severe';
}

/** @param {PclItemScore[]} items @param {number} threshold */
function countItemsAtOrAbove(items, threshold) {
  return items.filter((v) => (v == null ? 0 : v) >= threshold).length;
}

/**
 * DSM-5 provisional diagnosis pattern.
 * @param {AssessmentData} d
 * @param {number} total
 */
function meetsDsm5Pattern(d, total) {
  if (total < CUT_OFF) return false;
  const bVals = Object.values(d.clusterBIntrusion);
  const cVals = Object.values(d.clusterCAvoidance);
  const dVals = Object.values(d.clusterDNegativeAlterations);
  const eVals = Object.values(d.clusterEArousalReactivity);
  const b = countItemsAtOrAbove(bVals, 2) >= 1;
  const c = countItemsAtOrAbove(cVals, 2) >= 1;
  const dd = countItemsAtOrAbove(dVals, 2) >= 2;
  const e = countItemsAtOrAbove(eVals, 2) >= 2;
  return b && c && dd && e;
}

/** Count answered PCL items (any of the 20 with a non-null value). */
function answeredItemCount(d) {
  let count = 0;
  const groups = [
    d.clusterBIntrusion,
    d.clusterCAvoidance,
    d.clusterDNegativeAlterations,
    d.clusterEArousalReactivity
  ];
  for (const g of groups) {
    for (const v of Object.values(g)) {
      if (v !== null && v !== undefined) count++;
    }
  }
  return count;
}

/**
 * @param {AssessmentData} d
 * @returns {{ totalScore: number, category: SeverityCategory,
 *             probableDsm5Diagnosis: boolean, clusterScores: ClusterScores,
 *             answeredCount: number }}
 */
function calculatePcl5(d) {
  const clusterScores = computeClusterScores(d);
  const totalScore = clusterScores.b + clusterScores.c + clusterScores.d + clusterScores.e;
  const category = categorise(totalScore);
  const probableDsm5Diagnosis = meetsDsm5Pattern(d, totalScore);
  const answeredCount = answeredItemCount(d);
  return { totalScore, category, probableDsm5Diagnosis, clusterScores, answeredCount };
}

export { CUT_OFF, computeClusterScores, categorise, meetsDsm5Pattern, answeredItemCount, calculatePcl5 };
