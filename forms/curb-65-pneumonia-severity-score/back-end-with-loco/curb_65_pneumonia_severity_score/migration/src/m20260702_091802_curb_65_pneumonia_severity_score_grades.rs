use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "curb_65_pneumonia_severity_score_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("confusion_score", ColType::IntegerNull),
            ("urea_score", ColType::IntegerNull),
            ("respiratory_rate_score", ColType::IntegerNull),
            ("blood_pressure_score", ColType::IntegerNull),
            ("age_score", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("score_variant", ColType::String),
            ("risk_band", ColType::String),
            ("recommended_setting", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("curb_65_pneumonia_severity_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "curb_65_pneumonia_severity_score_grades").await
    }
}
