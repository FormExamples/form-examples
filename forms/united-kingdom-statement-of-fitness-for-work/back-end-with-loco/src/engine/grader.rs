//! Top-level `grade_fit_note` entry point. Composes the validity,
//! adaptation, period, and safety rule sets and reduces the result to an
//! overall recommendation.

use crate::engine::types::{AssessmentData, Grade};
use crate::engine::{adaptation_rules, period_rules, safety_flag_rules, validity_rules};

pub fn grade_fit_note(fit_note: &AssessmentData) -> Grade {
    let mut fired_rules = Vec::new();
    let mut safety_flags = Vec::new();

    validity_rules::evaluate(fit_note, &mut fired_rules, &mut safety_flags);
    let is_valid = validity_rules::is_valid(&fired_rules);

    let (adaptation_intensity, adaptation_count) =
        adaptation_rules::evaluate(fit_note, &mut fired_rules, &mut safety_flags);

    let (period_days, period_compliance, within_first_six_months) =
        period_rules::evaluate(fit_note, &mut fired_rules, &mut safety_flags);

    safety_flag_rules::evaluate(fit_note, &mut fired_rules, &mut safety_flags);

    // ─── Recommendation ladder ────────────────────────────────
    let recommendation = if !is_valid {
        "review_for_validity".to_string()
    } else if safety_flags
        .iter()
        .any(|f| f.category == "automatic_disability")
        || period_compliance == "very_long_term"
    {
        "refer_access_to_work".into()
    } else if adaptation_intensity == "substantial"
        || adaptation_intensity == "comprehensive"
        || period_compliance == "long_term"
    {
        "refer_occupational_health".into()
    } else if matches!(period_days, Some(d) if d >= 84) && fit_note.fitness_for_work == "not_fit" {
        "refer_employment_advisor".into()
    } else {
        "standard".into()
    };

    let timestamp = chrono::Utc::now().to_rfc3339();

    Grade {
        fitness_category: fit_note.fitness_for_work.clone(),
        adaptation_intensity,
        adaptation_count,
        period_days,
        period_compliance,
        is_within_first_six_months_of_condition: within_first_six_months,
        is_valid: if is_valid { "yes".into() } else { "no".into() },
        recommendation,
        fired_rules,
        safety_flags,
        timestamp,
    }
}
