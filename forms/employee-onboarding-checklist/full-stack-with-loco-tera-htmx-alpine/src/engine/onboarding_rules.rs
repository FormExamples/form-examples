use super::types::AssessmentData;

/// A declarative onboarding rule. Each rule fires when its condition is true.
/// Grade 1 = minor, 2 = moderate, 3 = significant, 4 = critical.
pub struct OnboardingRule {
    pub id: &'static str,
    pub category: &'static str,
    pub description: &'static str,
    pub grade: i32,
    pub evaluate: fn(&AssessmentData) -> bool,
}

/// All onboarding compliance rules, ported 1-to-1 from `onboarding-rules.js`.
pub fn all_rules() -> Vec<OnboardingRule> {
    vec![
        // ─── PRE-EMPLOYMENT CHECKS ──────────────────────────────────
        OnboardingRule {
            id: "DBS-001",
            category: "Pre-Employment",
            description: "DBS check not started",
            grade: 4,
            evaluate: |d| d.pre_employment_checks.dbs_check_status == "not-started",
        },
        OnboardingRule {
            id: "DBS-002",
            category: "Pre-Employment",
            description: "DBS check applied but not yet cleared",
            grade: 2,
            evaluate: |d| {
                d.pre_employment_checks.dbs_check_status == "applied"
                    || d.pre_employment_checks.dbs_check_status == "received"
            },
        },
        OnboardingRule {
            id: "RTW-001",
            category: "Pre-Employment",
            description: "Right to work not verified",
            grade: 4,
            evaluate: |d| d.pre_employment_checks.right_to_work_verified == "no",
        },
        OnboardingRule {
            id: "REF-001",
            category: "Pre-Employment",
            description: "References not satisfactory",
            grade: 3,
            evaluate: |d| d.pre_employment_checks.references_satisfactory == "no",
        },
        OnboardingRule {
            id: "REF-002",
            category: "Pre-Employment",
            description: "References incomplete",
            grade: 2,
            evaluate: |d| match (
                d.pre_employment_checks.references_received,
                d.pre_employment_checks.references_required,
            ) {
                (Some(rec), Some(req)) => rec < req,
                _ => false,
            },
        },
        OnboardingRule {
            id: "ID-001",
            category: "Pre-Employment",
            description: "Identity not verified",
            grade: 3,
            evaluate: |d| d.pre_employment_checks.identity_verified == "no",
        },
        // ─── OCCUPATIONAL HEALTH ────────────────────────────────────
        OnboardingRule {
            id: "OH-001",
            category: "Occupational Health",
            description: "Occupational health clearance not received",
            grade: 3,
            evaluate: |d| d.occupational_health.oh_clearance_received == "no",
        },
        OnboardingRule {
            id: "OH-002",
            category: "Occupational Health",
            description: "Not fit to work",
            grade: 4,
            evaluate: |d| d.occupational_health.fit_to_work == "no",
        },
        OnboardingRule {
            id: "OH-003",
            category: "Occupational Health",
            description: "Occupational health restrictions apply",
            grade: 2,
            evaluate: |d| d.occupational_health.oh_restrictions == "yes",
        },
        OnboardingRule {
            id: "OH-004",
            category: "Occupational Health",
            description: "Immunisation status incomplete",
            grade: 2,
            evaluate: |d| d.occupational_health.immunisation_status == "incomplete",
        },
        // ─── MANDATORY TRAINING ─────────────────────────────────────
        OnboardingRule {
            id: "TR-001",
            category: "Mandatory Training",
            description: "Fire safety training not completed",
            grade: 3,
            evaluate: |d| d.mandatory_training.fire_safety_completed == "no",
        },
        OnboardingRule {
            id: "TR-002",
            category: "Mandatory Training",
            description: "Manual handling training not completed",
            grade: 2,
            evaluate: |d| d.mandatory_training.manual_handling_completed == "no",
        },
        OnboardingRule {
            id: "TR-003",
            category: "Mandatory Training",
            description: "Infection control training not completed",
            grade: 3,
            evaluate: |d| d.mandatory_training.infection_control_completed == "no",
        },
        OnboardingRule {
            id: "TR-004",
            category: "Mandatory Training",
            description: "Safeguarding adults training not completed",
            grade: 3,
            evaluate: |d| d.mandatory_training.safeguarding_adults_completed == "no",
        },
        OnboardingRule {
            id: "TR-005",
            category: "Mandatory Training",
            description: "Safeguarding children training not completed",
            grade: 3,
            evaluate: |d| d.mandatory_training.safeguarding_children_completed == "no",
        },
        OnboardingRule {
            id: "TR-006",
            category: "Mandatory Training",
            description: "Information governance training not completed",
            grade: 3,
            evaluate: |d| d.mandatory_training.information_governance_completed == "no",
        },
        OnboardingRule {
            id: "TR-007",
            category: "Mandatory Training",
            description: "Basic life support training not completed",
            grade: 3,
            evaluate: |d| d.mandatory_training.basic_life_support_completed == "no",
        },
        // ─── PROFESSIONAL REGISTRATION ──────────────────────────────
        OnboardingRule {
            id: "REG-001",
            category: "Professional Registration",
            description: "Professional registration required but not verified",
            grade: 4,
            evaluate: |d| {
                d.professional_registration.registration_required == "yes"
                    && d.professional_registration.registration_verified == "no"
            },
        },
        OnboardingRule {
            id: "REG-002",
            category: "Professional Registration",
            description: "Professional registration has conditions",
            grade: 3,
            evaluate: |d| d.professional_registration.registration_conditions == "yes",
        },
        // ─── IT SYSTEMS ─────────────────────────────────────────────
        OnboardingRule {
            id: "IT-001",
            category: "IT Systems",
            description: "Clinical system access not granted",
            grade: 2,
            evaluate: |d| d.it_systems_access.clinical_system_access == "no",
        },
        OnboardingRule {
            id: "IT-002",
            category: "IT Systems",
            description: "Email account not created",
            grade: 1,
            evaluate: |d| d.it_systems_access.email_account_created == "no",
        },
        OnboardingRule {
            id: "IT-003",
            category: "IT Systems",
            description: "NHS smartcard not issued",
            grade: 2,
            evaluate: |d| d.it_systems_access.nhs_smartcard_issued == "no",
        },
        // ─── UNIFORM & ID ───────────────────────────────────────────
        OnboardingRule {
            id: "UID-001",
            category: "Uniform & ID",
            description: "ID badge not issued",
            grade: 2,
            evaluate: |d| d.uniform_id_badge.id_badge_issued == "no",
        },
        OnboardingRule {
            id: "UID-002",
            category: "Uniform & ID",
            description: "Access card not issued",
            grade: 2,
            evaluate: |d| d.uniform_id_badge.access_card_issued == "no",
        },
        // ─── INDUCTION ──────────────────────────────────────────────
        OnboardingRule {
            id: "IND-001",
            category: "Induction",
            description: "Corporate induction not completed",
            grade: 2,
            evaluate: |d| d.induction_programme.corporate_induction_completed == "no",
        },
        OnboardingRule {
            id: "IND-002",
            category: "Induction",
            description: "Local induction not completed",
            grade: 2,
            evaluate: |d| d.induction_programme.local_induction_completed == "no",
        },
        // ─── SIGN-OFF & COMPLIANCE ──────────────────────────────────
        OnboardingRule {
            id: "SO-001",
            category: "Sign-off",
            description: "Confidentiality agreement not signed",
            grade: 3,
            evaluate: |d| d.sign_off_compliance.confidentiality_agreement_signed == "no",
        },
        OnboardingRule {
            id: "SO-002",
            category: "Sign-off",
            description: "GDPR training not completed",
            grade: 3,
            evaluate: |d| d.sign_off_compliance.gdpr_training_completed == "no",
        },
        OnboardingRule {
            id: "SO-003",
            category: "Sign-off",
            description: "Manager sign-off not obtained",
            grade: 2,
            evaluate: |d| d.sign_off_compliance.manager_signed_off == "no",
        },
    ]
}
