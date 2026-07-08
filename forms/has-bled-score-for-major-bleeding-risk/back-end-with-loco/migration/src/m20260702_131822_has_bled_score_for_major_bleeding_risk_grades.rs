use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "has_bled_score_for_major_bleeding_risk_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("hypertension_points", ColType::IntegerNull),
            ("renal_points", ColType::IntegerNull),
            ("liver_points", ColType::IntegerNull),
            ("stroke_points", ColType::IntegerNull),
            ("bleeding_points", ColType::IntegerNull),
            ("labile_inr_points", ColType::IntegerNull),
            ("elderly_points", ColType::IntegerNull),
            ("drugs_points", ColType::IntegerNull),
            ("alcohol_points", ColType::IntegerNull),
            ("total_score", ColType::IntegerNull),
            ("risk_band", ColType::String),
            ("modifiable_factors", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("has_bled_score_for_major_bleeding_risk", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "has_bled_score_for_major_bleeding_risk_grades").await
    }
}
