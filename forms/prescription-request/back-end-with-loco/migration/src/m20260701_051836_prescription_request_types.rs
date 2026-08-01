use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "prescription_request_types",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("is_new_prescription", ColType::StringWithDefault(String::new())),
            ("is_emergency", ColType::StringWithDefault(String::new())),
            ("additional_notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("prescription_request", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "prescription_request_types").await
    }
}
