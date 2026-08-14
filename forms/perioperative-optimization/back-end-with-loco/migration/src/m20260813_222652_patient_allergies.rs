use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "patient_allergies",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("reaction", ColType::TextWithDefault(String::new())),
            ("severity", ColType::TextWithDefault(String::new())),
            ("kind", ColType::TextWithDefault(String::new())),
            ("diagnosis_method", ColType::TextWithDefault(String::new())),
            ("onset_on", ColType::DateNull),
            ("adrenaline_auto_injector", ColType::BooleanWithDefault(false)),
            ("notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("allergy", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "patient_allergies").await
    }
}
