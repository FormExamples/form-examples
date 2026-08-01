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
            ("sort_order", ColType::IntegerWithDefault(0)),
            ("drug_name", ColType::StringWithDefault(String::new())),
            ("action", ColType::StringWithDefault(String::new())),
            ("dose", ColType::StringWithDefault(String::new())),
            ("route", ColType::StringWithDefault(String::new())),
            ("frequency", ColType::StringWithDefault(String::new())),
            ("indication", ColType::StringWithDefault(String::new())),
            ("is_antimicrobial", ColType::StringWithDefault(String::new())),
            ("review_date", ColType::DateNull),
            ("stop_date", ColType::DateNull),
            ("dmd_code", ColType::StringWithDefault(String::new())),
            ("notes", ColType::TextWithDefault(String::new())),
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
