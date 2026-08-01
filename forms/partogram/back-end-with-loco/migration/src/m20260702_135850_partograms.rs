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
            
            ("clinician_name", ColType::TextWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("active_phase_start_at", ColType::TimestampWithTimeZoneNull),
            ("patient_identifier", ColType::TextWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("parity", ColType::StringWithDefault(String::new())),
            ("gestation_weeks", ColType::DoubleNull),
            ("membranes_on_admission", ColType::StringWithDefault(String::new())),
            ("risk_factors", ColType::TextWithDefault(String::new())),
            ("planned_care", ColType::TextWithDefault(String::new())),
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
