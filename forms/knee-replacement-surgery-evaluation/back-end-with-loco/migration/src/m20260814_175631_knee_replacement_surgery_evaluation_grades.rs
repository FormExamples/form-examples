use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "knee_replacement_surgery_evaluation_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("oks_total", ColType::IntegerNull),
            ("computed_oks_category", ColType::String),
            ("final_oks_category", ColType::String),
            ("max_kellgren_lawrence_grade", ColType::IntegerNull),
            ("computed_candidacy", ColType::String),
            ("final_candidacy", ColType::String),
            ("override_reason", ColType::String),
            ("clinician_notes", ColType::Text),
            ("signed_by_name", ColType::String),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("knee_replacement_surgery_evaluation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "knee_replacement_surgery_evaluation_grades").await
    }
}
