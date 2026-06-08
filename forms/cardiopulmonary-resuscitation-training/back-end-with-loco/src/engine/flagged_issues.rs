//! Detection of additional flagged issues.

use std::collections::BTreeMap;

use super::types::{AdditionalFlag, AssessmentData, FiredRule};
use super::utils::{
    COMPRESSION_DEPTH_MAX, COMPRESSION_DEPTH_MIN, COMPRESSION_RATE_MAX, COMPRESSION_RATE_MIN,
    SLOW_AED_SECONDS, compression_depth_in_range, compression_rate_in_range, date_is_past,
};

/// Build the prioritised list of flagged issues for the examiner report.
///
/// Flag catalogue:
/// - FLAG-CRIT-<rule>       — high   — each critical-action failure
/// - FLAG-CERT-EXPIRED      — high   — prior certification expiry in the past
/// - FLAG-MULTI-DEF         — medium / high — multiple non-critical deficiencies
/// - FLAG-DOMAIN-<category> — high   — 2+ deficiencies in same domain
/// - FLAG-CC-RATE-RANGE     — medium — measured rate outside AHA range
/// - FLAG-CC-DEPTH-RANGE    — medium — measured depth outside AHA range
/// - FLAG-CC-HESITATE-DEPTH — medium — hesitation in compression depth
/// - FLAG-AED-SLOW          — medium — time to first shock > 90 s
/// - FLAG-IMPROVE-<rule>    — low    — single non-critical deficiency
/// - FLAG-DEBRIEF-EXAMINER  — low    — examiner notes captured
/// - FLAG-DEBRIEF-TRAINEE   — low    — trainee feedback captured
pub fn detect_additional_flags(
    data: &AssessmentData,
    critical_failures: &[FiredRule],
    non_critical_deficiencies: &[FiredRule],
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // ─── HIGH: critical-action failures with the specific reason ──────────
    for rule in critical_failures {
        flags.push(AdditionalFlag {
            id: format!("FLAG-CRIT-{}", rule.id),
            category: format!("Critical action \u{2014} {}", rule.category),
            message: format!("Critical-action failure: {}", rule.description),
            priority: "high".to_string(),
        });
    }

    // ─── HIGH: prior certification expired ────────────────────────────────
    let expiry = data.trainee_details.prior_certification_expiry.trim();
    if !expiry.is_empty() && date_is_past(expiry) {
        flags.push(AdditionalFlag {
            id: "FLAG-CERT-EXPIRED".to_string(),
            category: "Trainee Details".to_string(),
            message: format!(
                "Prior certification expired on {expiry} \u{2014} recertification required."
            ),
            priority: "high".to_string(),
        });
    }

    // ─── Multiple non-critical deficiencies (medium or high) ──────────────
    let nc_len = non_critical_deficiencies.len();
    if nc_len >= 2 {
        let priority = if nc_len > 2 { "high" } else { "medium" };
        flags.push(AdditionalFlag {
            id: "FLAG-MULTI-DEF".to_string(),
            category: "Performance".to_string(),
            message: format!(
                "{nc_len} non-critical deficiencies recorded \u{2014} additional coaching recommended."
            ),
            priority: priority.to_string(),
        });
    }

    // ─── HIGH: same domain has multiple deficiencies ──────────────────────
    let mut by_category: BTreeMap<String, Vec<&FiredRule>> = BTreeMap::new();
    for rule in non_critical_deficiencies {
        by_category.entry(rule.category.clone()).or_default().push(rule);
    }
    for (category, rules) in &by_category {
        if rules.len() >= 2 {
            let slug: String = category
                .chars()
                .map(|c| {
                    if c.is_whitespace() {
                        '-'
                    } else {
                        c.to_ascii_uppercase()
                    }
                })
                .collect();
            flags.push(AdditionalFlag {
                id: format!("FLAG-DOMAIN-{slug}"),
                category: format!("Domain weakness \u{2014} {category}"),
                message: format!(
                    "{} deficiencies clustered in {category}; targeted remediation suggested.",
                    rules.len()
                ),
                priority: "high".to_string(),
            });
        }
    }

    // ─── MEDIUM: numeric measurement out of AHA range ─────────────────────
    if let Some(rate) = data.chest_compressions.compression_rate {
        if !compression_rate_in_range(rate) {
            flags.push(AdditionalFlag {
                id: "FLAG-CC-RATE-RANGE".to_string(),
                category: "Chest Compressions".to_string(),
                message: format!(
                    "Measured compression rate {rate}/min outside AHA target {COMPRESSION_RATE_MIN}-{COMPRESSION_RATE_MAX}/min."
                ),
                priority: "medium".to_string(),
            });
        }
    }
    if let Some(depth) = data.chest_compressions.compression_depth {
        if !compression_depth_in_range(depth) {
            flags.push(AdditionalFlag {
                id: "FLAG-CC-DEPTH-RANGE".to_string(),
                category: "Chest Compressions".to_string(),
                message: format!(
                    "Measured compression depth {depth} cm outside AHA target {COMPRESSION_DEPTH_MIN}-{COMPRESSION_DEPTH_MAX} cm."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── MEDIUM: hesitation in compression depth ──────────────────────────
    let depth_too_shallow = data
        .chest_compressions
        .compression_depth
        .map(|d| d < COMPRESSION_DEPTH_MIN)
        .unwrap_or(false);
    if data.chest_compressions.compressions_at_correct_depth == "no" || depth_too_shallow {
        flags.push(AdditionalFlag {
            id: "FLAG-CC-HESITATE-DEPTH".to_string(),
            category: "Chest Compressions".to_string(),
            message: "Hesitation observed in compression depth \u{2014} coach to push harder (5-6 cm).".to_string(),
            priority: "medium".to_string(),
        });
    }

    // ─── MEDIUM: slow time to first AED shock ─────────────────────────────
    if let Some(shock_time) = data.aed_shock_delivery.time_to_first_shock_seconds {
        if shock_time > SLOW_AED_SECONDS {
            flags.push(AdditionalFlag {
                id: "FLAG-AED-SLOW".to_string(),
                category: "AED Use".to_string(),
                message: format!(
                    "Time to first shock {shock_time} s exceeds {SLOW_AED_SECONDS} s \u{2014} practice rapid AED retrieval and pad placement."
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // ─── LOW: single non-critical deficiency ──────────────────────────────
    if nc_len == 1 {
        let only = &non_critical_deficiencies[0];
        flags.push(AdditionalFlag {
            id: format!("FLAG-IMPROVE-{}", only.id),
            category: format!("Improvement area \u{2014} {}", only.category),
            message: format!("Room for improvement: {}", only.description),
            priority: "low".to_string(),
        });
    }

    // ─── LOW: debrief / examiner notes captured for the record ────────────
    if !data.team_dynamics_handoff.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DEBRIEF-EXAMINER".to_string(),
            category: "Debrief".to_string(),
            message: "Examiner notes recorded \u{2014} review with trainee during debrief.".to_string(),
            priority: "low".to_string(),
        });
    }
    if !data.team_dynamics_handoff.trainee_feedback.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DEBRIEF-TRAINEE".to_string(),
            category: "Debrief".to_string(),
            message: "Trainee self-feedback captured \u{2014} incorporate into improvement plan.".to_string(),
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
