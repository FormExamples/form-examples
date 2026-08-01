use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "national_early_warning_score_2_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("aggregate_score", ColType::IntegerNull),
            ("respiratory_rate_score", ColType::IntegerNull),
            ("spo2_score", ColType::IntegerNull),
            ("oxygen_score", ColType::IntegerNull),
            ("blood_pressure_score", ColType::IntegerNull),
            ("pulse_score", ColType::IntegerNull),
            ("consciousness_score", ColType::IntegerNull),
            ("temperature_score", ColType::IntegerNull),
            ("any_single_parameter_three", ColType::StringWithDefault(String::new())),
            ("risk_band", ColType::StringWithDefault(String::new())),
            ("monitoring_frequency", ColType::TextWithDefault(String::new())),
            ("recommendation", ColType::TextWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("national_early_warning_score_2", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "national_early_warning_score_2_grades").await
    }
}
