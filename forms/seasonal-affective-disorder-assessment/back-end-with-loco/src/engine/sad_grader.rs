// Pure SAD grader. Takes an `AssessmentData` object and returns the SPAQ
// total + band, the PHQ-9 total + band, the combined severity, and the
// audit trail of fired rules.
//
// Combined severity rules (in order — first match wins):
//   1. critical  -> active suicidal ideation, suicidal intent, self-harm Yes,
//                   previous attempt Yes, PHQ-9 q9 >= 1, or PHQ-9 total >= 20.
//   2. severe    -> PHQ-9 band 'severe'
//                   OR (SPAQ band 'sad-likely' AND PHQ-9 band 'moderately-severe').
//   3. moderate  -> SPAQ 'sad-likely' OR PHQ-9 band 'moderate' OR 'moderately-severe'.
//   4. mild      -> SPAQ 'subsyndromal' OR PHQ-9 band 'mild'.
//   5. no-sad    -> otherwise.

use super::flagged_issues::detect_additional_flags;
use super::sad_rules::{classify_phq9, classify_spaq, phq9_items, spaq_items};
use super::types::{
    AssessmentData, CombinedSeverity, FiredRule, GradingResult, Phq9Band, SpaqBand,
};

/// Pure function: grade a Seasonal Affective Disorder Assessment.
pub fn grade(data: &AssessmentData) -> GradingResult {
    let timestamp = chrono::Utc::now().to_rfc3339();
    let mut fired_rules: Vec<FiredRule> = Vec::new();

    // ─── SPAQ Global Seasonality Score ────────────────────────
    let mut spaq_score: i32 = 0;
    for item in spaq_items() {
        if let Some(v) = (item.extract)(data) {
            spaq_score += v;
            fired_rules.push(FiredRule {
                id: item.id.to_string(),
                category: format!("SPAQ • {}", item.category),
                description: item.label.to_string(),
                score: v,
            });
        }
    }
    let spaq_band: SpaqBand = classify_spaq(spaq_score);

    // ─── PHQ-9 ────────────────────────────────────────────────
    let mut phq9_score: i32 = 0;
    for item in phq9_items() {
        if let Some(v) = (item.extract)(data) {
            phq9_score += v;
            fired_rules.push(FiredRule {
                id: item.id.to_string(),
                category: format!("PHQ-9 • {}", item.category),
                description: item.label.to_string(),
                score: v,
            });
        }
    }
    let phq9_band: Phq9Band = classify_phq9(phq9_score);

    // ─── Combined severity ────────────────────────────────────
    let phq9_q9 = data.current_mood.phq9.q9.unwrap_or(0);
    let combined_severity: CombinedSeverity = if data.risk_assessment.suicidal_ideation == "yes"
        || data.risk_assessment.suicidal_intent == "yes"
        || data.risk_assessment.self_harm == "yes"
        || data.risk_assessment.previous_attempt == "yes"
        || phq9_q9 >= 1
        || phq9_score >= 20
    {
        "critical".to_string()
    } else if phq9_band == "severe"
        || (spaq_band == "sad-likely" && phq9_band == "moderately-severe")
    {
        "severe".to_string()
    } else if spaq_band == "sad-likely"
        || phq9_band == "moderate"
        || phq9_band == "moderately-severe"
    {
        "moderate".to_string()
    } else if spaq_band == "subsyndromal" || phq9_band == "mild" {
        "mild".to_string()
    } else {
        "no-sad".to_string()
    };

    let additional_flags = detect_additional_flags(data, spaq_band.as_str(), phq9_score, combined_severity.as_str());

    GradingResult {
        spaq_score,
        spaq_band,
        phq9_score,
        phq9_band,
        combined_severity,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
