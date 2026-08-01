use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "modified_early_warning_score_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("aggregate_score", ColType::IntegerNull),
            ("systolic_blood_pressure_score", ColType::IntegerNull),
            ("heart_rate_score", ColType::IntegerNull),
            ("respiratory_rate_score", ColType::IntegerNull),
            ("temperature_score", ColType::IntegerNull),
            ("avpu_score", ColType::IntegerNull),
            ("single_parameter_trigger", ColType::StringWithDefault(String::new())),
            ("risk_band", ColType::StringWithDefault(String::new())),
            ("monitoring_frequency", ColType::TextWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("modified_early_warning_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "modified_early_warning_score_grades").await
    }
}
