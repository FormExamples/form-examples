//! Detection of additional flagged issues.

use std::collections::BTreeMap;

use super::psychomotor_grader::GradingForFlags;
use super::types::{AdditionalFlag, AssessmentData, FiredRule, PASS_PERCENT_THRESHOLD};

/// "Multiple non-critical deficiencies overall" threshold.
pub const MULTI_DEF_THRESHOLD: usize = 3;

/// "Primary survey appears slow / incomplete" threshold.
pub const PRIMARY_SURVEY_INCOMPLETE_THRESHOLD: usize = 2;

/// Build the prioritised list of flagged issues for the examiner report.
/// Mirrors `flagged-issues.js`.
pub fn detect_additional_flags(
    data: &AssessmentData,
    grading: &GradingForFlags,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // Non-critical deficiencies (status === "no" AND not critical).
    let non_critical_deficiencies: Vec<&FiredRule> = grading
        .fired_rules
        .iter()
        .filter(|r| r.status == "no" && !r.critical)
        .collect();

    // ─── High: each critical-criterion failure ──────────────────────
    for rule in &grading.critical_failures {
        flags.push(AdditionalFlag {
            id: format!("FLAG-CRIT-{}", rule.id),
            category: format!("Critical criterion — {}", rule.category),
            message: format!("Critical-criterion failure: {}", rule.description),
            priority: "high".to_string(),
        });
    }

    // ─── High: domain weakness (>=2 non-critical deficiencies in cat) ──
    let mut by_category: BTreeMap<&str, Vec<&FiredRule>> = BTreeMap::new();
    for rule in &non_critical_deficiencies {
        by_category.entry(rule.category.as_str()).or_default().push(rule);
    }
    for (category, rules) in &by_category {
        if rules.len() >= 2 {
            flags.push(AdditionalFlag {
                id: format!("FLAG-DOMAIN-{}", category.replace(' ', "-").to_uppercase()),
                category: format!("Domain weakness — {category}"),
                message: format!(
                    "{} deficiencies clustered in {}; targeted remediation suggested.",
                    rules.len(),
                    category
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── High: primary survey skipped ───────────────────────────────
    let ps_impression = grading.fired_rules.iter().find(|r| r.id == "EMT-PS-IMPRESSION");
    let ps_mental = grading.fired_rules.iter().find(|r| r.id == "EMT-PS-MENTAL");
    if let Some(r) = ps_impression {
        if r.status == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-PS-IMPRESSION".to_string(),
                category: "Primary Survey".to_string(),
                message: "No general impression verbalized — coach candidate to \"size up\" the patient before approaching.".to_string(),
                priority: "high".to_string(),
            });
        }
    }
    if let Some(r) = ps_mental {
        if r.status == "no" {
            flags.push(AdditionalFlag {
                id: "FLAG-PS-MENTAL".to_string(),
                category: "Primary Survey".to_string(),
                message: "Mental status (AVPU) not assessed — must be performed early in the primary survey.".to_string(),
                priority: "high".to_string(),
            });
        }
    }

    // ─── Medium: primary survey slow / incomplete ───────────────────
    let ps_deficits: Vec<&&FiredRule> = non_critical_deficiencies
        .iter()
        .filter(|r| r.step == 3)
        .collect();
    if ps_deficits.len() >= PRIMARY_SURVEY_INCOMPLETE_THRESHOLD {
        flags.push(AdditionalFlag {
            id: "FLAG-PS-INCOMPLETE".to_string(),
            category: "Primary Survey".to_string(),
            message: format!(
                "Primary survey appears incomplete: {} deficiencies in this section.",
                ps_deficits.len()
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: missed reassessment block ──────────────────────────
    let repeat_vitals = grading.fired_rules.iter().find(|r| r.id == "EMT-RA-VITALS");
    let repeat_focused = grading.fired_rules.iter().find(|r| r.id == "EMT-RA-FOCUSED");
    let rea_deficits: Vec<&&FiredRule> = non_critical_deficiencies
        .iter()
        .filter(|r| r.step == 5)
        .collect();

    let vitals_missed = repeat_vitals.map(|r| r.status == "no").unwrap_or(false);
    let focused_missed = repeat_focused.map(|r| r.status == "no").unwrap_or(false);
    if vitals_missed && focused_missed {
        flags.push(AdditionalFlag {
            id: "FLAG-RA-MISSED".to_string(),
            category: "Reassessment".to_string(),
            message: "Both reassessment of vitals and focused exam were missed — practice ongoing reassessment cadence.".to_string(),
            priority: "medium".to_string(),
        });
    } else if rea_deficits.len() >= 3 {
        flags.push(AdditionalFlag {
            id: "FLAG-RA-WEAK".to_string(),
            category: "Reassessment".to_string(),
            message: format!(
                "{} reassessment deficiencies — coach candidate to reassess every 5 minutes en route.",
                rea_deficits.len()
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: total non-critical deficiencies overall ────────────
    if non_critical_deficiencies.len() >= MULTI_DEF_THRESHOLD {
        flags.push(AdditionalFlag {
            id: "FLAG-MULTI-DEF".to_string(),
            category: "Performance".to_string(),
            message: format!(
                "{} non-critical deficiencies recorded — overall performance below station standard.",
                non_critical_deficiencies.len()
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Medium: below pass threshold even with no critical failure ──
    if grading.critical_failures.is_empty()
        && grading.max_points > 0
        && grading.percent < PASS_PERCENT_THRESHOLD
    {
        flags.push(AdditionalFlag {
            id: "FLAG-BELOW-THRESHOLD".to_string(),
            category: "Score".to_string(),
            message: format!(
                "{} of {} points ({:.0}%) — below the {:.0}% pass threshold.",
                grading.points, grading.max_points, grading.percent, PASS_PERCENT_THRESHOLD
            ),
            priority: "medium".to_string(),
        });
    }

    // ─── Low: single non-critical deficiency = improvement area ─────
    if non_critical_deficiencies.len() == 1 {
        let r = non_critical_deficiencies[0];
        flags.push(AdditionalFlag {
            id: format!("FLAG-IMPROVE-{}", r.id),
            category: format!("Improvement area — {}", r.category),
            message: format!("Room for improvement: {}", r.description),
            priority: "low".to_string(),
        });
    }

    // ─── Low: two non-critical deficiencies (pair) ──────────────────
    if non_critical_deficiencies.len() == 2 {
        flags.push(AdditionalFlag {
            id: "FLAG-IMPROVE-PAIR".to_string(),
            category: "Improvement areas".to_string(),
            message: "Two non-critical deficiencies — review with candidate during debrief.".to_string(),
            priority: "low".to_string(),
        });
    }

    // ─── Low: examiner / debrief notes captured ─────────────────────
    let ccr = &data.critical_criteria_review;
    if !ccr.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NOTE-EXAMINER".to_string(),
            category: "Debrief".to_string(),
            message: "Examiner notes recorded — review with candidate during debrief.".to_string(),
            priority: "low".to_string(),
        });
    }
    if !ccr.debrief_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-NOTE-DEBRIEF".to_string(),
            category: "Debrief".to_string(),
            message: "Debrief notes captured — incorporate into improvement plan.".to_string(),
            priority: "low".to_string(),
        });
    }

    // Sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
