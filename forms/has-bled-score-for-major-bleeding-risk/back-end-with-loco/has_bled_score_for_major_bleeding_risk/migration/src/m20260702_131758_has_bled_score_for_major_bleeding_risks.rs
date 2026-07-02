use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "has_bled_score_for_major_bleeding_risks",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("anticoagulation_status", ColType::String),
            ("cha_ds_vasc_score", ColType::IntegerNull),
            ("patient_identifier", ColType::String),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::String),
            ("hypertension_uncontrolled", ColType::String),
            ("abnormal_renal_function", ColType::String),
            ("abnormal_liver_function", ColType::String),
            ("stroke_history", ColType::String),
            ("bleeding_history", ColType::String),
            ("labile_inr", ColType::String),
            ("antiplatelet_or_nsaid", ColType::String),
            ("alcohol_units_per_week", ColType::DoubleNull),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "has_bled_score_for_major_bleeding_risks").await
    }
}
