use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "inpatient_clinical_note_medication_changes",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("sort_order", ColType::Integer),
            ("drug_name", ColType::String),
            ("action", ColType::String),
            ("dose", ColType::String),
            ("route", ColType::String),
            ("frequency", ColType::String),
            ("indication", ColType::String),
            ("is_antimicrobial", ColType::String),
            ("review_date", ColType::DateNull),
            ("stop_date", ColType::DateNull),
            ("dmd_code", ColType::String),
            ("notes", ColType::Text),
            ],
            &[
            ("inpatient_clinical_note", "inpatient_clinical_note_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "inpatient_clinical_note_medication_changes").await
    }
}
