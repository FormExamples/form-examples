use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "estimated_glomerular_filtration_rate_calculators",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("equation", ColType::String),
            ("patient_identifier", ColType::String),
            ("serum_creatinine_umol_l", ColType::DoubleNull),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::String),
            ("specimen_date", ColType::DateNull),
            ("steady_state", ColType::String),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "estimated_glomerular_filtration_rate_calculators").await
    }
}
