use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "assessments",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::String),
            ("full_name", ColType::String),
            ("address", ColType::Text),
            ("postcode", ColType::String),
            ("date_of_birth", ColType::DateNull),
            ("nhs_number", ColType::String),
            ("gp_name", ColType::String),
            ("gp_practice", ColType::String),
            ("gp_address", ColType::Text),
            ("gp_phone", ColType::String),
            ("has_mental_capacity", ColType::String),
            ("understands_consequences", ColType::String),
            ("made_voluntarily", ColType::String),
            ("capacity_assessment_date", ColType::DateNull),
            ("capacity_assessor_name", ColType::String),
            ("capacity_assessor_role", ColType::String),
            ("capacity_notes", ColType::Text),
            ("circumstances_description", ColType::Text),
            ("specific_conditions", ColType::Text),
            ("applies_if_terminally_ill", ColType::String),
            ("applies_if_permanently_unconscious", ColType::String),
            ("applies_if_severely_brain_damaged", ColType::String),
            ("applies_if_advanced_dementia", ColType::String),
            ("other_circumstances", ColType::Text),
            ("refuses_cardiopulmonary_resuscitation", ColType::String),
            ("refuses_mechanical_ventilation", ColType::String),
            ("refuses_artificial_nutrition", ColType::String),
            ("refuses_artificial_hydration", ColType::String),
            ("refuses_antibiotics", ColType::String),
            ("refuses_blood_transfusion", ColType::String),
            ("refuses_dialysis", ColType::String),
            ("other_treatments_refused", ColType::Text),
            ("treatment_refusal_details", ColType::Text),
            ("includes_life_sustaining_treatment", ColType::String),
            ("understands_may_result_in_death", ColType::String),
            ("life_sustaining_treatments_specified", ColType::Text),
            ("is_written_and_signed", ColType::String),
            ("is_witnessed", ColType::String),
            ("witness_confirmation", ColType::Text),
            ("has_exceptions", ColType::String),
            ("exception_details", ColType::Text),
            ("pain_management_wishes", ColType::Text),
            ("comfort_care_wishes", ColType::Text),
            ("emergency_exception_details", ColType::Text),
            ("condition_specific_exceptions", ColType::Text),
            ("preferred_place_of_care", ColType::Text),
            ("preferred_place_of_death", ColType::Text),
            ("spiritual_or_religious_wishes", ColType::Text),
            ("organ_donation_wishes", ColType::String),
            ("organ_donation_details", ColType::Text),
            ("other_wishes", ColType::Text),
            ("people_to_notify", ColType::Text),
            ("has_health_welfare_lpa", ColType::String),
            ("lpa_registered_with_opg", ColType::String),
            ("lpa_registration_date", ColType::DateNull),
            ("attorney_name", ColType::String),
            ("attorney_address", ColType::Text),
            ("attorney_phone", ColType::String),
            ("replacement_attorney_name", ColType::String),
            ("lpa_authority_scope", ColType::Text),
            ("lpa_conflicts_with_adrt", ColType::String),
            ("lpa_conflict_details", ColType::Text),
            ("reviewed_by_healthcare_professional", ColType::String),
            ("reviewer_name", ColType::String),
            ("reviewer_role", ColType::String),
            ("reviewer_registration_number", ColType::String),
            ("review_date", ColType::DateNull),
            ("reviewer_confirms_capacity", ColType::String),
            ("reviewer_confirms_informed", ColType::String),
            ("clinical_notes", ColType::Text),
            ("concerns_raised", ColType::Text),
            ("reviewer_signature_obtained", ColType::String),
            ("maker_signature_obtained", ColType::String),
            ("maker_signature_date", ColType::DateNull),
            ("witness_name", ColType::String),
            ("witness_address", ColType::Text),
            ("witness_signature_obtained", ColType::String),
            ("witness_signature_date", ColType::DateNull),
            ("second_witness_name", ColType::String),
            ("second_witness_signature_obtained", ColType::String),
            ("declaration_statement_agreed", ColType::String),
            ("legal_notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "assessments").await
    }
}
