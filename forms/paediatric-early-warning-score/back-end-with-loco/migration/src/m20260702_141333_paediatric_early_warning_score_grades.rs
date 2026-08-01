use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "paediatric_early_warning_score_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("aggregate_score", ColType::IntegerNull),
            ("max_parameter_score", ColType::IntegerNull),
            ("respiratory_rate_score", ColType::IntegerNull),
            ("respiratory_effort_score", ColType::IntegerNull),
            ("oxygen_saturation_score", ColType::IntegerNull),
            ("supplemental_oxygen_score", ColType::IntegerNull),
            ("heart_rate_score", ColType::IntegerNull),
            ("capillary_refill_score", ColType::IntegerNull),
            ("consciousness_score", ColType::IntegerNull),
            ("risk_band", ColType::StringWithDefault(String::new())),
            ("single_parameter_trigger", ColType::StringWithDefault(String::new())),
            ("concern_trigger", ColType::StringWithDefault(String::new())),
            ("monitoring_frequency", ColType::TextWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("paediatric_early_warning_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "paediatric_early_warning_score_grades").await
    }
}
