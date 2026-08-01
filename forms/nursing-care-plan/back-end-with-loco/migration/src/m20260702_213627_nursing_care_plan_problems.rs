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
            ("problem_statement", ColType::TextWithDefault(String::new())),
            ("adl_category", ColType::StringWithDefault(String::new())),
            ("actual_or_potential", ColType::StringWithDefault(String::new())),
            ("assessment_data", ColType::TextWithDefault(String::new())),
            ("linked_risk", ColType::StringWithDefault(String::new())),
            ("evaluation_note", ColType::TextWithDefault(String::new())),
            ("goal_met", ColType::StringWithDefault(String::new())),
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
