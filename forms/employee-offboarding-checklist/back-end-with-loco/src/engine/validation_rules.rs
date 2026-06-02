use super::types::AssessmentData;

/// A declarative offboarding validation rule. `evaluate` returns `true`
/// when the item is **outstanding** (the rule has fired).
///
/// - `mandatory` — true if this item must be confirmed for "complete".
/// - `blocker`   — true if outstanding-while-mandatory forces "incomplete".
pub struct ValidationRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub mandatory: bool,
    pub blocker: bool,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// "Outstanding" helper: yes/no field is anything other than "yes".
fn not_yes(v: &str) -> bool {
    v != "yes"
}

/// "Outstanding" helper: yes/no/na field is anything other than "yes" or "na".
fn not_yes_or_na(v: &str) -> bool {
    v != "yes" && v != "na"
}

/// All Employee Offboarding Checklist validation rules. Rule IDs are
/// preserved verbatim from the JavaScript engine.
pub fn all_rules() -> Vec<ValidationRule> {
    vec![
        // ─── EMPLOYEE DETAILS (mandatory non-blocking) ──────────────
        ValidationRule {
            id: "EMP-001",
            category: "Employee Details",
            description: "Employee name not recorded",
            mandatory: true,
            blocker: false,
            evaluate: |d| {
                d.employee_details.first_name.trim().is_empty()
                    || d.employee_details.last_name.trim().is_empty()
            },
        },
        ValidationRule {
            id: "EMP-002",
            category: "Employee Details",
            description: "Last working day not recorded",
            mandatory: true,
            blocker: false,
            evaluate: |d| d.employee_details.last_working_day.trim().is_empty(),
        },
        ValidationRule {
            id: "EMP-003",
            category: "Employee Details",
            description: "Reason for leaving not recorded",
            mandatory: true,
            blocker: false,
            evaluate: |d| d.employee_details.reason_for_leaving.trim().is_empty(),
        },
        // ─── EXIT INTERVIEW (non-blocking) ──────────────────────────
        ValidationRule {
            id: "EXI-001",
            category: "Exit Interview",
            description: "Exit interview not offered",
            mandatory: true,
            blocker: false,
            evaluate: |d| not_yes(&d.exit_interview.interview_offered),
        },
        ValidationRule {
            id: "EXI-002",
            category: "Exit Interview",
            description: "Exit interview not completed",
            mandatory: false,
            blocker: false,
            evaluate: |d| not_yes(&d.exit_interview.interview_completed),
        },
        ValidationRule {
            id: "EXI-003",
            category: "Exit Interview",
            description: "Exit interview feedback not documented",
            mandatory: false,
            blocker: false,
            evaluate: |d| {
                d.exit_interview.interview_completed == "yes"
                    && not_yes(&d.exit_interview.feedback_documented)
            },
        },
        // ─── KNOWLEDGE TRANSFER (non-blocking) ──────────────────────
        ValidationRule {
            id: "KT-001",
            category: "Knowledge Transfer",
            description: "Successor / handover recipient not identified",
            mandatory: true,
            blocker: false,
            evaluate: |d| not_yes(&d.knowledge_transfer.successor_identified),
        },
        ValidationRule {
            id: "KT-002",
            category: "Knowledge Transfer",
            description: "Handover document not created",
            mandatory: true,
            blocker: false,
            evaluate: |d| not_yes(&d.knowledge_transfer.handover_document_created),
        },
        ValidationRule {
            id: "KT-003",
            category: "Knowledge Transfer",
            description: "Work-in-progress not documented",
            mandatory: false,
            blocker: false,
            evaluate: |d| not_yes(&d.knowledge_transfer.work_in_progress_documented),
        },
        ValidationRule {
            id: "KT-004",
            category: "Knowledge Transfer",
            description: "Clinical caseload not reassigned",
            mandatory: true,
            blocker: false,
            evaluate: |d| not_yes(&d.knowledge_transfer.clinical_caseload_reassigned),
        },
        // ─── EQUIPMENT RETURN (mandatory + blocker) ─────────────────
        ValidationRule {
            id: "EQ-001",
            category: "Equipment Return",
            description: "Laptop not returned",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes_or_na(&d.equipment_return.laptop_returned),
        },
        ValidationRule {
            id: "EQ-002",
            category: "Equipment Return",
            description: "Mobile phone not returned",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes_or_na(&d.equipment_return.mobile_phone_returned),
        },
        ValidationRule {
            id: "EQ-003",
            category: "Equipment Return",
            description: "ID badge not returned",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes_or_na(&d.equipment_return.id_badge_returned),
        },
        ValidationRule {
            id: "EQ-004",
            category: "Equipment Return",
            description: "Keys not returned",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes_or_na(&d.equipment_return.keys_returned),
        },
        ValidationRule {
            id: "EQ-005",
            category: "Equipment Return",
            description: "Uniform not returned",
            mandatory: false,
            blocker: false,
            evaluate: |d| not_yes_or_na(&d.equipment_return.uniform_returned),
        },
        ValidationRule {
            id: "EQ-006",
            category: "Equipment Return",
            description: "Parking pass not returned",
            mandatory: false,
            blocker: false,
            evaluate: |d| not_yes_or_na(&d.equipment_return.parking_pass_returned),
        },
        // ─── ACCESS REVOCATION (mandatory + blocker for IT criticals) ─
        ValidationRule {
            id: "AC-001",
            category: "Access Revocation",
            description: "Email account not revoked",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.access_revocation.email_revoked),
        },
        ValidationRule {
            id: "AC-002",
            category: "Access Revocation",
            description: "EHR / EPR access not revoked",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.access_revocation.ehr_epr_revoked),
        },
        ValidationRule {
            id: "AC-003",
            category: "Access Revocation",
            description: "VPN access not revoked",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.access_revocation.vpn_revoked),
        },
        ValidationRule {
            id: "AC-004",
            category: "Access Revocation",
            description: "Active Directory account not disabled",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.access_revocation.active_directory_disabled),
        },
        ValidationRule {
            id: "AC-005",
            category: "Access Revocation",
            description: "Building access not revoked",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.access_revocation.building_access_revoked),
        },
        ValidationRule {
            id: "AC-006",
            category: "Access Revocation",
            description: "Cloud applications access not revoked",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.access_revocation.cloud_apps_revoked),
        },
        // ─── FINAL PAYROLL & BENEFITS (mandatory + blocker for payroll) ─
        ValidationRule {
            id: "PAY-001",
            category: "Final Payroll & Benefits",
            description: "Final salary not calculated",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.final_payroll_benefits.final_salary_calculated),
        },
        ValidationRule {
            id: "PAY-002",
            category: "Final Payroll & Benefits",
            description: "Accrued holiday pay not settled",
            mandatory: true,
            blocker: false,
            evaluate: |d| not_yes(&d.final_payroll_benefits.accrued_holiday_paid),
        },
        ValidationRule {
            id: "PAY-003",
            category: "Final Payroll & Benefits",
            description: "P45 / final tax document not issued",
            mandatory: true,
            blocker: false,
            evaluate: |d| not_yes(&d.final_payroll_benefits.p45_issued),
        },
        ValidationRule {
            id: "PAY-004",
            category: "Final Payroll & Benefits",
            description: "Payroll details not confirmed with employee",
            mandatory: false,
            blocker: false,
            evaluate: |d| not_yes(&d.final_payroll_benefits.payroll_details_confirmed),
        },
        // ─── REFERENCES & RECOMMENDATIONS (non-blocking) ─────────────
        ValidationRule {
            id: "REF-001",
            category: "References & Recommendations",
            description: "Reference consent not obtained or declined",
            mandatory: false,
            blocker: false,
            evaluate: |d| d.references_recommendations.reference_consent_given.is_empty(),
        },
        ValidationRule {
            id: "REF-002",
            category: "References & Recommendations",
            description: "Reference policy not explained",
            mandatory: false,
            blocker: false,
            evaluate: |d| not_yes(&d.references_recommendations.reference_policy_explained),
        },
        // ─── NDA & POST-EMPLOYMENT (mandatory + blocker) ─────────────
        ValidationRule {
            id: "NDA-001",
            category: "Non-Disclosure & Post-Employment",
            description: "Confidentiality not reaffirmed",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.non_disclosure_post_employment.confidentiality_reaffirmed),
        },
        ValidationRule {
            id: "NDA-002",
            category: "Non-Disclosure & Post-Employment",
            description: "Restrictive covenants not explained",
            mandatory: true,
            blocker: false,
            evaluate: |d| {
                not_yes(&d.non_disclosure_post_employment.restrictive_covenants_explained)
            },
        },
        ValidationRule {
            id: "NDA-003",
            category: "Non-Disclosure & Post-Employment",
            description: "Intellectual property not assigned to employer",
            mandatory: true,
            blocker: false,
            evaluate: |d| {
                not_yes(&d.non_disclosure_post_employment.intellectual_property_assigned)
            },
        },
        ValidationRule {
            id: "NDA-004",
            category: "Non-Disclosure & Post-Employment",
            description: "Organisational data not returned or destroyed",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.non_disclosure_post_employment.data_returned_or_destroyed),
        },
        // ─── FORWARDING DETAILS (non-blocking) ───────────────────────
        ValidationRule {
            id: "FWD-001",
            category: "Forwarding Details",
            description: "Forwarding address not recorded",
            mandatory: false,
            blocker: false,
            evaluate: |d| {
                d.forwarding_details.forwarding_address_line1.trim().is_empty()
                    || d.forwarding_details.forwarding_postcode.trim().is_empty()
            },
        },
        ValidationRule {
            id: "FWD-002",
            category: "Forwarding Details",
            description: "Personal contact details not confirmed",
            mandatory: false,
            blocker: false,
            evaluate: |d| not_yes(&d.forwarding_details.forwarding_details_confirmed),
        },
        // ─── SIGN-OFF (mandatory + blocker for HR/manager/IT) ────────
        ValidationRule {
            id: "SO-001",
            category: "Sign-off",
            description: "HR has not signed off",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.signoff.hr_signed_off),
        },
        ValidationRule {
            id: "SO-002",
            category: "Sign-off",
            description: "Line manager has not signed off",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.signoff.line_manager_signed_off),
        },
        ValidationRule {
            id: "SO-003",
            category: "Sign-off",
            description: "IT has not signed off",
            mandatory: true,
            blocker: true,
            evaluate: |d| not_yes(&d.signoff.it_signed_off),
        },
        ValidationRule {
            id: "SO-004",
            category: "Sign-off",
            description: "Employee has not acknowledged offboarding",
            mandatory: false,
            blocker: false,
            evaluate: |d| not_yes(&d.signoff.employee_acknowledged),
        },
    ]
}
