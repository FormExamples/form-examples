use super::types::ValidationRule;

/// All required-field validation rules for the Code of Conduct Notice.
/// Ported 1:1 from `front-end-form-with-html/js/validation-rules.js`.
pub fn validation_rules() -> Vec<ValidationRule> {
    vec![
        // Recipient Details
        ValidationRule {
            id: "REQ-RD-001",
            section: "recipientDetails",
            field: "organisationName",
            message: "Organisation name is required",
        },
        ValidationRule {
            id: "REQ-RD-002",
            section: "recipientDetails",
            field: "recipientName",
            message: "Recipient name is required",
        },
        ValidationRule {
            id: "REQ-RD-003",
            section: "recipientDetails",
            field: "recipientRole",
            message: "Recipient role is required",
        },
        // Acknowledgement & Signature
        ValidationRule {
            id: "REQ-AK-001",
            section: "acknowledgementSignature",
            field: "agreed",
            message: "Recipient must check the acknowledgement checkbox",
        },
        ValidationRule {
            id: "REQ-AK-002",
            section: "acknowledgementSignature",
            field: "recipientTypedFullName",
            message: "Recipient must type their full name",
        },
        ValidationRule {
            id: "REQ-AK-003",
            section: "acknowledgementSignature",
            field: "recipientTypedDate",
            message: "Recipient must enter today's date",
        },
    ]
}

/// Inspect a single field on an [`AssessmentData`] and return `true` when it
/// is considered empty (and therefore the matching rule should fire).
pub fn field_is_empty(
    data: &super::types::AssessmentData,
    section: &str,
    field: &str,
) -> bool {
    match (section, field) {
        ("recipientDetails", "organisationName") => {
            data.recipient_details.organisation_name.trim().is_empty()
        }
        ("recipientDetails", "recipientName") => {
            data.recipient_details.recipient_name.trim().is_empty()
        }
        ("recipientDetails", "recipientRole") => {
            data.recipient_details.recipient_role.trim().is_empty()
        }
        ("recipientDetails", "recipientEmployeeId") => {
            data.recipient_details.recipient_employee_id.trim().is_empty()
        }
        ("acknowledgementSignature", "agreed") => !data.acknowledgement_signature.agreed,
        ("acknowledgementSignature", "recipientTypedFullName") => {
            data.acknowledgement_signature
                .recipient_typed_full_name
                .trim()
                .is_empty()
        }
        ("acknowledgementSignature", "recipientTypedDate") => {
            data.acknowledgement_signature
                .recipient_typed_date
                .trim()
                .is_empty()
        }
        _ => true,
    }
}
