use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "lpas",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("form_version", ColType::String),
            ("jurisdiction", ColType::String),
            ("status", ColType::String),
            ("opg_reference", ColType::String),
            ("registered_at", ColType::TimestampWithTimeZoneNull),
            ("effective_from", ColType::TimestampWithTimeZoneNull),
            ("notes", ColType::Text),
            ],
            &[
            ("donor", ""),
            ("certificate_provider", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "lpas").await
    }
}
