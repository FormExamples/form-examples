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
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("presenting_complaint", ColType::TextWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::StringWithDefault(String::new())),
            ("systolic_blood_pressure_mmhg", ColType::IntegerNull),
            ("heart_rate_bpm", ColType::IntegerNull),
            ("comorbidity", ColType::StringWithDefault(String::new())),
            ("endoscopy_performed", ColType::StringWithDefault(String::new())),
            ("diagnosis", ColType::StringWithDefault(String::new())),
            ("stigmata_recent_haemorrhage", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
