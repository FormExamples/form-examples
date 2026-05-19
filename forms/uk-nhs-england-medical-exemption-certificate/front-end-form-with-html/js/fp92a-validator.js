/**
 * FP92A — eligibility validator.
 *
 * Consumes the form data, runs the rule and flag sets, and returns the
 * computed outcome with validity period, fired rules, and advisory flags.
 */

(function (root) {
  const Fp92aForm = root.Fp92aForm || (root.Fp92aForm = {});

  function isoPlusYears(iso, years) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.valueOf())) return "";
    d.setFullYear(d.getFullYear() + years);
    return d.toISOString().slice(0, 10);
  }

  function evaluateFp92a(data) {
    const rules = Fp92aForm.RULES || [];
    const flags = Fp92aForm.FLAGS || [];

    const firedRules = rules
      .filter((r) => {
        try { return !!r.fires(data); } catch { return false; }
      })
      .map((r) => ({
        ruleId: r.id, category: r.category,
        severity: r.severity, description: r.description,
      }));

    const firedRuleIds = firedRules.map((r) => r.ruleId);

    const additionalFlags = flags
      .filter((f) => {
        try { return !!f.fires(data, firedRuleIds); } catch { return false; }
      })
      .map((f) => ({
        flagId: f.id, category: f.category,
        priority: f.priority, description: f.description,
      }));

    const eligibleConditions = firedRules
      .filter((r) => r.category === "eligible-condition")
      .map((r) => r.ruleId.replace("fp92a.rule.condition.", ""));

    const hasDisqualifier = firedRules.some((r) => r.category === "disqualifying");
    const hasRedirect = firedRules.some((r) => r.category === "redirect");
    const cancerPending = firedRuleIds.includes("fp92a.rule.clarification.cancer-histology");

    let outcome;
    let redirectTo = "";
    if (hasRedirect && firedRuleIds.includes("fp92a.rule.redirect.fw8-pregnancy")) {
      redirectTo = "FW8";
    } else if (hasRedirect && firedRuleIds.includes("fp92a.rule.redirect.age-exemption")) {
      redirectTo = "age-exemption";
    }

    if (cancerPending) {
      outcome = "requires-clarification";
    } else if (eligibleConditions.length === 0 || hasDisqualifier) {
      outcome = "ineligible";
    } else if (hasRedirect) {
      outcome = "ineligible";
    } else {
      outcome = "eligible";
    }

    const validFrom = data.completedDate || new Date().toISOString().slice(0, 10);
    const validUntil = outcome === "eligible" ? isoPlusYears(validFrom, 5) : "";

    return {
      outcome,
      eligibleConditions,
      firedRules,
      additionalFlags,
      validFrom,
      validUntil,
      redirectTo,
    };
  }

  Fp92aForm.evaluateFp92a = evaluateFp92a;
})(window);
