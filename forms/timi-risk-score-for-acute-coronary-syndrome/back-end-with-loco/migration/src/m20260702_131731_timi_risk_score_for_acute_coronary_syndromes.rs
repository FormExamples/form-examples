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
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("working_diagnosis", ColType::String),
            ("patient_identifier", ColType::String),
            ("sex", ColType::String),
            ("age_over_65", ColType::String),
            ("three_or_more_cad_risk_factors", ColType::String),
            ("known_cad_stenosis", ColType::String),
            ("aspirin_use_prior_7_days", ColType::String),
            ("two_or_more_angina_episodes_24h", ColType::String),
            ("st_deviation", ColType::String),
            ("positive_cardiac_marker", ColType::String),
            ("clinical_note", ColType::Text),
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
