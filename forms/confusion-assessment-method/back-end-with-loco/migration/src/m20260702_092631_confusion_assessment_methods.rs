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
            
            ("assessor_name", ColType::StringWithDefault(String::new())),
            ("assessor_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("ward_unit", ColType::StringWithDefault(String::new())),
            ("cam_variant", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("cognitive_baseline", ColType::StringWithDefault(String::new())),
            ("collateral_source", ColType::StringWithDefault(String::new())),
            ("feature_acute_onset_fluctuating", ColType::StringWithDefault(String::new())),
            ("onset_timing", ColType::StringWithDefault(String::new())),
            ("feature_inattention", ColType::StringWithDefault(String::new())),
            ("attention_test", ColType::StringWithDefault(String::new())),
            ("feature_disorganised_thinking", ColType::StringWithDefault(String::new())),
            ("feature_altered_consciousness", ColType::StringWithDefault(String::new())),
            ("consciousness_level", ColType::StringWithDefault(String::new())),
            ("rass_score", ColType::IntegerNull),
            ("motoric_subtype", ColType::StringWithDefault(String::new())),
            ("hallucinations", ColType::BooleanWithDefault(false)),
            ("delusions", ColType::BooleanWithDefault(false)),
            ("sleep_wake_disturbance", ColType::BooleanWithDefault(false)),
            ("deliriogenic_medication", ColType::BooleanWithDefault(false)),
            ("deliriogenic_medication_detail", ColType::TextWithDefault(String::new())),
            ("suspected_precipitants", ColType::TextWithDefault(String::new())),
            ("recommended_actions", ColType::TextWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
