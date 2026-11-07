//! Uk NHS digital technology assessment criteria module.

use serde::{Deserialize, Serialize};

use crate::support::prelude::*;

/// Model.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Model {
    /// Created at.
    pub created_at: DateTimeWithTimeZone,
    /// Updated at.
    pub updated_at: DateTimeWithTimeZone,
    /// ID.
    pub id: Uuid,
    /// Deleted at.
    #[serde(skip)]
    pub deleted_at: Option<DateTimeWithTimeZone>,
    /// Status.
    pub status: String,
    /// Assessment date.
    pub assessment_date: Option<Date>,
    /// Review due date.
    pub review_due_date: Option<Date>,
    /// Dtac version.
    pub dtac_version: String,
    /// Commissioning organisation.
    pub commissioning_organisation: String,
    /// A1 company registered in uk.
    pub a1_company_registered_in_uk: String,
    /// A2 ico registration current.
    pub a2_ico_registration_current: String,
    /// A3 senior responsible owner named.
    pub a3_senior_responsible_owner_named: String,
    /// A4 incident contact published.
    pub a4_incident_contact_published: String,
    /// Section a notes.
    pub section_a_notes: String,
    /// B1 intended use and users defined.
    pub b1_intended_use_and_users_defined: String,
    /// B2 evidence of benefit.
    pub b2_evidence_of_benefit: String,
    /// B3 outcome measures defined.
    pub b3_outcome_measures_defined: String,
    /// B4 cost effectiveness evidence.
    pub b4_cost_effectiveness_evidence: String,
    /// Section b notes.
    pub section_b_notes: String,
    /// C1 clinical safety officer named.
    pub c1_clinical_safety_officer_named: String,
    /// C2 clinical risk management plan.
    pub c2_clinical_risk_management_plan: String,
    /// C3 hazard log maintained.
    pub c3_hazard_log_maintained: String,
    /// C4 clinical safety case report.
    pub c4_clinical_safety_case_report: String,
    /// C5 clinical safety officer registration verified.
    pub c5_clinical_safety_officer_registration_verified: String,
    /// C6 medical device registration if applicable.
    pub c6_medical_device_registration_if_applicable: String,
    /// C7 post market surveillance.
    pub c7_post_market_surveillance: String,
    /// Section c notes.
    pub section_c_notes: String,
    /// D1 data protection officer or lead.
    pub d1_data_protection_officer_or_lead: String,
    /// D2 dpia completed.
    pub d2_dpia_completed: String,
    /// D3 dspt standards met.
    pub d3_dspt_standards_met: String,
    /// D4 lawful basis documented.
    pub d4_lawful_basis_documented: String,
    /// D5 controller processor roles defined.
    pub d5_controller_processor_roles_defined: String,
    /// D6 data location and transfers.
    pub d6_data_location_and_transfers: String,
    /// D7 retention and deletion policy.
    pub d7_retention_and_deletion_policy: String,
    /// D8 privacy notice published.
    pub d8_privacy_notice_published: String,
    /// D9 data subject rights supported.
    pub d9_data_subject_rights_supported: String,
    /// Section d notes.
    pub section_d_notes: String,
    /// E1 cyber essentials plus or iso27001.
    pub e1_cyber_essentials_plus_or_iso27001: String,
    /// E2 penetration test within 12 months.
    pub e2_penetration_test_within_12_months: String,
    /// E3 vulnerability management.
    pub e3_vulnerability_management: String,
    /// E4 encryption in transit and at rest.
    pub e4_encryption_in_transit_and_at_rest: String,
    /// E5 access control and mfa.
    pub e5_access_control_and_mfa: String,
    /// E6 audit logging.
    pub e6_audit_logging: String,
    /// E7 business continuity and backup.
    pub e7_business_continuity_and_backup: String,
    /// E8 secure development lifecycle.
    pub e8_secure_development_lifecycle: String,
    /// E9 incident response and breach notification.
    pub e9_incident_response_and_breach_notification: String,
    /// Section e notes.
    pub section_e_notes: String,
    /// F1 open standards apis.
    pub f1_open_standards_apis: String,
    /// F2 fhir or NHS standard apis.
    pub f2_fhir_or_nhs_standard_apis: String,
    /// F3 NHS number supported.
    pub f3_nhs_number_supported: String,
    /// F4 clinical terminology standards.
    pub f4_clinical_terminology_standards: String,
    /// F5 NHS login integration.
    pub f5_nhs_login_integration: String,
    /// F6 NHS systems integration documented.
    pub f6_nhs_systems_integration_documented: String,
    /// F7 data portability export.
    pub f7_data_portability_export: String,
    /// Section f notes.
    pub section_f_notes: String,
    /// G1 user research with target users.
    pub g1_user_research_with_target_users: String,
    /// G2 wcag aa conformance.
    pub g2_wcag_aa_conformance: String,
    /// G3 accessibility statement published.
    pub g3_accessibility_statement_published: String,
    /// G4 NHS service manual followed.
    pub g4_nhs_service_manual_followed: String,
    /// G5 assistive technology tested.
    pub g5_assistive_technology_tested: String,
    /// G6 digital inclusion considered.
    pub g6_digital_inclusion_considered: String,
    /// G7 user feedback mechanism.
    pub g7_user_feedback_mechanism: String,
    /// Section g notes.
    pub section_g_notes: String,
    /// Assessor notes.
    pub assessor_notes: String,
    /// Supplier ID.
    pub supplier_id: Uuid,
    /// Product ID.
    pub product_id: Uuid,
    /// Assessor ID.
    pub assessor_id: Uuid,
}
/// Uk NHS digital technology assessment criteria.
pub type UkNhsDigitalTechnologyAssessmentCriteria = Model;

impl Model {
    /// One page of rows in a stable order, with one row more than the page
    /// when more follow, which `CursorPage::respond` drops.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn page(db: &PgPool, page: &axa::cursor_pagination::CursorPage) -> sqlx::Result<Vec<Self>> {
        let (limit, offset) = page.bounds();
        sqlx::query_as(
            "SELECT * FROM uk_nhs_digital_technology_assessment_criteria WHERE deleted_at \
            IS NULL ORDER BY id LIMIT $1 OFFSET $2",
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(db)
        .await
    }

    /// The row with this id, if there is one.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn find_by_id(db: &PgPool, id: Uuid) -> sqlx::Result<Option<Self>> {
        sqlx::query_as(
            "SELECT * FROM uk_nhs_digital_technology_assessment_criteria WHERE id = $1 \
            AND deleted_at IS NULL",
        )
        .bind(id)
        .fetch_optional(db)
        .await
    }

    /// Delete the row with this id.
    ///
    /// # Errors
    ///
    /// Propagates the database error.
    pub async fn delete(db: &PgPool, id: Uuid) -> sqlx::Result<()> {
        sqlx::query(
            "WITH target AS (UPDATE uk_nhs_digital_technology_assessment_criteria SET \
            deleted_at = now(), updated_at = now() WHERE id = $1 AND deleted_at IS NULL \
            RETURNING id), child1 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grades SET deleted_at = now(), \
            updated_at = now() WHERE uk_nhs_digital_technology_assessment_criteria_id IN \
            (SELECT id FROM target) AND deleted_at IS NULL RETURNING id), child2 AS \
            (UPDATE uk_nhs_digital_technology_assessment_criteria_grade_rules SET \
            deleted_at = now(), updated_at = now() WHERE grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id), child3 AS (UPDATE \
            uk_nhs_digital_technology_assessment_criteria_grade_flags SET deleted_at = \
            now(), updated_at = now() WHERE \
            uk_nhs_digital_technology_assessment_criteria_grade_id IN (SELECT id FROM \
            child1) AND deleted_at IS NULL RETURNING id) SELECT count(*) FROM target",
        )
        .bind(id)
        .execute(db)
        .await?;
        Ok(())
    }
}
