use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(m, "records_to_discloses",
            &[
            
            ("id", ColType::PkAuto),
            
            ("deleted_at", ColType::TimestampWithTimeZoneNull),
            ("include_medical_health", ColType::String),
            ("medical_health_initials", ColType::String),
            ("include_mental_health", ColType::String),
            ("mental_health_initials", ColType::String),
            ("include_substance_use", ColType::String),
            ("substance_use_initials", ColType::String),
            ("part2_redisclosure_notice_included", ColType::String),
            ("include_hiv_aids", ColType::String),
            ("hiv_aids_initials", ColType::String),
            ("hiv_aids_state_consent_included", ColType::String),
            ("include_psychotherapy_notes", ColType::String),
            ("include_genetic_information", ColType::String),
            ("include_reproductive_health", ColType::String),
            ("section_7332_notice_included", ColType::String),
            ("date_range_specified", ColType::String),
            ("date_from", ColType::DateNull),
            ("date_to", ColType::DateNull),
            ("other_description", ColType::Text),
            ],
            &[
            ("hipaa_authorization", ""),
            ]
        ).await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "records_to_discloses").await
    }
}
