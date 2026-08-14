use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hip_replacement_surgery_evaluation_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("ohs_total", ColType::IntegerNull),
            ("ohs_category", ColType::StringWithDefault(String::new())),
            ("computed_candidacy", ColType::StringWithDefault(String::new())),
            ("final_candidacy", ColType::StringWithDefault(String::new())),
            ("override_reason", ColType::StringWithDefault(String::new())),
            ("clinician_notes", ColType::TextWithDefault(String::new())),
            ("signed_by_name", ColType::StringWithDefault(String::new())),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("hip_replacement_surgery_evaluation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hip_replacement_surgery_evaluation_grades").await
    }
}
