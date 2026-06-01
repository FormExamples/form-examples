use std::collections::BTreeMap;

use super::flagged_issues::detect_additional_flags;
use super::items::{ItemDef, PRACTICES_ITEMS, STAKEHOLDERS_ITEMS, Section, TEAMS_ITEMS};
use super::maturity_rules::apply_maturity_rules;
use super::types::{AssessmentData, GradingResult, SectionScore};
use super::utils::{band_for, derive_maturity, round2};

const MIN_ANSWERED_FOR_REPORT: u32 = 30;

fn score_section(
    section: Section,
    items: &[ItemDef],
    answers: &BTreeMap<String, String>,
) -> SectionScore {
    let mut yes_count = 0u32;
    let mut no_count = 0u32;
    let mut not_applicable_count = 0u32;
    let mut unanswered_count = 0u32;
    for item in items {
        match answers.get(item.id).map(String::as_str).unwrap_or("") {
            "yes" => yes_count += 1,
            "no" => no_count += 1,
            "not-applicable" => not_applicable_count += 1,
            _ => unanswered_count += 1,
        }
    }
    let applicable_count = yes_count + no_count;
    let percent = if applicable_count == 0 {
        None
    } else {
        Some(round2((yes_count as f64 / applicable_count as f64) * 100.0))
    };
    let band = band_for(percent);
    SectionScore {
        section: section.slug().to_string(),
        yes_count,
        no_count,
        not_applicable_count,
        unanswered_count,
        applicable_count,
        percent,
        band: band.slug().to_string(),
    }
}

/// Pure function: grades an agile-checklist submission.
///
/// Returns a [`GradingResult`] containing:
/// - per-section scores (yes / no / N/A counts, percentage, band)
/// - composite overall percentage (unweighted mean of section percentages)
/// - maturity level (Ad-hoc / Initial / Developing / Mature / Optimising
///   / Insufficient-Data)
/// - fired maturity rules (one per section with coaching narrative)
/// - additional operational flags (autonomy risk, finished-work risk,
///   psychological-safety risk, etc.)
pub fn grade(data: &AssessmentData) -> GradingResult {
    let answers = &data.answers;
    let teams = score_section(Section::Teams, TEAMS_ITEMS, answers);
    let stakeholders = score_section(Section::Stakeholders, STAKEHOLDERS_ITEMS, answers);
    let practices = score_section(Section::Practices, PRACTICES_ITEMS, answers);

    let answered_count = teams.yes_count
        + teams.no_count
        + teams.not_applicable_count
        + stakeholders.yes_count
        + stakeholders.no_count
        + stakeholders.not_applicable_count
        + practices.yes_count
        + practices.no_count
        + practices.not_applicable_count;

    let defined: Vec<f64> = [teams.percent, stakeholders.percent, practices.percent]
        .iter()
        .filter_map(|p| *p)
        .collect();
    let overall_percent = if defined.len() == 3 && answered_count >= MIN_ANSWERED_FOR_REPORT {
        Some(round2(defined.iter().sum::<f64>() / defined.len() as f64))
    } else {
        None
    };
    let maturity = derive_maturity(overall_percent);

    let fired_rules = apply_maturity_rules(&teams, &stakeholders, &practices);
    let additional_flags =
        detect_additional_flags(answers, &teams, &stakeholders, &practices, answered_count);

    GradingResult {
        answered_count,
        teams,
        stakeholders,
        practices,
        overall_percent,
        maturity: maturity.slug().to_string(),
        maturity_label: maturity.label().to_string(),
        fired_rules,
        additional_flags,
        timestamp: chrono::Utc::now().to_rfc3339(),
    }
}
