use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "return_to_work_restrictions",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("kind", ColType::String),
            ("severity", ColType::String),
            ("quantitative_limit", ColType::String),
            ("notes", ColType::String),
            ("start_date", ColType::DateNull),
            ("end_date", ColType::DateNull),
            ("priority_rank", ColType::Integer),
            ],
            &[
            ("return_to_work", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "return_to_work_restrictions").await
    }
}
