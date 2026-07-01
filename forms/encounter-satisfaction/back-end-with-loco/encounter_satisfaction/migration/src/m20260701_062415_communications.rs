use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "communications",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("listening", ColType::IntegerNull),
            ("explaining_condition", ColType::IntegerNull),
            ("answering_questions", ColType::IntegerNull),
            ("time_spent", ColType::IntegerNull),
            ],
            &[
            ("encounter_satisfaction", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "communications").await
    }
}
