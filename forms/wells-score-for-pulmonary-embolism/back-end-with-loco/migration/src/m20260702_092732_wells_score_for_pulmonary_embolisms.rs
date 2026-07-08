use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "wells_score_for_pulmonary_embolisms",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("status", ColType::String),
            ("patient_identifier", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("age_band", ColType::String),
            ("haemodynamic_status", ColType::String),
            ("clinical_signs_of_dvt", ColType::String),
            ("pe_most_likely", ColType::String),
            ("heart_rate_over_100", ColType::String),
            ("immobilisation_or_surgery", ColType::String),
            ("previous_dvt_pe", ColType::String),
            ("haemoptysis", ColType::String),
            ("malignancy", ColType::String),
            ("clinical_notes", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "wells_score_for_pulmonary_embolisms").await
    }
}
