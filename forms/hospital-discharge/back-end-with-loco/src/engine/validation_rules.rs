//! Validation rules module.

use super::types::AssessmentData;
use super::utils::non_empty;

/// A declarative NICE NG27 validation rule. Each rule reports whether the
/// corresponding mandatory or optional field is satisfied.
pub struct ValidationRule {
    /// ID.
    pub id: &'static str,
    /// Category.
    pub category: &'static str,
    /// Description.
    pub description: &'static str,
    /// Mandatory.
    pub mandatory: bool,
    /// Evaluate.
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All NICE NG27 discharge-summary completeness rules. IDs are preserved
/// verbatim from the front-end JavaScript implementation. `NG27-M-NNN` rules
/// are mandatory; `NG27-O-NNN` are optional / recommended.
pub fn all_rules() -> Vec<ValidationRule> {
    vec![
        // ─── Patient identification (mandatory) ─────────────────────────
        ValidationRule {
            id: "NG27-M-001",
            category: "Patient Details",
            description: "Patient first name recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.patient_details.first_name),
        },
        ValidationRule {
            id: "NG27-M-002",
            category: "Patient Details",
            description: "Patient last name recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.patient_details.last_name),
        },
        ValidationRule {
            id: "NG27-M-003",
            category: "Patient Details",
            description: "Patient date of birth recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.patient_details.date_of_birth),
        },
        ValidationRule {
            id: "NG27-M-004",
            category: "Patient Details",
            description: "NHS number recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.patient_details.nhs_number),
        },
        ValidationRule {
            id: "NG27-M-005",
            category: "Patient Details",
            description: "GP name and practice recorded.",
            mandatory: true,
            evaluate: |d| {
                non_empty(&d.patient_details.gp_name) && non_empty(&d.patient_details.gp_practice)
            },
        },
        // ─── Admission summary (mandatory) ──────────────────────────────
        ValidationRule {
            id: "NG27-M-006",
            category: "Admission Summary",
            description: "Admission date recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.admission_summary.admission_date),
        },
        ValidationRule {
            id: "NG27-M-007",
            category: "Admission Summary",
            description: "Discharge date recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.admission_summary.discharge_date),
        },
        ValidationRule {
            id: "NG27-M-008",
            category: "Admission Summary",
            description: "Responsible consultant recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.admission_summary.consultant),
        },
        ValidationRule {
            id: "NG27-M-009",
            category: "Admission Summary",
            description: "Reason for admission recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.admission_summary.reason_for_admission),
        },
        // ─── Diagnoses (mandatory) ──────────────────────────────────────
        ValidationRule {
            id: "NG27-M-010",
            category: "Diagnoses",
            description: "At least one primary diagnosis recorded.",
            mandatory: true,
            evaluate: |d| {
                d.diagnoses
                    .diagnoses
                    .iter()
                    .any(|x| x.kind == "primary" && non_empty(&x.description))
            },
        },
        // ─── Procedures (mandatory: either list or explicit none) ──────
        ValidationRule {
            id: "NG27-M-011",
            category: "Procedures",
            description: "Procedures performed listed, or explicitly noted as none.",
            mandatory: true,
            evaluate: |d| {
                d.procedures_performed.no_procedures_performed == "yes"
                    || d.procedures_performed
                        .procedures
                        .iter()
                        .any(|p| non_empty(&p.description))
            },
        },
        // ─── Discharge medications (mandatory) ─────────────────────────
        ValidationRule {
            id: "NG27-M-012",
            category: "Discharge Medications",
            description: "Discharge medications listed (with dose, route, frequency).",
            mandatory: true,
            evaluate: |d| {
                !d.discharge_medications.medications.is_empty()
                    && d.discharge_medications
                        .medications
                        .iter()
                        .all(|m| non_empty(&m.name) && non_empty(&m.dose) && non_empty(&m.frequency))
            },
        },
        ValidationRule {
            id: "NG27-M-013",
            category: "Discharge Medications",
            description: "Medication reconciliation completed.",
            mandatory: true,
            evaluate: |d| d.discharge_medications.reconciliation_completed == "yes",
        },
        ValidationRule {
            id: "NG27-M-014",
            category: "Discharge Medications",
            description: "Allergies reviewed and documented.",
            mandatory: true,
            evaluate: |d| d.discharge_medications.allergies_reviewed == "yes",
        },
        // ─── Follow-up arrangements (mandatory) ────────────────────────
        ValidationRule {
            id: "NG27-M-015",
            category: "Follow-up",
            description: "GP follow-up requirement decided.",
            mandatory: true,
            evaluate: |d| {
                d.followup_arrangements.gp_followup_required == "yes"
                    || d.followup_arrangements.gp_followup_required == "no"
            },
        },
        ValidationRule {
            id: "NG27-M-016",
            category: "Follow-up",
            description: "Outpatient follow-up requirement decided.",
            mandatory: true,
            evaluate: |d| {
                d.followup_arrangements.outpatient_followup_required == "yes"
                    || d.followup_arrangements.outpatient_followup_required == "no"
            },
        },
        // ─── Community care (mandatory) ────────────────────────────────
        ValidationRule {
            id: "NG27-M-017",
            category: "Community Care",
            description: "Discharge destination recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.community_care_instructions.discharge_destination),
        },
        ValidationRule {
            id: "NG27-M-018",
            category: "Community Care",
            description: "Care responsibility recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.community_care_instructions.care_responsibility),
        },
        // ─── Warning signs / safety-netting (mandatory) ────────────────
        ValidationRule {
            id: "NG27-M-019",
            category: "Warning Signs",
            description: "When-to-seek-help advice recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.warning_signs.when_to_seek_help),
        },
        ValidationRule {
            id: "NG27-M-020",
            category: "Warning Signs",
            description: "Safety-netting provided.",
            mandatory: true,
            evaluate: |d| d.warning_signs.safety_neting_provided == "yes",
        },
        // ─── Clinician sign-off (mandatory) ────────────────────────────
        ValidationRule {
            id: "NG27-M-021",
            category: "Clinician Sign-off",
            description: "Signing clinician name recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.clinician_signoff.clinician_name),
        },
        ValidationRule {
            id: "NG27-M-022",
            category: "Clinician Sign-off",
            description: "Signing clinician role recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.clinician_signoff.clinician_role),
        },
        ValidationRule {
            id: "NG27-M-023",
            category: "Clinician Sign-off",
            description: "Sign-off date recorded.",
            mandatory: true,
            evaluate: |d| non_empty(&d.clinician_signoff.signoff_date),
        },
        // ─── Patient / carer acknowledgement (mandatory) ───────────────
        ValidationRule {
            id: "NG27-M-024",
            category: "Patient Acknowledgement",
            description: "Patient confirms understanding of plan.",
            mandatory: true,
            evaluate: |d| d.patient_acknowledgement.patient_understands_plan == "yes",
        },
        ValidationRule {
            id: "NG27-M-025",
            category: "Patient Acknowledgement",
            description: "Medications explained to patient/carer.",
            mandatory: true,
            evaluate: |d| d.patient_acknowledgement.medications_explained == "yes",
        },
        // ─── Optional / recommended fields ─────────────────────────────
        ValidationRule {
            id: "NG27-O-001",
            category: "Patient Details",
            description: "Patient address and postcode recorded.",
            mandatory: false,
            evaluate: |d| {
                non_empty(&d.patient_details.address) && non_empty(&d.patient_details.postcode)
            },
        },
        ValidationRule {
            id: "NG27-O-002",
            category: "Patient Details",
            description: "Next of kin name and phone recorded.",
            mandatory: false,
            evaluate: |d| {
                non_empty(&d.patient_details.next_of_kin_name)
                    && non_empty(&d.patient_details.next_of_kin_phone)
            },
        },
        ValidationRule {
            id: "NG27-O-003",
            category: "Admission Summary",
            description: "Clinical narrative / discharge summary text recorded.",
            mandatory: false,
            evaluate: |d| non_empty(&d.admission_summary.clinical_narrative),
        },
        ValidationRule {
            id: "NG27-O-004",
            category: "Diagnoses",
            description: "Primary diagnosis coded with ICD-10.",
            mandatory: false,
            evaluate: |d| {
                d.diagnoses
                    .diagnoses
                    .iter()
                    .any(|x| x.kind == "primary" && non_empty(&x.icd10))
            },
        },
        ValidationRule {
            id: "NG27-O-005",
            category: "Follow-up",
            description: "At least one follow-up appointment scheduled.",
            mandatory: false,
            evaluate: |d| {
                d.followup_arrangements
                    .appointments
                    .iter()
                    .any(|a| non_empty(&a.provider) && non_empty(&a.date))
            },
        },
        ValidationRule {
            id: "NG27-O-006",
            category: "Warning Signs",
            description: "Written information given to patient.",
            mandatory: false,
            evaluate: |d| d.warning_signs.written_info_given == "yes",
        },
        ValidationRule {
            id: "NG27-O-007",
            category: "Patient Acknowledgement",
            description: "Written discharge summary provided to patient.",
            mandatory: false,
            evaluate: |d| d.patient_acknowledgement.written_summary_provided == "yes",
        },
        ValidationRule {
            id: "NG27-O-008",
            category: "Patient Acknowledgement",
            description: "Patient questions answered.",
            mandatory: false,
            evaluate: |d| d.patient_acknowledgement.questions_answered == "yes",
        },
    ]
}
