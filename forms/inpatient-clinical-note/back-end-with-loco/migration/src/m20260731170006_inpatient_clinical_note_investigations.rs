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
            ("sort_order", ColType::IntegerWithDefault(0)),
            ("test_name", ColType::StringWithDefault(String::new())),
            ("category", ColType::StringWithDefault(String::new())),
            ("requested_date", ColType::DateNull),
            ("result_date", ColType::DateNull),
            ("result_summary", ColType::TextWithDefault(String::new())),
            ("abnormal", ColType::StringWithDefault(String::new())),
            ("actioned", ColType::StringWithDefault(String::new())),
            ("action_taken", ColType::TextWithDefault(String::new())),
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
