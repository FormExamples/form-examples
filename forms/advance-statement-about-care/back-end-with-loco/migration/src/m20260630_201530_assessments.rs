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
            ("phone", ColType::String),
            ("email", ColType::String),
            ("gp_name", ColType::String),
            ("gp_practice", ColType::String),
            ("reason_for_statement", ColType::Text),
            ("current_health_status", ColType::Text),
            ("current_diagnoses", ColType::Text),
            ("has_discussed_with_family", ColType::String),
            ("has_discussed_with_clinician", ColType::String),
            ("discussion_details", ColType::Text),
            ("personal_values", ColType::Text),
            ("quality_of_life_priorities", ColType::Text),
            ("religious_beliefs", ColType::Text),
            ("spiritual_needs", ColType::Text),
            ("cultural_considerations", ColType::Text),
            ("fears_and_concerns", ColType::Text),
            ("things_that_matter_most", ColType::Text),
            ("preferred_place_of_care", ColType::Text),
            ("preferred_place_of_death", ColType::Text),
            ("daily_routine_preferences", ColType::Text),
            ("personal_care_preferences", ColType::Text),
            ("food_and_drink_preferences", ColType::Text),
            ("sleep_preferences", ColType::Text),
            ("clothing_preferences", ColType::Text),
            ("environment_preferences", ColType::Text),
            ("pet_care_wishes", ColType::Text),
            ("pain_management_preferences", ColType::Text),
            ("attitude_to_hospital_admission", ColType::Text),
            ("attitude_to_intensive_care", ColType::Text),
            ("attitude_to_artificial_nutrition", ColType::Text),
            ("attitude_to_artificial_hydration", ColType::Text),
            ("medication_preferences", ColType::Text),
            ("complementary_therapy_preferences", ColType::Text),
            ("other_treatment_wishes", ColType::Text),
            ("preferred_language", ColType::String),
            ("communication_aids", ColType::Text),
            ("how_to_share_information", ColType::Text),
            ("who_to_involve_in_decisions", ColType::Text),
            ("information_sharing_restrictions", ColType::Text),
            ("preferred_communication_style", ColType::Text),
            ("primary_contact_name", ColType::String),
            ("primary_contact_relationship", ColType::String),
            ("primary_contact_phone", ColType::String),
            ("primary_contact_email", ColType::String),
            ("secondary_contact_name", ColType::String),
            ("secondary_contact_relationship", ColType::String),
            ("secondary_contact_phone", ColType::String),
            ("people_who_should_visit", ColType::Text),
            ("people_who_should_not_visit", ColType::Text),
            ("support_network_details", ColType::Text),
            ("financial_arrangements", ColType::Text),
            ("property_arrangements", ColType::Text),
            ("insurance_details", ColType::Text),
            ("will_location", ColType::Text),
            ("has_lasting_power_of_attorney", ColType::String),
            ("lpa_details", ColType::Text),
            ("funeral_wishes", ColType::Text),
            ("burial_or_cremation", ColType::String),
            ("other_practical_matters", ColType::Text),
            ("maker_signature_obtained", ColType::String),
            ("maker_signature_date", ColType::DateNull),
            ("witness_name", ColType::String),
            ("witness_address", ColType::Text),
            ("witness_signature_obtained", ColType::String),
            ("witness_signature_date", ColType::DateNull),
            ("review_date", ColType::DateNull),
            ("review_notes", ColType::Text),
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
