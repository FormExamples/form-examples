use crate::items::{PRACTICES_ITEMS, STAKEHOLDERS_ITEMS, Section, TEAMS_ITEMS};
use serde::Serialize;
use std::collections::HashMap;

const SECTION_LOW_THRESHOLD: f64 = 50.0;
const SECTION_IMBALANCE_THRESHOLD: f64 = 30.0;
const MIN_ANSWERED_FOR_REPORT: usize = 30;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum Band {
    High,
    Mid,
    Low,
    Unanswered,
}

impl Band {
    pub fn slug(self) -> &'static str {
        match self {
            Band::High => "high",
            Band::Mid => "mid",
            Band::Low => "low",
            Band::Unanswered => "unanswered",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum Maturity {
    Optimising,
    Mature,
    Developing,
    Initial,
    #[serde(rename = "ad-hoc")]
    AdHoc,
    #[serde(rename = "insufficient-data")]
    InsufficientData,
}

impl Maturity {
    pub fn slug(self) -> &'static str {
        match self {
            Maturity::Optimising => "optimising",
            Maturity::Mature => "mature",
            Maturity::Developing => "developing",
            Maturity::Initial => "initial",
            Maturity::AdHoc => "ad-hoc",
            Maturity::InsufficientData => "insufficient-data",
        }
    }

    pub fn label(self) -> &'static str {
        match self {
            Maturity::Optimising => "OPTIMISING",
            Maturity::Mature => "MATURE",
            Maturity::Developing => "DEVELOPING",
            Maturity::Initial => "INITIAL",
            Maturity::AdHoc => "AD-HOC",
            Maturity::InsufficientData => "INSUFFICIENT DATA",
        }
    }
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SectionScore {
    pub section: &'static str,
    pub yes_count: usize,
    pub no_count: usize,
    pub not_applicable_count: usize,
    pub unanswered_count: usize,
    pub applicable_count: usize,
    pub percent: Option<f64>,
    pub band: Band,
    pub band_slug: &'static str,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FiredRule {
    pub rule_id: String,
    pub section: &'static str,
    pub band: &'static str,
    pub description: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalFlag {
    pub flag_id: &'static str,
    pub category: &'static str,
    pub priority: &'static str,
    pub section: &'static str,
    pub triggering_items: Vec<&'static str>,
    pub description: String,
    pub suggested_action: &'static str,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GradingResult {
    pub answered_count: usize,
    pub teams: SectionScore,
    pub stakeholders: SectionScore,
    pub practices: SectionScore,
    pub overall_percent: Option<f64>,
    pub maturity: &'static str,
    pub maturity_label: &'static str,
    pub fired_rules: Vec<FiredRule>,
    pub additional_flags: Vec<AdditionalFlag>,
}

pub fn band_for(percent: Option<f64>) -> Band {
    match percent {
        None => Band::Unanswered,
        Some(p) if p >= 75.0 => Band::High,
        Some(p) if p >= 50.0 => Band::Mid,
        Some(_) => Band::Low,
    }
}

pub fn derive_maturity(overall_percent: Option<f64>) -> Maturity {
    match overall_percent {
        None => Maturity::InsufficientData,
        Some(p) if p >= 90.0 => Maturity::Optimising,
        Some(p) if p >= 75.0 => Maturity::Mature,
        Some(p) if p >= 50.0 => Maturity::Developing,
        Some(p) if p >= 25.0 => Maturity::Initial,
        Some(_) => Maturity::AdHoc,
    }
}

fn round2(n: f64) -> f64 {
    (n * 100.0).round() / 100.0
}

fn score_section(
    section: Section,
    items: &[crate::items::ItemDef],
    answers: &HashMap<String, String>,
) -> SectionScore {
    let mut yes_count = 0usize;
    let mut no_count = 0usize;
    let mut not_applicable_count = 0usize;
    let mut unanswered_count = 0usize;
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
        section: section.slug(),
        yes_count,
        no_count,
        not_applicable_count,
        unanswered_count,
        applicable_count,
        percent,
        band,
        band_slug: band.slug(),
    }
}

fn coaching_for(section: Section, band: Band) -> &'static str {
    match (section, band) {
        (Section::Teams, Band::High) => "Teams have strong agile habits — autonomy, learning, and finishing. Preserve psychological safety as the team grows.",
        (Section::Teams, Band::Mid) => "Team behaviours are uneven. Identify two or three weak items and turn them into named retrospective experiments.",
        (Section::Teams, Band::Low) => "Teams are not yet operating with agile habits. Start with autonomy, finishing work, and dissent-safety; coaching is needed.",
        (Section::Stakeholders, Band::High) => "Stakeholders trust and support the team. Continue investing in transparency and shared goals.",
        (Section::Stakeholders, Band::Mid) => "Stakeholder support is partial. Audit which decisions sponsors still take back at the first sign of trouble.",
        (Section::Stakeholders, Band::Low) => "Stakeholder behaviour is the binding constraint. No team can outrun a sponsor who revokes authority and punishes experiments.",
        (Section::Practices, Band::High) => "Operating practices are healthy — quick decisions, finished-work focus, blame-free culture. Keep watching for over-engineering.",
        (Section::Practices, Band::Mid) => "Practices are partly in place. Pick the two weakest items and address them at the system level, not the team level.",
        (Section::Practices, Band::Low) => "Operating practices are working against agility. Address finished-over-WIP, quality-over-deadline, and blame culture before adding rituals.",
        (_, Band::Unanswered) => "",
    }
}

fn apply_maturity_rules(
    teams: &SectionScore,
    stakeholders: &SectionScore,
    practices: &SectionScore,
) -> Vec<FiredRule> {
    let mut fired = Vec::with_capacity(3);
    for (section, score) in [
        (Section::Teams, teams),
        (Section::Stakeholders, stakeholders),
        (Section::Practices, practices),
    ] {
        let description = if score.band == Band::Unanswered {
            format!(
                "{} section was not answered.",
                capitalise(score.section)
            )
        } else {
            coaching_for(section, score.band).to_string()
        };
        fired.push(FiredRule {
            rule_id: format!(
                "R-{}-{}",
                score.section.to_uppercase(),
                score.band_slug.to_uppercase()
            ),
            section: score.section,
            band: score.band_slug,
            description,
        });
    }
    fired
}

fn is_no(answers: &HashMap<String, String>, id: &str) -> bool {
    answers.get(id).map(String::as_str) == Some("no")
}

fn detect_additional_flags(
    answers: &HashMap<String, String>,
    teams: &SectionScore,
    stakeholders: &SectionScore,
    practices: &SectionScore,
    answered_count: usize,
) -> Vec<AdditionalFlag> {
    let mut flags = Vec::new();

    if let Some(p) = teams.percent
        && p < SECTION_LOW_THRESHOLD
    {
        flags.push(AdditionalFlag {
            flag_id: "F-TEAMS-AUTONOMY",
            category: "teams-autonomy-risk",
            priority: "high",
            section: "teams",
            triggering_items: vec![],
            description: format!(
                "Teams section scored {:.0}% — autonomy and finishing habits are weak.",
                p
            ),
            suggested_action: "Run a focused retrospective on autonomy, finishing work, and decision authority.",
        });
    }
    if let Some(p) = stakeholders.percent
        && p < SECTION_LOW_THRESHOLD
    {
        flags.push(AdditionalFlag {
            flag_id: "F-STAKEHOLDERS-TRUST",
            category: "stakeholders-trust-risk",
            priority: "high",
            section: "stakeholders",
            triggering_items: vec![],
            description: format!(
                "Stakeholders section scored {:.0}% — sponsorship is the binding constraint.",
                p
            ),
            suggested_action: "Brief executive sponsors on agile delegation; renegotiate explicit decision rights.",
        });
    }
    if let Some(p) = practices.percent
        && p < SECTION_LOW_THRESHOLD
    {
        flags.push(AdditionalFlag {
            flag_id: "F-PRACTICES-DISCIPLINE",
            category: "practices-discipline-risk",
            priority: "high",
            section: "practices",
            triggering_items: vec![],
            description: format!(
                "Practices section scored {:.0}% — operating practices are working against agility.",
                p
            ),
            suggested_action: "Address finished-over-WIP, quality-over-deadline, and blame culture as system-level changes.",
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
                flag_id: "F-SECTION-IMBALANCE",
                category: "section-imbalance",
                priority: "medium",
                section: "",
                triggering_items: vec![],
                description: format!(
                    "Section spread is {:.0} percentage points — adoption is uneven across audiences.",
                    max_spread
                ),
                suggested_action: "Align coaching across teams, stakeholders, and practices so improvements are not undone elsewhere.",
            });
        }
    }

    if is_no(answers, "t08") && is_no(answers, "p12") {
        flags.push(AdditionalFlag {
            flag_id: "F-FINISHED-WORK",
            category: "finished-work-risk",
            priority: "high",
            section: "",
            triggering_items: vec!["t08", "p12"],
            description: "Teams wait on others (t08=no) and the organisation values WIP over finished work (p12=no).".to_string(),
            suggested_action: "Set explicit WIP limits and prioritise finishing in-flight work over starting new work.",
        });
    }
    if is_no(answers, "s09") && is_no(answers, "s10") {
        flags.push(AdditionalFlag {
            flag_id: "F-EXPERIMENTATION-BLOCKED",
            category: "experimentation-blocked",
            priority: "high",
            section: "stakeholders",
            triggering_items: vec!["s09", "s10"],
            description: "Stakeholders neither support experiments (s09=no) nor tolerate failed ones (s10=no).".to_string(),
            suggested_action: "Negotiate a formal experiment budget with the sponsor; agree explicitly that some experiments will fail.",
        });
    }
    if is_no(answers, "t17") && is_no(answers, "t18") {
        flags.push(AdditionalFlag {
            flag_id: "F-LEARNING-STALLED",
            category: "learning-stalled",
            priority: "medium",
            section: "teams",
            triggering_items: vec!["t17", "t18"],
            description: "Teams neither seek (t17=no) nor improve (t18=no) skills — long-term capability is decaying.".to_string(),
            suggested_action: "Schedule recurring learning time and pair people deliberately on unfamiliar work.",
        });
    }

    let mut psych: Vec<&'static str> = vec![];
    if is_no(answers, "t22") {
        psych.push("t22");
    }
    if is_no(answers, "s08") {
        psych.push("s08");
    }
    if is_no(answers, "p14") {
        psych.push("p14");
    }
    if !psych.is_empty() {
        flags.push(AdditionalFlag {
            flag_id: "F-PSYCHOLOGICAL-SAFETY",
            category: "psychological-safety-risk",
            priority: "high",
            section: "",
            triggering_items: psych,
            description: "Psychological safety is at risk — dissent, sustained authority, or blameless problem-solving is missing.".to_string(),
            suggested_action: "Address safety before adding rituals or processes; nothing else compounds without it.",
        });
    }

    if answered_count < MIN_ANSWERED_FOR_REPORT {
        flags.push(AdditionalFlag {
            flag_id: "F-INSUFFICIENT-DATA",
            category: "insufficient-data",
            priority: "medium",
            section: "",
            triggering_items: vec![],
            description: format!(
                "Only {} of 57 items answered; the composite maturity is not reportable below 30.",
                answered_count
            ),
            suggested_action: "Complete more items before relying on the maturity result.",
        });
    }

    flags
}

fn capitalise(s: &str) -> String {
    let mut chars = s.chars();
    match chars.next() {
        Some(c) => c.to_uppercase().collect::<String>() + chars.as_str(),
        None => String::new(),
    }
}

pub fn calculate_maturity(answers: &HashMap<String, String>) -> GradingResult {
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
        maturity: maturity.slug(),
        maturity_label: maturity.label(),
        fired_rules,
        additional_flags,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::items::all_items;

    fn answer_all(value: &str) -> HashMap<String, String> {
        let mut m = HashMap::new();
        for item in all_items() {
            m.insert(item.id.to_string(), value.to_string());
        }
        m
    }

    #[test]
    fn band_thresholds() {
        assert_eq!(band_for(Some(75.0)), Band::High);
        assert_eq!(band_for(Some(74.0)), Band::Mid);
        assert_eq!(band_for(Some(50.0)), Band::Mid);
        assert_eq!(band_for(Some(49.0)), Band::Low);
        assert_eq!(band_for(None), Band::Unanswered);
    }

    #[test]
    fn maturity_thresholds() {
        assert_eq!(derive_maturity(Some(90.0)), Maturity::Optimising);
        assert_eq!(derive_maturity(Some(89.0)), Maturity::Mature);
        assert_eq!(derive_maturity(Some(75.0)), Maturity::Mature);
        assert_eq!(derive_maturity(Some(50.0)), Maturity::Developing);
        assert_eq!(derive_maturity(Some(49.0)), Maturity::Initial);
        assert_eq!(derive_maturity(Some(24.0)), Maturity::AdHoc);
        assert_eq!(derive_maturity(None), Maturity::InsufficientData);
    }

    #[test]
    fn all_yes_is_optimising() {
        let r = calculate_maturity(&answer_all("yes"));
        assert_eq!(r.maturity, "optimising");
        assert_eq!(r.overall_percent, Some(100.0));
    }

    #[test]
    fn all_no_is_ad_hoc_with_section_flags() {
        let r = calculate_maturity(&answer_all("no"));
        assert_eq!(r.maturity, "ad-hoc");
        assert_eq!(r.overall_percent, Some(0.0));
        let cats: Vec<&str> = r.additional_flags.iter().map(|f| f.category).collect();
        assert!(cats.contains(&"teams-autonomy-risk"));
        assert!(cats.contains(&"stakeholders-trust-risk"));
        assert!(cats.contains(&"practices-discipline-risk"));
    }

    #[test]
    fn fewer_than_30_is_insufficient_data() {
        let mut answers = HashMap::new();
        answers.insert("t01".into(), "yes".into());
        answers.insert("t02".into(), "yes".into());
        let r = calculate_maturity(&answers);
        assert_eq!(r.maturity, "insufficient-data");
        assert!(r.additional_flags.iter().any(|f| f.category == "insufficient-data"));
    }

    #[test]
    fn finished_work_flag() {
        let mut answers = answer_all("yes");
        answers.insert("t08".into(), "no".into());
        answers.insert("p12".into(), "no".into());
        let r = calculate_maturity(&answers);
        assert!(r.additional_flags.iter().any(|f| f.category == "finished-work-risk"));
    }

    #[test]
    fn psych_safety_flag_on_any_no() {
        let mut answers = answer_all("yes");
        answers.insert("t22".into(), "no".into());
        let r = calculate_maturity(&answers);
        assert!(r
            .additional_flags
            .iter()
            .any(|f| f.category == "psychological-safety-risk"));
    }

    #[test]
    fn not_applicable_excluded_from_denominator() {
        let mut answers = answer_all("yes");
        for item in TEAMS_ITEMS {
            answers.insert(item.id.to_string(), "not-applicable".into());
        }
        let r = calculate_maturity(&answers);
        assert_eq!(r.teams.applicable_count, 0);
        assert!(r.teams.percent.is_none());
        // overall is null because one section is unanswered
        assert!(r.overall_percent.is_none());
        assert_eq!(r.maturity, "insufficient-data");
    }
}
