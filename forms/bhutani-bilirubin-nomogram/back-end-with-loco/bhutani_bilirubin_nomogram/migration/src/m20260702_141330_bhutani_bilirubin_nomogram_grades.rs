use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "bhutani_bilirubin_nomogram_grades",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("risk_zone", ColType::String),
            ("percentile_band", ColType::String),
            ("phototherapy_threshold_umol_l", ColType::DoubleNull),
            ("exchange_threshold_umol_l", ColType::DoubleNull),
            ("above_phototherapy_threshold", ColType::String),
            ("above_exchange_threshold", ColType::String),
            ("graded_at", ColType::TimestampWithTimeZone),
            ],
            &[
            ("bhutani_bilirubin_nomogram", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bhutani_bilirubin_nomogram_grades").await
    }
}
