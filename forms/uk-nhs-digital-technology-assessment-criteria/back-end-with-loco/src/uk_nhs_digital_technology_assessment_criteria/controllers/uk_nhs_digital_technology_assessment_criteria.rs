//! Uk NHS digital technology assessment criteria module.

#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;
use serde::{Deserialize, Serialize};

use crate::models::_entities::uk_nhs_digital_technology_assessment_criteria::{
    ActiveModel, Entity, Model,
};

/// Params.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    /// Deleted at.
    pub deleted_at: Option<DateTimeWithTimeZone>,
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
    fn update(&self, item: &mut ActiveModel) {
        item.deleted_at = Set(self.deleted_at);
        item.supplier_id = Set(self.supplier_id);
        item.product_id = Set(self.product_id);
        item.assessor_id = Set(self.assessor_id);
        item.status = Set(self.status.clone());
        item.assessment_date = Set(self.assessment_date);
        item.review_due_date = Set(self.review_due_date);
        item.dtac_version = Set(self.dtac_version.clone());
        item.commissioning_organisation = Set(self.commissioning_organisation.clone());
        item.a1_company_registered_in_uk = Set(self.a1_company_registered_in_uk.clone());
        item.a2_ico_registration_current = Set(self.a2_ico_registration_current.clone());
        item.a3_senior_responsible_owner_named =
            Set(self.a3_senior_responsible_owner_named.clone());
        item.a4_incident_contact_published = Set(self.a4_incident_contact_published.clone());
        item.section_a_notes = Set(self.section_a_notes.clone());
        item.b1_intended_use_and_users_defined =
            Set(self.b1_intended_use_and_users_defined.clone());
        item.b2_evidence_of_benefit = Set(self.b2_evidence_of_benefit.clone());
        item.b3_outcome_measures_defined = Set(self.b3_outcome_measures_defined.clone());
        item.b4_cost_effectiveness_evidence = Set(self.b4_cost_effectiveness_evidence.clone());
        item.section_b_notes = Set(self.section_b_notes.clone());
        item.c1_clinical_safety_officer_named = Set(self.c1_clinical_safety_officer_named.clone());
        item.c2_clinical_risk_management_plan = Set(self.c2_clinical_risk_management_plan.clone());
        item.c3_hazard_log_maintained = Set(self.c3_hazard_log_maintained.clone());
        item.c4_clinical_safety_case_report = Set(self.c4_clinical_safety_case_report.clone());
        item.c5_clinical_safety_officer_registration_verified = Set(self
            .c5_clinical_safety_officer_registration_verified
            .clone());
        item.c6_medical_device_registration_if_applicable =
            Set(self.c6_medical_device_registration_if_applicable.clone());
        item.c7_post_market_surveillance = Set(self.c7_post_market_surveillance.clone());
        item.section_c_notes = Set(self.section_c_notes.clone());
        item.d1_data_protection_officer_or_lead =
            Set(self.d1_data_protection_officer_or_lead.clone());
        item.d2_dpia_completed = Set(self.d2_dpia_completed.clone());
        item.d3_dspt_standards_met = Set(self.d3_dspt_standards_met.clone());
        item.d4_lawful_basis_documented = Set(self.d4_lawful_basis_documented.clone());
        item.d5_controller_processor_roles_defined =
            Set(self.d5_controller_processor_roles_defined.clone());
        item.d6_data_location_and_transfers = Set(self.d6_data_location_and_transfers.clone());
        item.d7_retention_and_deletion_policy = Set(self.d7_retention_and_deletion_policy.clone());
        item.d8_privacy_notice_published = Set(self.d8_privacy_notice_published.clone());
        item.d9_data_subject_rights_supported = Set(self.d9_data_subject_rights_supported.clone());
        item.section_d_notes = Set(self.section_d_notes.clone());
        item.e1_cyber_essentials_plus_or_iso27001 =
            Set(self.e1_cyber_essentials_plus_or_iso27001.clone());
        item.e2_penetration_test_within_12_months =
            Set(self.e2_penetration_test_within_12_months.clone());
        item.e3_vulnerability_management = Set(self.e3_vulnerability_management.clone());
        item.e4_encryption_in_transit_and_at_rest =
            Set(self.e4_encryption_in_transit_and_at_rest.clone());
        item.e5_access_control_and_mfa = Set(self.e5_access_control_and_mfa.clone());
        item.e6_audit_logging = Set(self.e6_audit_logging.clone());
        item.e7_business_continuity_and_backup =
            Set(self.e7_business_continuity_and_backup.clone());
        item.e8_secure_development_lifecycle = Set(self.e8_secure_development_lifecycle.clone());
        item.e9_incident_response_and_breach_notification =
            Set(self.e9_incident_response_and_breach_notification.clone());
        item.section_e_notes = Set(self.section_e_notes.clone());
        item.f1_open_standards_apis = Set(self.f1_open_standards_apis.clone());
        item.f2_fhir_or_nhs_standard_apis = Set(self.f2_fhir_or_nhs_standard_apis.clone());
        item.f3_nhs_number_supported = Set(self.f3_nhs_number_supported.clone());
        item.f4_clinical_terminology_standards =
            Set(self.f4_clinical_terminology_standards.clone());
        item.f5_nhs_login_integration = Set(self.f5_nhs_login_integration.clone());
        item.f6_nhs_systems_integration_documented =
            Set(self.f6_nhs_systems_integration_documented.clone());
        item.f7_data_portability_export = Set(self.f7_data_portability_export.clone());
        item.section_f_notes = Set(self.section_f_notes.clone());
        item.g1_user_research_with_target_users =
            Set(self.g1_user_research_with_target_users.clone());
        item.g2_wcag_aa_conformance = Set(self.g2_wcag_aa_conformance.clone());
        item.g3_accessibility_statement_published =
            Set(self.g3_accessibility_statement_published.clone());
        item.g4_nhs_service_manual_followed = Set(self.g4_nhs_service_manual_followed.clone());
        item.g5_assistive_technology_tested = Set(self.g5_assistive_technology_tested.clone());
        item.g6_digital_inclusion_considered = Set(self.g6_digital_inclusion_considered.clone());
        item.g7_user_feedback_mechanism = Set(self.g7_user_feedback_mechanism.clone());
        item.section_g_notes = Set(self.section_g_notes.clone());
        item.assessor_notes = Set(self.assessor_notes.clone());
    }
}

async fn load_item(ctx: &AppContext, id: Uuid) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

/// List.
#[debug_handler]
pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    format::json(Entity::find().all(&ctx.db).await?)
}

/// Add.
#[debug_handler]
pub async fn add(State(ctx): State<AppContext>, Json(params): Json<Params>) -> Result<Response> {
    let mut item = ActiveModel {
        ..Default::default()
    };
    params.update(&mut item);
    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

/// Update.
#[debug_handler]
pub async fn update(
    Path(id): Path<Uuid>,
    State(ctx): State<AppContext>,
    Json(params): Json<Params>,
) -> Result<Response> {
    let item = load_item(&ctx, id).await?;
    let mut item = item.into_active_model();
    params.update(&mut item);
    let item = item.update(&ctx.db).await?;
    format::json(item)
}

/// Remove.
#[debug_handler]
pub async fn remove(Path(id): Path<Uuid>, State(ctx): State<AppContext>) -> Result<Response> {
    load_item(&ctx, id).await?.delete(&ctx.db).await?;
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
