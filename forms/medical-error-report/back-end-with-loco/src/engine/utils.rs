//! Helper predicates and counters used by the grader.

use super::types::ContributingFactors;

/// Display label for the WHO severity scale.
pub fn who_severity_label(severity: &str) -> String {
    match severity {
        "near-miss" => "Near Miss - No harm reached patient".to_string(),
        "mild" => "Mild - Temporary minor harm".to_string(),
        "moderate" => "Moderate - Temporary significant harm".to_string(),
        "severe" => "Severe - Permanent harm".to_string(),
        "critical" => "Critical - Death or life-threatening".to_string(),
        _ => "Not classified".to_string(),
    }
}

/// Display label for the NCC MERP category.
pub fn ncc_merp_label(category: &str) -> String {
    match category {
        "A" => "Category A - Capacity to cause error".to_string(),
        "B" => "Category B - Error did not reach patient".to_string(),
        "C" => "Category C - Reached patient, no harm".to_string(),
        "D" => "Category D - Required monitoring, no harm".to_string(),
        "E" => "Category E - Temporary harm, intervention required".to_string(),
        "F" => "Category F - Temporary harm, hospitalisation".to_string(),
        "G" => "Category G - Permanent harm".to_string(),
        "H" => "Category H - Intervention to sustain life".to_string(),
        "I" => "Category I - Patient death".to_string(),
        _ => "Not classified".to_string(),
    }
}

/// Display label for the overall risk level.
pub fn risk_level_label(risk: &str) -> String {
    match risk {
        "low" => "Low Risk".to_string(),
        "moderate" => "Moderate Risk".to_string(),
        "high" => "High Risk".to_string(),
        "critical" => "Critical Risk".to_string(),
        _ => String::new(),
    }
}

/// Count contributing factors flagged as "yes".
pub fn count_contributing_factors(cf: &ContributingFactors) -> i32 {
    let fields: [&str; 9] = [
        &cf.staff_fatigue,
        &cf.inadequate_training,
        &cf.communication_failure,
        &cf.handover_failure,
        &cf.equipment_failure,
        &cf.environmental_factors,
        &cf.policy_not_followed,
        &cf.workload_pressure,
        &cf.patient_factors,
    ];
    fields.iter().filter(|v| **v == "yes").count() as i32
}
