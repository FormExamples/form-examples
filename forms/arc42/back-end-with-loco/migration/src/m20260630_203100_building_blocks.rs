use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "building_blocks",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("ordinal", ColType::IntegerWithDefault(0)),
            ("name", ColType::TextWithDefault(String::new())),
            ("responsibility", ColType::TextWithDefault(String::new())),
            ("interfaces", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("arc42_documentation", ""),
            ("building_blocks?", "parent_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "building_blocks").await
    }
}
