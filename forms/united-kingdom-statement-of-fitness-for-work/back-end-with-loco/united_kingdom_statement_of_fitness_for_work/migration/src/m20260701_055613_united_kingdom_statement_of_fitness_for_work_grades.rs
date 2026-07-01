use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "united_kingdom_statement_of_fitness_for_work_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("fitness_category", ColType::String),
            ("adaptation_intensity", ColType::String),
            ("adaptation_count", ColType::Integer),
            ("period_days", ColType::IntegerNull),
            ("period_compliance", ColType::String),
            ("recommendation", ColType::String),
            ("is_within_first_six_months_of_condition", ColType::String),
            ("is_valid", ColType::String),
            ("grader_notes", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ("clinician_override", ColType::String),
            ("clinician_override_reason", ColType::String),
            ("clinician_final_recommendation", ColType::String),
            ],
            &[
            ("united_kingdom_statement_of_fitness_for_work", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "united_kingdom_statement_of_fitness_for_work_grades").await
    }
}
