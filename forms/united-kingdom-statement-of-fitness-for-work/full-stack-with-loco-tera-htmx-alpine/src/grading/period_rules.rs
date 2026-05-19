//! Period compliance rules. DWP thresholds:
//!
//! - `< 7 days`   → `self_cert_range` (fit note not required)
//! - `> 180 days` → `very_long_term`
//! - `> 90 days` AND within first 6 months of condition → `exceeds_initial_max`
//! - `> 28 days` → `long_term`
//! - otherwise   → `compliant`
//!
//! Two flags are also computed: `long_absence_four_weeks` (> 28 days)
//! and `long_absence_twelve_weeks` (> 84 days).

use crate::grading::types::{FiredRule, FitNote, SafetyFlag};
use crate::grading::utils::{classify_first_six_months, compute_period_days};

pub fn classify_period(days: Option<i64>, within_first_six_months: bool) -> String {
    match days {
        None => String::new(),
        Some(d) if d < 7 => "self_cert_range".into(),
        Some(d) if d > 180 => "very_long_term".into(),
        Some(d) if d > 90 && within_first_six_months => "exceeds_initial_max".into(),
        Some(d) if d > 28 => "long_term".into(),
        _ => "compliant".into(),
    }
}

/// Returns `(period_days, period_compliance, within_first_six_months)`.
pub fn evaluate(
    fit_note: &FitNote,
    fired: &mut Vec<FiredRule>,
    flags: &mut Vec<SafetyFlag>,
) -> (Option<i64>, String, String) {
    let period_days = compute_period_days(fit_note);
    let within = classify_first_six_months(fit_note);
    let compliance = classify_period(period_days, within == "yes");

    if !compliance.is_empty() {
        let severity = match compliance.as_str() {
            "exceeds_initial_max" => "high",
            "very_long_term" => "medium",
            _ => "low",
        }
        .to_string();
        fired.push(FiredRule {
            rule_id: format!(
                "R-PERIOD-{}-001",
                compliance.to_uppercase().replace('_', "-")
            ),
            rule_set: "period".into(),
            severity,
            description: format!(
                "Period = {} days → {}",
                period_days
                    .map(|d| d.to_string())
                    .unwrap_or_else(|| "null".into()),
                compliance
            ),
        });
    }

    if compliance == "exceeds_initial_max" {
        flags.push(SafetyFlag {
            flag_id: "F-PERIOD-MAX".into(),
            category: "duration_exceeds_3_months_in_first_6_months".into(),
            priority: "high".into(),
            description:
                "Period exceeds the 3-month maximum allowed in the first six months of the condition."
                    .into(),
            suggested_action:
                "Reduce period to ≤ 3 months or document why the rule does not apply.".into(),
        });
    }
    if compliance == "self_cert_range" {
        flags.push(SafetyFlag {
            flag_id: "F-SELF-CERT".into(),
            category: "self_cert_range".into(),
            priority: "low".into(),
            description: "Absence is < 7 days; a fit note is not required.".into(),
            suggested_action:
                "Recommend self-certification (employee statement of sickness).".into(),
        });
    }
    if let Some(d) = period_days {
        if d > 28 {
            flags.push(SafetyFlag {
                flag_id: "F-4W".into(),
                category: "long_absence_four_weeks".into(),
                priority: "low".into(),
                description: "Absence > 4 weeks — consider Access to Work referral.".into(),
                suggested_action:
                    "Signpost the patient to Access to Work and the Health Adjustment Passport."
                        .into(),
            });
        }
        if d > 84 {
            flags.push(SafetyFlag {
                flag_id: "F-12W".into(),
                category: "long_absence_twelve_weeks".into(),
                priority: "medium".into(),
                description: "Absence > 12 weeks — review SSP entitlement.".into(),
                suggested_action:
                    "Discuss SSP, ESA, or Universal Credit eligibility with the patient.".into(),
            });
        }
    }

    (period_days, compliance, within)
}
