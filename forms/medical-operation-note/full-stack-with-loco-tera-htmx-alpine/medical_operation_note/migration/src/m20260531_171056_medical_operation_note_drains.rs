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
            ("device_type", ColType::String),
            ("name", ColType::String),
            ("site", ColType::String),
            ("size_or_gauge", ColType::String),
            ("output_target", ColType::String),
            ("removal_plan", ColType::String),
            ("removal_by_date", ColType::DateNull),
            ("quantity", ColType::Integer),
            ("notes", ColType::Text),
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
