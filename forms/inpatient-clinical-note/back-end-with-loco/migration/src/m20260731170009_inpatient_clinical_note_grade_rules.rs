use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "inpatient_clinical_note_grade_rules",
            &[

            ("id", ColType::PkAuto),

            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("rule_id", ColType::String),
            ("engine", ColType::String),
            ("component", ColType::String),
            ("band", ColType::String),
            ("category", ColType::String),
            ("description", ColType::String),
            ],
            &[
            ("inpatient_clinical_note_grade", "inpatient_clinical_note_grade_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "inpatient_clinical_note_grade_rules").await
    }
}
