//! Stress grader module.

// HSE Management Standards stress grader. Pure functions: given an
// `AssessmentData` object, return per-domain means + concern categories,
// and an overall risk equal to the worst-domain category.
//
// Reverse-scored items (negatively worded statements) are transformed via
// (6 - raw) before being averaged, so a higher domain mean is *always* a
// more favourable outcome.

use super::rules::{benchmark, item_value, stress_items, StressItem};
use super::types::{
    AssessmentData, DomainResult, DomainResults, FiredItem, GradingResult, RiskLevel,
};
use super::utils::{risk_level_rank, worse_risk};

/// Classify a domain mean against its HSE percentile cut-offs.
///
///   mean ≥ goodAt              → 'low'        concern (above 80th percentile)
///   moderateAt ≤ mean < good   → 'moderate'   (50th-80th)
///   highAt     ≤ mean < mod    → 'high'       (20th-50th)
///   mean < highAt              → 'very-high'  (below 20th percentile)
pub fn classify_domain_mean(domain_key: &str, mean: Option<f64>) -> RiskLevel {
    let Some(m) = mean else { return String::new(); };
    if !m.is_finite() {
        return String::new();
    }
    let Some(b) = benchmark(domain_key) else { return String::new(); };
    if m >= b.good_at {
        "low".to_string()
    } else if m >= b.moderate_at {
        "moderate".to_string()
    } else if m >= b.high_at {
        "high".to_string()
    } else {
        "very-high".to_string()
    }
}

/// Apply reverse-coding if needed.
fn effective_value(raw: i32, reverse_scored: bool) -> i32 {
    if reverse_scored { 6 - raw } else { raw }
}

/// Score a single domain. Returns the result and per-item audit rows.
pub fn grade_domain(
    data: &AssessmentData,
    domain_key: &str,
) -> (DomainResult, Vec<FiredItem>) {
    let mut fired: Vec<FiredItem> = Vec::new();
    let items: Vec<StressItem> = stress_items()
        .into_iter()
        .filter(|it| it.domain == domain_key)
        .collect();
    let total = items.len() as u32;

    let mut sum: i32 = 0;
    let mut answered: u32 = 0;

    for item in &items {
        let Some(raw) = item_value(data, item) else { continue };
        if !(1..=5).contains(&raw) {
            continue;
        }
        let eff = effective_value(raw, item.reverse_scored);
        sum += eff;
        answered += 1;
        fired.push(FiredItem {
            id: item.id.to_string(),
            domain: item.domain.to_string(),
            label: item.label.to_string(),
            raw_value: raw,
            effective_value: eff,
            reverse_scored: item.reverse_scored,
        });
    }

    let mean = if answered == 0 {
        None
    } else {
        let m = sum as f64 / answered as f64;
        Some((m * 100.0).round() / 100.0)
    };
    let category = match mean {
        None => String::new(),
        Some(_) => classify_domain_mean(domain_key, mean),
    };

    (
        DomainResult {
            mean,
            answered_count: answered,
            total_count: total,
            category,
        },
        fired,
    )
}

/// Grade the entire assessment. Computes per-domain means + categories
/// and the overall risk (worst category across the seven domains).
pub fn grade_stress(data: &AssessmentData) -> GradingResult {
    let (demands_r, demands_f) = grade_domain(data, "demands");
    let (control_r, control_f) = grade_domain(data, "control");
    let (ms_r, ms_f) = grade_domain(data, "managerSupport");
    let (ps_r, ps_f) = grade_domain(data, "peerSupport");
    let (rel_r, rel_f) = grade_domain(data, "relationships");
    let (role_r, role_f) = grade_domain(data, "role");
    let (chg_r, chg_f) = grade_domain(data, "change");

    let total_answered: u32 = demands_r.answered_count
        + control_r.answered_count
        + ms_r.answered_count
        + ps_r.answered_count
        + rel_r.answered_count
        + role_r.answered_count
        + chg_r.answered_count;

    let mut fired_rules: Vec<FiredItem> = Vec::new();
    fired_rules.extend(demands_f);
    fired_rules.extend(control_f);
    fired_rules.extend(ms_f);
    fired_rules.extend(ps_f);
    fired_rules.extend(rel_f);
    fired_rules.extend(role_f);
    fired_rules.extend(chg_f);

    let mut worst: RiskLevel = String::new();
    for c in [
        &demands_r.category,
        &control_r.category,
        &ms_r.category,
        &ps_r.category,
        &rel_r.category,
        &role_r.category,
        &chg_r.category,
    ] {
        if !c.is_empty() && risk_level_rank(c) > risk_level_rank(&worst) {
            worst = c.clone();
        }
    }
    // Defensive: keep `worse_risk` referenced (also acts as a documentation hook).
    let overall_risk: RiskLevel = if total_answered == 0 {
        String::new()
    } else {
        worse_risk(&String::new(), &worst)
    };

    let domains = DomainResults {
        demands: demands_r,
        control: control_r,
        manager_support: ms_r,
        peer_support: ps_r,
        relationships: rel_r,
        role: role_r,
        change: chg_r,
    };

    let additional_flags = super::flagged_issues::detect_additional_flags(data, &domains);
    let timestamp = chrono::Utc::now().to_rfc3339();

    GradingResult {
        domains,
        overall_risk,
        answered_count: total_answered,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
