use super::flagged_issues::detect_additional_flags;
use super::survey_rules::{GRADED_DOMAIN_KEYS, SurveyItem, survey_items};
use super::types::{
    AssessmentData, DomainScore, DomainScores, ENpsResult, ENpsValue, FiredItem, GradingResult,
    SatisfactionCategory,
};
use super::utils::{classify_enps, classify_score};

/// Pure function: grades an Employee Satisfaction Survey response.
///
/// Methodology:
/// - Each Likert item is rated 1-5; per-domain mean = sum / answered;
///   per-domain 0-100 = mean × 20.
/// - Composite = average of the eight graded domain 0-100 scores
///   (only domains with at least one answer contribute).
/// - eNPS: 9-10 promoter, 7-8 passive, 0-6 detractor.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let items = survey_items();
    let mut fired_rules: Vec<FiredItem> = Vec::new();
    let mut domain_scores = DomainScores::default();
    let mut total_answered: u32 = 0;
    let total_count = items.len() as u32;

    let mut composite_sum: f64 = 0.0;
    let mut scored_domains: u32 = 0;

    for key in GRADED_DOMAIN_KEYS.iter() {
        let (score, fired) = grade_domain(data, key, &items);
        total_answered += score.answered_count;
        if let Some(s) = score.score {
            composite_sum += s;
            scored_domains += 1;
        }
        assign_domain_score(&mut domain_scores, key, score);
        fired_rules.extend(fired);
    }

    let composite_raw = if scored_domains == 0 {
        None
    } else {
        Some(composite_sum / scored_domains as f64)
    };
    let composite_score = composite_raw.map(|s| (s * 10.0).round() / 10.0);
    let category: SatisfactionCategory = classify_score(composite_score);
    let enps = grade_enps(data);

    let timestamp = chrono::Utc::now().to_rfc3339();
    let additional_flags = detect_additional_flags(
        data,
        composite_score,
        &category,
        &domain_scores,
        &enps,
    );

    GradingResult {
        composite_score,
        category,
        domain_scores,
        enps,
        answered_count: total_answered,
        total_count,
        fired_rules,
        additional_flags,
        timestamp,
    }
}

fn grade_domain(
    data: &AssessmentData,
    domain_key: &str,
    items: &[SurveyItem],
) -> (DomainScore, Vec<FiredItem>) {
    let mut fired: Vec<FiredItem> = Vec::new();
    let mut sum: i32 = 0;
    let mut answered: u32 = 0;
    let mut total: u32 = 0;

    for item in items.iter().filter(|it| it.domain == domain_key) {
        total += 1;
        let raw = (item.accessor)(data);
        let Some(v) = raw else { continue };
        if !(1..=5).contains(&v) {
            continue;
        }
        sum += v;
        answered += 1;
        fired.push(FiredItem {
            id: item.id.to_string(),
            domain: item.domain.to_string(),
            label: item.label.to_string(),
            raw_value: v,
        });
    }

    let mean = if answered == 0 {
        None
    } else {
        Some(sum as f64 / answered as f64)
    };
    let score = mean.map(|m| m * 20.0);
    let category = classify_score(score);

    let score = DomainScore {
        mean: mean.map(|m| (m * 100.0).round() / 100.0),
        score: score.map(|s| (s * 10.0).round() / 10.0),
        answered_count: answered,
        total_count: total,
        category,
    };

    (score, fired)
}

fn assign_domain_score(scores: &mut DomainScores, key: &str, value: DomainScore) {
    match key {
        "workload" => scores.workload = value,
        "management" => scores.management = value,
        "growth" => scores.growth = value,
        "compensation" => scores.compensation = value,
        "culture" => scores.culture = value,
        "environment" => scores.environment = value,
        "recognition" => scores.recognition = value,
        "overall" => scores.overall = value,
        _ => {}
    }
}

fn grade_enps(data: &AssessmentData) -> ENpsResult {
    let raw: ENpsValue = data.overall.recommend_score;
    let Some(v) = raw else {
        return ENpsResult {
            score: None,
            classification: String::new(),
        };
    };
    if !(0..=10).contains(&v) {
        return ENpsResult {
            score: None,
            classification: String::new(),
        };
    }
    ENpsResult {
        score: Some(v),
        classification: classify_enps(Some(v)),
    }
}
