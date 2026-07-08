use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "model_for_end_stage_liver_disease_scores",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("meld_variant", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("bilirubin", ColType::DoubleNull),
            ("bilirubin_unit", ColType::String),
            ("inr", ColType::DoubleNull),
            ("creatinine", ColType::DoubleNull),
            ("creatinine_unit", ColType::String),
            ("dialysis_sessions_past_week", ColType::IntegerNull),
            ("cvvhd_24h", ColType::String),
            ("sodium", ColType::DoubleNull),
            ("albumin", ColType::DoubleNull),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "model_for_end_stage_liver_disease_scores").await
    }
}
