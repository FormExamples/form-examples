use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "parkland_formula_for_burns_grades",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("total_24h_volume_ml", ColType::DoubleNull),
            ("first_8h_volume_ml", ColType::DoubleNull),
            ("next_16h_volume_ml", ColType::DoubleNull),
            ("hours_since_injury", ColType::DoubleNull),
            ("remaining_first_8h_hours", ColType::DoubleNull),
            ("first_8h_rate_ml_h", ColType::DoubleNull),
            ("next_16h_rate_ml_h", ColType::DoubleNull),
            ("urine_output_target_min_ml_h", ColType::DoubleNull),
            ("urine_output_target_max_ml_h", ColType::DoubleNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("parkland_formula_for_burns", "parkland_formula_for_burns_id"),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "parkland_formula_for_burns_grades").await
    }
}
