use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "fluid_balance_chart_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("total_intake_ml", ColType::DoubleWithDefault(0.0)),
            ("total_output_ml", ColType::DoubleWithDefault(0.0)),
            ("net_balance_ml", ColType::DoubleWithDefault(0.0)),
            ("urine_output_ml", ColType::DoubleWithDefault(0.0)),
            ("hours_observed", ColType::DoubleNull),
            ("weight_kg", ColType::DoubleNull),
            ("urine_output_ml_kg_h", ColType::DoubleNull),
            ("fluid_status", ColType::StringWithDefault(String::new())),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("fluid_balance_chart", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "fluid_balance_chart_grades").await
    }
}
