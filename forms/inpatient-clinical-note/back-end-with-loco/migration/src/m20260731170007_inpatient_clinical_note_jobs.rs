use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "inpatient_clinical_note_jobs",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("sort_order", ColType::IntegerWithDefault(0)),
            ("job", ColType::StringWithDefault(String::new())),
            ("category", ColType::StringWithDefault(String::new())),
            ("owner", ColType::StringWithDefault(String::new())),
            ("priority", ColType::StringWithDefault(String::new())),
            ("due_at", ColType::TimestampWithTimeZoneNull),
            ("status", ColType::StringWithDefault(String::new())),
            ("completed_at", ColType::TimestampWithTimeZoneNull),
            ("notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("inpatient_clinical_note", "inpatient_clinical_note_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "inpatient_clinical_note_jobs").await
    }
}
