//! Climate grader module.

use super::climate_rules::{GRADED_DOMAIN_KEYS, all_items};
use super::flagged_issues::detect_additional_flags;
use super::types::{
    AssessmentData, DomainScore, DomainScores, FiredRule, GradingResult,
};
use super::utils::{classify_score, round1, round2};

/// Score a single domain: mean of 1-5 answers and 0-100 normalised score.
/// Returns (DomainScore, fired-rules-for-domain).
pub fn grade_domain(data: &AssessmentData, domain_key: &str) -> (DomainScore, Vec<FiredRule>) {
    let mut fired: Vec<FiredRule> = Vec::new();
    let items = all_items();
    let domain_items: Vec<_> = items.iter().filter(|it| it.domain == domain_key).collect();
    let mut sum: f64 = 0.0;
    let mut answered: u32 = 0;

    for item in &domain_items {
        let raw = (item.value_of)(data);
        if let Some(numeric) = raw {
            if !(1..=5).contains(&numeric) {
                continue;
            }
            sum += numeric as f64;
            answered += 1;
            fired.push(FiredRule {
                id: item.id.to_string(),
                domain: item.domain.to_string(),
                label: item.label.to_string(),
                raw_value: numeric,
            });
        }
    }

    let mean = if answered == 0 {
        None
    } else {
        Some(round2(sum / answered as f64))
    };
    let score = mean.map(|m| round1(m * 20.0));
    let category = classify_score(score);

    (
        DomainScore {
            mean,
            score,
            answered_count: answered,
            total_count: domain_items.len() as u32,
            category,
        },
        fired,
    )
}

/// Grade the entire assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let mut fired_rules: Vec<FiredRule> = Vec::new();
    let mut total_answered: u32 = 0;
    let items = all_items();
    // Total only counts items in the eight graded domains.
    let total_count = items
        .iter()
        .filter(|it| GRADED_DOMAIN_KEYS.contains(&it.domain))
        .count() as u32;

    let mut score_sum: f64 = 0.0;
    let mut scored_domains: u32 = 0;
    let mut per_domain: std::collections::HashMap<&'static str, DomainScore> =
        std::collections::HashMap::new();

    for key in GRADED_DOMAIN_KEYS {
        let (result, fired) = grade_domain(data, key);
        total_answered += result.answered_count;
        fired_rules.extend(fired);
        if let Some(s) = result.score {
            score_sum += s;
            scored_domains += 1;
        }
        per_domain.insert(*key, result);
    }

    let composite_score = if scored_domains == 0 {
        None
    } else {
        Some(round1(score_sum / scored_domains as f64))
    };

    let category = classify_score(composite_score);

    let domain_scores = DomainScores {
        leadership: per_domain.remove("leadership").unwrap_or_default(),
        psych_safety: per_domain.remove("psychSafety").unwrap_or_default(),
        inclusion: per_domain.remove("inclusion").unwrap_or_default(),
        communication: per_domain.remove("communication").unwrap_or_default(),
        collaboration: per_domain.remove("collaboration").unwrap_or_default(),
        recognition: per_domain.remove("recognition").unwrap_or_default(),
        wellbeing: per_domain.remove("wellbeing").unwrap_or_default(),
        career: per_domain.remove("career").unwrap_or_default(),
    };

    // Build a transient grading view for flag detection, then attach the flags.
    let preliminary = GradingResult {
        composite_score,
        category: category.clone(),
        domain_scores: domain_scores.clone(),
        answered_count: total_answered,
        total_count,
        fired_rules: fired_rules.clone(),
        additional_flags: Vec::new(),
        timestamp: timestamp.clone(),
    };
    let additional_flags = detect_additional_flags(data, &preliminary);

    GradingResult {
        composite_score,
        category,
        domain_scores,
        answered_count: total_answered,
        total_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
