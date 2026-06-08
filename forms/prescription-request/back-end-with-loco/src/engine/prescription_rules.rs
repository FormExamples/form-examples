//! Prescription rules module.

use super::types::AssessmentData;

/// A declarative prescription priority-classification rule. Each rule has a
/// `evaluate(data)` function returning true when the rule applies. Ports
/// `front-end-form-with-html/js/prescription-rules.js`.
pub struct PrescriptionRule {
    /// ID.
    pub id: &'static str,
    /// Category.
    pub category: &'static str,
    /// Description.
    pub description: &'static str,
    /// Priority level.
    pub priority_level: &'static str,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All prescription-request priority rules. IDs are preserved verbatim from
/// the JS engine so the same audit trail applies to both stacks.
pub fn all_rules() -> Vec<PrescriptionRule> {
    vec![
        // ─── EMERGENCY ────────────────────────────────────────
        PrescriptionRule {
            id: "RX-EM-001",
            category: "Emergency",
            description: "Emergency prescription request",
            priority_level: "emergency",
            evaluate: |d| d.request_type.is_emergency == "yes",
        },
        // ─── SUBSTITUTION RESTRICTIONS ────────────────────────
        PrescriptionRule {
            id: "RX-SUB-001",
            category: "Substitution",
            description: "No brand substitution allowed",
            priority_level: "urgent",
            evaluate: |d| d.substitution_options.allow_brand_substitution == "no",
        },
        PrescriptionRule {
            id: "RX-SUB-002",
            category: "Substitution",
            description: "No generic substitution allowed",
            priority_level: "urgent",
            evaluate: |d| d.substitution_options.allow_generic_substitution == "no",
        },
        PrescriptionRule {
            id: "RX-SUB-003",
            category: "Substitution",
            description: "No dosage adjustment allowed",
            priority_level: "urgent",
            evaluate: |d| d.substitution_options.allow_dosage_adjustment == "no",
        },
        // ─── COMPLETENESS ────────────────────────────────────
        PrescriptionRule {
            id: "RX-CMP-001",
            category: "Completeness",
            description: "Clinician contact information missing",
            priority_level: "urgent",
            evaluate: |d| {
                d.clinician_information.phone.trim().is_empty()
                    && d.clinician_information.email.trim().is_empty()
            },
        },
        PrescriptionRule {
            id: "RX-CMP-002",
            category: "Completeness",
            description: "Patient contact information missing",
            priority_level: "urgent",
            evaluate: |d| {
                d.patient_information.phone.trim().is_empty()
                    && d.patient_information.email.trim().is_empty()
            },
        },
        PrescriptionRule {
            id: "RX-CMP-003",
            category: "Completeness",
            description: "Medication name not provided",
            priority_level: "urgent",
            evaluate: |d| d.prescription_details.medication_name.trim().is_empty(),
        },
        PrescriptionRule {
            id: "RX-CMP-004",
            category: "Completeness",
            description: "Dosage not specified",
            priority_level: "urgent",
            evaluate: |d| d.prescription_details.dosage.trim().is_empty(),
        },
        // ─── REQUEST TYPE ─────────────────────────────────────
        PrescriptionRule {
            id: "RX-NEW-001",
            category: "Request Type",
            description: "New prescription (not a refill)",
            priority_level: "routine",
            evaluate: |d| d.request_type.is_new_prescription == "yes",
        },
    ]
}
