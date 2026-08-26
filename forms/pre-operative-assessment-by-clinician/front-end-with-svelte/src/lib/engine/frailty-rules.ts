import type { ClinicianAssessment, FiredRule } from "./types.js";

/**
 * Fried Frailty Phenotype (Fried et al., J Gerontol A Biol Sci Med Sci 2001).
 * Five criteria, each yes/no: weakness, slowness, low physical activity,
 * exhaustion, unintentional weight loss. Score = count of criteria met.
 * 0 = robust, 1-2 = pre-frail, 3-5 = frail. Returns null when no criterion
 * has been answered yet, so an incomplete step does not fire "robust".
 */
export function computeFriedPhenotypeScore(data: ClinicianAssessment): {
  score: number | null;
  category: "robust" | "pre-frail" | "frail" | "";
} {
  const fc = data.functionalCapacity;
  const criteria = [
    fc.friedWeakness,
    fc.friedSlowness,
    fc.friedLowPhysicalActivity,
    fc.friedExhaustion,
    fc.friedUnintentionalWeightLoss,
  ];
  if (criteria.every((c) => c === "")) return { score: null, category: "" };

  const score = criteria.filter((c) => c === "yes").length;
  const category = score === 0 ? "robust" : score <= 2 ? "pre-frail" : "frail";
  return { score, category };
}

export function applyFrailtyRules(data: ClinicianAssessment): FiredRule[] {
  const rules: FiredRule[] = [];

  const cfs = data.functionalCapacity.clinicalFrailtyScale;
  if (cfs !== null) {
    rules.push({
      ruleId: `R-CFS-${cfs}`,
      instrument: "frailty",
      grade: String(cfs),
      category: "functional",
      description: `Clinical Frailty Scale ${cfs}`,
    });
  }

  const { score: friedScore, category: friedCategory } =
    computeFriedPhenotypeScore(data);
  if (friedScore !== null) {
    rules.push({
      ruleId: `R-FRIED-${friedScore}`,
      instrument: "frailty",
      grade: friedCategory,
      category: "functional",
      description: `Fried Frailty Phenotype ${friedScore}/5 (${friedCategory})`,
    });
  }

  const rai = data.functionalCapacity.riskAnalysisIndexScore;
  if (rai !== null) {
    rules.push({
      ruleId: `R-RAI-${rai}`,
      instrument: "frailty",
      grade: String(rai),
      category: "functional",
      description: `Risk Analysis Index ${rai}`,
    });
  }

  return rules;
}
