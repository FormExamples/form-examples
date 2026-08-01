use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "united_kingdom_statement_of_fitness_for_works",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("assessment_date", ColType::DateNull),
            ("assessment_method", ColType::StringWithDefault(String::new())),
            ("general_fitness_considered", ColType::StringWithDefault(String::new())),
            ("diagnosis_text", ColType::TextWithDefault(String::new())),
            ("diagnosis_snomed_code", ColType::StringWithDefault(String::new())),
            ("diagnosis_snomed_display", ColType::StringWithDefault(String::new())),
            ("diagnosis_category", ColType::StringWithDefault(String::new())),
            ("condition_first_recorded_date", ColType::DateNull),
            ("is_automatic_disability", ColType::StringWithDefault(String::new())),
            ("is_non_medical", ColType::StringWithDefault(String::new())),
            ("fitness_for_work", ColType::StringWithDefault(String::new())),
            ("adaptation_phased_return", ColType::StringWithDefault(String::new())),
            ("adaptation_altered_hours", ColType::StringWithDefault(String::new())),
            ("adaptation_amended_duties", ColType::StringWithDefault(String::new())),
            ("adaptation_workplace_adaptations", ColType::StringWithDefault(String::new())),
            ("comments", ColType::TextWithDefault(String::new())),
            ("period_type", ColType::StringWithDefault(String::new())),
            ("period_duration_value", ColType::IntegerNull),
            ("period_duration_unit", ColType::StringWithDefault(String::new())),
            ("period_from", ColType::DateNull),
            ("period_to", ColType::DateNull),
            ("will_assess_again", ColType::StringWithDefault(String::new())),
            ("planned_review_date", ColType::DateNull),
            ("issued_at", ColType::TimestampWithTimeZoneNull),
            ("issued_via", ColType::StringWithDefault(String::new())),
            ("issue_setting", ColType::StringWithDefault(String::new())),
            ("safeguarding_concern", ColType::StringWithDefault(String::new())),
            ("safeguarding_notes", ColType::TextWithDefault(String::new())),
            ("clinician_signature_svg", ColType::TextWithDefault(String::new())),
            ("clinician_signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ("medical_practice", ""),
            ("united_kingdom_statement_of_fitness_for_work", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "united_kingdom_statement_of_fitness_for_works").await
    }
}
