//! Adaptation classification rules. Only fires when the clinician selects
//! `fitness_for_work = may_be_fit`. Counts the four adaptation tick boxes
//! and classifies the intensity. DWP policy 5.6 also requires advice in
//! the comments box when "may be fit" is selected.

use crate::grading::types::{FiredRule, FitNote, SafetyFlag};
use crate::grading::utils::count_adaptations;

/// Map an adaptation count (0..=4) to its policy intensity label.
pub fn classify_adaptation(count: u32) -> String {
    match count {
        0 => "none".into(),
        1 => "light".into(),
        2 => "moderate".into(),
        3 => "substantial".into(),
        4 => "comprehensive".into(),
        _ => String::new(),
    }
}

/// Returns (intensity, count). The fired rules and flags are pushed
/// into the caller's accumulators.
pub fn evaluate(
    fit_note: &FitNote,
    fired: &mut Vec<FiredRule>,
    flags: &mut Vec<SafetyFlag>,
) -> (String, u32) {
    let count = count_adaptations(fit_note);
    let mut intensity = String::new();

    if fit_note.fitness_for_work == "may_be_fit" {
        intensity = classify_adaptation(count);
        fired.push(FiredRule {
            rule_id: format!("R-ADAPT-{}-001", intensity.to_uppercase()),
            rule_set: "adaptation".into(),
            severity: if count >= 3 { "medium".into() } else { "low".into() },
            description: format!(
                "Adaptation count = {count} → intensity {intensity}."
            ),
        });
        if count == 0 {
            flags.push(SafetyFlag {
                flag_id: "F-ADAPT-NONE".into(),
                category: "may_be_fit_no_adaptations".into(),
                priority: "medium".into(),
                description: r#""May be fit" selected but no adaptations chosen."#.into(),
                suggested_action:
                    r#"Tick at least one adaptation or change the fitness selection to "not fit"."#
                        .into(),
            });
        }
        if fit_note.comments.is_empty() {
            fired.push(FiredRule {
                rule_id: "R-ADAPT-COMMENT-001".into(),
                rule_set: "adaptation".into(),
                severity: "medium".into(),
                description:
                    r#"Comments box empty when "may be fit" selected (DWP policy 5.6)."#.into(),
            });
            flags.push(SafetyFlag {
                flag_id: "F-NO-COMMENTS".into(),
                category: "may_be_fit_no_comments".into(),
                priority: "medium".into(),
                description: "Comments box is empty.".into(),
                suggested_action:
                    "Provide practical advice about what the patient can do at work.".into(),
            });
        }
    }

    (intensity, count)
}
