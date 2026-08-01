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
            ("phone", ColType::StringWithDefault(String::new())),
            ("email", ColType::StringWithDefault(String::new())),
            ("gp_name", ColType::StringWithDefault(String::new())),
            ("gp_practice", ColType::StringWithDefault(String::new())),
            ("reason_for_statement", ColType::TextWithDefault(String::new())),
            ("current_health_status", ColType::TextWithDefault(String::new())),
            ("current_diagnoses", ColType::TextWithDefault(String::new())),
            ("has_discussed_with_family", ColType::StringWithDefault(String::new())),
            ("has_discussed_with_clinician", ColType::StringWithDefault(String::new())),
            ("discussion_details", ColType::TextWithDefault(String::new())),
            ("personal_values", ColType::TextWithDefault(String::new())),
            ("quality_of_life_priorities", ColType::TextWithDefault(String::new())),
            ("religious_beliefs", ColType::TextWithDefault(String::new())),
            ("spiritual_needs", ColType::TextWithDefault(String::new())),
            ("cultural_considerations", ColType::TextWithDefault(String::new())),
            ("fears_and_concerns", ColType::TextWithDefault(String::new())),
            ("things_that_matter_most", ColType::TextWithDefault(String::new())),
            ("preferred_place_of_care", ColType::TextWithDefault(String::new())),
            ("preferred_place_of_death", ColType::TextWithDefault(String::new())),
            ("daily_routine_preferences", ColType::TextWithDefault(String::new())),
            ("personal_care_preferences", ColType::TextWithDefault(String::new())),
            ("food_and_drink_preferences", ColType::TextWithDefault(String::new())),
            ("sleep_preferences", ColType::TextWithDefault(String::new())),
            ("clothing_preferences", ColType::TextWithDefault(String::new())),
            ("environment_preferences", ColType::TextWithDefault(String::new())),
            ("pet_care_wishes", ColType::TextWithDefault(String::new())),
            ("pain_management_preferences", ColType::TextWithDefault(String::new())),
            ("attitude_to_hospital_admission", ColType::TextWithDefault(String::new())),
            ("attitude_to_intensive_care", ColType::TextWithDefault(String::new())),
            ("attitude_to_artificial_nutrition", ColType::TextWithDefault(String::new())),
            ("attitude_to_artificial_hydration", ColType::TextWithDefault(String::new())),
            ("medication_preferences", ColType::TextWithDefault(String::new())),
            ("complementary_therapy_preferences", ColType::TextWithDefault(String::new())),
            ("other_treatment_wishes", ColType::TextWithDefault(String::new())),
            ("preferred_language", ColType::StringWithDefault(String::new())),
            ("communication_aids", ColType::TextWithDefault(String::new())),
            ("how_to_share_information", ColType::TextWithDefault(String::new())),
            ("who_to_involve_in_decisions", ColType::TextWithDefault(String::new())),
            ("information_sharing_restrictions", ColType::TextWithDefault(String::new())),
            ("preferred_communication_style", ColType::TextWithDefault(String::new())),
            ("primary_contact_name", ColType::StringWithDefault(String::new())),
            ("primary_contact_relationship", ColType::StringWithDefault(String::new())),
            ("primary_contact_phone", ColType::StringWithDefault(String::new())),
            ("primary_contact_email", ColType::StringWithDefault(String::new())),
            ("secondary_contact_name", ColType::StringWithDefault(String::new())),
            ("secondary_contact_relationship", ColType::StringWithDefault(String::new())),
            ("secondary_contact_phone", ColType::StringWithDefault(String::new())),
            ("people_who_should_visit", ColType::TextWithDefault(String::new())),
            ("people_who_should_not_visit", ColType::TextWithDefault(String::new())),
            ("support_network_details", ColType::TextWithDefault(String::new())),
            ("financial_arrangements", ColType::TextWithDefault(String::new())),
            ("property_arrangements", ColType::TextWithDefault(String::new())),
            ("insurance_details", ColType::TextWithDefault(String::new())),
            ("will_location", ColType::TextWithDefault(String::new())),
            ("has_lasting_power_of_attorney", ColType::StringWithDefault(String::new())),
            ("lpa_details", ColType::TextWithDefault(String::new())),
            ("funeral_wishes", ColType::TextWithDefault(String::new())),
            ("burial_or_cremation", ColType::StringWithDefault(String::new())),
            ("other_practical_matters", ColType::TextWithDefault(String::new())),
            ("maker_signature_obtained", ColType::StringWithDefault(String::new())),
            ("maker_signature_date", ColType::DateNull),
            ("witness_name", ColType::StringWithDefault(String::new())),
            ("witness_address", ColType::TextWithDefault(String::new())),
            ("witness_signature_obtained", ColType::StringWithDefault(String::new())),
            ("witness_signature_date", ColType::DateNull),
            ("review_date", ColType::DateNull),
            ("review_notes", ColType::TextWithDefault(String::new())),
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
