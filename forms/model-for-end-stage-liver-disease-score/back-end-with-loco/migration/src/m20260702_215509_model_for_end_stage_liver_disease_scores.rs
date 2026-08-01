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
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("meld_variant", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("bilirubin", ColType::DoubleNull),
            ("bilirubin_unit", ColType::StringWithDefault(String::new())),
            ("inr", ColType::DoubleNull),
            ("creatinine", ColType::DoubleNull),
            ("creatinine_unit", ColType::StringWithDefault(String::new())),
            ("dialysis_sessions_past_week", ColType::IntegerNull),
            ("cvvhd_24h", ColType::StringWithDefault(String::new())),
            ("sodium", ColType::DoubleNull),
            ("albumin", ColType::DoubleNull),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
