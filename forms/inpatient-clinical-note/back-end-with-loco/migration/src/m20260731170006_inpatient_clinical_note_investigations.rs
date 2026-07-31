use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "inpatient_clinical_note_investigations",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("sort_order", ColType::Integer),
            ("test_name", ColType::String),
            ("category", ColType::String),
            ("requested_date", ColType::DateNull),
            ("result_date", ColType::DateNull),
            ("result_summary", ColType::Text),
            ("abnormal", ColType::String),
            ("actioned", ColType::String),
            ("action_taken", ColType::Text),
            ],
            &[
            ("inpatient_clinical_note", "inpatient_clinical_note_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "inpatient_clinical_note_investigations").await
    }
}
