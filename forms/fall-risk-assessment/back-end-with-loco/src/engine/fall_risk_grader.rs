//! Fall risk grader module.

// Fall Risk grader. Pure functions: take an `AssessmentData`, return the
// total Morse Fall Scale score (0..=125), the `Severity`, the list of
// fired item rules, and the Critical-override metadata.
//
// Severity cutoffs (raw MFS):
//   0..=24   -> low
//   25..=44  -> moderate
//   >=45     -> high
//
// Critical-override (raises the severity to "critical" regardless of raw
// MFS):
//   - recurrent falls with injury
//   - anticoagulated patient
//   - MFS >= 75

use super::flagged_issues::detect_additional_flags;
use super::mfs_rules::{
    MfsItem, has_recurrent_falls_with_injury, is_anticoagulated, mfs_items,
};
use super::types::{AssessmentData, FiredRule, GradingResult, Severity};

/// Classify a numeric MFS score (0..=125) into the base severity. The
/// Critical-override is applied separately by [`grade`].
pub fn classify_mfs_score(score: i32) -> Severity {
    if score >= 45 {
        "high".to_string()
    } else if score >= 25 {
        "moderate".to_string()
    } else {
        "low".to_string()
    }
}

/// Look up the option label corresponding to an MFS item's selected
/// score. Returns the empty string if no option matches.
fn mfs_option_label(item: &MfsItem, score: i32) -> &'static str {
    for opt in item.options {
        if opt.score == score {
            return opt.label;
        }
    }
    ""
}

/// Evaluate the six-item Morse Fall Scale against the supplied
/// assessment data and apply the Critical-override. Mirrors
/// `gradeFallRisk` in the JS front-end engine.
pub fn grade_fall_risk(data: &AssessmentData) -> (i32, Severity, bool, Vec<String>, u32, Vec<FiredRule>) {
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut mfs_score: i32 = 0;
    let mut answered_count: u32 = 0;

    for item in mfs_items() {
        if let Some(value) = (item.field_get)(&data.mfs) {
            answered_count += 1;
            mfs_score += value;
            let label = mfs_option_label(&item, value);
            let description = if label.is_empty() {
                item.description.to_string()
            } else {
                label.to_string()
            };
            fired_rules.push(FiredRule {
                id: item.id.to_string(),
                category: item.label.to_string(),
                description,
                score: value,
            });
        }
    }

    let base_severity = classify_mfs_score(mfs_score);

    let mut critical_reasons: Vec<String> = Vec::new();
    if has_recurrent_falls_with_injury(data) {
        critical_reasons.push("Recurrent falls with injury".to_string());
    }
    if is_anticoagulated(data) {
        critical_reasons.push("Anticoagulated patient".to_string());
    }
    if mfs_score >= 75 {
        critical_reasons.push(format!("MFS {mfs_score} (>= 75)"));
    }

    let critical_override = !critical_reasons.is_empty();
    let severity = if critical_override {
        "critical".to_string()
    } else {
        base_severity
    };

    (mfs_score, severity, critical_override, critical_reasons, answered_count, fired_rules)
}

/// Run the grader and bundle the flag-detection output into a
/// [`GradingResult`] with an ISO-8601 timestamp. This is the public
/// entry point used by the controllers.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let (mfs_score, severity, critical_override, critical_reasons, answered_count, fired_rules) =
        grade_fall_risk(data);
    let additional_flags = detect_additional_flags(data);
    GradingResult {
        mfs_score,
        severity,
        critical_override,
        critical_reasons,
        answered_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
