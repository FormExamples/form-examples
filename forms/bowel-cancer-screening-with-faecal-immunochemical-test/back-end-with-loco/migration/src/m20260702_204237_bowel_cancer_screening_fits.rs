use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "bowel_cancer_screening_fits",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("reviewed_at", ColType::TimestampWithTimeZoneNull),
            ("screening_hub", ColType::String),
            ("participant_identifier", ColType::String),
            ("age", ColType::IntegerNull),
            ("within_age_range", ColType::String),
            ("recall_interval", ColType::String),
            ("invitation_date", ColType::DateNull),
            ("previous_outcome", ColType::String),
            ("last_screen_date", ColType::DateNull),
            ("kit_returned", ColType::String),
            ("return_date", ColType::DateNull),
            ("sample_adequacy", ColType::String),
            ("spoilt_reason", ColType::String),
            ("faecal_haemoglobin_ug_g", ColType::DoubleNull),
            ("assay", ColType::String),
            ("threshold_applied", ColType::DoubleNull),
            ("red_flag_symptoms", ColType::String),
            ("clinical_note", ColType::Text),
            ("context", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "bowel_cancer_screening_fits").await
    }
}
