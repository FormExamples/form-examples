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
            ("name", ColType::StringWithDefault(String::new())),
            ("email", ColType::TextWithDefault(String::new())),
            ("phone", ColType::TextWithDefault(String::new())),
            ("role", ColType::StringWithDefault(String::new())),
            ("department", ColType::StringWithDefault(String::new())),
            ("seniority", ColType::StringWithDefault(String::new())),
            ("timezone", ColType::StringWithDefault(String::new())),
            ("preferred_contact", ColType::StringWithDefault(String::new())),
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
