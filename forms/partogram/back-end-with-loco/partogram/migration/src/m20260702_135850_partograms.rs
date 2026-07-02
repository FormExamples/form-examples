use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "partograms",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::Text),
            ("clinician_role", ColType::String),
            ("care_setting", ColType::String),
            ("active_phase_start_at", ColType::TimestampWithTimeZoneNull),
            ("patient_identifier", ColType::Text),
            ("age_band", ColType::String),
            ("parity", ColType::String),
            ("gestation_weeks", ColType::DoubleNull),
            ("membranes_on_admission", ColType::String),
            ("risk_factors", ColType::Text),
            ("planned_care", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "partograms").await
    }
}
