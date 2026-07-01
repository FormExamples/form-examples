//! Axis C — response completeness.
//!
//! Returns the percentage (0–100, rounded) of mandatory response sections that
//! are present, plus an audit-trail rule for each missing section. The five
//! mandatory sections per the NHS e-Referral advice-and-guidance /
//! counter-referral model are: clinical summary, examination, diagnosis,
//! management plan, and recommended follow-up.

use super::types::{CardiologyResponse, FiredRule};

struct SectionCheck {
    rule_id: &'static str,
    category: &'static str,
    label: &'static str,
    present: fn(&CardiologyResponse) -> bool,
}

const SECTIONS: &[SectionCheck] = &[
    SectionCheck {
        rule_id: "R-COMP-SUMMARY-01",
        category: "summary",
        label: "clinical summary",
        present: |r| !r.clinical_summary.trim().is_empty(),
    },
    SectionCheck {
        rule_id: "R-COMP-EXAMINATION-01",
        category: "examination",
        label: "examination findings",
        present: |r| !r.examination_findings.trim().is_empty(),
    },
    SectionCheck {
        rule_id: "R-COMP-DIAGNOSIS-01",
        category: "diagnosis",
        label: "diagnosis",
        present: |r| !r.primary_diagnosis_category.is_empty() || !r.diagnosis_narrative.trim().is_empty(),
    },
    SectionCheck {
        rule_id: "R-COMP-MANAGEMENT-01",
        category: "management",
        label: "management plan",
        present: |r| !r.management_plan.trim().is_empty(),
    },
    SectionCheck {
        rule_id: "R-COMP-FOLLOWUP-01",
        category: "follow-up",
        label: "recommended follow-up",
        present: |r| !r.recommended_follow_up.trim().is_empty(),
    },
];

/// Grade completeness, returning the percent and the fired rules (one per
/// missing section).
pub fn grade_completeness(r: &CardiologyResponse) -> (i32, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut present_count = 0_i32;

    for section in SECTIONS {
        if (section.present)(r) {
            present_count += 1;
        } else {
            fired_rules.push(FiredRule {
                rule_id: section.rule_id.to_string(),
                axis: "completeness".to_string(),
                category: section.category.to_string(),
                description: format!("Mandatory response section missing: {}.", section.label),
            });
        }
    }

    let total = SECTIONS.len() as f64;
    let completeness_percent = ((f64::from(present_count) / total) * 100.0).round() as i32;
    (completeness_percent, fired_rules)
}
