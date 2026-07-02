use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "nursing_care_plan_problems",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("problem_statement", ColType::Text),
            ("adl_category", ColType::String),
            ("actual_or_potential", ColType::String),
            ("assessment_data", ColType::Text),
            ("linked_risk", ColType::String),
            ("evaluation_note", ColType::Text),
            ("goal_met", ColType::String),
            ("next_review_date", ColType::DateNull),
            ],
            &[
            ("nursing_care_plan", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "nursing_care_plan_problems").await
    }
}
