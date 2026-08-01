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
            
            ("assessor_name", ColType::StringWithDefault(String::new())),
            ("assessor_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("setting", ColType::StringWithDefault(String::new())),
            ("reason", ColType::TextWithDefault(String::new())),
            ("intubated", ColType::StringWithDefault(String::new())),
            ("sedated", ColType::StringWithDefault(String::new())),
            ("paralysed", ColType::StringWithDefault(String::new())),
            ("eye_response", ColType::StringWithDefault(String::new())),
            ("eye_not_testable_reason", ColType::TextWithDefault(String::new())),
            ("verbal_response", ColType::StringWithDefault(String::new())),
            ("verbal_not_testable_reason", ColType::TextWithDefault(String::new())),
            ("motor_response", ColType::StringWithDefault(String::new())),
            ("motor_not_testable_reason", ColType::TextWithDefault(String::new())),
            ("left_pupil_reactivity", ColType::StringWithDefault(String::new())),
            ("right_pupil_reactivity", ColType::StringWithDefault(String::new())),
            ("left_pupil_size_mm", ColType::DoubleNull),
            ("right_pupil_size_mm", ColType::DoubleNull),
            ("previous_total", ColType::IntegerNull),
            ("previous_motor_score", ColType::IntegerNull),
            ("previous_assessed_at", ColType::TimestampWithTimeZoneNull),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
