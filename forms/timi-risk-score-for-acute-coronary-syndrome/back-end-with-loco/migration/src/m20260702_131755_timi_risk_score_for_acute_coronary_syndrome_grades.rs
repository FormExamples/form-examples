use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "timi_risk_score_for_acute_coronary_syndrome_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("total_score", ColType::IntegerNull),
            ("risk_band", ColType::String),
            ("fourteen_day_event_risk_percent", ColType::DoubleNull),
            ("management", ColType::Text),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("timi_risk_score_for_acute_coronary_syndrome", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "timi_risk_score_for_acute_coronary_syndrome_grades").await
    }
}
