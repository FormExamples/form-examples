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
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("symptom_onset_at", ColType::TimestampWithTimeZoneNull),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("blood_glucose", ColType::DoubleNull),
            ("hypoglycaemia_corrected", ColType::StringWithDefault(String::new())),
            ("loss_of_consciousness", ColType::StringWithDefault(String::new())),
            ("seizure_activity", ColType::StringWithDefault(String::new())),
            ("facial_weakness", ColType::StringWithDefault(String::new())),
            ("arm_weakness", ColType::StringWithDefault(String::new())),
            ("leg_weakness", ColType::StringWithDefault(String::new())),
            ("speech_disturbance", ColType::StringWithDefault(String::new())),
            ("visual_field_defect", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
