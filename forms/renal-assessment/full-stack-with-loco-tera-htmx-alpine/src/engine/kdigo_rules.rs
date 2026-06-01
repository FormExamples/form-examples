use super::types::AssessmentData;
use super::utils::{
    albuminuria_category_label, gfr_category_label, kdigo_composite_risk,
    resolve_albuminuria_category, resolve_gfr_category, risk_level_label,
};

/// A KDIGO classification rule. Each rule produces a single named
/// contribution to the report's audit trail.
pub struct KdigoRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub evaluate: fn(&AssessmentData) -> String,
}

/// All KDIGO classification rules. Rule IDs are preserved verbatim from the
/// JavaScript reference (`KDIGO-001` … `KDIGO-003`).
pub fn all_rules() -> Vec<KdigoRule> {
    vec![
        KdigoRule {
            id: "KDIGO-001",
            category: "GFR Category",
            description: "GFR stage derived from eGFR (mL/min/1.73 m^2).",
            evaluate: |d| {
                let g = resolve_gfr_category(d);
                if g.is_empty() {
                    String::new()
                } else {
                    gfr_category_label(&g)
                }
            },
        },
        KdigoRule {
            id: "KDIGO-002",
            category: "Albuminuria Category",
            description: "Albuminuria stage derived from urine ACR (mg/mmol).",
            evaluate: |d| {
                let a = resolve_albuminuria_category(d);
                if a.is_empty() {
                    String::new()
                } else {
                    albuminuria_category_label(&a)
                }
            },
        },
        KdigoRule {
            id: "KDIGO-003",
            category: "Composite Risk",
            description: "KDIGO composite risk from GFR x Albuminuria heatmap.",
            evaluate: |d| {
                let g = resolve_gfr_category(d);
                let a = resolve_albuminuria_category(d);
                let risk = kdigo_composite_risk(&g, &a);
                risk_level_label(&risk)
            },
        },
    ]
}
