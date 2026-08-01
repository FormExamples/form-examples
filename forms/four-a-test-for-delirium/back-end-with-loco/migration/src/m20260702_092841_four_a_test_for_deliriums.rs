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
            
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("patient_name", ColType::StringWithDefault(String::new())),
            ("date_of_birth", ColType::DateNull),
            ("assessment_date", ColType::DateNull),
            ("assessment_time", ColType::TimeNull),
            ("setting", ColType::StringWithDefault(String::new())),
            ("assessor_name", ColType::StringWithDefault(String::new())),
            ("assessor_role", ColType::StringWithDefault(String::new())),
            ("alertness", ColType::StringWithDefault(String::new())),
            ("amt4", ColType::StringWithDefault(String::new())),
            ("attention_months", ColType::StringWithDefault(String::new())),
            ("acute_change", ColType::StringWithDefault(String::new())),
            ("acute_change_source", ColType::StringWithDefault(String::new())),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
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
