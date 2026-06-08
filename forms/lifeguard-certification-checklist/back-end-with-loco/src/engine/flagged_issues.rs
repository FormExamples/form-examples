//! Detection of additional flagged issues.

// Prioritised flag detection for the Lifeguard Competency Verification report.
//
//   high   — any critical-competency failure (with reason), expired prior
//            certification, multiple deficiencies in one domain, 50 m swim
//            beyond NPLQ target, more than 3 deficiencies
//   medium — multiple non-critical deficiencies, slow physical fitness
//            measurement, hesitation in compression depth, slow time to
//            first AED shock, single critical numeric out of range,
//            surface dive depth shallow, 200 m swim slow
//   low    — single improvement area, examiner / candidate notes captured

use std::collections::BTreeMap;

use super::types::{AdditionalFlag, AssessmentData, FiredRule};
use super::utils::{
    COMPRESSION_DEPTH_MAX, COMPRESSION_DEPTH_MIN, COMPRESSION_RATE_MAX, COMPRESSION_RATE_MIN,
    SLOW_AED_SECONDS, SURFACE_DIVE_MIN_METRES, SWIM_50M_MAX_SECONDS, SWIM_200M_MAX_SECONDS,
    compression_depth_in_range, compression_rate_in_range, surface_dive_depth_adequate,
    swim50m_within_target, swim200m_within_target,
};

/// Format a numeric value omitting a trailing ".0" so "60" prints instead of "60.0".
fn fmt_num(v: f64) -> String {
    if v.fract() == 0.0 {
        format!("{}", v as i64)
    } else {
        format!("{}", v)
    }
}

/// Parse an ISO date string ("YYYY-MM-DD") and decide whether it is before today (UTC).
fn is_past_date(s: &str) -> bool {
    if s.is_empty() {
        return false;
    }
    match chrono::NaiveDate::parse_from_str(s, "%Y-%m-%d") {
        Ok(d) => d < chrono::Utc::now().date_naive(),
        Err(_) => false,
    }
}

/// Build the list of flagged issues for the examiner report.
pub fn detect_additional_flags(
    data: &AssessmentData,
    critical_failures: &[FiredRule],
    deficiencies: &[FiredRule],
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    // --- High: critical-competency failures with the specific reason ---
    for rule in critical_failures {
        flags.push(AdditionalFlag {
            id: format!("FLAG-CRIT-{}", rule.id),
            category: format!("Critical competency — {}", rule.category),
            message: format!("Critical-competency failure: {}", rule.description),
            priority: "high".to_string(),
        });
    }

    // --- High: prior certification expired ---
    let expiry = &data.candidate_details.prior_certification_expiry;
    if is_past_date(expiry) {
        flags.push(AdditionalFlag {
            id: "FLAG-CERT-EXPIRED".to_string(),
            category: "Candidate Details".to_string(),
            message: format!(
                "Prior certification expired on {expiry} — recertification required."
            ),
            priority: "high".to_string(),
        });
    }

    // --- High: domain weakness (multiple deficiencies in same category) ---
    let mut by_category: BTreeMap<String, Vec<&FiredRule>> = BTreeMap::new();
    for rule in deficiencies {
        by_category
            .entry(rule.category.clone())
            .or_default()
            .push(rule);
    }
    for (category, rules) in &by_category {
        if rules.len() >= 2 {
            let id_suffix = category.replace(' ', "-").to_uppercase();
            flags.push(AdditionalFlag {
                id: format!("FLAG-DOMAIN-{id_suffix}"),
                category: format!("Domain weakness — {category}"),
                message: format!(
                    "{} deficiencies clustered in {category}; targeted remediation recommended before recertification.",
                    rules.len()
                ),
                priority: "high".to_string(),
            });
        }
    }

    // --- Medium / High: multiple non-critical deficiencies overall ---
    let def_count = deficiencies.len();
    if def_count >= 2 {
        let priority = if def_count > 3 { "high" } else { "medium" };
        flags.push(AdditionalFlag {
            id: "FLAG-MULTI-DEF".to_string(),
            category: "Performance".to_string(),
            message: format!(
                "{def_count} non-critical deficiencies recorded — additional coaching recommended."
            ),
            priority: priority.to_string(),
        });
    }

    // --- 50 m swim slow or near margin ---
    let swim50 = data.physical_fitness_swim.swim50m_time_seconds;
    if let Some(s) = swim50 {
        if !swim50m_within_target(swim50) {
            flags.push(AdditionalFlag {
                id: "FLAG-SWIM-50M-SLOW".to_string(),
                category: "Physical Fitness".to_string(),
                message: format!(
                    "Measured 50 m swim time {}s exceeds NPLQ target of {}s.",
                    fmt_num(s),
                    fmt_num(SWIM_50M_MAX_SECONDS)
                ),
                priority: "high".to_string(),
            });
        } else if s > SWIM_50M_MAX_SECONDS - 5.0 {
            flags.push(AdditionalFlag {
                id: "FLAG-SWIM-50M-MARGIN".to_string(),
                category: "Physical Fitness".to_string(),
                message: format!(
                    "50 m swim {}s is within target but close to the {}s limit — recommend conditioning.",
                    fmt_num(s),
                    fmt_num(SWIM_50M_MAX_SECONDS)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // --- Medium: 200 m swim slow ---
    let swim200 = data.physical_fitness_swim.swim200m_time_seconds;
    if let Some(s) = swim200 {
        if !swim200m_within_target(swim200) {
            flags.push(AdditionalFlag {
                id: "FLAG-SWIM-200M-SLOW".to_string(),
                category: "Physical Fitness".to_string(),
                message: format!(
                    "Measured 200 m swim time {}s exceeds suggested {}s target.",
                    fmt_num(s),
                    fmt_num(SWIM_200M_MAX_SECONDS)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // --- Medium: surface dive depth shallow ---
    let dive = data.physical_fitness_swim.surface_dive_depth_metres;
    if let Some(m) = dive {
        if !surface_dive_depth_adequate(dive) {
            flags.push(AdditionalFlag {
                id: "FLAG-DIVE-SHALLOW".to_string(),
                category: "Physical Fitness".to_string(),
                message: format!(
                    "Surface dive recovered at {}m — below {}m suggested NPLQ minimum.",
                    fmt_num(m),
                    fmt_num(SURFACE_DIVE_MIN_METRES)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // --- Medium: compression rate / depth out of range ---
    let rate = data.cpr_aed.compression_rate;
    if let Some(r) = rate {
        if !compression_rate_in_range(rate) {
            flags.push(AdditionalFlag {
                id: "FLAG-CPR-RATE-RANGE".to_string(),
                category: "CPR & AED".to_string(),
                message: format!(
                    "Measured compression rate {}/min outside target {}-{}/min.",
                    fmt_num(r),
                    fmt_num(COMPRESSION_RATE_MIN),
                    fmt_num(COMPRESSION_RATE_MAX)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    let depth = data.cpr_aed.compression_depth;
    if let Some(d) = depth {
        if !compression_depth_in_range(depth) {
            flags.push(AdditionalFlag {
                id: "FLAG-CPR-DEPTH-RANGE".to_string(),
                category: "CPR & AED".to_string(),
                message: format!(
                    "Measured compression depth {}cm outside target {}-{}cm.",
                    fmt_num(d),
                    fmt_num(COMPRESSION_DEPTH_MIN),
                    fmt_num(COMPRESSION_DEPTH_MAX)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // --- Medium: hesitation in compression depth ---
    let depth_shallow = matches!(depth, Some(d) if d < COMPRESSION_DEPTH_MIN);
    if data.cpr_aed.effective_compressions == "no" || depth_shallow {
        flags.push(AdditionalFlag {
            id: "FLAG-CPR-HESITATE-DEPTH".to_string(),
            category: "CPR & AED".to_string(),
            message: "Hesitation in compression depth observed — coach to push harder (5-6 cm)."
                .to_string(),
            priority: "medium".to_string(),
        });
    }

    // --- Medium: slow time to first AED shock ---
    let shock_time = data.cpr_aed.time_to_first_shock_seconds;
    if let Some(t) = shock_time {
        if t > SLOW_AED_SECONDS {
            flags.push(AdditionalFlag {
                id: "FLAG-AED-SLOW".to_string(),
                category: "CPR & AED".to_string(),
                message: format!(
                    "Time to first shock {}s exceeds {}s target — practice rapid AED retrieval and pad placement.",
                    fmt_num(t),
                    fmt_num(SLOW_AED_SECONDS)
                ),
                priority: "medium".to_string(),
            });
        }
    }

    // --- Low: single non-critical deficiency = improvement area ---
    if deficiencies.len() == 1 {
        let only = &deficiencies[0];
        flags.push(AdditionalFlag {
            id: format!("FLAG-IMPROVE-{}", only.id),
            category: format!("Improvement area — {}", only.category),
            message: format!("Room for improvement: {}", only.description),
            priority: "low".to_string(),
        });
    }

    // --- Low: examiner / candidate notes captured ---
    if !data.overall_result_signoff.examiner_notes.trim().is_empty() {
        flags.push(AdditionalFlag {
            id: "FLAG-DEBRIEF-EXAMINER".to_string(),
            category: "Debrief".to_string(),
            message: "Examiner notes recorded — review with candidate during debrief.".to_string(),
            priority: "low".to_string(),
        });
    }
    if !data
        .overall_result_signoff
        .candidate_feedback
        .trim()
        .is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DEBRIEF-CANDIDATE".to_string(),
            category: "Debrief".to_string(),
            message: "Candidate self-feedback captured — incorporate into improvement plan."
                .to_string(),
            priority: "low".to_string(),
        });
    }
    if !data
        .overall_result_signoff
        .development_areas
        .trim()
        .is_empty()
    {
        flags.push(AdditionalFlag {
            id: "FLAG-DEVELOPMENT-AREAS".to_string(),
            category: "Development".to_string(),
            message: "Development areas noted — supply written feedback to candidate.".to_string(),
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
