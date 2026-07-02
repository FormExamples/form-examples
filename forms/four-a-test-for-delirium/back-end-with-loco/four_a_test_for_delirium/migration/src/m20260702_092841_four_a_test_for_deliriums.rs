use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "four_a_test_for_deliriums",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("patient_identifier", ColType::String),
            ("patient_name", ColType::String),
            ("date_of_birth", ColType::DateNull),
            ("assessment_date", ColType::DateNull),
            ("assessment_time", ColType::TimeNull),
            ("setting", ColType::String),
            ("assessor_name", ColType::String),
            ("assessor_role", ColType::String),
            ("alertness", ColType::String),
            ("amt4", ColType::String),
            ("attention_months", ColType::String),
            ("acute_change", ColType::String),
            ("acute_change_source", ColType::String),
            ("clinical_notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "four_a_test_for_deliriums").await
    }
}
