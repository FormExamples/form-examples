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
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("full_name", ColType::StringWithDefault(String::new())),
            ("address", ColType::TextWithDefault(String::new())),
            ("postcode", ColType::StringWithDefault(String::new())),
            ("date_of_birth", ColType::DateNull),
            ("nhs_number", ColType::StringWithDefault(String::new())),
            ("gp_name", ColType::StringWithDefault(String::new())),
            ("gp_practice", ColType::StringWithDefault(String::new())),
            ("gp_address", ColType::TextWithDefault(String::new())),
            ("gp_phone", ColType::StringWithDefault(String::new())),
            ("has_mental_capacity", ColType::StringWithDefault(String::new())),
            ("understands_consequences", ColType::StringWithDefault(String::new())),
            ("made_voluntarily", ColType::StringWithDefault(String::new())),
            ("capacity_assessment_date", ColType::DateNull),
            ("capacity_assessor_name", ColType::StringWithDefault(String::new())),
            ("capacity_assessor_role", ColType::StringWithDefault(String::new())),
            ("capacity_notes", ColType::TextWithDefault(String::new())),
            ("circumstances_description", ColType::TextWithDefault(String::new())),
            ("specific_conditions", ColType::TextWithDefault(String::new())),
            ("applies_if_terminally_ill", ColType::StringWithDefault(String::new())),
            ("applies_if_permanently_unconscious", ColType::StringWithDefault(String::new())),
            ("applies_if_severely_brain_damaged", ColType::StringWithDefault(String::new())),
            ("applies_if_advanced_dementia", ColType::StringWithDefault(String::new())),
            ("other_circumstances", ColType::TextWithDefault(String::new())),
            ("refuses_cardiopulmonary_resuscitation", ColType::StringWithDefault(String::new())),
            ("refuses_mechanical_ventilation", ColType::StringWithDefault(String::new())),
            ("refuses_artificial_nutrition", ColType::StringWithDefault(String::new())),
            ("refuses_artificial_hydration", ColType::StringWithDefault(String::new())),
            ("refuses_antibiotics", ColType::StringWithDefault(String::new())),
            ("refuses_blood_transfusion", ColType::StringWithDefault(String::new())),
            ("refuses_dialysis", ColType::StringWithDefault(String::new())),
            ("other_treatments_refused", ColType::TextWithDefault(String::new())),
            ("treatment_refusal_details", ColType::TextWithDefault(String::new())),
            ("includes_life_sustaining_treatment", ColType::StringWithDefault(String::new())),
            ("understands_may_result_in_death", ColType::StringWithDefault(String::new())),
            ("life_sustaining_treatments_specified", ColType::TextWithDefault(String::new())),
            ("is_written_and_signed", ColType::StringWithDefault(String::new())),
            ("is_witnessed", ColType::StringWithDefault(String::new())),
            ("witness_confirmation", ColType::TextWithDefault(String::new())),
            ("has_exceptions", ColType::StringWithDefault(String::new())),
            ("exception_details", ColType::TextWithDefault(String::new())),
            ("pain_management_wishes", ColType::TextWithDefault(String::new())),
            ("comfort_care_wishes", ColType::TextWithDefault(String::new())),
            ("emergency_exception_details", ColType::TextWithDefault(String::new())),
            ("condition_specific_exceptions", ColType::TextWithDefault(String::new())),
            ("preferred_place_of_care", ColType::TextWithDefault(String::new())),
            ("preferred_place_of_death", ColType::TextWithDefault(String::new())),
            ("spiritual_or_religious_wishes", ColType::TextWithDefault(String::new())),
            ("organ_donation_wishes", ColType::StringWithDefault(String::new())),
            ("organ_donation_details", ColType::TextWithDefault(String::new())),
            ("other_wishes", ColType::TextWithDefault(String::new())),
            ("people_to_notify", ColType::TextWithDefault(String::new())),
            ("has_health_welfare_lpa", ColType::StringWithDefault(String::new())),
            ("lpa_registered_with_opg", ColType::StringWithDefault(String::new())),
            ("lpa_registration_date", ColType::DateNull),
            ("attorney_name", ColType::StringWithDefault(String::new())),
            ("attorney_address", ColType::TextWithDefault(String::new())),
            ("attorney_phone", ColType::StringWithDefault(String::new())),
            ("replacement_attorney_name", ColType::StringWithDefault(String::new())),
            ("lpa_authority_scope", ColType::TextWithDefault(String::new())),
            ("lpa_conflicts_with_adrt", ColType::StringWithDefault(String::new())),
            ("lpa_conflict_details", ColType::TextWithDefault(String::new())),
            ("reviewed_by_healthcare_professional", ColType::StringWithDefault(String::new())),
            ("reviewer_name", ColType::StringWithDefault(String::new())),
            ("reviewer_role", ColType::StringWithDefault(String::new())),
            ("reviewer_registration_number", ColType::StringWithDefault(String::new())),
            ("review_date", ColType::DateNull),
            ("reviewer_confirms_capacity", ColType::StringWithDefault(String::new())),
            ("reviewer_confirms_informed", ColType::StringWithDefault(String::new())),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
            ("concerns_raised", ColType::TextWithDefault(String::new())),
            ("reviewer_signature_obtained", ColType::StringWithDefault(String::new())),
            ("maker_signature_obtained", ColType::StringWithDefault(String::new())),
            ("maker_signature_date", ColType::DateNull),
            ("witness_name", ColType::StringWithDefault(String::new())),
            ("witness_address", ColType::TextWithDefault(String::new())),
            ("witness_signature_obtained", ColType::StringWithDefault(String::new())),
            ("witness_signature_date", ColType::DateNull),
            ("second_witness_name", ColType::StringWithDefault(String::new())),
            ("second_witness_signature_obtained", ColType::StringWithDefault(String::new())),
            ("declaration_statement_agreed", ColType::StringWithDefault(String::new())),
            ("legal_notes", ColType::TextWithDefault(String::new())),
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
