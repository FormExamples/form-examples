use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "hospital_daily_monitoring_checklists",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("hospital_name", ColType::String),
            ("department_or_site", ColType::String),
            ("inspection_date", ColType::DateNull),
            ("inspecting_officer_name", ColType::String),
            ("inspecting_officer_designation", ColType::String),
            ("overall_notes", ColType::Text),
            ("action_plan", ColType::Text),
            ("status", ColType::String),
            ("signed_at", ColType::TimestampWithTimeZoneNull),
            ],
            &[
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "hospital_daily_monitoring_checklists").await
    }
}
