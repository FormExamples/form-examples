use super::types::AssessmentData;
use super::utils::count_contributing_factors;

/// A declarative grading rule. Each rule fires when its condition is true.
/// Grade scale: 1 = minimal, 2 = mild, 3 = moderate, 4 = severe, 5 = critical.
pub struct ErrorRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub grade: i32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All medical-error-report grading rules. Rule IDs are preserved verbatim
/// from the JavaScript front-end engine (`error-rules.js`).
pub fn all_rules() -> Vec<ErrorRule> {
    vec![
        // ─── WHO SEVERITY ──────────────────────────────────────────
        ErrorRule {
            id: "SEV-001",
            category: "Severity",
            description: "Near miss - error did not reach patient",
            grade: 1,
            evaluate: |d| d.error_classification.who_severity == "near-miss",
        },
        ErrorRule {
            id: "SEV-002",
            category: "Severity",
            description: "Mild severity - temporary minor harm",
            grade: 2,
            evaluate: |d| d.error_classification.who_severity == "mild",
        },
        ErrorRule {
            id: "SEV-003",
            category: "Severity",
            description: "Moderate severity - temporary significant harm",
            grade: 3,
            evaluate: |d| d.error_classification.who_severity == "moderate",
        },
        ErrorRule {
            id: "SEV-004",
            category: "Severity",
            description: "Severe - permanent harm to patient",
            grade: 4,
            evaluate: |d| d.error_classification.who_severity == "severe",
        },
        ErrorRule {
            id: "SEV-005",
            category: "Severity",
            description: "Critical - death or life-threatening event",
            grade: 5,
            evaluate: |d| d.error_classification.who_severity == "critical",
        },
        // ─── NCC MERP CATEGORIES ───────────────────────────────────
        ErrorRule {
            id: "MERP-001",
            category: "NCC MERP",
            description: "NCC MERP Category E - temporary harm requiring intervention",
            grade: 3,
            evaluate: |d| d.error_classification.ncc_merp_category == "E",
        },
        ErrorRule {
            id: "MERP-002",
            category: "NCC MERP",
            description: "NCC MERP Category F - temporary harm requiring hospitalisation",
            grade: 3,
            evaluate: |d| d.error_classification.ncc_merp_category == "F",
        },
        ErrorRule {
            id: "MERP-003",
            category: "NCC MERP",
            description: "NCC MERP Category G - permanent harm",
            grade: 4,
            evaluate: |d| d.error_classification.ncc_merp_category == "G",
        },
        ErrorRule {
            id: "MERP-004",
            category: "NCC MERP",
            description: "NCC MERP Category H - intervention to sustain life",
            grade: 5,
            evaluate: |d| d.error_classification.ncc_merp_category == "H",
        },
        ErrorRule {
            id: "MERP-005",
            category: "NCC MERP",
            description: "NCC MERP Category I - patient death",
            grade: 5,
            evaluate: |d| d.error_classification.ncc_merp_category == "I",
        },
        // ─── PATIENT OUTCOME ───────────────────────────────────────
        ErrorRule {
            id: "OUT-001",
            category: "Outcome",
            description: "Patient died as a result of the error",
            grade: 5,
            evaluate: |d| d.patient_outcome.patient_died == "yes",
        },
        ErrorRule {
            id: "OUT-002",
            category: "Outcome",
            description: "Permanent disability resulted from error",
            grade: 4,
            evaluate: |d| d.patient_outcome.permanent_disability == "yes",
        },
        ErrorRule {
            id: "OUT-003",
            category: "Outcome",
            description: "Extended hospital stay required",
            grade: 3,
            evaluate: |d| d.patient_outcome.extended_hospital_stay == "yes",
        },
        ErrorRule {
            id: "OUT-004",
            category: "Outcome",
            description: "Readmission required",
            grade: 3,
            evaluate: |d| d.patient_outcome.readmission_required == "yes",
        },
        ErrorRule {
            id: "OUT-005",
            category: "Outcome",
            description: "Additional treatment required due to error",
            grade: 2,
            evaluate: |d| d.patient_outcome.additional_treatment_required == "yes",
        },
        ErrorRule {
            id: "OUT-006",
            category: "Outcome",
            description: "Severe harm level reported",
            grade: 4,
            evaluate: |d| d.patient_outcome.harm_level == "severe",
        },
        ErrorRule {
            id: "OUT-007",
            category: "Outcome",
            description: "Death reported as harm level",
            grade: 5,
            evaluate: |d| d.patient_outcome.harm_level == "death",
        },
        // ─── ERROR TYPE ────────────────────────────────────────────
        ErrorRule {
            id: "ET-001",
            category: "Error Type",
            description: "Medication error",
            grade: 2,
            evaluate: |d| d.error_classification.error_type == "medication",
        },
        ErrorRule {
            id: "ET-002",
            category: "Error Type",
            description: "Surgical error",
            grade: 3,
            evaluate: |d| d.error_classification.error_type == "surgical",
        },
        ErrorRule {
            id: "ET-003",
            category: "Error Type",
            description: "Transfusion error",
            grade: 3,
            evaluate: |d| d.error_classification.error_type == "transfusion",
        },
        ErrorRule {
            id: "ET-004",
            category: "Error Type",
            description: "Diagnostic error",
            grade: 2,
            evaluate: |d| d.error_classification.error_type == "diagnostic",
        },
        // ─── CONTRIBUTING FACTORS ──────────────────────────────────
        ErrorRule {
            id: "CF-001",
            category: "Contributing Factors",
            description: "Multiple contributing factors identified (3+)",
            grade: 3,
            evaluate: |d| count_contributing_factors(&d.contributing_factors) >= 3,
        },
        ErrorRule {
            id: "CF-002",
            category: "Contributing Factors",
            description: "Communication failure contributed to error",
            grade: 2,
            evaluate: |d| d.contributing_factors.communication_failure == "yes",
        },
        ErrorRule {
            id: "CF-003",
            category: "Contributing Factors",
            description: "Policy or protocol not followed",
            grade: 2,
            evaluate: |d| d.contributing_factors.policy_not_followed == "yes",
        },
        ErrorRule {
            id: "CF-004",
            category: "Contributing Factors",
            description: "Equipment failure contributed",
            grade: 2,
            evaluate: |d| d.contributing_factors.equipment_failure == "yes",
        },
        ErrorRule {
            id: "CF-005",
            category: "Contributing Factors",
            description: "Handover failure contributed",
            grade: 2,
            evaluate: |d| d.contributing_factors.handover_failure == "yes",
        },
        // ─── PREVENTABILITY ────────────────────────────────────────
        ErrorRule {
            id: "PRV-001",
            category: "Preventability",
            description: "Error was clearly preventable",
            grade: 3,
            evaluate: |d| d.error_classification.preventability == "clearly-preventable",
        },
        ErrorRule {
            id: "PRV-002",
            category: "Preventability",
            description: "Error was probably preventable",
            grade: 2,
            evaluate: |d| d.error_classification.preventability == "probably-preventable",
        },
        // ─── RECURRENCE ────────────────────────────────────────────
        ErrorRule {
            id: "REC-001",
            category: "Recurrence",
            description: "Recurrence very likely",
            grade: 4,
            evaluate: |d| d.error_classification.recurrence_likelihood == "very-likely",
        },
        ErrorRule {
            id: "REC-002",
            category: "Recurrence",
            description: "Recurrence likely",
            grade: 3,
            evaluate: |d| d.error_classification.recurrence_likelihood == "likely",
        },
        // ─── SIMILAR INCIDENTS ─────────────────────────────────────
        ErrorRule {
            id: "SIM-001",
            category: "Root Cause",
            description: "Similar incidents have occurred previously",
            grade: 3,
            evaluate: |d| d.root_cause_analysis.similar_incidents == "yes",
        },
        // ─── STAFFING ──────────────────────────────────────────────
        ErrorRule {
            id: "STF-001",
            category: "Staffing",
            description: "Unit was understaffed at time of incident",
            grade: 2,
            evaluate: |d| d.incident_details.staffing_level == "understaffed",
        },
        // ─── DUTY OF CANDOUR ───────────────────────────────────────
        ErrorRule {
            id: "DOC-001",
            category: "Duty of Candour",
            description: "Duty of candour applies but not yet completed",
            grade: 3,
            evaluate: |d| {
                d.patient_involvement.duty_of_candour_applies == "yes"
                    && d.patient_involvement.duty_of_candour_completed == "no"
            },
        },
    ]
}
