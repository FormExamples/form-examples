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
            
            ("name", ColType::StringWithDefault(String::new())),
            ("email", ColType::StringWithDefault(String::new())),
            ("phone", ColType::StringWithDefault(String::new())),
            ("role", ColType::StringWithDefault(String::new())),
            ("organization_name", ColType::StringWithDefault(String::new())),
            ("team_name", ColType::StringWithDefault(String::new())),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "authors").await
    }
}
