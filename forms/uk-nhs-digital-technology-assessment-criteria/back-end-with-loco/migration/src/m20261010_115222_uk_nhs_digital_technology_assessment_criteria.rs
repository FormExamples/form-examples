use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "uk_nhs_digital_technology_assessment_criteria",
            &[
                ("id", ColType::PkUuid),
                ("deleted_at", ColType::TimestampWithTimeZoneNull),
                ("status", ColType::StringWithDefault("draft".to_string())),
                ("assessment_date", ColType::DateNull),
                ("review_due_date", ColType::DateNull),
                ("dtac_version", ColType::StringWithDefault(String::new())),
                (
                    "commissioning_organisation",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "a1_company_registered_in_uk",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "a2_ico_registration_current",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "a3_senior_responsible_owner_named",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "a4_incident_contact_published",
                    ColType::StringWithDefault(String::new()),
                ),
                ("section_a_notes", ColType::TextWithDefault(String::new())),
                (
                    "b1_intended_use_and_users_defined",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "b2_evidence_of_benefit",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "b3_outcome_measures_defined",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "b4_cost_effectiveness_evidence",
                    ColType::StringWithDefault(String::new()),
                ),
                ("section_b_notes", ColType::TextWithDefault(String::new())),
                (
                    "c1_clinical_safety_officer_named",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "c2_clinical_risk_management_plan",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "c3_hazard_log_maintained",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "c4_clinical_safety_case_report",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "c5_clinical_safety_officer_registration_verified",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "c6_medical_device_registration_if_applicable",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "c7_post_market_surveillance",
                    ColType::StringWithDefault(String::new()),
                ),
                ("section_c_notes", ColType::TextWithDefault(String::new())),
                (
                    "d1_data_protection_officer_or_lead",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "d2_dpia_completed",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "d3_dspt_standards_met",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "d4_lawful_basis_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "d5_controller_processor_roles_defined",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "d6_data_location_and_transfers",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "d7_retention_and_deletion_policy",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "d8_privacy_notice_published",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "d9_data_subject_rights_supported",
                    ColType::StringWithDefault(String::new()),
                ),
                ("section_d_notes", ColType::TextWithDefault(String::new())),
                (
                    "e1_cyber_essentials_plus_or_iso27001",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "e2_penetration_test_within_12_months",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "e3_vulnerability_management",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "e4_encryption_in_transit_and_at_rest",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "e5_access_control_and_mfa",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "e6_audit_logging",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "e7_business_continuity_and_backup",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "e8_secure_development_lifecycle",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "e9_incident_response_and_breach_notification",
                    ColType::StringWithDefault(String::new()),
                ),
                ("section_e_notes", ColType::TextWithDefault(String::new())),
                (
                    "f1_open_standards_apis",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "f2_fhir_or_nhs_standard_apis",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "f3_nhs_number_supported",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "f4_clinical_terminology_standards",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "f5_nhs_login_integration",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "f6_nhs_systems_integration_documented",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "f7_data_portability_export",
                    ColType::StringWithDefault(String::new()),
                ),
                ("section_f_notes", ColType::TextWithDefault(String::new())),
                (
                    "g1_user_research_with_target_users",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "g2_wcag_aa_conformance",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "g3_accessibility_statement_published",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "g4_nhs_service_manual_followed",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "g5_assistive_technology_tested",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "g6_digital_inclusion_considered",
                    ColType::StringWithDefault(String::new()),
                ),
                (
                    "g7_user_feedback_mechanism",
                    ColType::StringWithDefault(String::new()),
                ),
                ("section_g_notes", ColType::TextWithDefault(String::new())),
                ("assessor_notes", ColType::TextWithDefault(String::new())),
                ("supplier_id", ColType::Uuid),
                ("product_id", ColType::Uuid),
                ("assessor_id", ColType::Uuid),
            ],
            &[
                ("supplier", "supplier_id"),
                ("product", "product_id"),
                ("assessor", "assessor_id"),
            ],
        )
        .await?;
        m.get_connection()
            .execute_unprepared("ALTER TABLE uk_nhs_digital_technology_assessment_criteria ALTER COLUMN id SET DEFAULT gen_random_uuid()")
            .await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "uk_nhs_digital_technology_assessment_criteria").await
    }
}
