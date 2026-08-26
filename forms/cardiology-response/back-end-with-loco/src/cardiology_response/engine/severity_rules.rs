//! Axis B — condition severity & structured-finding category.
//!
//! Severity ladder (none → minor → moderate → major), grounded in NICE NG106
//! (chronic heart failure) and the 2021 ESC/EACTS valvular heart disease
//! guidelines:
//! - major: a critical result, severe valve disease, significant arrhythmia, or
//!   reduced ejection fraction (`HFrEF`; LVEF < 40 %).
//! - moderate: any other structured cardiac finding (ischaemia/CAD, structural
//!   abnormality, uncontrolled hypertension).
//! - minor: a mild reduction in ejection fraction (40–49 %, `HFmrEF`) with no
//!   other finding.
//! - none: no structured cardiac finding.

use super::types::{CardiologyResponse, FiredRule, ResponseClassification, Severity};
use super::utils::{
    has_any_cardiac_finding, has_critical_finding, has_reduced_ejection_fraction,
};

/// Grade severity, returning the level, the structured-finding category, and
/// the fired rules.
#[must_use]
#[allow(clippy::too_many_lines)] // linear clinical rule list; splitting adds indirection, not clarity
pub fn grade_severity(
    r: &CardiologyResponse,
    classification: &ResponseClassification,
) -> (Severity, String, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    if has_critical_finding(r) {
        fired_rules.push(FiredRule {
            rule_id: "R-SEVERITY-MAJOR-01".to_string(),
            axis: "severity".to_string(),
            category: "critical-finding".to_string(),
            description: "Critical result present; condition severity graded major.".to_string(),
        });
        return ("major".to_string(), "critical-cardiac".to_string(), fired_rules);
    }

    if r.significant_valve_disease {
        fired_rules.push(FiredRule {
            rule_id: "R-SEVERITY-MAJOR-02".to_string(),
            axis: "severity".to_string(),
            category: "severe-valve-disease".to_string(),
            description: "Significant valve disease present; condition severity graded major."
                .to_string(),
        });
        return ("major".to_string(), "valve-disease".to_string(), fired_rules);
    }

    if has_reduced_ejection_fraction(r) {
        fired_rules.push(FiredRule {
            rule_id: "R-SEVERITY-MAJOR-03".to_string(),
            axis: "severity".to_string(),
            category: "reduced-ejection-fraction".to_string(),
            description:
                "Reduced left-ventricular ejection fraction (HFrEF); condition severity graded major."
                    .to_string(),
        });
        return (
            "major".to_string(),
            "reduced-ejection-fraction".to_string(),
            fired_rules,
        );
    }

    if r.significant_arrhythmia {
        fired_rules.push(FiredRule {
            rule_id: "R-SEVERITY-MAJOR-04".to_string(),
            axis: "severity".to_string(),
            category: "significant-arrhythmia".to_string(),
            description: "Significant arrhythmia present; condition severity graded major."
                .to_string(),
        });
        return ("major".to_string(), "arrhythmia".to_string(), fired_rules);
    }

    // Mildly reduced ejection fraction (HFmrEF; 40–49 %) with no other finding.
    let mildly_reduced_ef = matches!(
        r.lv_ejection_fraction_percent,
        Some(ef) if (40.0..50.0).contains(&ef)
    );

    if r.ischaemia_or_cad || r.structural_abnormality || r.uncontrolled_hypertension {
        let category = if r.ischaemia_or_cad {
            "ischaemia-cad"
        } else if r.structural_abnormality {
            "structural-abnormality"
        } else {
            "uncontrolled-hypertension"
        };
        fired_rules.push(FiredRule {
            rule_id: "R-SEVERITY-MODERATE-01".to_string(),
            axis: "severity".to_string(),
            category: category.to_string(),
            description:
                "A structured cardiac finding (ischaemia/CAD, structural abnormality, or uncontrolled hypertension) is present; severity graded moderate."
                    .to_string(),
        });
        return ("moderate".to_string(), category.to_string(), fired_rules);
    }

    if mildly_reduced_ef {
        fired_rules.push(FiredRule {
            rule_id: "R-SEVERITY-MINOR-01".to_string(),
            axis: "severity".to_string(),
            category: "mildly-reduced-ejection-fraction".to_string(),
            description:
                "Mildly reduced left-ventricular ejection fraction (HFmrEF, 40–49 %); severity graded minor."
                    .to_string(),
        });
        return (
            "minor".to_string(),
            "mildly-reduced-ejection-fraction".to_string(),
            fired_rules,
        );
    }

    if classification == "inconclusive" {
        fired_rules.push(FiredRule {
            rule_id: "R-SEVERITY-NONE-02".to_string(),
            axis: "severity".to_string(),
            category: "inconclusive".to_string(),
            description: "Inconclusive response; condition severity not established.".to_string(),
        });
        return ("none".to_string(), "indeterminate".to_string(), fired_rules);
    }

    // Defensive: no finding but somehow flagged as a cardiac condition.
    if has_any_cardiac_finding(r) {
        fired_rules.push(FiredRule {
            rule_id: "R-SEVERITY-MODERATE-02".to_string(),
            axis: "severity".to_string(),
            category: "cardiac-finding".to_string(),
            description: "A structured cardiac finding is present; severity graded moderate."
                .to_string(),
        });
        return ("moderate".to_string(), "cardiac-finding".to_string(), fired_rules);
    }

    fired_rules.push(FiredRule {
        rule_id: "R-SEVERITY-NONE-01".to_string(),
        axis: "severity".to_string(),
        category: "no-finding".to_string(),
        description: "No structured cardiac finding; condition severity graded none.".to_string(),
    });
    ("none".to_string(), "no-abnormality".to_string(), fired_rules)
}
