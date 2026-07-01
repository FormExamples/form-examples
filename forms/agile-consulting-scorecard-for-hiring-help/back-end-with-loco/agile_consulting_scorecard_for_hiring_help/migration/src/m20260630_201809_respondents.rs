use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "respondents",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("name", ColType::String),
            ("email", ColType::Text),
            ("phone", ColType::Text),
            ("role", ColType::String),
            ("department", ColType::String),
            ("seniority", ColType::String),
            ("timezone", ColType::String),
            ("preferred_contact", ColType::String),
            ],
            &[
            ("organization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "respondents").await
    }
}
