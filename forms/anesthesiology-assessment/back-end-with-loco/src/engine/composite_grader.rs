// Composite perioperative-risk grader.
//
// Runs the four sub-graders (ASA, Mallampati airway, RCRI, STOP-BANG) and
// promotes the worst sub-risk to the overall risk level. Also collects
// every fired rule for the report's audit trail.

use super::asa_rules::evaluate_asa;
use super::flagged_issues::detect_additional_flags;
use super::mallampati_rules::evaluate_airway;
use super::rcri_rules::evaluate_rcri;
use super::stopbang_rules::evaluate_stopbang;
use super::types::{AssessmentData, FiredRule, GradingResult};
use super::utils::worst_risk;

/// Grade a full assessment. Pure function — no side effects.
pub fn grade(d: &AssessmentData) -> GradingResult {
    let asa = evaluate_asa(d);
    let airway = evaluate_airway(d);
    let rcri = evaluate_rcri(d);
    let stopbang = evaluate_stopbang(d);

    let mut overall = "low".to_string();
    overall = worst_risk(&overall, &asa.risk_level);
    overall = worst_risk(&overall, &airway.risk_level);
    overall = worst_risk(&overall, &rcri.risk_level);
    overall = worst_risk(&overall, &stopbang.risk_level);

    let mut fired_rules: Vec<FiredRule> = Vec::new();
    fired_rules.extend(asa.fired_rules.iter().cloned());
    fired_rules.extend(airway.fired_rules.iter().cloned());
    fired_rules.extend(rcri.fired_rules.iter().cloned());
    fired_rules.extend(stopbang.fired_rules.iter().cloned());

    let additional_flags = detect_additional_flags(d);
    let timestamp = chrono::Utc::now().to_rfc3339();

    GradingResult {
        asa,
        airway,
        rcri,
        stopbang,
        overall_risk: overall,
        fired_rules,
        additional_flags,
        timestamp,
    }
}
