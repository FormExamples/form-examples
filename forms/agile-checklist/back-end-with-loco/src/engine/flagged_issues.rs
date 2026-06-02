use std::collections::BTreeMap;

use super::types::{AdditionalFlag, SectionScore};
use super::utils::is_no;

const SECTION_LOW_THRESHOLD: f64 = 50.0;
const SECTION_IMBALANCE_THRESHOLD: f64 = 30.0;
const MIN_ANSWERED_FOR_REPORT: u32 = 30;

/// Detect operational concerns computed independently of the maturity
/// banding. Priority: high > medium > low.
pub fn detect_additional_flags(
    answers: &BTreeMap<String, String>,
    teams: &SectionScore,
    stakeholders: &SectionScore,
    practices: &SectionScore,
    answered_count: u32,
) -> Vec<AdditionalFlag> {
    let mut flags: Vec<AdditionalFlag> = Vec::new();

    if let Some(p) = teams.percent
        && p < SECTION_LOW_THRESHOLD
    {
        flags.push(AdditionalFlag {
            flag_id: "F-TEAMS-AUTONOMY".to_string(),
            category: "teams-autonomy-risk".to_string(),
            priority: "high".to_string(),
            section: "teams".to_string(),
            triggering_items: vec![],
            description: format!(
                "Teams section scored {:.0}% — autonomy and finishing habits are weak.",
                p
            ),
            suggested_action:
                "Run a focused retrospective on autonomy, finishing work, and decision authority."
                    .to_string(),
        });
    }
    if let Some(p) = stakeholders.percent
        && p < SECTION_LOW_THRESHOLD
    {
        flags.push(AdditionalFlag {
            flag_id: "F-STAKEHOLDERS-TRUST".to_string(),
            category: "stakeholders-trust-risk".to_string(),
            priority: "high".to_string(),
            section: "stakeholders".to_string(),
            triggering_items: vec![],
            description: format!(
                "Stakeholders section scored {:.0}% — sponsorship is the binding constraint.",
                p
            ),
            suggested_action:
                "Brief executive sponsors on agile delegation; renegotiate explicit decision rights."
                    .to_string(),
        });
    }
    if let Some(p) = practices.percent
        && p < SECTION_LOW_THRESHOLD
    {
        flags.push(AdditionalFlag {
            flag_id: "F-PRACTICES-DISCIPLINE".to_string(),
            category: "practices-discipline-risk".to_string(),
            priority: "high".to_string(),
            section: "practices".to_string(),
            triggering_items: vec![],
            description: format!(
                "Practices section scored {:.0}% — operating practices are working against agility.",
                p
            ),
            suggested_action:
                "Address finished-over-WIP, quality-over-deadline, and blame culture as system-level changes."
                    .to_string(),
        });
    }

    let defined: Vec<f64> = [teams.percent, stakeholders.percent, practices.percent]
        .iter()
        .filter_map(|p| *p)
        .collect();
    if defined.len() >= 2 {
        let mut max_spread: f64 = 0.0;
        for i in 0..defined.len() {
            for j in (i + 1)..defined.len() {
                max_spread = max_spread.max((defined[i] - defined[j]).abs());
            }
        }
        if max_spread > SECTION_IMBALANCE_THRESHOLD {
            flags.push(AdditionalFlag {
                flag_id: "F-SECTION-IMBALANCE".to_string(),
                category: "section-imbalance".to_string(),
                priority: "medium".to_string(),
                section: String::new(),
                triggering_items: vec![],
                description: format!(
                    "Section spread is {:.0} percentage points — adoption is uneven across audiences.",
                    max_spread
                ),
                suggested_action:
                    "Align coaching across teams, stakeholders, and practices so improvements are not undone elsewhere."
                        .to_string(),
            });
        }
    }

    if is_no(answers, "t08") && is_no(answers, "p12") {
        flags.push(AdditionalFlag {
            flag_id: "F-FINISHED-WORK".to_string(),
            category: "finished-work-risk".to_string(),
            priority: "high".to_string(),
            section: String::new(),
            triggering_items: vec!["t08".to_string(), "p12".to_string()],
            description:
                "Teams wait on others (t08=no) and the organisation values WIP over finished work (p12=no)."
                    .to_string(),
            suggested_action:
                "Set explicit WIP limits and prioritise finishing in-flight work over starting new work."
                    .to_string(),
        });
    }
    if is_no(answers, "s09") && is_no(answers, "s10") {
        flags.push(AdditionalFlag {
            flag_id: "F-EXPERIMENTATION-BLOCKED".to_string(),
            category: "experimentation-blocked".to_string(),
            priority: "high".to_string(),
            section: "stakeholders".to_string(),
            triggering_items: vec!["s09".to_string(), "s10".to_string()],
            description:
                "Stakeholders neither support experiments (s09=no) nor tolerate failed ones (s10=no)."
                    .to_string(),
            suggested_action:
                "Negotiate a formal experiment budget with the sponsor; agree explicitly that some experiments will fail."
                    .to_string(),
        });
    }
    if is_no(answers, "t17") && is_no(answers, "t18") {
        flags.push(AdditionalFlag {
            flag_id: "F-LEARNING-STALLED".to_string(),
            category: "learning-stalled".to_string(),
            priority: "medium".to_string(),
            section: "teams".to_string(),
            triggering_items: vec!["t17".to_string(), "t18".to_string()],
            description:
                "Teams neither seek (t17=no) nor improve (t18=no) skills — long-term capability is decaying."
                    .to_string(),
            suggested_action:
                "Schedule recurring learning time and pair people deliberately on unfamiliar work."
                    .to_string(),
        });
    }

    let mut psych: Vec<String> = vec![];
    if is_no(answers, "t22") {
        psych.push("t22".to_string());
    }
    if is_no(answers, "s08") {
        psych.push("s08".to_string());
    }
    if is_no(answers, "p14") {
        psych.push("p14".to_string());
    }
    if !psych.is_empty() {
        flags.push(AdditionalFlag {
            flag_id: "F-PSYCHOLOGICAL-SAFETY".to_string(),
            category: "psychological-safety-risk".to_string(),
            priority: "high".to_string(),
            section: String::new(),
            triggering_items: psych,
            description:
                "Psychological safety is at risk — dissent, sustained authority, or blameless problem-solving is missing."
                    .to_string(),
            suggested_action:
                "Address safety before adding rituals or processes; nothing else compounds without it."
                    .to_string(),
        });
    }

    if answered_count < MIN_ANSWERED_FOR_REPORT {
        flags.push(AdditionalFlag {
            flag_id: "F-INSUFFICIENT-DATA".to_string(),
            category: "insufficient-data".to_string(),
            priority: "medium".to_string(),
            section: String::new(),
            triggering_items: vec![],
            description: format!(
                "Only {} of 57 items answered; the composite maturity is not reportable below 30.",
                answered_count
            ),
            suggested_action: "Complete more items before relying on the maturity result."
                .to_string(),
        });
    }

    // Stable priority sort: high > medium > low.
    flags.sort_by_key(|f| match f.priority.as_str() {
        "high" => 0,
        "medium" => 1,
        "low" => 2,
        _ => 3,
    });

    flags
}
