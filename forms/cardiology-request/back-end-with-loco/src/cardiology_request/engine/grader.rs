//! The composite four-axis vetting engine.
//!
//! Ported from `front-end-with-svelte/src/lib/engine/grader.ts`. Pure: no side
//! effects, no network calls, no I/O.

use chrono::Utc;

use super::appropriateness_rules::grade_appropriateness;
use super::completeness_rules::grade_completeness;
use super::flagged_issues::detect_flags;
use super::safety_rules::grade_safety;
use super::triage_rules::grade_triage;
use super::types::{CardiologyRequest, FiredRule, GradingResult};

/// Compute the four-axis vetting grade for a cardiology referral request.
///
/// Axis A: referral appropriateness; Axis B: safety / red-flag; Axis C: request
/// completeness percent; Axis D: triage priority + target timeframe. Plus an
/// overall recommendation, the fired-rule audit trail (in firing order), and
/// safety flags.
///
/// Invariant: a red flag (suspected acute coronary syndrome, exertional
/// syncope, new-onset heart failure) drives Axis B to red-flag and
/// auto-escalates Axis D regardless of the other axes. The least-alarming band
/// is only chosen when no rule fires.
#[must_use]
pub fn calculate_grade(request: &CardiologyRequest) -> GradingResult {
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // Axis A
    let a = grade_appropriateness(request);
    fired_rules.extend(a.fired_rules);

    // Axis B
    let b = grade_safety(request);
    fired_rules.extend(b.fired_rules);

    // Axis C
    let c = grade_completeness(request);
    fired_rules.extend(c.fired_rules);

    // Axis D (depends on the safety band)
    let d = grade_triage(request, &b.safety_band);
    fired_rules.extend(d.fired_rules);

    let recommendation = derive_recommendation(
        &a.appropriateness_band,
        &b.safety_band,
        c.completeness_percent,
        &d.triage_tier,
    );

    let flags = detect_flags(request);

    GradingResult {
        appropriateness_band: a.appropriateness_band,
        safety_band: b.safety_band,
        completeness_percent: c.completeness_percent,
        triage_tier: d.triage_tier,
        target_timeframe: d.target_timeframe,
        recommendation,
        fired_rules,
        flags,
        graded_at: Utc::now().to_rfc3339(),
    }
}

/// Derive the overall vetting recommendation from the graded axes.
///
/// - reject: usually not appropriate and no red flag.
/// - redirect: may be appropriate elsewhere (service mismatch) and no red flag.
/// - query-referrer: a red flag or low completeness needs clarification (a true
///   emergency is still accepted onto the urgent pathway).
/// - accept: an appropriate, sufficiently complete referral.
#[must_use]
pub fn derive_recommendation(
    appropriateness: &str,
    safety: &str,
    completeness: i32,
    triage: &str,
) -> String {
    // An emergency is always accepted onto the acute pathway.
    if triage == "emergency" {
        return "accept".to_string();
    }

    if appropriateness == "usually-not-appropriate" && safety == "ok" {
        return "reject".to_string();
    }

    if appropriateness == "may-be-appropriate" && safety == "ok" && completeness < 60 {
        return "redirect".to_string();
    }

    // A red flag or a materially incomplete request needs clarification.
    if safety == "red-flag" && completeness < 70 {
        return "query-referrer".to_string();
    }
    if completeness < 50 {
        return "query-referrer".to_string();
    }
    if appropriateness == "may-be-appropriate" && completeness < 70 {
        return "query-referrer".to_string();
    }

    "accept".to_string()
}
