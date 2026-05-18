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
            
            ("name", ColType::String),
            ("legal_name", ColType::StringNull),
            ("industry", ColType::StringNull),
            ("domain", ColType::StringNull),
            ("country_as_iso_3166_1_alpha_2", ColType::StringNull),
            ("description", ColType::TextNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "organizations").await
    }
}
