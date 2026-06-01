use super::types::AssessmentData;

/// A declarative required-field rule. Each rule fires when the named
/// field is empty / unanswered. The Svelte engine encodes these as a
/// data-driven list; the Rust port keeps the same shape with a typed
/// `is_empty` closure so the data model can stay strongly typed.
pub struct ValidationRule {
    pub id: &'static str,
    pub section: &'static str,
    pub field: &'static str,
    pub message: &'static str,
    pub is_empty: fn(&AssessmentData) -> bool,
}

/// All required-field rules for the research-and-planning privacy
/// notice form. The IDs MUST stay verbatim (`REQ-RD-*`, `REQ-AK-*`) —
/// they are referenced from the SvelteKit engine, the docs, and the
/// FHIR validation map.
pub fn all_rules() -> Vec<ValidationRule> {
    vec![
        // ───────── Step 1 — Recipient Details ─────────
        ValidationRule {
            id: "REQ-RD-001",
            section: "recipientDetails",
            field: "organisationName",
            message: "Organisation name is required",
            is_empty: |d| d.recipient_details.organisation_name.is_empty(),
        },
        ValidationRule {
            id: "REQ-RD-002",
            section: "recipientDetails",
            field: "recipientName",
            message: "Recipient name is required",
            is_empty: |d| d.recipient_details.recipient_name.is_empty(),
        },
        // ───── Step 3 — Acknowledgement & Signature ────
        ValidationRule {
            id: "REQ-AK-001",
            section: "acknowledgementSignature",
            field: "agreed",
            message: "Recipient must check the acknowledgement checkbox",
            // `false` counts as empty for the agreement boolean.
            is_empty: |d| !d.acknowledgement_signature.agreed,
        },
        ValidationRule {
            id: "REQ-AK-002",
            section: "acknowledgementSignature",
            field: "type1OptOut",
            message: "Recipient must select a Type 1 opt-out preference",
            is_empty: |d| d.acknowledgement_signature.type1_opt_out.is_empty(),
        },
        ValidationRule {
            id: "REQ-AK-003",
            section: "acknowledgementSignature",
            field: "nationalDataOptOut",
            message: "Recipient must select a National Data Opt-Out preference",
            is_empty: |d| d.acknowledgement_signature.national_data_opt_out.is_empty(),
        },
        ValidationRule {
            id: "REQ-AK-004",
            section: "acknowledgementSignature",
            field: "recipientTypedFullName",
            message: "Recipient must type their full name",
            is_empty: |d| d.acknowledgement_signature.recipient_typed_full_name.is_empty(),
        },
        ValidationRule {
            id: "REQ-AK-005",
            section: "acknowledgementSignature",
            field: "recipientTypedDate",
            message: "Recipient must enter today's date",
            is_empty: |d| d.acknowledgement_signature.recipient_typed_date.is_empty(),
        },
    ]
}
