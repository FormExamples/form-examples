use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_operation_note_implants",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("category", ColType::String),
            ("name", ColType::String),
            ("size_or_gauge", ColType::String),
            ("quantity", ColType::Integer),
            ("manufacturer", ColType::String),
            ("lot_number", ColType::String),
            ("serial_number", ColType::String),
            ("batch_number", ColType::String),
            ("expiry_date", ColType::DateNull),
            ("udi_di", ColType::String),
            ("implant_site", ColType::String),
            ("registry_required", ColType::String),
            ("registry_submitted", ColType::String),
            ("notes", ColType::Text),
            ],
            &[
            ("medical_operation_note", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_operation_note_implants").await
    }
}
