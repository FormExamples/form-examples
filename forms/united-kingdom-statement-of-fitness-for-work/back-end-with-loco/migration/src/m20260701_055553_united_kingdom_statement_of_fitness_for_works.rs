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
            ("status", ColType::String),
            ("assessment_date", ColType::DateNull),
            ("assessment_method", ColType::String),
            ("general_fitness_considered", ColType::String),
            ("diagnosis_text", ColType::Text),
            ("diagnosis_snomed_code", ColType::String),
            ("diagnosis_snomed_display", ColType::String),
            ("diagnosis_category", ColType::String),
            ("condition_first_recorded_date", ColType::DateNull),
            ("is_automatic_disability", ColType::String),
            ("is_non_medical", ColType::String),
            ("fitness_for_work", ColType::String),
            ("adaptation_phased_return", ColType::String),
            ("adaptation_altered_hours", ColType::String),
            ("adaptation_amended_duties", ColType::String),
            ("adaptation_workplace_adaptations", ColType::String),
            ("comments", ColType::Text),
            ("period_type", ColType::String),
            ("period_duration_value", ColType::IntegerNull),
            ("period_duration_unit", ColType::String),
            ("period_from", ColType::DateNull),
            ("period_to", ColType::DateNull),
            ("will_assess_again", ColType::String),
            ("planned_review_date", ColType::DateNull),
            ("issued_at", ColType::TimestampWithTimeZoneNull),
            ("issued_via", ColType::String),
            ("issue_setting", ColType::String),
            ("safeguarding_concern", ColType::String),
            ("safeguarding_notes", ColType::Text),
            ("clinician_signature_svg", ColType::Text),
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
