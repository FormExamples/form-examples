use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "diabetes_podiatry_assessment_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("right_foot_risk", ColType::StringWithDefault(String::new())),
            ("left_foot_risk", ColType::StringWithDefault(String::new())),
            ("overall_risk", ColType::StringWithDefault(String::new())),
            ("review_pathway", ColType::StringWithDefault(String::new())),
            ("referral", ColType::StringWithDefault(String::new())),
            ("review_interval_months", ColType::IntegerNull),
            ("status", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("diabetes_podiatry_assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "diabetes_podiatry_assessment_grades").await
    }
}
