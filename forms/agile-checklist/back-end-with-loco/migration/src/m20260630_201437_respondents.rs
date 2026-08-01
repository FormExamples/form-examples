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
            ("full_name", ColType::StringWithDefault(String::new())),
            ("email", ColType::StringWithDefault(String::new())),
            ("role", ColType::StringWithDefault(String::new())),
            ("team_name", ColType::StringWithDefault(String::new())),
            ("organisation_name", ColType::StringWithDefault(String::new())),
            ("years_in_agile", ColType::IntegerNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "respondents").await
    }
}
