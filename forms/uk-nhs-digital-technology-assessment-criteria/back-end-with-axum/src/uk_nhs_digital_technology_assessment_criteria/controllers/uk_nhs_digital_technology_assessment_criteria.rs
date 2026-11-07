//! Uk NHS digital technology assessment criteria module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use crate::support::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::uk_nhs_digital_technology_assessment_criteria::Model;

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Supplier ID.
    pub supplier_id: Uuid,
    /// Product ID.
    pub product_id: Uuid,
    /// Assessor ID.
    pub assessor_id: Uuid,
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
}

impl Params {
    /// Insert a row.
    async fn insert(&self, db: &PgPool) -> sqlx::Result<Model> {
        sqlx::query_as(
            "INSERT INTO uk_nhs_digital_technology_assessment_criteria (supplier_id, \
            product_id, assessor_id, status, assessment_date, review_due_date, \
            dtac_version, commissioning_organisation, a1_company_registered_in_uk, \
            a2_ico_registration_current, a3_senior_responsible_owner_named, \
            a4_incident_contact_published, section_a_notes, \
            b1_intended_use_and_users_defined, b2_evidence_of_benefit, \
            b3_outcome_measures_defined, b4_cost_effectiveness_evidence, \
            section_b_notes, c1_clinical_safety_officer_named, \
            c2_clinical_risk_management_plan, c3_hazard_log_maintained, \
            c4_clinical_safety_case_report, \
            c5_clinical_safety_officer_registration_verified, \
            c6_medical_device_registration_if_applicable, c7_post_market_surveillance, \
            section_c_notes, d1_data_protection_officer_or_lead, d2_dpia_completed, \
            d3_dspt_standards_met, d4_lawful_basis_documented, \
            d5_controller_processor_roles_defined, d6_data_location_and_transfers, \
            d7_retention_and_deletion_policy, d8_privacy_notice_published, \
            d9_data_subject_rights_supported, section_d_notes, \
            e1_cyber_essentials_plus_or_iso27001, e2_penetration_test_within_12_months, \
            e3_vulnerability_management, e4_encryption_in_transit_and_at_rest, \
            e5_access_control_and_mfa, e6_audit_logging, \
            e7_business_continuity_and_backup, e8_secure_development_lifecycle, \
            e9_incident_response_and_breach_notification, section_e_notes, \
            f1_open_standards_apis, f2_fhir_or_nhs_standard_apis, \
            f3_nhs_number_supported, f4_clinical_terminology_standards, \
            f5_nhs_login_integration, f6_nhs_systems_integration_documented, \
            f7_data_portability_export, section_f_notes, \
            g1_user_research_with_target_users, g2_wcag_aa_conformance, \
            g3_accessibility_statement_published, g4_nhs_service_manual_followed, \
            g5_assistive_technology_tested, g6_digital_inclusion_considered, \
            g7_user_feedback_mechanism, section_g_notes, assessor_notes) VALUES ($1, $2, \
            $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, \
            $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, \
            $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, \
            $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63) \
            RETURNING *",
        )
        .bind(self.supplier_id)
        .bind(self.product_id)
        .bind(self.assessor_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(self.review_due_date)
        .bind(&self.dtac_version)
        .bind(&self.commissioning_organisation)
        .bind(&self.a1_company_registered_in_uk)
        .bind(&self.a2_ico_registration_current)
        .bind(&self.a3_senior_responsible_owner_named)
        .bind(&self.a4_incident_contact_published)
        .bind(&self.section_a_notes)
        .bind(&self.b1_intended_use_and_users_defined)
        .bind(&self.b2_evidence_of_benefit)
        .bind(&self.b3_outcome_measures_defined)
        .bind(&self.b4_cost_effectiveness_evidence)
        .bind(&self.section_b_notes)
        .bind(&self.c1_clinical_safety_officer_named)
        .bind(&self.c2_clinical_risk_management_plan)
        .bind(&self.c3_hazard_log_maintained)
        .bind(&self.c4_clinical_safety_case_report)
        .bind(
            self.c5_clinical_safety_officer_registration_verified
                .clone(),
        )
        .bind(&self.c6_medical_device_registration_if_applicable)
        .bind(&self.c7_post_market_surveillance)
        .bind(&self.section_c_notes)
        .bind(&self.d1_data_protection_officer_or_lead)
        .bind(&self.d2_dpia_completed)
        .bind(&self.d3_dspt_standards_met)
        .bind(&self.d4_lawful_basis_documented)
        .bind(&self.d5_controller_processor_roles_defined)
        .bind(&self.d6_data_location_and_transfers)
        .bind(&self.d7_retention_and_deletion_policy)
        .bind(&self.d8_privacy_notice_published)
        .bind(&self.d9_data_subject_rights_supported)
        .bind(&self.section_d_notes)
        .bind(&self.e1_cyber_essentials_plus_or_iso27001)
        .bind(&self.e2_penetration_test_within_12_months)
        .bind(&self.e3_vulnerability_management)
        .bind(&self.e4_encryption_in_transit_and_at_rest)
        .bind(&self.e5_access_control_and_mfa)
        .bind(&self.e6_audit_logging)
        .bind(&self.e7_business_continuity_and_backup)
        .bind(&self.e8_secure_development_lifecycle)
        .bind(&self.e9_incident_response_and_breach_notification)
        .bind(&self.section_e_notes)
        .bind(&self.f1_open_standards_apis)
        .bind(&self.f2_fhir_or_nhs_standard_apis)
        .bind(&self.f3_nhs_number_supported)
        .bind(&self.f4_clinical_terminology_standards)
        .bind(&self.f5_nhs_login_integration)
        .bind(&self.f6_nhs_systems_integration_documented)
        .bind(&self.f7_data_portability_export)
        .bind(&self.section_f_notes)
        .bind(&self.g1_user_research_with_target_users)
        .bind(&self.g2_wcag_aa_conformance)
        .bind(&self.g3_accessibility_statement_published)
        .bind(&self.g4_nhs_service_manual_followed)
        .bind(&self.g5_assistive_technology_tested)
        .bind(&self.g6_digital_inclusion_considered)
        .bind(&self.g7_user_feedback_mechanism)
        .bind(&self.section_g_notes)
        .bind(&self.assessor_notes)
        .fetch_one(db)
        .await
    }

    /// Update the row with this id, if there is one.
    async fn update(&self, db: &PgPool, id: Uuid) -> sqlx::Result<Option<Model>> {
        sqlx::query_as(
            "UPDATE uk_nhs_digital_technology_assessment_criteria SET supplier_id = $2, \
            product_id = $3, assessor_id = $4, status = $5, assessment_date = $6, \
            review_due_date = $7, dtac_version = $8, commissioning_organisation = $9, \
            a1_company_registered_in_uk = $10, a2_ico_registration_current = $11, \
            a3_senior_responsible_owner_named = $12, a4_incident_contact_published = \
            $13, section_a_notes = $14, b1_intended_use_and_users_defined = $15, \
            b2_evidence_of_benefit = $16, b3_outcome_measures_defined = $17, \
            b4_cost_effectiveness_evidence = $18, section_b_notes = $19, \
            c1_clinical_safety_officer_named = $20, c2_clinical_risk_management_plan = \
            $21, c3_hazard_log_maintained = $22, c4_clinical_safety_case_report = $23, \
            c5_clinical_safety_officer_registration_verified = $24, \
            c6_medical_device_registration_if_applicable = $25, \
            c7_post_market_surveillance = $26, section_c_notes = $27, \
            d1_data_protection_officer_or_lead = $28, d2_dpia_completed = $29, \
            d3_dspt_standards_met = $30, d4_lawful_basis_documented = $31, \
            d5_controller_processor_roles_defined = $32, d6_data_location_and_transfers \
            = $33, d7_retention_and_deletion_policy = $34, d8_privacy_notice_published = \
            $35, d9_data_subject_rights_supported = $36, section_d_notes = $37, \
            e1_cyber_essentials_plus_or_iso27001 = $38, \
            e2_penetration_test_within_12_months = $39, e3_vulnerability_management = \
            $40, e4_encryption_in_transit_and_at_rest = $41, e5_access_control_and_mfa = \
            $42, e6_audit_logging = $43, e7_business_continuity_and_backup = $44, \
            e8_secure_development_lifecycle = $45, \
            e9_incident_response_and_breach_notification = $46, section_e_notes = $47, \
            f1_open_standards_apis = $48, f2_fhir_or_nhs_standard_apis = $49, \
            f3_nhs_number_supported = $50, f4_clinical_terminology_standards = $51, \
            f5_nhs_login_integration = $52, f6_nhs_systems_integration_documented = $53, \
            f7_data_portability_export = $54, section_f_notes = $55, \
            g1_user_research_with_target_users = $56, g2_wcag_aa_conformance = $57, \
            g3_accessibility_statement_published = $58, g4_nhs_service_manual_followed = \
            $59, g5_assistive_technology_tested = $60, g6_digital_inclusion_considered = \
            $61, g7_user_feedback_mechanism = $62, section_g_notes = $63, assessor_notes \
            = $64, updated_at = now() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
        )
        .bind(id)
        .bind(self.supplier_id)
        .bind(self.product_id)
        .bind(self.assessor_id)
        .bind(&self.status)
        .bind(self.assessment_date)
        .bind(self.review_due_date)
        .bind(&self.dtac_version)
        .bind(&self.commissioning_organisation)
        .bind(&self.a1_company_registered_in_uk)
        .bind(&self.a2_ico_registration_current)
        .bind(&self.a3_senior_responsible_owner_named)
        .bind(&self.a4_incident_contact_published)
        .bind(&self.section_a_notes)
        .bind(&self.b1_intended_use_and_users_defined)
        .bind(&self.b2_evidence_of_benefit)
        .bind(&self.b3_outcome_measures_defined)
        .bind(&self.b4_cost_effectiveness_evidence)
        .bind(&self.section_b_notes)
        .bind(&self.c1_clinical_safety_officer_named)
        .bind(&self.c2_clinical_risk_management_plan)
        .bind(&self.c3_hazard_log_maintained)
        .bind(&self.c4_clinical_safety_case_report)
        .bind(
            self.c5_clinical_safety_officer_registration_verified
                .clone(),
        )
        .bind(&self.c6_medical_device_registration_if_applicable)
        .bind(&self.c7_post_market_surveillance)
        .bind(&self.section_c_notes)
        .bind(&self.d1_data_protection_officer_or_lead)
        .bind(&self.d2_dpia_completed)
        .bind(&self.d3_dspt_standards_met)
        .bind(&self.d4_lawful_basis_documented)
        .bind(&self.d5_controller_processor_roles_defined)
        .bind(&self.d6_data_location_and_transfers)
        .bind(&self.d7_retention_and_deletion_policy)
        .bind(&self.d8_privacy_notice_published)
        .bind(&self.d9_data_subject_rights_supported)
        .bind(&self.section_d_notes)
        .bind(&self.e1_cyber_essentials_plus_or_iso27001)
        .bind(&self.e2_penetration_test_within_12_months)
        .bind(&self.e3_vulnerability_management)
        .bind(&self.e4_encryption_in_transit_and_at_rest)
        .bind(&self.e5_access_control_and_mfa)
        .bind(&self.e6_audit_logging)
        .bind(&self.e7_business_continuity_and_backup)
        .bind(&self.e8_secure_development_lifecycle)
        .bind(&self.e9_incident_response_and_breach_notification)
        .bind(&self.section_e_notes)
        .bind(&self.f1_open_standards_apis)
        .bind(&self.f2_fhir_or_nhs_standard_apis)
        .bind(&self.f3_nhs_number_supported)
        .bind(&self.f4_clinical_terminology_standards)
        .bind(&self.f5_nhs_login_integration)
        .bind(&self.f6_nhs_systems_integration_documented)
        .bind(&self.f7_data_portability_export)
        .bind(&self.section_f_notes)
        .bind(&self.g1_user_research_with_target_users)
        .bind(&self.g2_wcag_aa_conformance)
        .bind(&self.g3_accessibility_statement_published)
        .bind(&self.g4_nhs_service_manual_followed)
        .bind(&self.g5_assistive_technology_tested)
        .bind(&self.g6_digital_inclusion_considered)
        .bind(&self.g7_user_feedback_mechanism)
        .bind(&self.section_g_notes)
        .bind(&self.assessor_notes)
        .fetch_optional(db)
        .await
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Model::find_by_id(&db(ctx), id).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(
    State(ctx): State<AppContext>,
    Query(params): Query<PageParams>,
) -> Result<Response> {
    let page = paging::resolve(&params)?;
    let (rows, total) = Model::page(&db(&ctx), page).await?;
    paging::respond(page, total, rows)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let item = params.insert(&db(&ctx)).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = params.update(&db(&ctx), id).await?.ok_or(Error::NotFound)?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?;
    Model::delete(&db(&ctx), id).await?;
    format::empty()
}

/// Get one.
#[debug_handler]
pub async fn get_one(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    format::json(load_item(&ctx, id).await?)
}

/// Routes.
pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/uk_nhs_digital_technology_assessment_criteria/")
        .add("/", get(list))
        .add("/", post(add))
        .add("{id}", get(get_one))
        .add("{id}", delete(remove))
        .add("{id}", put(update))
        .add("{id}", patch(update))
}
