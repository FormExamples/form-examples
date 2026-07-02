use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "recognition_of_stroke_in_the_emergency_rooms",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("symptom_onset_at", ColType::TimestampWithTimeZoneNull),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("blood_glucose", ColType::DoubleNull),
            ("hypoglycaemia_corrected", ColType::String),
            ("loss_of_consciousness", ColType::String),
            ("seizure_activity", ColType::String),
            ("facial_weakness", ColType::String),
            ("arm_weakness", ColType::String),
            ("leg_weakness", ColType::String),
            ("speech_disturbance", ColType::String),
            ("visual_field_defect", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "recognition_of_stroke_in_the_emergency_rooms").await
    }
}
