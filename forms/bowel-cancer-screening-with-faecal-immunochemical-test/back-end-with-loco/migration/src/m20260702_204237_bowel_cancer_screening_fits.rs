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
            ("screening_hub", ColType::StringWithDefault(String::new())),
            ("participant_identifier", ColType::StringWithDefault(String::new())),
            ("age", ColType::IntegerNull),
            ("within_age_range", ColType::StringWithDefault(String::new())),
            ("recall_interval", ColType::StringWithDefault(String::new())),
            ("invitation_date", ColType::DateNull),
            ("previous_outcome", ColType::StringWithDefault(String::new())),
            ("last_screen_date", ColType::DateNull),
            ("kit_returned", ColType::StringWithDefault(String::new())),
            ("return_date", ColType::DateNull),
            ("sample_adequacy", ColType::StringWithDefault(String::new())),
            ("spoilt_reason", ColType::StringWithDefault(String::new())),
            ("faecal_haemoglobin_ug_g", ColType::DoubleNull),
            ("assay", ColType::StringWithDefault(String::new())),
            ("threshold_applied", ColType::DoubleNull),
            ("red_flag_symptoms", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
            ("context", ColType::TextWithDefault(String::new())),
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
