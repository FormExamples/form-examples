use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "context_partners",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("ordinal", ColType::IntegerWithDefault(0)),
            ("kind", ColType::TextWithDefault(String::new())),
            ("name", ColType::TextWithDefault(String::new())),
            ("interface_description", ColType::TextWithDefault(String::new())),
            ("protocol", ColType::TextWithDefault(String::new())),
            ("direction", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("arc42_documentation", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "context_partners").await
    }
}
