use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "centor_score_for_streptococcal_pharyngitis",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("patient_identifier", ColType::String),
            ("age_years", ColType::IntegerNull),
            ("sex", ColType::String),
            ("tonsillar_exudate", ColType::String),
            ("tender_anterior_cervical_nodes", ColType::String),
            ("fever_over_38", ColType::String),
            ("measured_temperature_celsius", ColType::DoubleNull),
            ("absence_of_cough", ColType::String),
            ("stridor_or_breathing_difficulty", ColType::String),
            ("drooling_or_cannot_swallow", ColType::String),
            ("trismus", ColType::String),
            ("muffled_voice", ColType::String),
            ("unilateral_neck_swelling", ColType::String),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "centor_score_for_streptococcal_pharyngitis").await
    }
}
