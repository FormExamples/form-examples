use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "quick_sequential_organ_failure_assessment_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("respiratory_rate_point", ColType::IntegerNull),
            ("mentation_point", ColType::IntegerNull),
            ("systolic_blood_pressure_point", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("risk_band", ColType::String),
            ("threshold_met", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("quick_sequential_organ_failure_assessment", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "quick_sequential_organ_failure_assessment_grades").await
    }
}
