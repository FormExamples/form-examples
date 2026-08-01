use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "glasgow_blatchford_bleeding_scores",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("presenting_complaint", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("blood_urea_mmol_l", ColType::DoubleNull),
            ("haemoglobin_g_l", ColType::DoubleNull),
            ("systolic_blood_pressure_mmhg", ColType::IntegerNull),
            ("pulse_beats_per_min", ColType::IntegerNull),
            ("melaena_present", ColType::StringWithDefault(String::new())),
            ("syncope", ColType::StringWithDefault(String::new())),
            ("hepatic_disease", ColType::StringWithDefault(String::new())),
            ("cardiac_failure", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "glasgow_blatchford_bleeding_scores").await
    }
}
