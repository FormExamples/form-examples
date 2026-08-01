use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "medical_operation_note_drains",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("device_type", ColType::StringWithDefault(String::new())),
            ("name", ColType::StringWithDefault(String::new())),
            ("site", ColType::StringWithDefault(String::new())),
            ("size_or_gauge", ColType::StringWithDefault(String::new())),
            ("output_target", ColType::StringWithDefault(String::new())),
            ("removal_plan", ColType::StringWithDefault(String::new())),
            ("removal_by_date", ColType::DateNull),
            ("quantity", ColType::IntegerWithDefault(1)),
            ("notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("medical_operation_note", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "medical_operation_note_drains").await
    }
}
