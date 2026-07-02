use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "learning_disability_annual_health_check_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::String),
            ("completeness_percent", ColType::IntegerNull),
            ("health_action_plan_complete", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("learning_disability_annual_health_check", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "learning_disability_annual_health_check_grades").await
    }
}
