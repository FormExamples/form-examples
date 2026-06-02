use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "authors",
            &[
            
            ("id", ColType::PkAuto),
            
            ("name", ColType::String),
            ("email", ColType::StringNull),
            ("phone", ColType::StringNull),
            ("role", ColType::StringNull),
            ("organization_name", ColType::StringNull),
            ("team_name", ColType::StringNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "authors").await
    }
}
