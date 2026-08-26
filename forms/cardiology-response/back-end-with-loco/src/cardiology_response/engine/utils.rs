//! Structured-findings predicates and display helpers used by the grader.

use super::types::CardiologyResponse;

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/// A critical result auto-escalates Axis D to critical-alert and raises the
/// critical-finding flag. The clinician sets `criticalResult` explicitly when a
/// critical or unexpected significant cardiac result is present (e.g. critical
/// arrhythmia, severe symptomatic aortic stenosis, acute coronary syndrome).
#[must_use]
pub fn has_critical_finding(r: &CardiologyResponse) -> bool {
    r.critical_result
}

/// Whether any structured cardiac finding is present.
#[must_use]
pub fn has_any_cardiac_finding(r: &CardiologyResponse) -> bool {
    r.ischaemia_or_cad
        || r.significant_arrhythmia
        || r.reduced_ejection_fraction
        || r.significant_valve_disease
        || r.structural_abnormality
        || r.uncontrolled_hypertension
}

/// Reduced ejection fraction is present if the flag is set or LVEF < 40 %.
#[must_use]
pub fn has_reduced_ejection_fraction(r: &CardiologyResponse) -> bool {
    r.reduced_ejection_fraction
        || matches!(r.lv_ejection_fraction_percent, Some(ef) if ef < 40.0)
}

// ──────────────────────────────────────────────
// Display labels
// ──────────────────────────────────────────────

/// Axis A response-classification display label.
#[must_use]
pub fn response_classification_label(value: &str) -> String {
    match value {
        "no-abnormality" => "No abnormality",
        "cardiac-condition" => "Cardiac condition",
        "critical" => "Critical",
        "inconclusive" => "Inconclusive",
        _ => "Not graded",
    }
    .to_string()
}

/// Axis B severity display label.
#[must_use]
pub fn severity_label(value: &str) -> String {
    match value {
        "none" => "None",
        "minor" => "Minor",
        "moderate" => "Moderate",
        "major" => "Major",
        _ => "Not graded",
    }
    .to_string()
}

/// Axis D follow-up-urgency display label.
#[must_use]
pub fn follow_up_urgency_label(value: &str) -> String {
    match value {
        "routine" => "Routine",
        "recommended" => "Recommended",
        "urgent" => "Urgent",
        "critical-alert" => "Critical alert",
        _ => "Not graded",
    }
    .to_string()
}

/// Human-readable consultation-type label.
#[must_use]
pub fn consultation_type_label(value: &str) -> String {
    match value {
        "clinic-review" => "Clinic review",
        "advice-and-guidance" => "Advice and guidance",
        "telephone" => "Telephone",
        "inpatient-review" => "Inpatient review",
        "virtual" => "Virtual",
        _ => "Unspecified",
    }
    .to_string()
}

/// Human-readable response-status label.
#[must_use]
pub fn response_status_label(value: &str) -> String {
    match value {
        "preliminary" => "Preliminary",
        "final" => "Final",
        "amended" => "Amended",
        "cancelled" => "Cancelled",
        _ => "Unspecified",
    }
    .to_string()
}

/// Human-readable primary-diagnosis-category label.
#[must_use]
pub fn primary_diagnosis_category_label(value: &str) -> String {
    match value {
        "coronary-artery-disease" => "Coronary artery disease",
        "heart-failure" => "Heart failure",
        "arrhythmia" => "Arrhythmia",
        "valve-disease" => "Valve disease",
        "hypertension" => "Hypertension",
        "cardiomyopathy" => "Cardiomyopathy",
        "non-cardiac" => "Non-cardiac",
        "no-abnormality" => "No abnormality",
        "other" => "Other",
        _ => "Unspecified",
    }
    .to_string()
}
