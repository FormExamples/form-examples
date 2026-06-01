//! OET Speaking Sub-test (Medicine) grader.
//!
//! Pure function: takes an `AssessmentData` value, returns the linguistic
//! total (0-24), clinical total (0-15), raw total (0-39), scaled score
//! (0-500), grade (A, B, C+, C, D, E), the per-criterion audit trail, and
//! the list of fired rules and additional flags.
//!
//! Ported verbatim from `front-end-form-with-html/js/oet-grader.js` and
//! `flagged-issues.js`. Criterion IDs, flag IDs, and grade-band cut-points
//! are preserved.

use super::flagged_issues::detect_additional_flags;
use super::rules::{CriterionDomain, criterion_registry};
use super::types::{AssessmentData, CriterionScore, FiredRule, GradingResult};
use super::utils::{classify_scaled_score, mean_or_single, round1};

/// Pure scoring engine.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let mut per_criterion_scores: Vec<CriterionScore> = Vec::new();
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    let mut linguistic_total: f64 = 0.0;
    let mut clinical_total: f64 = 0.0;

    for c in criterion_registry() {
        match c.domain {
            CriterionDomain::Linguistic => {
                let rp1 = (c.linguistic_accessor)(&data.linguistic_role_play1);
                let rp2 = (c.linguistic_accessor)(&data.linguistic_role_play2);
                let mean = mean_or_single(rp1, rp2);
                per_criterion_scores.push(CriterionScore {
                    id: c.id.to_string(),
                    domain: c.domain.as_str().to_string(),
                    label: c.label.to_string(),
                    max_score: c.max_score,
                    role_play1_score: rp1,
                    role_play2_score: rp2,
                    mean_score: mean.map(round1),
                });
                if let Some(m) = mean {
                    linguistic_total += m;
                    fired_rules.push(FiredRule {
                        id: c.id.to_string(),
                        category: "Linguistic".to_string(),
                        description: c.label.to_string(),
                        score: round1(m),
                    });
                }
            }
            CriterionDomain::Clinical => {
                let v = (c.clinical_accessor)(&data.clinical_indicators);
                per_criterion_scores.push(CriterionScore {
                    id: c.id.to_string(),
                    domain: c.domain.as_str().to_string(),
                    label: c.label.to_string(),
                    max_score: c.max_score,
                    role_play1_score: None,
                    role_play2_score: None,
                    mean_score: v,
                });
                if let Some(score) = v {
                    clinical_total += score;
                    fired_rules.push(FiredRule {
                        id: c.id.to_string(),
                        category: "Clinical Communication".to_string(),
                        description: c.label.to_string(),
                        score,
                    });
                }
            }
        }
    }

    let raw_total = linguistic_total + clinical_total;
    let scaled_score = ((raw_total / 39.0) * 500.0).round() as u32;
    let grade = classify_scaled_score(scaled_score);

    let timestamp = chrono::Utc::now().to_rfc3339();

    // First build a partial result so the flag detector can read the grade
    // / scaled-score / per-criterion table.
    let mut result = GradingResult {
        linguistic_total: round1(linguistic_total),
        clinical_total: round1(clinical_total),
        raw_total: round1(raw_total),
        scaled_score,
        grade,
        per_criterion_scores,
        fired_rules,
        additional_flags: Vec::new(),
        timestamp,
    };

    result.additional_flags = detect_additional_flags(data, &result);

    result
}
