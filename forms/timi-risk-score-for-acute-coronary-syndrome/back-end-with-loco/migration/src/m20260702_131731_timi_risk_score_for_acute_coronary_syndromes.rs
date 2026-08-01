use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "timi_risk_score_for_acute_coronary_syndromes",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("working_diagnosis", ColType::StringWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("age_over_65", ColType::StringWithDefault(String::new())),
            ("three_or_more_cad_risk_factors", ColType::StringWithDefault(String::new())),
            ("known_cad_stenosis", ColType::StringWithDefault(String::new())),
            ("aspirin_use_prior_7_days", ColType::StringWithDefault(String::new())),
            ("two_or_more_angina_episodes_24h", ColType::StringWithDefault(String::new())),
            ("st_deviation", ColType::StringWithDefault(String::new())),
            ("positive_cardiac_marker", ColType::StringWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "timi_risk_score_for_acute_coronary_syndromes").await
    }
}
