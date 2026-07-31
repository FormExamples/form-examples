use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "inpatient_clinical_note_problems",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("sort_order", ColType::Integer),
            ("problem", ColType::String),
            ("category", ColType::String),
            ("status", ColType::String),
            ("priority", ColType::String),
            ("onset_date", ColType::DateNull),
            ("snomed_code", ColType::String),
            ("progress_commentary", ColType::Text),
            ],
            &[
            ("inpatient_clinical_note", "inpatient_clinical_note_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "inpatient_clinical_note_problems").await
    }
}
