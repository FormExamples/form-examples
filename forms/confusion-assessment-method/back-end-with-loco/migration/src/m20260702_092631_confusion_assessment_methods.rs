use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "confusion_assessment_methods",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("assessor_name", ColType::String),
            ("assessor_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("ward_unit", ColType::String),
            ("cam_variant", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("cognitive_baseline", ColType::String),
            ("collateral_source", ColType::String),
            ("feature_acute_onset_fluctuating", ColType::String),
            ("onset_timing", ColType::String),
            ("feature_inattention", ColType::String),
            ("attention_test", ColType::String),
            ("feature_disorganised_thinking", ColType::String),
            ("feature_altered_consciousness", ColType::String),
            ("consciousness_level", ColType::String),
            ("rass_score", ColType::IntegerNull),
            ("motoric_subtype", ColType::String),
            ("hallucinations", ColType::Boolean),
            ("delusions", ColType::Boolean),
            ("sleep_wake_disturbance", ColType::Boolean),
            ("deliriogenic_medication", ColType::Boolean),
            ("deliriogenic_medication_detail", ColType::Text),
            ("suspected_precipitants", ColType::Text),
            ("recommended_actions", ColType::Text),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "confusion_assessment_methods").await
    }
}
