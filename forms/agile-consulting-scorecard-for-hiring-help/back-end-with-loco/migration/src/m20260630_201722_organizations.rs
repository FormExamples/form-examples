use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "organizations",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("name", ColType::StringWithDefault(String::new())),
            ("legal_name", ColType::StringWithDefault(String::new())),
            ("sector", ColType::StringWithDefault(String::new())),
            ("size_band", ColType::StringWithDefault(String::new())),
            ("headcount", ColType::IntegerNull),
            ("country", ColType::StringWithDefault(String::new())),
            ("region", ColType::StringWithDefault(String::new())),
            ("website", ColType::TextWithDefault(String::new())),
            ("notes", ColType::TextWithDefault(String::new())),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "organizations").await
    }
}
