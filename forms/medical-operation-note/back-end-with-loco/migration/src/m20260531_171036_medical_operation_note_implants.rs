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
            ("category", ColType::StringWithDefault(String::new())),
            ("name", ColType::StringWithDefault(String::new())),
            ("size_or_gauge", ColType::StringWithDefault(String::new())),
            ("quantity", ColType::IntegerWithDefault(1)),
            ("manufacturer", ColType::StringWithDefault(String::new())),
            ("lot_number", ColType::StringWithDefault(String::new())),
            ("serial_number", ColType::StringWithDefault(String::new())),
            ("batch_number", ColType::StringWithDefault(String::new())),
            ("expiry_date", ColType::DateNull),
            ("udi_di", ColType::StringWithDefault(String::new())),
            ("implant_site", ColType::StringWithDefault(String::new())),
            ("registry_required", ColType::StringWithDefault(String::new())),
            ("registry_submitted", ColType::StringWithDefault(String::new())),
            ("notes", ColType::TextWithDefault(String::new())),
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
