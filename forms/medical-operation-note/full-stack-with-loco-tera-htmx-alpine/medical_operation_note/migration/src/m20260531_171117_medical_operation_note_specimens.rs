use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_operation_note_specimens",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("label", ColType::String),
            ("specimen_type", ColType::String),
            ("anatomical_site", ColType::String),
            ("container", ColType::String),
            ("fixative", ColType::String),
            ("destination", ColType::String),
            ("urgency", ColType::String),
            ("label_verified", ColType::String),
            ("chain_of_custody_documented", ColType::String),
            ("notes", ColType::Text),
            ],
            &[
            ("medical_operation_note", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_operation_note_specimens").await
    }
}
