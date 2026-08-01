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
            
            ("clinician_name", ColType::StringWithDefault(String::new())),
            ("clinician_role", ColType::StringWithDefault(String::new())),
            ("assessed_at", ColType::TimestampWithTimeZoneNull),
            ("care_setting", ColType::StringWithDefault(String::new())),
            ("scale_version", ColType::StringWithDefault(String::new())),
            ("reason_for_assessment", ColType::TextWithDefault(String::new())),
            ("patient_identifier", ColType::StringWithDefault(String::new())),
            ("age_band", ColType::StringWithDefault(String::new())),
            ("sex", ColType::StringWithDefault(String::new())),
            ("wish_to_be_dead", ColType::StringWithDefault(String::new())),
            ("non_specific_active_thoughts", ColType::StringWithDefault(String::new())),
            ("active_ideation_methods", ColType::StringWithDefault(String::new())),
            ("active_ideation_intent", ColType::StringWithDefault(String::new())),
            ("active_ideation_plan", ColType::StringWithDefault(String::new())),
            ("ideation_timeframe", ColType::StringWithDefault(String::new())),
            ("ideation_frequency", ColType::IntegerNull),
            ("ideation_duration", ColType::IntegerNull),
            ("ideation_controllability", ColType::IntegerNull),
            ("ideation_deterrents", ColType::IntegerNull),
            ("ideation_reasons", ColType::IntegerNull),
            ("actual_attempt", ColType::StringWithDefault(String::new())),
            ("interrupted_attempt", ColType::StringWithDefault(String::new())),
            ("aborted_attempt", ColType::StringWithDefault(String::new())),
            ("preparatory_acts", ColType::StringWithDefault(String::new())),
            ("non_suicidal_self_injury", ColType::StringWithDefault(String::new())),
            ("behaviour_recency", ColType::StringWithDefault(String::new())),
            ("lifetime_attempt_count", ColType::IntegerNull),
            ("most_recent_attempt_date", ColType::DateNull),
            ("actual_lethality", ColType::IntegerNull),
            ("potential_lethality", ColType::IntegerNull),
            ("access_to_lethal_means", ColType::StringWithDefault(String::new())),
            ("protective_factors", ColType::TextWithDefault(String::new())),
            ("clinical_note", ColType::TextWithDefault(String::new())),
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
