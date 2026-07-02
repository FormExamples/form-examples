use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "quick_sequential_organ_failure_assessments",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("suspected_source", ColType::Text),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("respiratory_rate", ColType::DoubleNull),
            ("glasgow_coma_scale", ColType::IntegerNull),
            ("mentation_altered", ColType::String),
            ("systolic_blood_pressure", ColType::DoubleNull),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "quick_sequential_organ_failure_assessments").await
    }
}
