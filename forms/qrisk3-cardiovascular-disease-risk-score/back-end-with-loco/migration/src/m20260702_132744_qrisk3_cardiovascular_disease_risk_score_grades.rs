use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "qrisk3_cardiovascular_disease_risk_score_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("ten_year_risk_percent", ColType::DoubleNull),
            ("risk_band", ColType::String),
            ("heart_age", ColType::DoubleNull),
            ("linear_predictor", ColType::DoubleNull),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("qrisk3_cardiovascular_disease_risk_score", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "qrisk3_cardiovascular_disease_risk_score_grades").await
    }
}
