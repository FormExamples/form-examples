// Clinical Welsh-language (Cymraeg) speaking assessment grader.
//
// Pure port of `front-end-form-with-html/js/oet-grader.js`.
//
// Calculation:
//   linguisticTotal = sum over the 4 linguistic criteria of
//                     mean(rolePlay1Score, rolePlay2Score)        -> 0..24
//   clinicalTotal   = sum over the 5 clinical indicators           -> 0..15
//   rawTotal        = linguisticTotal + clinicalTotal              -> 0..39
//   scaledScore     = round(rawTotal / 39 * 500)                   -> 0..500
//
// Grade bands (CEFR-mapped cut-points used for Welsh-medium clinical
// communication, parallel to the OET Medicine bands):
//   450-500  -> A   (CEFR C2)
//   350-440  -> B   (CEFR C1)
//   300-340  -> C+  (CEFR B2+)
//   200-290  -> C   (CEFR B2)
//   100-190  -> D   (CEFR B1)
//     0- 90  -> E   (CEFR A2 or below)

use super::cymraeg_rules::{DOMAIN_LINGUISTIC, all_criteria};
use super::types::{AssessmentData, CriterionScore, FiredRule, GradingResult};
use super::utils::{classify_scaled_score, mean_or_single, round1};

/// Pure scoring engine. Mirrors `gradeOET` in the JS reference.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let mut per_criterion_scores: Vec<CriterionScore> = Vec::new();
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    let mut linguistic_total: f64 = 0.0;
    let mut clinical_total: f64 = 0.0;

    for c in all_criteria() {
        if c.domain == DOMAIN_LINGUISTIC {
            let accessor = c.linguistic_field.expect("linguistic accessor");
            let rp1 = accessor(&data.linguistic_role_play1);
            let rp2 = accessor(&data.linguistic_role_play2);
            let mean = mean_or_single(rp1, rp2);
            per_criterion_scores.push(CriterionScore {
                id: c.id.to_string(),
                domain: "linguistic".to_string(),
                label: c.label.to_string(),
                max_score: c.max_score,
                role_play1_score: rp1.map(|v| v as f64),
                role_play2_score: rp2.map(|v| v as f64),
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
        } else {
            let accessor = c.clinical_field.expect("clinical accessor");
            let v = accessor(data);
            per_criterion_scores.push(CriterionScore {
                id: c.id.to_string(),
                domain: "clinical".to_string(),
                label: c.label.to_string(),
                max_score: c.max_score,
                role_play1_score: None,
                role_play2_score: None,
                mean_score: v.map(|x| x as f64),
            });
            if let Some(v) = v {
                clinical_total += v as f64;
                fired_rules.push(FiredRule {
                    id: c.id.to_string(),
                    category: "Clinical Communication".to_string(),
                    description: c.label.to_string(),
                    score: v as f64,
                });
            }
        }
    }

    let raw_total = linguistic_total + clinical_total;
    let scaled_score = ((raw_total / 39.0) * 500.0).round() as i32;
    let grade = classify_scaled_score(scaled_score);

    GradingResult {
        linguistic_total: round1(linguistic_total),
        clinical_total: round1(clinical_total),
        raw_total: round1(raw_total),
        scaled_score,
        grade,
        per_criterion_scores,
        fired_rules,
    }
}
