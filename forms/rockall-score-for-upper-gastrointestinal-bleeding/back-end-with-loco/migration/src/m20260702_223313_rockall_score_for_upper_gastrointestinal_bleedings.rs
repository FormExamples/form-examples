use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "rockall_score_for_upper_gastrointestinal_bleedings",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("presenting_complaint", ColType::Text),
            ("patient_identifier", ColType::String),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::String),
            ("systolic_blood_pressure_mmhg", ColType::IntegerNull),
            ("heart_rate_bpm", ColType::IntegerNull),
            ("comorbidity", ColType::String),
            ("endoscopy_performed", ColType::String),
            ("diagnosis", ColType::String),
            ("stigmata_recent_haemorrhage", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "rockall_score_for_upper_gastrointestinal_bleedings").await
    }
}
