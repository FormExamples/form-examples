use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "glasgow_coma_scales",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("assessor_name", ColType::String),
            ("assessor_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("setting", ColType::String),
            ("reason", ColType::Text),
            ("intubated", ColType::String),
            ("sedated", ColType::String),
            ("paralysed", ColType::String),
            ("eye_response", ColType::String),
            ("eye_not_testable_reason", ColType::Text),
            ("verbal_response", ColType::String),
            ("verbal_not_testable_reason", ColType::Text),
            ("motor_response", ColType::String),
            ("motor_not_testable_reason", ColType::Text),
            ("left_pupil_reactivity", ColType::String),
            ("right_pupil_reactivity", ColType::String),
            ("left_pupil_size_mm", ColType::DoubleNull),
            ("right_pupil_size_mm", ColType::DoubleNull),
            ("previous_total", ColType::IntegerNull),
            ("previous_motor_score", ColType::IntegerNull),
            ("previous_assessed_at", ColType::TimestampWithTimeZoneNull),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "glasgow_coma_scales").await
    }
}
