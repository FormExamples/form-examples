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
            
            ("status", ColType::StringWithDefault("draft".to_string())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("haemodynamic_status", ColType::StringWithDefault(String::new())),
            ("clinical_signs_of_dvt", ColType::StringWithDefault(String::new())),
            ("pe_most_likely", ColType::StringWithDefault(String::new())),
            ("heart_rate_over_100", ColType::StringWithDefault(String::new())),
            ("immobilisation_or_surgery", ColType::StringWithDefault(String::new())),
            ("previous_dvt_pe", ColType::StringWithDefault(String::new())),
            ("haemoptysis", ColType::StringWithDefault(String::new())),
            ("malignancy", ColType::StringWithDefault(String::new())),
            ("clinical_notes", ColType::TextWithDefault(String::new())),
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
