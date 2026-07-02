use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "learning_disability_annual_health_check_grade_flags",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("flag_id", ColType::String),
            ("category", ColType::String),
            ("priority", ColType::String),
            ("description", ColType::String),
            ("suggested_action", ColType::String),
            ],
            &[
            ("learning_disability_annual_health_check_grade", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "learning_disability_annual_health_check_grade_flags").await
    }
}
