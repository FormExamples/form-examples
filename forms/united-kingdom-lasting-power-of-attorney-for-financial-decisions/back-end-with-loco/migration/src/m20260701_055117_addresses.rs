use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "addresses",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("address_line_1", ColType::TextWithDefault(String::new())),
            ("address_line_2", ColType::TextWithDefault(String::new())),
            ("address_line_3", ColType::TextWithDefault(String::new())),
            ("postcode", ColType::TextWithDefault(String::new())),
            ("country_as_iso_3166_1_alpha_2", ColType::TextWithDefault("GB".to_string())),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "addresses").await
    }
}
