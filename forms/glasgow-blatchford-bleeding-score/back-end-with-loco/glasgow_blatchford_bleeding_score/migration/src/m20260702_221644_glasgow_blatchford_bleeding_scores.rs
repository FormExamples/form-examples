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
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("presenting_complaint", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("blood_urea_mmol_l", ColType::DoubleNull),
            ("haemoglobin_g_l", ColType::DoubleNull),
            ("systolic_blood_pressure_mmhg", ColType::IntegerNull),
            ("pulse_beats_per_min", ColType::IntegerNull),
            ("melaena_present", ColType::String),
            ("syncope", ColType::String),
            ("hepatic_disease", ColType::String),
            ("cardiac_failure", ColType::String),
            ("clinical_note", ColType::Text),
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
