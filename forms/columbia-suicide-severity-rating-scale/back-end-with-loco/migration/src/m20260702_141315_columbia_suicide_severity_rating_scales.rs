use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "columbia_suicide_severity_rating_scales",
            &[
            
            ("id", ColType::PkAuto),
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            
            ("clinician_name", ColType::String),
            ("clinician_role", ColType::String),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::String),
            ("scale_version", ColType::String),
            ("reason_for_assessment", ColType::Text),
            ("patient_identifier", ColType::String),
            ("age_band", ColType::String),
            ("sex", ColType::String),
            ("wish_to_be_dead", ColType::String),
            ("non_specific_active_thoughts", ColType::String),
            ("active_ideation_methods", ColType::String),
            ("active_ideation_intent", ColType::String),
            ("active_ideation_plan", ColType::String),
            ("ideation_timeframe", ColType::String),
            ("ideation_frequency", ColType::IntegerNull),
            ("ideation_duration", ColType::IntegerNull),
            ("ideation_controllability", ColType::IntegerNull),
            ("ideation_deterrents", ColType::IntegerNull),
            ("ideation_reasons", ColType::IntegerNull),
            ("actual_attempt", ColType::String),
            ("interrupted_attempt", ColType::String),
            ("aborted_attempt", ColType::String),
            ("preparatory_acts", ColType::String),
            ("non_suicidal_self_injury", ColType::String),
            ("behaviour_recency", ColType::String),
            ("lifetime_attempt_count", ColType::IntegerNull),
            ("most_recent_attempt_date", ColType::DateNull),
            ("actual_lethality", ColType::IntegerNull),
            ("potential_lethality", ColType::IntegerNull),
            ("access_to_lethal_means", ColType::String),
            ("protective_factors", ColType::Text),
            ("clinical_note", ColType::Text),
            ],
            &[
            ("patient", ""),
            ("clinician?", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "columbia_suicide_severity_rating_scales").await
    }
}
